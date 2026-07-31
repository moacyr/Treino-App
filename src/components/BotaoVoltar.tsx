export function BotaoVoltar({
  aoVoltar,
  rotulo = 'Semana',
}: {
  aoVoltar: () => void
  rotulo?: string
}) {
  return (
    <button className="btn-voltar" onClick={aoVoltar} aria-label={`Voltar para ${rotulo}`}>
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path
          d="M15 18l-6-6 6-6"
          stroke="currentColor"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      <span>{rotulo}</span>
    </button>
  )
}
