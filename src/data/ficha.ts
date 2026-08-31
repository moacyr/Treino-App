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
    titulo: 'Peito + Ombro + Braço',
    subtitulo: 'Perna descansa no dia seguinte à trilha, o tronco trabalha pesado. Ombro forte carrega mochila sem dor.',
    tipo: 'treino',
    exercicios: [
      ex('supino-reto', 'Supino Reto', 'bilateral', 4, '6–8', 120, 'Barra ou halteres, carga alta com técnica limpa. Escápula presa no banco. Fechou as 4 séries no topo da faixa? Sobe 2,5 kg na semana seguinte.'),
      ex('supino-inclinado', 'Supino Inclinado com halteres', 'bilateral', 3, '8–12', 90, 'Banco a 30–45°. Não deixe os halteres baterem no topo.'),
      ex('pec-fly', 'Pec Fly (crucifixo na máquina)', 'bilateral', 3, '8–12', 90, 'Isolamento no fim do peito, depois dos supinos. Cotovelo levemente dobrado e fixo, junte até quase encostar e segure 1s.'),
      ex('desenvolvimento', 'Desenvolvimento Militar', 'bilateral', 4, '6–8', 120, 'Halteres ou barra, carga alta. Core firme, sem arquear a lombar pra empurrar. Ombro forte é o que segura a alça da mochila hora após hora. Fechou as 4 séries em 8? Sobe pro próximo par de halteres na semana seguinte.'),
      ex('elevacao-lateral', 'Elevação Lateral', 'bilateral', 3, '20', 45, 'Peso leve, movimento limpo. Pare na linha do ombro.'),
      ex('rosca-direta', 'Rosca Direta', 'bilateral', 3, '15', 45, 'Cotovelo colado no tronco. Sem impulso de quadril.'),
      ex('triceps-corda', 'Tríceps Corda', 'bilateral', 3, '20', 45, 'Abra a corda no final do movimento.'),
      ex('face-pull', 'Face Pull', 'core', 3, '20', 45, 'Puxe até a altura do rosto, cotovelo alto. Abre o ombro que a mochila fecha.'),
    ],
  },
  {
    id: 'ter',
    diaSemana: 'Terça',
    titulo: 'Spinning',
    subtitulo: 'Motor aeróbico. A base que segura horas de subida sem estourar o fôlego.',
    tipo: 'cardio',
    exercicios: [],
    nota: 'Aula de 45–60 min. Priorize os blocos de subida: carga alta, cadência baixa (50–60 rpm) e fora do selim — é o que mais se parece com rampa forte. Sem aula guiada, faça 6–8 blocos de 3 min pesados com 2 min leves entre eles. Amanhã é perna pesada: puxe o ritmo, mas saia da bike com gás sobrando.',
  },
  {
    id: 'qua',
    diaSemana: 'Quarta',
    titulo: 'Pernas — Força de Subida',
    subtitulo: '72h depois da trilha, perna inteira. Carga alta e poucas reps: é força que empurra ladeira acima.',
    tipo: 'treino',
    exercicios: [
      ex('step-up-alto', 'Step-up alto com halteres', 'unilateral', 4, '6–8/perna', 120, 'Banco na altura do joelho ou acima — é o degrau da subida íngreme. Suba empurrando o calcanhar de cima, sem impulso da perna de trás, e desça em 2s. Fechou as 4 séries em 8/perna? Sobe 2 kg em cada halter na semana seguinte.'),
      ex('agachamento', 'Agachamento (barra ou Smith)', 'bilateral', 4, '6–8', 150, 'Carga alta com técnica limpa: coxa paralela, peso no meio do pé. Fechou as 4 séries no topo da faixa? Sobe 2,5–5 kg na semana seguinte.'),
      ex('terra-romeno', 'Levantamento Terra Romeno', 'bilateral', 3, '8–10', 120, 'Quadril pra trás, barra raspando a perna, coluna neutra. Extensão de quadril é o motor da subida com mochila.'),
      ex('leg-press-45', 'Leg Press 45°', 'bilateral', 3, '12', 90, 'Volume depois do pesado. Pés na largura do quadril, meio da plataforma. Não trave o joelho no topo.'),
      ex('mesa-flexora', 'Mesa Flexora', 'bilateral', 3, '12', 60, 'Quadril colado no apoio. Isquiotibial forte é o que segura o joelho na descida.'),
      ex('panturrilha-sentada', 'Panturrilha sentada', 'bilateral', 4, '15', 45, 'Joelho dobrado ativa o sóleo — o músculo que sustenta a subida íngreme. Pausa 1s embaixo, amplitude total.'),
      ex('step-down', 'Step-down (descida controlada)', 'unilateral', 3, '8/perna', 60, 'Fecha o dia com peso do corpo ou halter leve: desça em 3s até encostar de leve o calcanhar. Treina a descida — onde a trilha longa cobra o joelho.'),
    ],
  },
  {
    id: 'qui',
    diaSemana: 'Quinta',
    titulo: 'Spinning',
    subtitulo: 'Dia seguinte à perna pesada. Aqui é girar, não competir.',
    tipo: 'cardio',
    exercicios: [],
    nota: 'Aula de 45–60 min em cadência alta (85–95 rpm), carga leve a moderada e sentado na maior parte do tempo. A proposta é bombear sangue na perna e tirar a dor do treino de ontem, não criar fadiga nova. Se a aula puxar pra subida pesada, fique fora dos blocos mais duros — domingo é a prova.',
  },
  {
    id: 'sex',
    diaSemana: 'Sexta',
    titulo: 'Costas + Core + Prevenção',
    subtitulo: 'Puxada e tronco sustentam a postura sob mochila. Fecha com o que a bike não treina: glúteo médio, tornozelo e equilíbrio.',
    tipo: 'treino',
    exercicios: [
      ex('puxada-frontal', 'Puxada Frontal (pulley)', 'bilateral', 4, '6–8', 120, 'Carga alta: puxe com o cotovelo, não com a mão. Peito aberto, sem jogar o tronco pra trás. Fechou as 4 séries em 8? Sobe uma placa na semana seguinte.'),
      ex('remada-baixa', 'Remada Baixa (polia)', 'bilateral', 4, '6–8', 120, 'Carga alta. Junte as escápulas no fim. Tronco firme, sem balançar pra puxar mais peso. Fechou as 4 séries em 8? Sobe uma placa na semana seguinte.'),
      ex('remada-curvada', 'Remada Curvada com barra', 'bilateral', 3, '8–12', 90, 'Tronco a ~45°, coluna neutra. Puxe até o umbigo.'),
      ex('abducao-polia', 'Abdução de quadril na polia', 'unilateral', 3, '20/lado', 45, 'Caneleira na polia baixa. Glúteo médio — trava o joelho na descida, e pedalar não treina isso.'),
      ex('panturrilha-uni', 'Panturrilha unilateral no step', 'unilateral', 3, '20/perna', 45, 'Uma perna por vez, amplitude total. Carga leve: faltam dois dias pra trilha.'),
      ex('apoio-unipodal', 'Apoio unipodal (equilíbrio)', 'core', 3, '40s/lado', 30, 'Fique numa perna só. Progrida fechando os olhos. Tornozelo de terreno irregular.'),
      ex('prancha', 'Prancha isométrica', 'core', 3, '60s', 45, 'Quadril na linha do ombro. Se cair, encerra a série.'),
      ex('prancha-lateral', 'Prancha lateral', 'core', 3, '40s/lado', 30, 'Core anti-inclinação. Segura o tronco quando a mochila puxa pro lado.'),
      ex('pallof-press', 'Pallof Press na polia', 'core', 3, '12/lado', 45, 'Empurre a polia e resista à rotação. Core anti-giro.'),
    ],
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
    nota: 'Mochila carregada, desnível, distância longa. Progrida uma variável por vez e comece pelo desnível: metros de subida valem mais que quilômetros planos. O peso da mochila é o último a subir — cerca de 1 kg a cada 2–3 semanas. A trilha é o exercício; a semana é preparação.',
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

/**
 * Quantos exercícios do dia estão marcados como feitos. Ignora ids que já não
 * existem na ficha: quando um exercício sai do plano no meio da semana, o
 * registro daquela semana ainda carrega o id antigo e a contagem passaria do
 * total (barra acima de 100%).
 */
export function contarConcluidos(dia: Dia, concluidos: string[] | undefined): number {
  if (!concluidos || concluidos.length === 0) return 0
  const ids = new Set(dia.exercicios.map((e) => e.id))
  return concluidos.reduce((n, id) => (ids.has(id) ? n + 1 : n), 0)
}

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
