import { openDB, type DBSchema, type IDBPDatabase } from 'idb'
import type { SessaoRegistro } from '../types'

interface TreinoDB extends DBSchema {
  sessoes: {
    key: string
    value: SessaoRegistro
    indexes: {
      'by-dia': string
      'by-data': string
      'by-semana': string
    }
  }
}

const DB_NOME = 'ficha-trekking'
const DB_VERSAO = 2

let dbPromise: Promise<IDBPDatabase<TreinoDB>> | null = null

function getDb(): Promise<IDBPDatabase<TreinoDB>> {
  if (!dbPromise) {
    dbPromise = openDB<TreinoDB>(DB_NOME, DB_VERSAO, {
      async upgrade(db, versaoAntiga, _nova, tx) {
        if (versaoAntiga < 1) {
          const store = db.createObjectStore('sessoes', { keyPath: 'id' })
          store.createIndex('by-dia', 'diaId')
          store.createIndex('by-data', 'data')
        }
        if (versaoAntiga < 2) {
          // v2: a sessão passa a ser semanal (uma por dia-da-semana por semana),
          // com id `${diaId}-${segundaISO}`. Reescreve os registros antigos,
          // que eram diários (`${diaId}-${dataISO}`).
          const store = tx.objectStore('sessoes')
          store.createIndex('by-semana', 'semana')
          const antigos = await store.getAll()
          await store.clear()
          const porId = new Map<string, SessaoRegistro>()
          for (const s of antigos) {
            const semana = semanaISO(s.data)
            const novo: SessaoRegistro = { ...s, semana, id: `${s.diaId}-${semana}` }
            const existente = porId.get(novo.id)
            // Duas sessões do mesmo dia-da-semana na mesma semana: fica a mais recente.
            if (!existente || existente.data <= novo.data) porId.set(novo.id, novo)
          }
          for (const s of porId.values()) await store.put(s)
        }
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

/** Segunda-feira da semana de `dataISO` (ou de hoje), em ISO. */
export function semanaISO(dataISO: string = hojeISO()): string {
  const [ano, mes, dia] = dataISO.split('-').map(Number)
  const d = new Date(ano, (mes ?? 1) - 1, dia ?? 1)
  // getDay(): 0 = domingo. Recuar até a segunda-feira.
  const recuo = (d.getDay() + 6) % 7
  d.setDate(d.getDate() - recuo)
  const a = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const j = String(d.getDate()).padStart(2, '0')
  return `${a}-${m}-${j}`
}

/** Id da sessão semanal: um registro por dia-da-semana por semana. */
export function idSessao(diaId: string, semana: string): string {
  return `${diaId}-${semana}`
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

/** Sessões da semana (segunda a domingo) que começa em `semana`. */
export async function getSessoesDaSemana(semana: string): Promise<SessaoRegistro[]> {
  return (await getDb()).getAllFromIndex('sessoes', 'by-semana', semana)
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
