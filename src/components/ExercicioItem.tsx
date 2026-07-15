import { useEffect, useState } from 'react'
import type { Exercicio } from '../types'
import { ROTULO_PADRAO, urlYoutube } from '../data/ficha'
import { irPara } from '../router'
import { useTimer } from '../timer/TimerContext'

interface Props {
  indice: number
  exercicio: Exercicio
  cargas: (number | null)[]
  concluido: boolean
  aoDefinirCarga: (serie: number, valor: number | null) => void
  aoAlternarConcluido: () => void
}

/** Converte texto do input (pt-BR, aceita vírgula) em número ou null. */
function parseCarga(texto: string): number | null {
  const limpo = texto.replace(',', '.').trim()
  if (limpo === '') return null
  const n = Number(limpo)
  return Number.isFinite(n) ? n : null
}

function CargaInput({
  serie,
  valor,
  aoDefinir,
}: {
  serie: number
  valor: number | null
  aoDefinir: (valor: number | null) => void
}) {
  const [texto, setTexto] = useState(valor == null ? '' : String(valor))

  // Sincroniza quando o valor externo muda (ex.: carga de outra fonte)
  useEffect(() => {
    setTexto(valor == null ? '' : String(valor))
  }, [valor])

  return (
    <label className={`carga${valor != null ? ' carga--preenchida' : ''}`}>
      <span className="carga-label">S{serie + 1}</span>
      <input
        className="carga-input mono"
        type="text"
        inputMode="decimal"
        enterKeyHint="done"
        placeholder="—"
        value={texto}
        onChange={(e) => {
          setTexto(e.target.value)
          aoDefinir(parseCarga(e.target.value))
        }}
        aria-label={`Carga da série ${serie + 1} em kg`}
      />
      <span className="carga-unidade">kg</span>
    </label>
  )
}

const CORES_PADRAO = ROTULO_PADRAO

export function ExercicioItem({
  indice,
  exercicio,
  cargas,
  concluido,
  aoDefinirCarga,
  aoAlternarConcluido,
}: Props) {
  const timer = useTimer()

  return (
    <li className={`exercicio${concluido ? ' exercicio--feito' : ''}`}>
      <div className="exercicio-topo">
        <span className="exercicio-num mono">{String(indice).padStart(2, '0')}</span>
        <div className="exercicio-titulo-bloco">
          <h3 className="exercicio-nome">{exercicio.nome}</h3>
          <span className={`tag-padrao tag-${exercicio.padrao}`}>
            {CORES_PADRAO[exercicio.padrao]}
          </span>
        </div>
        <button
          className={`check${concluido ? ' check--on' : ''}`}
          onClick={aoAlternarConcluido}
          aria-pressed={concluido}
          aria-label={concluido ? 'Marcar como não feito' : 'Marcar como feito'}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path
              d="M5 13l4 4L19 7"
              stroke="currentColor"
              strokeWidth="2.6"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </div>

      <div className="exercicio-meta">
        <span className="meta-item">
          <span className="meta-rotulo">reps</span>
          <span className="mono meta-valor">{exercicio.reps}</span>
        </span>
        <span className="meta-item">
          <span className="meta-rotulo">séries</span>
          <span className="mono meta-valor">{exercicio.series}</span>
        </span>
        <span className="meta-item">
          <span className="meta-rotulo">descanso</span>
          <span className="mono meta-valor">{exercicio.descansoSeg}s</span>
        </span>
      </div>

      <p className="exercicio-dica">{exercicio.dica}</p>

      <div className="cargas">
        {Array.from({ length: exercicio.series }, (_, i) => (
          <CargaInput
            key={i}
            serie={i}
            valor={cargas[i] ?? null}
            aoDefinir={(valor) => aoDefinirCarga(i, valor)}
          />
        ))}
      </div>

      <div className="exercicio-acoes">
        <button
          className="acao acao--timer"
          onClick={() => timer.iniciar(exercicio.descansoSeg, exercicio.nome)}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <circle cx="12" cy="13" r="8" stroke="currentColor" strokeWidth="2" />
            <path d="M12 9v4l2.5 2M9 2h6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
          Descanso {exercicio.descansoSeg}s
        </button>

        <button
          className="acao acao--hist"
          onClick={() => irPara({ nome: 'historico', exercicioId: exercicio.id })}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path
              d="M12 8v5l3 2M3.5 12a8.5 8.5 0 1 0 2.2-5.7M3 4v3h3"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          Histórico
        </button>

        <a
          className="acao acao--video"
          href={urlYoutube(exercicio.buscaYoutube)}
          target="_blank"
          rel="noopener noreferrer"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <rect x="2.5" y="5" width="19" height="14" rx="3.5" stroke="currentColor" strokeWidth="2" />
            <path d="M10 9l5 3-5 3V9z" fill="currentColor" />
          </svg>
          Vídeo
        </a>
      </div>
    </li>
  )
}
