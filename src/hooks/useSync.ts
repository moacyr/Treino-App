import { useEffect, useState } from 'react'
import { assinarDados, assinarEstado, estadoAtual, type EstadoSync } from '../sync/sync'

/** Estado da sincronização com a nuvem, reativo. */
export function useSync(): EstadoSync {
  const [estado, setEstado] = useState<EstadoSync>(estadoAtual)
  useEffect(() => assinarEstado(setEstado), [])
  return estado
}

/**
 * Contador que muda sempre que um pull traz dados novos — use como dependência
 * de efeito para reler o IndexedDB.
 */
export function useVersaoDados(): number {
  const [versao, setVersao] = useState(0)
  useEffect(() => assinarDados(() => setVersao((v) => v + 1)), [])
  return versao
}
