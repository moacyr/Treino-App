import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react'
import { alertarFimDescanso, desbloquearAudio } from './audio'

interface EstadoTimer {
  ativo: boolean
  pausado: boolean
  total: number // segundos
  restante: number // segundos
  label: string
}

interface TimerAPI extends EstadoTimer {
  iniciar: (segundos: number, label: string) => void
  pausar: () => void
  retomar: () => void
  adicionar: (segundos: number) => void
  encerrar: () => void
}

const TimerContext = createContext<TimerAPI | null>(null)

const INICIAL: EstadoTimer = {
  ativo: false,
  pausado: false,
  total: 0,
  restante: 0,
  label: '',
}

export function TimerProvider({ children }: { children: ReactNode }) {
  const [estado, setEstado] = useState<EstadoTimer>(INICIAL)
  // timestamp (ms) em que o timer deve terminar, para contagem precisa
  const fimRef = useRef<number>(0)
  const intervaloRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const restantePausaRef = useRef<number>(0)

  const limparIntervalo = useCallback(() => {
    if (intervaloRef.current) {
      clearInterval(intervaloRef.current)
      intervaloRef.current = null
    }
  }, [])

  const tick = useCallback(() => {
    const restante = Math.max(0, Math.round((fimRef.current - Date.now()) / 1000))
    setEstado((e) => (e.restante === restante ? e : { ...e, restante }))
    if (restante <= 0) {
      limparIntervalo()
      alertarFimDescanso()
      setEstado((e) => ({ ...e, restante: 0, ativo: true, pausado: false }))
    }
  }, [limparIntervalo])

  const iniciar = useCallback(
    (segundos: number, label: string) => {
      desbloquearAudio()
      limparIntervalo()
      fimRef.current = Date.now() + segundos * 1000
      setEstado({ ativo: true, pausado: false, total: segundos, restante: segundos, label })
      intervaloRef.current = setInterval(tick, 250)
    },
    [limparIntervalo, tick],
  )

  const pausar = useCallback(() => {
    setEstado((e) => {
      if (!e.ativo || e.pausado) return e
      restantePausaRef.current = Math.max(0, Math.round((fimRef.current - Date.now()) / 1000))
      limparIntervalo()
      return { ...e, pausado: true, restante: restantePausaRef.current }
    })
  }, [limparIntervalo])

  const retomar = useCallback(() => {
    setEstado((e) => {
      if (!e.ativo || !e.pausado) return e
      fimRef.current = Date.now() + restantePausaRef.current * 1000
      limparIntervalo()
      intervaloRef.current = setInterval(tick, 250)
      return { ...e, pausado: false }
    })
  }, [limparIntervalo, tick])

  const adicionar = useCallback(
    (segundos: number) => {
      setEstado((e) => {
        if (!e.ativo) return e
        if (e.pausado) {
          restantePausaRef.current = restantePausaRef.current + segundos
          return { ...e, total: e.total + segundos, restante: restantePausaRef.current }
        }
        fimRef.current += segundos * 1000
        const restante = Math.max(0, Math.round((fimRef.current - Date.now()) / 1000))
        return { ...e, total: e.total + segundos, restante }
      })
    },
    [],
  )

  const encerrar = useCallback(() => {
    limparIntervalo()
    setEstado(INICIAL)
  }, [limparIntervalo])

  useEffect(() => () => limparIntervalo(), [limparIntervalo])

  const api = useMemo<TimerAPI>(
    () => ({ ...estado, iniciar, pausar, retomar, adicionar, encerrar }),
    [estado, iniciar, pausar, retomar, adicionar, encerrar],
  )

  return <TimerContext.Provider value={api}>{children}</TimerContext.Provider>
}

export function useTimer(): TimerAPI {
  const ctx = useContext(TimerContext)
  if (!ctx) throw new Error('useTimer precisa estar dentro de <TimerProvider>')
  return ctx
}
