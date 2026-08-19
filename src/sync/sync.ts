import {
  getMeta,
  getSessao,
  getSessoesPendentes,
  limparTudo,
  marcarSincronizadas,
  salvarSessaoRemota,
  setMeta,
} from '../db/db'
import { paraLinha, paraSessao, supabase, syncHabilitado, type LinhaSessao } from './supabase'

export type StatusSync =
  /** sem VITE_SUPABASE_* — app roda só local */
  | 'desativado'
  /** configurado, mas ninguém logado */
  | 'deslogado'
  | 'offline'
  | 'sincronizando'
  | 'ok'
  | 'erro'

export interface EstadoSync {
  status: StatusSync
  email: string | null
  ultimaSync: string | null
  pendentes: number
  erro: string | null
}

const CHAVE_CURSOR = 'sync:cursor'
/** Quanto o cursor recua para tolerar commits fora de ordem. */
const MARGEM_CURSOR_MS = 30_000
const CHAVE_USUARIO = 'sync:usuario'

function comMargem(iso: string, ms: number): string {
  return new Date(new Date(iso).getTime() - ms).toISOString()
}

let estado: EstadoSync = {
  status: syncHabilitado ? 'deslogado' : 'desativado',
  email: null,
  ultimaSync: null,
  pendentes: 0,
  erro: null,
}

const ouvintesEstado = new Set<(e: EstadoSync) => void>()
const ouvintesDados = new Set<() => void>()

export function estadoAtual(): EstadoSync {
  return estado
}

/** Notificado a cada mudança de status/erro/contagem de pendentes. */
export function assinarEstado(fn: (e: EstadoSync) => void): () => void {
  ouvintesEstado.add(fn)
  return () => ouvintesEstado.delete(fn)
}

/** Notificado quando um pull trouxe dados novos e a tela precisa recarregar. */
export function assinarDados(fn: () => void): () => void {
  ouvintesDados.add(fn)
  return () => ouvintesDados.delete(fn)
}

function atualizar(parcial: Partial<EstadoSync>): void {
  estado = { ...estado, ...parcial }
  for (const fn of ouvintesEstado) fn(estado)
}

function avisarDados(): void {
  for (const fn of ouvintesDados) fn()
}

async function contarPendentes(): Promise<number> {
  return (await getSessoesPendentes()).length
}

/**
 * Envia o que está pendente e traz o que mudou na nuvem desde o último cursor.
 * Conflito é resolvido por last-write-wins comparando `atualizadoEm`.
 */
let rodando = false
let repetir = false

export async function sincronizar(): Promise<void> {
  if (!supabase) return
  if (rodando) {
    // Não descarta a chamada: reexecuta assim que a atual terminar.
    repetir = true
    return
  }
  rodando = true
  try {
    await executarSync()
  } finally {
    rodando = false
  }
  if (repetir) {
    repetir = false
    await sincronizar()
  }
}

