import { useReducer } from 'react'
import { GameScene } from './components/GameScene.tsx'
import { LobbyScreen } from './components/LobbyScreen.tsx'
import { OverScreen } from './components/OverScreen.tsx'
import { SessionContext, initialSession, sessionReducer } from './state/session.ts'

export function App() {
  const [session, dispatch] = useReducer(sessionReducer, initialSession)

  return (
    <SessionContext value={{ session, dispatch }}>
      <h1>Arène</h1>
      {session.screen === 'lobby' && <LobbyScreen />}
      {session.screen === 'playing' && (
        <GameScene
          level={session.level}
          players={session.players}
          onOver={(final) => dispatch({ type: 'finish', final })}
        />
      )}
      {session.screen === 'over' && <OverScreen session={session} />}
    </SessionContext>
  )
}
