import { createClient, type SupabaseClient } from '@supabase/supabase-js'
import type { SessaoRegistro } from '../types'

const URL = import.meta.env.VITE_SUPABASE_URL
const CHAVE = import.meta.env.VITE_SUPABASE_ANON_KEY

/**
 * O app funciona 100% offline sem Supabase configurado. Só quando as duas
 * variáveis existem é que a sincronização com a nuvem entra em cena.
 */
export const syncHabilitado = Boolean(URL && CHAVE)

export const supabase: SupabaseClient | null = syncHabilitado
  ? createClient(URL as string, CHAVE as string, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
      },
    })
  : null

/** Linha da tabela `sessoes` no Postgres (snake_case). */
export interface LinhaSessao {
  id: string
  user_id: string
  dia_id: string
  data: string
  semana: string
  cargas: SessaoRegistro['cargas']
  concluidos: string[]
  atualizado_em: string
  servidor_em: string
}

export function paraLinha(s: SessaoRegistro, userId: string): Omit<LinhaSessao, 'servidor_em'> {
  return {
    id: s.id,
    user_id: userId,
    dia_id: s.diaId,
    data: s.data,
    semana: s.semana,
    cargas: s.cargas,
    concluidos: s.concluidos,
    atualizado_em: s.atualizadoEm,
  }
}

export function paraSessao(linha: LinhaSessao): SessaoRegistro {
  return {
    id: linha.id,
    diaId: linha.dia_id,
    data: linha.data,
    semana: linha.semana,
    cargas: linha.cargas ?? {},
    concluidos: linha.concluidos ?? [],
    atualizadoEm: linha.atualizado_em,
    pendente: 0,
  }
}
