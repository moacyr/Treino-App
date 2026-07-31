import { useEffect, useState } from 'react'
import type { Dia, Exercicio, SessaoRegistro } from '../types'
import { getHistoricoExercicio } from '../db/db'
import { ROTULO_PADRAO, urlYoutube } from '../data/ficha'
import { irPara, voltar } from '../router'
import { BotaoVoltar } from './BotaoVoltar'

function formatarData(iso: string): string {
  // iso: YYYY-MM-DD interpretado como data local → "Qua., 15 de jul. de 2026"
  const [ano, mes, dia] = iso.split('-').map(Number)
  const d = new Date(ano, (mes ?? 1) - 1, dia ?? 1)
  const texto = d.toLocaleDateString('pt-BR', {
    weekday: 'short',
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })
  return texto.charAt(0).toUpperCase() + texto.slice(1)
}

function melhorCarga(sessoes: SessaoRegistro[], exId: string): number | null {
  let melhor: number | null = null
  for (const s of sessoes) {
    for (const c of s.cargas[exId] ?? []) {
      if (c != null && (melhor == null || c > melhor)) melhor = c
    }
  }
  return melhor
}

export function HistoricoView({ exercicio, dia }: { exercicio: Exercicio; dia: Dia }) {
  const [sessoes, setSessoes] = useState<SessaoRegistro[] | null>(null)

  useEffect(() => {
    let ativo = true
    getHistoricoExercicio(exercicio.id).then((lista) => {
      if (ativo) setSessoes(lista)
    })
    return () => {
      ativo = false
    }
  }, [exercicio.id])

  const melhor = sessoes ? melhorCarga(sessoes, exercicio.id) : null

  return (
    <>
      <header className="topo topo--dia">
        <BotaoVoltar aoVoltar={() => voltar()} rotulo="Voltar" />
        <p className="topo-kicker">Histórico · {dia.diaSemana}</p>
        <h1 className="topo-titulo">{exercicio.nome}</h1>
        <div className="hist-cabecalho-tags">
          <span className={`tag-padrao tag-${exercicio.padrao}`}>
            {ROTULO_PADRAO[exercicio.padrao]}
          </span>
          <span className="hist-meta mono">
            {exercicio.series} × {exercicio.reps}
          </span>
          {melhor != null && (
            <span className="hist-recorde">
              melhor <span className="mono">{melhor} kg</span>
            </span>
          )}
        </div>
      </header>

      <main className="conteudo">
        {sessoes == null ? (
          <p className="carregando">Carregando…</p>
        ) : sessoes.length === 0 ? (
          <div className="hist-vazio">
            <span className="hist-vazio-emoji" aria-hidden="true">
              📈
            </span>
            <p className="hist-vazio-titulo">Ainda sem registros</p>
            <p className="hist-vazio-texto">
              Assim que você anotar a carga deste exercício num treino, o histórico
              aparece aqui para comparar e progredir.
            </p>
            <button
              className="acao acao--timer"
              onClick={() => irPara({ nome: 'dia', diaId: dia.id })}
            >
              Ir para {dia.diaSemana}
            </button>
          </div>
        ) : (
          <ul className="hist-lista">
            {sessoes.map((s) => {
              const cargas = s.cargas[exercicio.id] ?? []
              return (
                <li key={s.id} className="hist-item">
                  <div className="hist-data">{formatarData(s.data)}</div>
                  <div className="hist-cargas">
                    {cargas.map((c, i) => (
                      <span
                        key={i}
                        className={`hist-chip${c == null ? ' hist-chip--vazio' : ''}`}
                      >
                        <span className="hist-chip-serie">S{i + 1}</span>
                        <span className="mono hist-chip-valor">
                          {c == null ? '—' : `${c}`}
                        </span>
                      </span>
                    ))}
                  </div>
                </li>
              )
            })}
          </ul>
        )}

        <a
          className="acao acao--video hist-video"
          href={urlYoutube(exercicio.buscaYoutube)}
          target="_blank"
          rel="noopener noreferrer"
        >
          Ver execução no YouTube
        </a>
      </main>
    </>
  )
}
