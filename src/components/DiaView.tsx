import type { Dia } from '../types'
import { contarConcluidos } from '../data/ficha'
import { useSessao } from '../hooks/useSessao'
import { irPara } from '../router'
import { ExercicioItem } from './ExercicioItem'
import { BotaoVoltar } from './BotaoVoltar'

export function DiaView({ dia }: { dia: Dia }) {
  const { sessao, carregado, setCarga, alternarConcluido } = useSessao(dia)

  const total = dia.exercicios.length
  const feitos = contarConcluidos(dia, sessao?.concluidos)
  const pct = total > 0 ? Math.round((feitos / total) * 100) : 0

  return (
    <>
      <header className={`topo topo--dia tipo-${dia.tipo}`}>
        <BotaoVoltar aoVoltar={() => irPara({ nome: 'home' })} />
        <p className="topo-kicker">{dia.diaSemana}</p>
        <h1 className="topo-titulo">{dia.titulo}</h1>
        <p className="topo-sub">{dia.subtitulo}</p>

        {dia.tipo === 'treino' && (
          <div className="dia-progresso">
            <div className="dia-progresso-info">
              <span className="mono dia-progresso-num">
                {feitos}/{total}
              </span>
              <span className="dia-progresso-label">concluídos</span>
            </div>
            <span className="barra barra--grande">
              <span className="barra-fill" style={{ width: `${pct}%` }} />
            </span>
          </div>
        )}
      </header>

      <main className="conteudo">
        {dia.tipo !== 'treino' ? (
          <div className="nota-card">
            <span className="nota-emoji" aria-hidden="true">
              {dia.tipo === 'trilha' ? '🥾' : dia.tipo === 'cardio' ? '🚴' : '🌙'}
            </span>
            <p className="nota-texto">{dia.nota}</p>
          </div>
        ) : !carregado ? (
          <p className="carregando">Carregando…</p>
        ) : (
          <ol className="lista-exercicios">
            {dia.exercicios.map((exercicio, i) => (
              <ExercicioItem
                key={exercicio.id}
                indice={i + 1}
                exercicio={exercicio}
                cargas={sessao?.cargas[exercicio.id] ?? []}
                concluido={sessao?.concluidos.includes(exercicio.id) ?? false}
                aoDefinirCarga={(serie, valor) => setCarga(exercicio.id, serie, valor)}
                aoAlternarConcluido={() => alternarConcluido(exercicio.id)}
              />
            ))}
          </ol>
        )}
      </main>
    </>
  )
}
