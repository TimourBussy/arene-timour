// La version React du <score-board> natif de la S2 : 10 lignes, zéro synchronisation manuelle.

type Props = { readonly value: number; readonly label?: string }

export function ScoreBoard({ value, label = 'Score' }: Props) {
  return (
    <div className="row">
      <span className="muted">{label}</span>
      <strong>{value}</strong>
    </div>
  )
}
