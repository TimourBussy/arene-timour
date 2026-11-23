// L'état de la session : quel écran, quels joueurs, quel niveau.
// Un reducer : (état, action) → nouvel état, sans mutation. Lu et adapté, pas réécrit.

import { createContext, useContext, type Dispatch } from 'react'
import type { GameState, Level } from '../engine/types.ts'

export type PlayerDraft = {
  readonly id: string
  readonly name: string
  readonly color: string
  readonly ready: boolean
}

export type Session =
  | { readonly screen: 'lobby'; readonly players: readonly PlayerDraft[]; readonly levelFile: string }
  | { readonly screen: 'playing'; readonly players: readonly PlayerDraft[]; readonly levelFile: string; readonly level: Level }
  | {
      readonly screen: 'over'
      readonly players: readonly PlayerDraft[]
      readonly levelFile: string
      readonly level: Level
      readonly final: GameState
    }

export type SessionAction =
  | { readonly type: 'addPlayer'; readonly name: string; readonly color: string }
  | { readonly type: 'removePlayer'; readonly id: string }
  | { readonly type: 'toggleReady'; readonly id: string }
  | { readonly type: 'chooseLevel'; readonly levelFile: string }
  | { readonly type: 'start'; readonly level: Level }
  | { readonly type: 'finish'; readonly final: GameState }
  | { readonly type: 'backToLobby' }

export const MAX_PLAYERS = 2

export const initialSession: Session = {
  screen: 'lobby',
  players: [{ id: 'p1', name: 'Joueur 1', color: '#61dafb', ready: false }],
  levelFile: 'arena.json',
}

let nextId = 2

export function sessionReducer(session: Session, action: SessionAction): Session {
  switch (action.type) {
    case 'addPlayer': {
      if (session.players.length >= MAX_PLAYERS) return session
      const player: PlayerDraft = { id: `p${nextId++}`, name: action.name, color: action.color, ready: false }
      return { ...session, players: [...session.players, player] }
    }
    case 'removePlayer':
      return { ...session, players: session.players.filter((p) => p.id !== action.id) }
    case 'toggleReady':
      return {
        ...session,
        players: session.players.map((p) => (p.id === action.id ? { ...p, ready: !p.ready } : p)),
      }
    case 'chooseLevel':
      return { ...session, levelFile: action.levelFile }
    case 'start':
      return { screen: 'playing', players: session.players, levelFile: session.levelFile, level: action.level }
    case 'finish':
      if (session.screen !== 'playing') return session
      return { ...session, screen: 'over', final: action.final }
    case 'backToLobby':
      return {
        screen: 'lobby',
        players: session.players.map((p) => ({ ...p, ready: false })),
        levelFile: session.levelFile,
      }
  }
}

export const SessionContext = createContext<{ session: Session; dispatch: Dispatch<SessionAction> } | null>(null)

/** Accès à la session depuis n'importe quel composant sous le provider. */
export function useSession() {
  const value = useContext(SessionContext)
  if (value === null) throw new Error('useSession doit être utilisé sous SessionContext.Provider')
  return value
}
