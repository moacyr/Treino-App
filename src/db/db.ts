import { openDB, type DBSchema, type IDBPDatabase } from 'idb'
import type { SessaoRegistro } from '../types'

interface TreinoDB extends DBSchema {
  sessoes: {
    key: string
    value: SessaoRegistro
    indexes: {
      'by-dia': string
      'by-data': string
    }
  }
}

const DB_NOME = 'ficha-trekking'
const DB_VERSAO = 1

let dbPromise: Promise<IDBPDatabase<TreinoDB>> | null = null

function getDb(): Promise<IDBPDatabase<TreinoDB>> {
  if (!dbPromise) {
    dbPromise = openDB<TreinoDB>(DB_NOME, DB_VERSAO, {
      upgrade(db) {
        const store = db.createObjectStore('sessoes', { keyPath: 'id' })
        store.createIndex('by-dia', 'diaId')
        store.createIndex('by-data', 'data')
      },
    })
  }
  return dbPromise
}

/** Data local de hoje no formato ISO (YYYY-MM-DD), sem fuso UTC. */
export function hojeISO(): string {
  const d = new Date()
  const ano = d.getFullYear()
  const mes = String(d.getMonth() + 1).padStart(2, '0')
  const dia = String(d.getDate()).padStart(2, '0')
  return `${ano}-${mes}-${dia}`
}

export function idSessao(diaId: string, dataISO: string): string {
  return `${diaId}-${dataISO}`
}

export async function getSessao(id: string): Promise<SessaoRegistro | undefined> {
  return (await getDb()).get('sessoes', id)
}

export async function salvarSessao(sessao: SessaoRegistro): Promise<void> {
  await (await getDb()).put('sessoes', sessao)
}

export async function getTodasSessoes(): Promise<SessaoRegistro[]> {
  return (await getDb()).getAll('sessoes')
}

export async function getSessoesPorData(dataISO: string): Promise<SessaoRegistro[]> {
  return (await getDb()).getAllFromIndex('sessoes', 'by-data', dataISO)
}

/**
 * Histórico de um exercício: todas as sessões que registraram alguma carga
 * (não-nula) para ele, ordenadas da mais recente para a mais antiga.
 */
export async function getHistoricoExercicio(
  exercicioId: string,
): Promise<SessaoRegistro[]> {
  const todas = await getTodasSessoes()
  return todas
    .filter((s) => {
      const cargas = s.cargas[exercicioId]
      return Array.isArray(cargas) && cargas.some((c) => c != null)
    })
    .sort((a, b) => (a.data < b.data ? 1 : a.data > b.data ? -1 : 0))
}
