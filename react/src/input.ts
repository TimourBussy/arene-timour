// Clavier → direction. On utilise `event.code` (touche physique) : ZQSD sur un clavier
// français et WASD sur un clavier anglais tombent sur les mêmes codes KeyW / KeyA / KeyS / KeyD.

import type { Game } from './engine/game.ts'
import type { Direction } from './engine/types.ts'

export type KeyMap = Readonly<Record<string, Direction>>

export const ARROWS: KeyMap = { ArrowUp: 'up', ArrowDown: 'down', ArrowLeft: 'left', ArrowRight: 'right' }
export const WASD: KeyMap = { KeyW: 'up', KeyS: 'down', KeyA: 'left', KeyD: 'right' }

/** Branche un jeu de touches sur un joueur. Renvoie la fonction qui débranche. */
export function bindKeyboard(game: Game, playerId: string, keys: KeyMap): () => void {
  const onKeyDown = (event: KeyboardEvent): void => {
    const direction = keys[event.code]
    if (direction === undefined) return
    event.preventDefault()
    game.turn(playerId, direction)
  }
  window.addEventListener('keydown', onKeyDown)
  return () => window.removeEventListener('keydown', onKeyDown)
}
