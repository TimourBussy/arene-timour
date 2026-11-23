import { useState } from 'react'
import { loadLevel } from '../levels.ts'
import { useSession } from '../state/session.ts'
import { LevelPicker } from './LevelPicker.tsx'
import { Lobby } from './Lobby.tsx'

export function LobbyScreen() {
  const { session, dispatch } = useSession()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const canStart = session.players.length > 0 && session.players.every((p) => p.ready) && !loading

  const start = async (): Promise<void> => {
    setLoading(true)
    setError(null)
    try {
      const level = await loadLevel(session.levelFile)
      dispatch({ type: 'start', level })
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : String(e))
      setLoading(false)
    }
  }

  return (
    <>
      <Lobby
        players={session.players}
        onAdd={(name, color) => dispatch({ type: 'addPlayer', name, color })}
        onRemove={(id) => dispatch({ type: 'removePlayer', id })}
        onToggleReady={(id) => dispatch({ type: 'toggleReady', id })}
      />
      <section className="panel">
        <LevelPicker value={session.levelFile} onChange={(levelFile) => dispatch({ type: 'chooseLevel', levelFile })} />
        <div className="row">
          <button className="primary" onClick={start} disabled={!canStart}>
            {loading ? 'Chargement…' : 'Lancer la partie'}
          </button>
          {!canStart && !loading && <span className="muted">Tous les joueurs doivent être prêts</span>}
          {error !== null && <span className="error">{error}</span>}
        </div>
      </section>
    </>
  )
}