async function executarSync(): Promise<void> {
  if (!supabase) return

  // getSession lê do storage local — offline não pode parecer "deslogado".
  const { data: auth } = await supabase.auth.getSession()
  const usuario = auth.session?.user
  if (!usuario) {
    atualizar({ status: 'deslogado', email: null })
    return
  }
  if (!navigator.onLine) {
    atualizar({ status: 'offline', pendentes: await contarPendentes() })
    return
  }

  atualizar({ status: 'sincronizando', email: usuario.email ?? null, erro: null })

  try {
    // 1) push — sobe tudo que foi editado offline/local
    const pendentes = await getSessoesPendentes()
    if (pendentes.length > 0) {
      const { error } = await supabase
        .from('sessoes')
        .upsert(pendentes.map((s) => paraLinha(s, usuario.id)), { onConflict: 'user_id,id' })
      if (error) throw error
      await marcarSincronizadas(
        pendentes.map((s) => ({ id: s.id, atualizadoEm: s.atualizadoEm })),
      )
    }

    // 2) pull — busca o que mudou desde o último sync (cursor no relógio do
    //    servidor, para não depender do relógio de cada aparelho)
    const cursor = await getMeta(CHAVE_CURSOR)
    let query = supabase
      .from('sessoes')
      .select('*')
      .order('servidor_em', { ascending: true })
      .limit(1000)
    if (cursor) query = query.gt('servidor_em', cursor)

    const { data: linhas, error } = await query
    if (error) throw error

    let mudou = false
    let maiorCursor = cursor
    for (const linha of (linhas ?? []) as LinhaSessao[]) {
      const remota = paraSessao(linha)
      const local = await getSessao(remota.id)
      // Last-write-wins: só aplica se o remoto for mais novo que o local.
      if (!local || local.atualizadoEm < remota.atualizadoEm) {
        await salvarSessaoRemota(remota)
        mudou = true
      }
      if (!maiorCursor || linha.servidor_em > maiorCursor) maiorCursor = linha.servidor_em
    }
    if (maiorCursor && maiorCursor !== cursor) {
      // Margem de segurança: uma transação pode commitar depois de outra com
      // `servidor_em` menor. Reler alguns segundos é inofensivo (o LWW ignora
      // o que já está aplicado) e evita perder um registro na janela de commit.
      await setMeta(CHAVE_CURSOR, comMargem(maiorCursor, MARGEM_CURSOR_MS))
    }

    const agora = new Date().toISOString()
    await setMeta('sync:ultima', agora)
    atualizar({
      status: 'ok',
      ultimaSync: agora,
      pendentes: await contarPendentes(),
      erro: null,
    })
    if (mudou) avisarDados()
  } catch (e) {
    atualizar({
      status: navigator.onLine ? 'erro' : 'offline',
      pendentes: await contarPendentes(),
      erro: e instanceof Error ? e.message : String(e),
    })
  }
}

let agendado: ReturnType<typeof setTimeout> | null = null

/** Sync com debounce — chamado depois de cada edição do usuário. */
export function agendarSync(atrasoMs = 2000): void {
  if (!supabase) return
  if (agendado) clearTimeout(agendado)
  agendado = setTimeout(() => {
    agendado = null
    void sincronizar()
  }, atrasoMs)
}

/**
 * Se o usuário trocar de conta no mesmo aparelho, os dados locais da conta
 * anterior não podem vazar para a nova: zera o banco local e o cursor.
 */
async function garantirMesmoUsuario(userId: string | null): Promise<void> {
  const anterior = await getMeta(CHAVE_USUARIO)
  if (userId && anterior && anterior !== userId) {
    await limparTudo()
    avisarDados()
  }
  if (userId) await setMeta(CHAVE_USUARIO, userId)
}

export function iniciarSync(): void {
  if (!supabase) return

  supabase.auth.onAuthStateChange((evento, sessao) => {
    const usuario = sessao?.user ?? null
    void (async () => {
      await garantirMesmoUsuario(usuario?.id ?? null)
      if (usuario) {
        // Entrou (pelo código ou pelo link aberto aqui): o pedido acabou.
        guardarPendente(null)
        atualizar({ email: usuario.email ?? null })
        if (evento !== 'TOKEN_REFRESHED') await sincronizar()
      } else {
        atualizar({ status: 'deslogado', email: null, ultimaSync: null })
      }
    })()
  })

  void (async () => {
    atualizar({
      ultimaSync: await getMeta('sync:ultima'),
      pendentes: await contarPendentes(),
    })
    await sincronizar()
  })()

  window.addEventListener('online', () => void sincronizar())
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible') agendarSync(300)
  })
}

const CHAVE_LOGIN = 'sync:login-pendente'

/** E-mail que já pediu um código e ainda não confirmou. */
export function emailPendente(): string | null {
  try {
    return localStorage.getItem(CHAVE_LOGIN)
  } catch {
    return null
  }
}

