import { useTimer } from '../timer/TimerContext'

function formatar(seg: number): string {
  const m = Math.floor(seg / 60)
  const s = seg % 60
  if (m > 0) return `${m}:${String(s).padStart(2, '0')}`
  return `${s}`
}

export function RestTimerBar() {
  const t = useTimer()
  if (!t.ativo) return null

  const acabou = t.restante <= 0
  const pct = t.total > 0 ? (t.restante / t.total) * 100 : 0

  return (
    <div className={`timer-bar${acabou ? ' timer-bar--fim' : ''}`} role="status" aria-live="polite">
      <span className="timer-fill" style={{ width: `${pct}%` }} aria-hidden="true" />
      <div className="timer-conteudo">
        <div className="timer-esq">
          <span className="timer-relogio mono">
            {acabou ? 'Fim!' : formatar(t.restante)}
          </span>
          <span className="timer-label">
            {acabou ? 'Descanso concluído' : `Descanso · ${t.label}`}
          </span>
        </div>

        <div className="timer-controles">
          {!acabou && (
            <>
              <button
                className="timer-btn"
                onClick={() => t.adicionar(15)}
                aria-label="Somar 15 segundos"
              >
                +15s
              </button>
              {t.pausado ? (
                <button className="timer-btn" onClick={t.retomar} aria-label="Retomar">
                  ▶
                </button>
              ) : (
                <button className="timer-btn" onClick={t.pausar} aria-label="Pausar">
                  ❚❚
                </button>
              )}
            </>
          )}
          <button
            className="timer-btn timer-btn--fechar"
            onClick={t.encerrar}
            aria-label="Fechar timer"
          >
            ✕
          </button>
        </div>
      </div>
    </div>
  )
}
