import { useEffect, useState } from 'react'

export type Rota =
  | { nome: 'home' }
  | { nome: 'dia'; diaId: string }
  | { nome: 'historico'; exercicioId: string }

function parse(hash: string): Rota {
  const limpo = hash.replace(/^#/, '')
  const partes = limpo.split('/').filter(Boolean) // ['dia','seg']
  if (partes[0] === 'dia' && partes[1]) {
    return { nome: 'dia', diaId: partes[1] }
  }
  if (partes[0] === 'hist' && partes[1]) {
    return { nome: 'historico', exercicioId: partes[1] }
  }
  return { nome: 'home' }
}

export function useRota(): Rota {
  const [rota, setRota] = useState<Rota>(() => parse(window.location.hash))
  useEffect(() => {
    const onHash = () => setRota(parse(window.location.hash))
    window.addEventListener('hashchange', onHash)
    return () => window.removeEventListener('hashchange', onHash)
  }, [])
  return rota
}

export function irPara(rota: Rota): void {
  switch (rota.nome) {
    case 'home':
      window.location.hash = '#/'
      break
    case 'dia':
      window.location.hash = `#/dia/${rota.diaId}`
      break
    case 'historico':
      window.location.hash = `#/hist/${rota.exercicioId}`
      break
  }
}

export function voltar(): void {
  window.history.back()
}
