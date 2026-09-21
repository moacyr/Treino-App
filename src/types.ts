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
  /** segundos, para o timer de descanso. 0 = esforço contínuo, sem descanso */
  descansoSeg: number
  dica: string
  /** termo de busca já pronto para o YouTube */
  buscaYoutube: string
  /** unidade do campo de carga; default 'kg' (ex.: 'nível' na escada) */
  unidadeCarga?: string
}

export interface Dia {
  /** 'seg', 'ter', ... */
  id: string
  diaSemana: string
  titulo: string
  /** a linha de lógica do dia */
  subtitulo: string
  tipo: TipoDia
  /** vazio nos dias sem musculação (descanso, trilha) */
  exercicios: Exercicio[]
  /** nota de contexto do dia; pode conviver com a lista de exercícios */
  nota?: string
}

/** Uma sessão = um dia treinado numa data */
export interface SessaoRegistro {
  /** `${diaId}-${semana}` */
  id: string
  diaId: string
  /** ISO date do último registro, ex: '2026-07-15' */
  data: string
  /** segunda-feira da semana a que a sessão pertence, ex: '2026-07-13' */
  semana: string
  cargas: {
    /** uma entrada por série */
    [exercicioId: string]: (number | null)[]
  }
  /** ids de exercícios marcados como feitos */
  concluidos: string[]
  /** ISO timestamp da última edição — critério de conflito no sync (last-write-wins) */
  atualizadoEm: string
  /** 1 = ainda não enviada para a nuvem (só local) */
  pendente: 0 | 1
}
