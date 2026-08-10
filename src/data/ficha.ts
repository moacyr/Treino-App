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
    subtitulo: 'Recuperação ativa no dia seguinte à trilha. Ombro forte carrega mochila sem dor.',
    tipo: 'treino',
    exercicios: [
      ex('supino-reto', 'Supino Reto', 'bilateral', 4, '15', 60, 'Barra ou halteres. Escápula presa no banco.'),
      ex('supino-inclinado', 'Supino Inclinado com halteres', 'bilateral', 3, '15', 60, 'Banco a 30–45°. Não deixe os halteres baterem no topo.'),
      ex('pec-fly', 'Pec Fly (crucifixo na máquina)', 'bilateral', 3, '15', 45, 'Isolamento no fim do peito, depois dos supinos. Cotovelo levemente dobrado e fixo, junte até quase encostar e segure 1s.'),
      ex('desenvolvimento', 'Desenvolvimento Militar', 'bilateral', 4, '15', 60, 'Halteres. Core firme, sem arquear a lombar pra empurrar.'),
      ex('elevacao-lateral', 'Elevação Lateral', 'bilateral', 3, '20', 45, 'Peso leve, movimento limpo. Pare na linha do ombro.'),
      ex('rosca-direta', 'Rosca Direta', 'bilateral', 3, '15', 45, 'Cotovelo colado no tronco. Sem impulso de quadril.'),
      ex('triceps-corda', 'Tríceps Corda', 'bilateral', 3, '20', 45, 'Abra a corda no final do movimento.'),
      ex('face-pull', 'Face Pull', 'core', 3, '20', 45, 'Puxe até a altura do rosto, cotovelo alto. Abre o ombro que a mochila fecha.'),
    ],
  },
  {
    id: 'ter',
    diaSemana: 'Terça',
    titulo: 'Pernas — Força de Subida',
    subtitulo: '48h depois da trilha, perna recuperada. Carga alta e poucas reps: é força que empurra ladeira acima.',
    tipo: 'treino',
    exercicios: [
      ex('step-up-alto', 'Step-up alto com halteres', 'unilateral', 4, '6–8/perna', 120, 'Banco na altura do joelho ou acima — é o degrau da subida íngreme. Suba empurrando o calcanhar de cima, sem impulso da perna de trás, e desça em 2s.'),
      ex('agachamento', 'Agachamento (barra ou Smith)', 'bilateral', 4, '6–8', 150, 'Carga alta com técnica limpa: coxa paralela, peso no meio do pé. Fechou as 4 séries no topo da faixa? Sobe 2,5–5 kg na semana seguinte.'),
      ex('terra-romeno', 'Levantamento Terra Romeno', 'bilateral', 3, '8–10', 120, 'Quadril pra trás, barra raspando a perna, coluna neutra. Extensão de quadril é o motor da subida com mochila.'),
      ex('leg-press-45', 'Leg Press 45°', 'bilateral', 3, '12', 90, 'Volume depois do pesado. Pés na largura do quadril, meio da plataforma. Não trave o joelho no topo.'),
      ex('mesa-flexora', 'Mesa Flexora', 'bilateral', 3, '12', 60, 'Quadril colado no apoio. Isquiotibial forte é o que segura o joelho na descida.'),
      ex('panturrilha-sentada', 'Panturrilha sentada', 'bilateral', 4, '15', 45, 'Joelho dobrado ativa o sóleo — o músculo que sustenta a subida íngreme. Pausa 1s embaixo, amplitude total.'),
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
    subtitulo: 'Leve de propósito. O que a trilha não treina: tornozelo, glúteo médio, core — e a descida controlada.',
    tipo: 'treino',
    exercicios: [
      ex('step-down', 'Step-down (descida controlada)', 'unilateral', 3, '8/perna', 60, 'Em cima do step, desça em 3s até encostar de leve o calcanhar. Peso do corpo ou halter leve. Treina a descida — onde a trilha longa cobra o joelho.'),
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
    nota: 'Opcional. 30–40 min de esteira em inclinação alta (10–15%) e velocidade baixa, sem se apoiar no corrimão — é subida específica sem impacto. Bike ou mobilidade de quadril e tornozelo também servem. Sem carga: chegar no domingo com a perna 100%.',
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
