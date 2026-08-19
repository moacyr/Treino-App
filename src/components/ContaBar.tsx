import { useState } from 'react'
import { useSync } from '../hooks/useSync'
import {
  cancelarLogin,
  emailPendente,
  entrarComCodigo,
  entrarComEmail,
  sair,
  sincronizar,
  type StatusSync,
} from '../sync/sync'

const ROTULO: Record<StatusSync, string> = {
  desativado: 'Dados salvos só neste aparelho',
  deslogado: 'Backup na nuvem desligado',
  offline: 'Offline — salvo aqui, sobe depois',
  sincronizando: 'Sincronizando…',
  ok: 'Sincronizado',
  erro: 'Falha ao sincronizar',
}

const PONTO: Record<StatusSync, string> = {
  desativado: 'conta-ponto--neutro',
  deslogado: 'conta-ponto--neutro',
  offline: 'conta-ponto--espera',
  sincronizando: 'conta-ponto--espera',
  ok: 'conta-ponto--ok',
  erro: 'conta-ponto--erro',
}

/** Erro de rede ou do Supabase (em inglês) vira mensagem em português. */
function mensagemErro(e: unknown): string {
  const texto = e instanceof Error ? e.message : String(e)
  if (/failed to fetch|networkerror|load failed/i.test(texto)) {
    return 'Sem conexão com o servidor. Tente de novo quando tiver internet.'
  }
  if (/expired|invalid/i.test(texto) && /token|otp|code/i.test(texto)) {
    return 'Código expirado ou já usado. Peça um novo e digite o do e-mail mais recente.'
  }
  if (/rate limit|too many/i.test(texto)) {
    return 'Muitos pedidos seguidos. Espere um minuto antes de pedir outro código.'
  }
  return texto
}

function horaCurta(iso: string): string {
  return new Date(iso).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
}

/** 'fechado' → 'email' (pedir código) → 'codigo' (digitar o que chegou). */
type Etapa = 'fechado' | 'email' | 'codigo'

export function ContaBar() {
  const estado = useSync()
  // Um código pedido antes de fechar o app reabre já na etapa de digitá-lo.
  const [etapa, setEtapa] = useState<Etapa>(() => (emailPendente() ? 'codigo' : 'fechado'))
  const [email, setEmail] = useState(() => emailPendente() ?? '')
  const [codigo, setCodigo] = useState('')
  const [enviando, setEnviando] = useState(false)
  const [aviso, setAviso] = useState<string | null>(null)

  const logado = estado.email != null && estado.status !== 'deslogado'

  async function encerrar() {
    setAviso(null)
    const { mantidas } = await sair()
    if (mantidas > 0) {
      setAviso(
        `Saiu com ${mantidas} treino(s) ainda não enviados — eles ficaram guardados neste aparelho e sobem quando você entrar de novo.`,
      )
    }
  }

  function fecharLogin() {
    cancelarLogin()
    setEtapa('fechado')
    setCodigo('')
    setAviso(null)
  }

  async function pedirCodigo(destino: string) {
    setEnviando(true)
    setAviso(null)
    try {
      await entrarComEmail(destino)
      setCodigo('')
      setEtapa('codigo')
      setAviso(`Código enviado para ${destino}. Digite aqui os 6 dígitos do e-mail.`)
    } catch (err) {
      setAviso(mensagemErro(err))
    } finally {
      setEnviando(false)
    }
  }

  function enviarEmail(e: React.FormEvent) {
    e.preventDefault()
    if (!email.trim()) return
    void pedirCodigo(email.trim())
  }

  async function confirmarCodigo(e: React.FormEvent) {
    e.preventDefault()
    setEnviando(true)
    setAviso(null)
    try {
      await entrarComCodigo(email.trim(), codigo)
      setEtapa('fechado')
      setCodigo('')
    } catch (err) {
      setAviso(mensagemErro(err))
    } finally {
      setEnviando(false)
    }
  }

  if (estado.status === 'desativado') {
    return (
      <p className="rodape-app">
        Dados salvos só neste aparelho. Funciona offline. Instale na tela inicial
        para abrir como um app.
      </p>
    )
  }

  return (
    <section className="conta">
      <div className="conta-linha">
        <span className={`conta-ponto ${PONTO[estado.status]}`} aria-hidden="true" />
        <div className="conta-texto">
          <p className="conta-status">{ROTULO[estado.status]}</p>
          <p className="conta-detalhe">
            {logado ? estado.email : 'Entre para guardar o treino na nuvem'}
            {estado.pendentes > 0 && ` · ${estado.pendentes} para enviar`}
            {estado.status === 'ok' && estado.ultimaSync && ` · ${horaCurta(estado.ultimaSync)}`}
          </p>
        </div>
        {logado ? (
          <div className="conta-acoes">
            <button
              className="conta-botao"
              onClick={() => void sincronizar()}
              disabled={estado.status === 'sincronizando'}
            >
              Sincronizar
            </button>
            <button className="conta-botao conta-botao--fraco" onClick={() => void encerrar()}>
              Sair
            </button>
          </div>
        ) : (
          <button
            className="conta-botao"
            onClick={() => (etapa === 'fechado' ? setEtapa('email') : fecharLogin())}
          >
            {etapa === 'fechado' ? 'Entrar' : 'Cancelar'}
          </button>
        )}
      </div>

      {etapa === 'email' && !logado && (
        <>
          <form className="conta-form" onSubmit={enviarEmail}>
            <input
              className="conta-input"
              type="email"
              inputMode="email"
              autoComplete="email"
              placeholder="seu@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <button className="conta-botao conta-botao--primario" type="submit" disabled={enviando}>
              {enviando ? 'Enviando…' : 'Receber código'}
            </button>
          </form>
          <p className="conta-ajuda">
            Chega um código de 6 dígitos no e-mail. Digite o código aqui dentro do
            app — o link do e-mail abre no navegador, que é uma "caixa" separada
            do app instalado e não conecta esta tela.
          </p>
        </>
      )}

      {etapa === 'codigo' && !logado && (
        <>
          <form className="conta-form" onSubmit={confirmarCodigo}>
            <input
              className="conta-input conta-input--codigo"
              type="text"
              inputMode="numeric"
              autoComplete="one-time-code"
              autoFocus
              placeholder="000000"
              aria-label="Código de 6 dígitos do e-mail"
              value={codigo}
              onChange={(e) => setCodigo(e.target.value)}
              required
            />
            <button className="conta-botao conta-botao--primario" type="submit" disabled={enviando}>
              {enviando ? 'Entrando…' : 'Entrar'}
            </button>
          </form>
          <div className="conta-links">
            <button
              className="conta-link"
              type="button"
              disabled={enviando}
              onClick={() => void pedirCodigo(email.trim())}
            >
              Reenviar código
            </button>
            <button className="conta-link" type="button" onClick={() => setEtapa('email')}>
              Usar outro e-mail
            </button>
          </div>
          <p className="conta-ajuda">
            Só veio o link, sem código? Segure o link no e-mail, escolha "Copiar" e
            cole o endereço neste campo — funciona igual, desde que o link ainda
            não tenha sido aberto.
          </p>
        </>
      )}

      {(aviso || estado.erro) && (
        <p className={`conta-aviso${estado.erro && !aviso ? ' conta-aviso--erro' : ''}`}>
          {aviso ?? mensagemErro(estado.erro)}
        </p>
      )}

      <p className="rodape-app">
        Funciona offline: o treino é salvo no aparelho e sobe para a nuvem quando
        houver internet.
      </p>
    </section>
  )
}
