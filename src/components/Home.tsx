import { useEffect, useState } from 'react'
import { FICHA } from '../data/ficha'
import type { Dia, SessaoRegistro } from '../types'
import { getSessoesPorData, hojeISO } from '../db/db'
import { irPara } from '../router'

const ORDEM_SEMANA: Record<number, string> = {
  0: 'dom',
  1: 'seg',
  2: 'ter',
  3: 'qua',
  4: 'qui',
  5: 'sex',
  6: 'sab',
}

function diaDeHojeId(): string {
  return ORDEM_SEMANA[new Date().getDay()]
}

function iconeTipo(dia: Dia): string {
  if (dia.tipo === 'trilha') return '🥾'
  if (dia.tipo === 'descanso') return '🌙'
  if (dia.tipo === 'cardio') return '🚴'
  return ''
}

const ROTULO_TIPO: Record<string, string> = {
  trilha: 'Trilha',
  descanso: 'Descanso',
  cardio: 'Cardio',
}

export function Home() {
  const [sessoesHoje, setSessoesHoje] = useState<Record<string, SessaoRegistro>>({})
  const hojeId = diaDeHojeId()

  useEffect(() => {
    let ativo = true
    getSessoesPorData(hojeISO()).then((lista) => {
      if (!ativo) return
      const mapa: Record<string, SessaoRegistro> = {}
      for (const s of lista) mapa[s.diaId] = s
      setSessoesHoje(mapa)
    })
    return () => {
      ativo = false
    }
  }, [])

  return (
    <>
      <header className="topo">
        <div className="topo-linha">
          <div>
            <p className="topo-kicker">Preparação para trilha</p>
            <h1 className="topo-titulo">Ficha Trekking</h1>
          </div>
          <span className="topo-emoji" aria-hidden="true">
            🏔️
          </span>
        </div>
        <p className="topo-sub">
          A trilha é o exercício; a semana é preparação. Registre a carga de cada
          série e acompanhe a progressão.
        </p>
      </header>

      <main className="conteudo">
        <div className="semana">
          {FICHA.map((dia) => {
            const sessao = sessoesHoje[dia.id]
            const feitos = sessao?.concluidos.length ?? 0
            const total = dia.exercicios.length
            const ehHoje = dia.id === hojeId
            const pct = total > 0 ? Math.round((feitos / total) * 100) : 0

            return (
              <button
                key={dia.id}
                className={`card-dia tipo-${dia.tipo}${ehHoje ? ' card-dia--hoje' : ''}`}
                onClick={() => irPara({ nome: 'dia', diaId: dia.id })}
              >
                <div className="card-dia-cabecalho">
                  <span className="card-dia-semana">{dia.diaSemana}</span>
                  {ehHoje && <span className="badge-hoje">hoje</span>}
                  {iconeTipo(dia) && (
                    <span className="card-dia-icone" aria-hidden="true">
                      {iconeTipo(dia)}
                    </span>
                  )}
                </div>

                <h2 className="card-dia-titulo">{dia.titulo}</h2>
                <p className="card-dia-sub">{dia.subtitulo}</p>

                {dia.tipo === 'treino' ? (
                  <div className="card-dia-rodape">
                    <span className="card-dia-qtd">{total} exercícios</span>
                    {feitos > 0 && (
                      <span className="card-dia-progresso">
                        <span className="mono">
                          {feitos}/{total}
                        </span>
                        <span className="barra">
                          <span className="barra-fill" style={{ width: `${pct}%` }} />
                        </span>
                      </span>
                    )}
                  </div>
                ) : (
                  <div className="card-dia-rodape">
                    <span className="card-dia-tag-tipo">{ROTULO_TIPO[dia.tipo]}</span>
                  </div>
                )}
              </button>
            )
          })}
        </div>

        <p className="rodape-app">
          Dados salvos só neste aparelho. Funciona offline. Instale na tela inicial
          para abrir como um app.
        </p>
      </main>
    </>
  )
}
