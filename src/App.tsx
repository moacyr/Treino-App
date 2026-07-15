import { DIAS_POR_ID, EXERCICIO_POR_ID } from './data/ficha'
import { useRota } from './router'
import { TimerProvider } from './timer/TimerContext'
import { RestTimerBar } from './components/RestTimerBar'
import { Home } from './components/Home'
import { DiaView } from './components/DiaView'
import { HistoricoView } from './components/HistoricoView'

export function App() {
  const rota = useRota()

  let tela
  if (rota.nome === 'dia') {
    const dia = DIAS_POR_ID[rota.diaId]
    tela = dia ? <DiaView dia={dia} /> : <Home />
  } else if (rota.nome === 'historico') {
    const alvo = EXERCICIO_POR_ID[rota.exercicioId]
    tela = alvo ? <HistoricoView exercicio={alvo.exercicio} dia={alvo.dia} /> : <Home />
  } else {
    tela = <Home />
  }

  return (
    <TimerProvider>
      <div className="app">{tela}</div>
      <RestTimerBar />
    </TimerProvider>
  )
}
