// Alerta sonoro via WebAudio (sem asset, funciona offline) + vibração.
// O AudioContext precisa ser criado/desbloqueado a partir de um gesto do
// usuário (o toque em "iniciar"). Guardamos uma instância para tocar o beep
// mais tarde, quando o timer terminar.

let ctx: AudioContext | null = null

type AudioContextCtor = typeof AudioContext

function getCtx(): AudioContext | null {
  if (typeof window === 'undefined') return null
  const Ctor: AudioContextCtor | undefined =
    window.AudioContext ??
    (window as unknown as { webkitAudioContext?: AudioContextCtor })
      .webkitAudioContext
  if (!Ctor) return null
  if (!ctx) ctx = new Ctor()
  return ctx
}

/** Desbloqueia o áudio dentro de um gesto do usuário. */
export function desbloquearAudio(): void {
  const c = getCtx()
  if (c && c.state === 'suspended') {
    void c.resume()
  }
}

function tom(c: AudioContext, freq: number, inicio: number, duracao: number): void {
  const osc = c.createOscillator()
  const gain = c.createGain()
  osc.connect(gain)
  gain.connect(c.destination)
  osc.type = 'sine'
  osc.frequency.value = freq
  // envelope suave para evitar "clique"
  gain.gain.setValueAtTime(0.0001, inicio)
  gain.gain.exponentialRampToValueAtTime(0.35, inicio + 0.02)
  gain.gain.exponentialRampToValueAtTime(0.0001, inicio + duracao)
  osc.start(inicio)
  osc.stop(inicio + duracao + 0.02)
}

/** Toca a sequência de alerta de fim de descanso. */
export function alertarFimDescanso(): void {
  const c = getCtx()
  if (c) {
    if (c.state === 'suspended') void c.resume()
    const t = c.currentTime
    tom(c, 880, t, 0.15)
    tom(c, 880, t + 0.22, 0.15)
    tom(c, 1175, t + 0.44, 0.3)
  }
  if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
    navigator.vibrate?.([200, 90, 200, 90, 350])
  }
}
