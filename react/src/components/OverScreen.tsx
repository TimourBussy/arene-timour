import { useEffect } from 'react'
import { useBestScore } from '../hooks/useBestScore.ts'
import { loadLevel } from '../levels.ts'
import { useSession, type Session } from '../state/session.ts'
import { ScoreBoard } from './ScoreBoard.tsx'

// Le parent ne rend cet écran que sur 'over' : on reçoit la session déjà rétrécie à ce cas,
// ce qui évite un `if` avant les hooks (les hooks s'appellent toujours, dans le même ordre).
type Props = { readonly session: Extract<Session, { screen: 'over' }> }

export function OverScreen({ session }: Props) {
  const { dispatch } = useSession()
  const { final, level } = session
  const top = Math.max(...final.players.map((p) => p.score))
  const [best, submit] = useBestScore(level.name)

  useEffect(() => {
    submit(top)
  }, [top, submit])

  const replay = async (): Promise<void> => dispatch({ type: 'start', level: await loadLevel(session.levelFile) })

  return (
    <section className="panel">
      <h2>Partie terminée · {level.name}</h2>
      {final.players.map((p) => (
        <ScoreBoard key={p.id} value={p.score} label={p.name} />
      ))}
      <ScoreBoard value={Math.max(best, top)} label="Meilleur score sur ce niveau" />
      <div className="row">
        <button className="primary" onClick={replay}>
          Rejouer
        </button>
        <button onClick={() => dispatch({ type: 'backToLobby' })}>Retour au lobby</button>
      </div>
    </section>
  )
}
