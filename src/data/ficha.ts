import type { Dia, Exercicio, Padrao, TipoDia } from '../types'

/**
 * Constrói um exercício. O termo de busca do YouTube segue o padrão
 * "<nome do exercício> execução correta", gerado automaticamente a partir do nome.
 * `opcoes` cobre os casos fora da régua: cardio contínuo registra nível da
 * máquina em vez de kg e pede um termo de busca próprio.
 */
function ex(
  id: string,
  nome: string,
  padrao: Padrao,
  series: number,
  reps: string,
  descansoSeg: number,
  dica: string,
  opcoes?: { unidadeCarga?: string; busca?: string },
): Exercicio {
  return {
    id,
    nome,
    padrao,
    series,
    reps,
    descansoSeg,
    dica,
    buscaYoutube: opcoes?.busca ?? `${nome} execução correta`,
    ...(opcoes?.unidadeCarga ? { unidadeCarga: opcoes.unidadeCarga } : {}),
  }
}

/** A ficha é fixa e vive no código. Ordem: Segunda → Domingo. */
export const FICHA: Dia[] = [
  {
    id: 'seg',
    diaSemana: 'Segunda',
    titulo: 'Peito + Ombro',
    subtitulo: 'Perna descansa no dia seguinte à trilha, o tronco trabalha pesado. Ombro forte carrega mochila sem dor.',
    tipo: 'treino',
    exercicios: [
      ex('supino-reto', 'Supino Reto', 'bilateral', 4, '6–8', 120, 'Barra ou halteres, carga alta com técnica limpa. Escápula presa no banco. Fechou as 4 séries no topo da faixa? Sobe 2,5 kg na semana seguinte.'),
      ex('supino-inclinado', 'Supino Inclinado com halteres', 'bilateral', 3, '8–12', 90, 'Banco a 30–45°. Não deixe os halteres baterem no topo.'),
      ex('pec-fly', 'Pec Fly (crucifixo na máquina)', 'bilateral', 3, '8–12', 90, 'Isolamento no fim do peito, depois dos supinos. Cotovelo levemente dobrado e fixo, junte até quase encostar e segure 1s.'),
      ex('desenvolvimento', 'Desenvolvimento Militar', 'bilateral', 4, '6–8', 120, 'Halteres ou barra, carga alta. Core firme, sem arquear a lombar pra empurrar. Ombro forte é o que segura a alça da mochila hora após hora. Fechou as 4 séries em 8? Sobe pro próximo par de halteres na semana seguinte.'),
      ex('elevacao-lateral', 'Elevação Lateral', 'bilateral', 3, '20', 45, 'Peso leve, movimento limpo. Pare na linha do ombro. Fecha o dia: rosca e tríceps ficaram para terça.'),
    ],
  },
  {
    id: 'ter',
    diaSemana: 'Terça',
    titulo: 'Escada + Braço e Core',
    subtitulo: 'Escada é o gesto mais parecido com a subida da trilha. Depois dela, o volume leve de braço e core que saiu de segunda e sexta.',
    tipo: 'cardio',
    exercicios: [
      ex('escada-ter', 'Escada Ergométrica (ou elíptico)', 'condicionamento', 1, '30 min', 0, 'Ritmo firme e contínuo, do tipo que dá pra sustentar os 30 min inteiros. Tronco ereto e olhar à frente: não pendure o peso nos braços — quem sobe é a perna. Amanhã é perna pesada, então puxe o ritmo mas saia da escada com gás sobrando. Anote o nível da máquina pra acompanhar a progressão; elíptico se a escada estiver ocupada.', { unidadeCarga: 'nível', busca: 'escada ergométrica postura e técnica' }),
      ex('rosca-direta', 'Rosca Direta', 'bilateral', 3, '15', 45, 'Cotovelo colado no tronco. Sem impulso de quadril.'),
      ex('triceps-corda', 'Tríceps Corda', 'bilateral', 3, '20', 45, 'Peso leve: aqui a proposta é volume, não carga. Se as 20 não saem limpas nas 3 séries, baixe a carga — cotovelo colado no tronco, sem ajuda do ombro. Abra a corda no final do movimento.'),
      ex('face-pull', 'Face Pull', 'core', 3, '20', 45, 'Puxe até a altura do rosto, cotovelo alto. Abre o ombro que a mochila fecha.'),
      ex('prancha', 'Prancha isométrica', 'core', 3, '60s', 45, 'Quadril na linha do ombro. Se cair, encerra a série.'),
    ],
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
      ex('panturrilha-sentada', 'Panturrilha sentada', 'bilateral', 4, '15', 45, 'Joelho dobrado ativa o sóleo — o músculo que sustenta a subida íngreme. Pausa 1s embaixo, amplitude total.'),
    ],
  },
  {
    id: 'qui',
    diaSemana: 'Quinta',
    titulo: 'Escada + Perna Leve e Core',
    subtitulo: 'Dia seguinte à perna pesada: escada leve pra bombear sangue, isquiotibial, técnica de descida e core.',
    tipo: 'cardio',
    exercicios: [
      ex('escada-qui', 'Escada Ergométrica (ou elíptico)', 'condicionamento', 1, '30 min', 0, 'Ritmo leve e constante — hoje é bombear sangue na perna de ontem, não criar fadiga nova. Nada de blocos duros: domingo é a prova. Se a perna ainda estiver pesada de quarta, troque pelo elíptico, que cobra menos do joelho. Anote o nível pra comparar com a terça.', { unidadeCarga: 'nível', busca: 'escada ergométrica postura e técnica' }),
      ex('mesa-flexora', 'Mesa Flexora', 'bilateral', 3, '12', 60, 'Quadril colado no apoio. Isquiotibial forte é o que segura o joelho na descida.'),
      ex('step-down', 'Step-down (descida controlada)', 'unilateral', 3, '8/perna', 60, 'Peso do corpo ou halter leve: desça em 3s até encostar de leve o calcanhar. A escada treinou a subida; este treina a descida — onde a trilha longa cobra o joelho.'),
      ex('prancha-lateral', 'Prancha lateral', 'core', 3, '40s/lado', 30, 'Core anti-inclinação. Segura o tronco quando a mochila puxa pro lado.'),
      ex('pallof-press', 'Pallof Press na polia', 'core', 3, '12/lado', 45, 'Empurre a polia e resista à rotação. Core anti-giro.'),
    ],
  },
  {
    id: 'sex',
    diaSemana: 'Sexta',
    titulo: 'Costas + Prevenção',
    subtitulo: 'Puxada e tronco sustentam a postura sob mochila. Fecha com o que a escada não treina: glúteo médio, tornozelo e equilíbrio.',
    tipo: 'treino',
    exercicios: [
      ex('puxada-frontal', 'Puxada Frontal (pulley)', 'bilateral', 4, '6–8', 120, 'Carga alta: puxe com o cotovelo, não com a mão. Peito aberto, sem jogar o tronco pra trás. Fechou as 4 séries em 8? Sobe uma placa na semana seguinte.'),
      ex('remada-baixa', 'Remada Baixa (polia)', 'bilateral', 4, '6–8', 120, 'Carga alta. Junte as escápulas no fim. Tronco firme, sem balançar pra puxar mais peso. Fechou as 4 séries em 8? Sobe uma placa na semana seguinte.'),
      ex('remada-curvada', 'Remada Curvada com barra', 'bilateral', 3, '8–12', 90, 'Tronco a ~45°, coluna neutra. Puxe até o umbigo.'),
      ex('cadeira-abdutora', 'Cadeira Abdutora (máquina)', 'bilateral', 3, '15–20', 45, 'Glúteo médio: é ele que segura o joelho na descida, e pedalar não treina isso. Tronco um pouco à frente, abra até o fim, segure 1s e volte devagar — sem deixar as placas baterem.'),
      ex('panturrilha-uni', 'Panturrilha unilateral no step', 'unilateral', 3, '20/perna', 45, 'Uma perna por vez, amplitude total. Carga leve: faltam dois dias pra trilha.'),
      ex('apoio-unipodal', 'Apoio unipodal (equilíbrio)', 'core', 3, '40s/lado', 30, 'Fique numa perna só. Progrida fechando os olhos. Tornozelo de terreno irregular.'),
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

/** Emoji do cabeçalho/card por tipo de dia. Dia de treino não usa emoji. */
export const EMOJI_TIPO: Record<TipoDia, string> = {
  treino: '',
  descanso: '🌙',
  trilha: '🥾',
  cardio: '🧗',
}

export const ROTULO_TIPO: Record<TipoDia, string> = {
  treino: 'Treino',
  descanso: 'Descanso',
  trilha: 'Trilha',
  cardio: 'Cardio',
}

/** URL de busca no YouTube para um termo pronto. */
export function urlYoutube(termo: string): string {
  return `https://www.youtube.com/results?search_query=${encodeURIComponent(termo)}`
}
