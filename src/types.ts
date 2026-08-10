export type Padrao = 'bilateral' | 'unilateral' | 'core' | 'condicionamento'

export type TipoDia = 'treino' | 'descanso' | 'trilha' | 'cardio'

export interface Exercicio {
  /** slug único, ex: 'leg-press-45' */
  id: string
  nome: string
  padrao: Padrao
  /** nº de campos de carga a exibir */
  series: number
  /** texto livre, ex: '20', '15/perna', '40s/lado' */
  reps: string
  /** segundos, para o timer de descanso */
  descansoSeg: number
  dica: string
  /** termo de busca já pronto para o YouTube */
  buscaYoutube: string
}

export interface Dia {
  /** 'seg', 'ter', ... */
  id: string
  diaSemana: string
  titulo: string
  /** a linha de lógica do dia */
  subtitulo: string
  tipo: TipoDia
  /** vazio para descanso/trilha/cardio */
  exercicios: Exercicio[]
  /** texto para dias de descanso/trilha/cardio */
  nota?: string
}

/** Uma sessão = um dia treinado numa data */
export interface SessaoRegistro {
  /** `${diaId}-${dataISO}` */
  id: string
  diaId: string
  /** ISO date, ex: '2026-07-15' */
  data: string
  cargas: {
    /** uma entrada por série */
    [exercicioId: string]: (number | null)[]
  }
  /** ids de exercícios marcados como feitos */
  concluidos: string[]
}
