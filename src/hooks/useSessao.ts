import { useCallback, useEffect, useRef, useState } from 'react'
import type { Dia, SessaoRegistro } from '../types'
import { getSessao, hojeISO, idSessao, salvarSessao } from '../db/db'

function sessaoVazia(dia: Dia, dataISO: string): SessaoRegistro {
  const cargas: SessaoRegistro['cargas'] = {}
  for (const ex of dia.exercicios) {
    cargas[ex.id] = Array<number | null>(ex.series).fill(null)
  }
  return {
    id: idSessao(dia.id, dataISO),
    diaId: dia.id,
    data: dataISO,
    cargas,
    concluidos: [],
  }
}

/**
 * Garante que o array de cargas de um exercício tenha o tamanho certo
 * (caso a ficha mude o nº de séries depois de já existir um registro).
 */
function normalizar(dia: Dia, sessao: SessaoRegistro): SessaoRegistro {
  const cargas = { ...sessao.cargas }
  for (const ex of dia.exercicios) {
    const atual = cargas[ex.id] ?? []
    const ajustado = Array.from({ length: ex.series }, (_, i) => atual[i] ?? null)
    cargas[ex.id] = ajustado
  }
  return { ...sessao, cargas }
}

interface UseSessao {
  sessao: SessaoRegistro | null
  carregado: boolean
  setCarga: (exercicioId: string, serie: number, valor: number | null) => void
  alternarConcluido: (exercicioId: string) => void
  progresso: (dia: Dia) => { feitos: number; total: number }
}

/** Carrega/cria a sessão de hoje para um dia e persiste cada alteração. */
export function useSessao(dia: Dia): UseSessao {
  const dataISO = hojeISO()
  const [sessao, setSessao] = useState<SessaoRegistro | null>(null)
  const [carregado, setCarregado] = useState(false)
  const sessaoRef = useRef<SessaoRegistro | null>(null)

  useEffect(() => {
    let ativo = true
    setCarregado(false)
    getSessao(idSessao(dia.id, dataISO)).then((existente) => {
      if (!ativo) return
      const base = existente ? normalizar(dia, existente) : sessaoVazia(dia, dataISO)
      sessaoRef.current = base
      setSessao(base)
      setCarregado(true)
    })
    return () => {
      ativo = false
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dia.id, dataISO])

  const persistir = useCallback((next: SessaoRegistro) => {
    sessaoRef.current = next
    setSessao(next)
    void salvarSessao(next)
  }, [])

  const setCarga = useCallback(
    (exercicioId: string, serie: number, valor: number | null) => {
      const atual = sessaoRef.current
      if (!atual) return
      const cargasEx = (atual.cargas[exercicioId] ?? []).slice()
      cargasEx[serie] = valor
      persistir({
        ...atual,
        cargas: { ...atual.cargas, [exercicioId]: cargasEx },
      })
    },
    [persistir],
  )

  const alternarConcluido = useCallback(
    (exercicioId: string) => {
      const atual = sessaoRef.current
      if (!atual) return
      const jaFeito = atual.concluidos.includes(exercicioId)
      const concluidos = jaFeito
        ? atual.concluidos.filter((id) => id !== exercicioId)
        : [...atual.concluidos, exercicioId]
      persistir({ ...atual, concluidos })
    },
    [persistir],
  )

  const progresso = useCallback(
    (d: Dia) => ({
      feitos: sessao ? sessao.concluidos.length : 0,
      total: d.exercicios.length,
    }),
    [sessao],
  )

  return { sessao, carregado, setCarga, alternarConcluido, progresso }
}
