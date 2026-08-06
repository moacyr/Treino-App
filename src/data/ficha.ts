import type { Dia, Exercicio, Padrao } from '../types'

/**
 * Constrói um exercício. O termo de busca do YouTube segue o padrão
 * "<nome do exercício> execução correta", gerado automaticamente a partir do nome.
 */
function ex(
  id: string,
  nome: string,
  padrao: Padrao,
  series: number,
  reps: string,
  descansoSeg: number,
  dica: string,
): Exercicio {
  return {
    id,
    nome,
    padrao,
    series,
    reps,
    descansoSeg,
    dica,
    buscaYoutube: `${nome} execução correta`,
  }
}

/** A ficha é fixa e vive no código. Ordem: Segunda → Domingo. */
export const FICHA: Dia[] = [
  {
    id: 'seg',
    diaSemana: 'Segunda',
    titulo: 'Pernas — Base',
    subtitulo: 'Distância máxima da trilha. Ponto mais seguro pra carga alta.',
    tipo: 'treino',
    exercicios: [
      ex('leg-press-45', 'Leg Press 45°', 'bilateral', 4, '20', 60, 'Pés na largura do quadril, meio da plataforma. Não trave o joelho no topo.'),
      ex('agachamento', 'Agachamento (barra ou Smith)', 'bilateral', 4, '15', 60, 'Desça até a coxa ficar paralela ao chão. Peso no meio do pé.'),
      ex('passada-halteres', 'Passada com halteres', 'unilateral', 3, '20 passos', 60, 'Caminhando. Joelho de trás quase encosta no chão, tronco ereto.'),
      ex('cadeira-extensora', 'Cadeira Extensora', 'bilateral', 3, '20', 45, 'Segure 1s no topo. Desça devagar — o freio importa mais que a subida.'),
      ex('mesa-flexora', 'Mesa Flexora', 'bilateral', 3, '20', 45, 'Quadril colado no apoio. Sem levantar o tronco pra puxar mais peso.'),
      ex('panturrilha-pe', 'Panturrilha em pé', 'bilateral', 4, '25', 45, 'Amplitude total: calcanhar abaixo do degrau, suba ao máximo.'),
    ],
  },
  {
    id: 'ter',
    diaSemana: 'Terça',
    titulo: 'Peito + Ombro + Braço',
    subtitulo: 'Recupera as pernas. Ombro forte carrega mochila sem dor.',
    tipo: 'treino',
    exercicios: [
      ex('supino-reto', 'Supino Reto', 'bilateral', 4, '15', 60, 'Barra ou halteres. Escápula presa no banco.'),
      ex('supino-inclinado', 'Supino Inclinado com halteres', 'bilateral', 3, '15', 60, 'Banco a 30–45°. Não deixe os halteres baterem no topo.'),
      ex('desenvolvimento', 'Desenvolvimento Militar', 'bilateral', 4, '15', 60, 'Halteres. Core firme, sem arquear a lombar pra empurrar.'),
      ex('elevacao-lateral', 'Elevação Lateral', 'bilateral', 3, '20', 45, 'Peso leve, movimento limpo. Pare na linha do ombro.'),
      ex('rosca-direta', 'Rosca Direta', 'bilateral', 3, '15', 45, 'Cotovelo colado no tronco. Sem impulso de quadril.'),
      ex('triceps-corda', 'Tríceps Corda', 'bilateral', 3, '20', 45, 'Abra a corda no final do movimento.'),
      ex('face-pull', 'Face Pull', 'core', 3, '20', 45, 'Puxe até a altura do rosto, cotovelo alto. Abre o ombro que a mochila fecha.'),
    ],
  },
  {
    id: 'qua',
    diaSemana: 'Quarta',
    titulo: 'Costas + Core',
    subtitulo: 'Puxada e tronco. Sustentam a postura sob carga nas costas.',
    tipo: 'treino',
    exercicios: [
      ex('puxada-frontal', 'Puxada Frontal (pulley)', 'bilateral', 4, '15', 60, 'Puxe com o cotovelo, não com a mão. Peito aberto.'),
      ex('remada-baixa', 'Remada Baixa (polia)', 'bilateral', 4, '15', 60, 'Junte as escápulas no fim. Tronco firme, sem balançar.'),
      ex('remada-curvada', 'Remada Curvada com barra', 'bilateral', 3, '15', 60, 'Tronco a ~45°, coluna neutra. Puxe até o umbigo.'),
      ex('pulldown-reto', 'Pulldown com braço estendido', 'bilateral', 3, '20', 45, 'Cotovelo travado quase reto. Isola o dorsal.'),
      ex('prancha', 'Prancha isométrica', 'core', 3, '60s', 45, 'Quadril na linha do ombro. Se cair, encerra a série.'),
      ex('prancha-lateral', 'Prancha lateral', 'core', 3, '40s/lado', 30, 'Cada lado. Corrige o desequilíbrio que a mochila causa.'),
    ],
  },
  {
    id: 'qui',
    diaSemana: 'Quinta',
    titulo: 'Estabilidade + Prevenção',
    subtitulo: 'Leve de propósito. O que a trilha não treina: tornozelo, glúteo médio e core.',
    tipo: 'treino',
    exercicios: [
      ex('bulgaro-leve', 'Agachamento Búlgaro (leve)', 'unilateral', 3, '12/perna', 60, 'Carga leve. Força unilateral sem fadigar a perna pro domingo.'),
      ex('elevacao-pelvica', 'Elevação Pélvica com halter', 'bilateral', 3, '15', 45, 'Halter sobre o quadril. Aperte o glúteo 1s no topo.'),
      ex('abducao-polia', 'Abdução de quadril na polia', 'unilateral', 3, '20/lado', 45, 'Caneleira na polia baixa. Glúteo médio — trava o joelho na descida.'),
      ex('apoio-unipodal', 'Apoio unipodal (equilíbrio)', 'core', 3, '40s/lado', 30, 'Fique numa perna só. Progrida fechando os olhos.'),
      ex('panturrilha-uni', 'Panturrilha unilateral no step', 'unilateral', 3, '20/perna', 45, 'Uma perna por vez. Amplitude total.'),
      ex('prancha-lateral-2', 'Prancha lateral', 'core', 3, '40s/lado', 30, 'Core anti-inclinação. Segura o tronco quando a mochila puxa.'),
      ex('pallof-press', 'Pallof Press na polia', 'core', 3, '12/lado', 45, 'Empurre a polia e resista à rotação. Core anti-giro.'),
    ],
  },
  {
    id: 'sex',
    diaSemana: 'Sexta',
    titulo: 'Descanso / Cardio Leve',
    subtitulo: 'Recuperação ativa opcional antes do fim de semana.',
    tipo: 'descanso',
    exercicios: [],
    nota: 'Opcional. 30–40 min de esteira inclinada leve, bike ou mobilidade de quadril e tornozelo. Sem carga. Chegar no domingo com a perna 100%.',
  },
  {
    id: 'sab',
    diaSemana: 'Sábado',
    titulo: 'Descanso',
    subtitulo: 'Recuperação total. Prepare corpo e equipamento para a trilha.',
    tipo: 'descanso',
    exercicios: [],
    nota: 'Descanso completo. Hidrate bem, revise a mochila e o equipamento e durma cedo. Amanhã é dia de trilha.',
  },
  {
    id: 'dom',
    diaSemana: 'Domingo',
    titulo: 'Trekking de Carga Alta',
    subtitulo: 'O objetivo de tudo. A trilha é o exercício.',
    tipo: 'trilha',
    exercicios: [],
    nota: 'Mochila carregada, desnível, distância longa. Progrida peso e distância aos poucos. A trilha é o exercício; a semana é preparação.',
  },
]

/** Índice rápido diaId → Dia. */
export const DIAS_POR_ID: Record<string, Dia> = Object.fromEntries(
  FICHA.map((d) => [d.id, d]),
)

/** Índice rápido exercicioId → { exercicio, dia }. */
export const EXERCICIO_POR_ID: Record<string, { exercicio: Exercicio; dia: Dia }> =
  Object.fromEntries(
    FICHA.flatMap((dia) =>
      dia.exercicios.map((exercicio) => [exercicio.id, { exercicio, dia }]),
    ),
  )

export const ROTULO_PADRAO: Record<Padrao, string> = {
  bilateral: 'Bilateral',
  unilateral: 'Unilateral',
  core: 'Core',
  condicionamento: 'Condicionamento',
}

/** URL de busca no YouTube para um termo pronto. */
export function urlYoutube(termo: string): string {
  return `https://www.youtube.com/results?search_query=${encodeURIComponent(termo)}`
}
