import { useState } from 'react'
import { useSync } from '../hooks/useSync'
import { entrarComEmail, sair, sincronizar, type StatusSync } from '../sync/sync'

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

/** Erro de rede do fetch vira mensagem em português. */
function mensagemErro(e: unknown): string {
  const texto = e instanceof Error ? e.message : String(e)
  if (/failed to fetch|networkerror|load failed/i.test(texto)) {
    return 'Sem conexão com o servidor. Tente de novo quando tiver internet.'
  }
  return texto
}

function horaCurta(iso: string): string {
  return new Date(iso).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
}

export function ContaBar() {
  const estado = useSync()
  const [abrirLogin, setAbrirLogin] = useState(false)
  const [email, setEmail] = useState('')
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

  async function enviarLink(e: React.FormEvent) {
    e.preventDefault()
    if (!email.trim()) return
    setEnviando(true)
    setAviso(null)
    try {
      await entrarComEmail(email.trim())
      setAviso(`Link de acesso enviado para ${email.trim()}. Abra o e-mail neste aparelho.`)
      setAbrirLogin(false)
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
          <button className="conta-botao" onClick={() => setAbrirLogin((v) => !v)}>
            {abrirLogin ? 'Cancelar' : 'Entrar'}
          </button>
        )}
      </div>

      {abrirLogin && !logado && (
        <form className="conta-form" onSubmit={enviarLink}>
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
            {enviando ? 'Enviando…' : 'Receber link'}
          </button>
        </form>
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