function guardarPendente(email: string | null): void {
  try {
    if (email) localStorage.setItem(CHAVE_LOGIN, email)
    else localStorage.removeItem(CHAVE_LOGIN)
  } catch {
    /* modo privado sem storage — o login continua funcionando na sessão atual */
  }
}

/** Desiste do código pendente e volta para a tela de e-mail. */
export function cancelarLogin(): void {
  guardarPendente(null)
}

export async function entrarComEmail(email: string): Promise<void> {
  if (!supabase) throw new Error('Sincronização não configurada neste build.')
  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: { emailRedirectTo: `${window.location.origin}${import.meta.env.BASE_URL}` },
  })
  if (error) throw error
  guardarPendente(email)
}

type Colado =
  /** o link do e-mail, ainda não aberto — o token é trocado por sessão aqui */
  | { tipo: 'token'; token: string; otp: string }
  /** a URL de retorno com a sessão no fragmento (link já aberto no navegador) */
  | { tipo: 'sessao'; access: string; refresh: string }

/**
 * Entende a URL do link mágico colada do e-mail (ou da barra de endereço do
 * navegador). Os parâmetros aparecem ora na query, ora no fragmento, então
 * procura nos dois.
 */
function lerLink(texto: string): Colado | null {
  if (!/^https?:\/\//i.test(texto)) return null
  let url: URL
  try {
    url = new URL(texto)
  } catch {
    return null
  }
  const fragmento = new URLSearchParams(url.hash.replace(/^#\/?/, ''))
  const ler = (chave: string) => url.searchParams.get(chave) ?? fragmento.get(chave)

  const access = ler('access_token')
  const refresh = ler('refresh_token')
  if (access && refresh) return { tipo: 'sessao', access, refresh }

  const token = ler('token_hash') ?? ler('token')
  if (token) return { tipo: 'token', token, otp: ler('type') ?? 'magiclink' }
  return null
}

/**
 * Fecha o login sem sair do app: aceita o código de 6 dígitos do e-mail ou a
 * URL do link mágico colada. É o caminho que funciona no PWA instalado — o
 * link do e-mail abre no navegador, que tem storage separado do app.
 */
export async function entrarComCodigo(email: string, valor: string): Promise<void> {
  if (!supabase) throw new Error('Sincronização não configurada neste build.')
  const texto = valor.trim()
  if (!texto) throw new Error('Digite o código de 6 dígitos que chegou no e-mail.')

  const link = lerLink(texto)
  if (link?.tipo === 'sessao') {
    const { error } = await supabase.auth.setSession({
      access_token: link.access,
      refresh_token: link.refresh,
    })
    if (error) throw error
  } else if (link?.tipo === 'token') {
    const { error } = await supabase.auth.verifyOtp({ token_hash: link.token, type: link.otp })
    if (error) throw error
  } else {
    const codigo = texto.replace(/\D/g, '')
    if (codigo.length !== 6) {
      throw new Error('Código inválido: são 6 dígitos. Ou cole o endereço do link do e-mail.')
    }
    const { error } = await supabase.auth.verifyOtp({ email, token: codigo, type: 'email' })
    if (error) throw error
  }
  guardarPendente(null)
}

/**
 * Encerra a sessão. Só limpa o banco local se tudo já subiu — sair offline com
 * alterações na fila não pode apagar treino que ainda não existe na nuvem.
 * Retorna quantas sessões ficaram guardadas no aparelho.
 */
export async function sair(): Promise<{ mantidas: number }> {
  if (!supabase) return { mantidas: 0 }
  // Última tentativa de subir o que faltou antes de encerrar.
  await sincronizar()
  const mantidas = await contarPendentes()
  await supabase.auth.signOut()
  if (mantidas === 0) await limparTudo()
  atualizar({ status: 'deslogado', email: null, ultimaSync: null, pendentes: mantidas })
  avisarDados()
  return { mantidas }
}
