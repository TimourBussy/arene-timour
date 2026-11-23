// Règles du jeu : des fonctions pures.
// Aucune ne modifie son argument ; chacune renvoie une nouvelle valeur.

import {
  BASE_LENGTH,
  TARGET_COUNT,
  type Direction,
  type GameState,
  type Inputs,
  type Level,
  type Player,
  type PlayerSetup,
  type Point,
} from './types.ts'

/** Direction opposée : on ne peut pas faire demi‑tour sur place. */
export function opposite(direction: Direction): Direction {
  switch (direction) {
    case 'up':
      return 'down'
    case 'down':
      return 'up'
    case 'left':
      return 'right'
    case 'right':
      return 'left'
  }
}

/** La case suivante à partir d'une tête et d'une direction. L'axe y pointe vers le bas. */
export function nextHead(head: Point, direction: Direction): Point {
  switch (direction) {
    case 'up':
      return { x: head.x, y: head.y - 1 }
    case 'down':
      return { x: head.x, y: head.y + 1 }
    case 'left':
      return { x: head.x - 1, y: head.y }
    case 'right':
      return { x: head.x + 1, y: head.y }
  }
}

export function samePoint(a: Point, b: Point): boolean {
  return a.x === b.x && a.y === b.y
}

/** Le point est‑il dans la grille ? */
export function inside(level: Level, p: Point): boolean {
  return p.x >= 0 && p.y >= 0 && p.x < level.width && p.y < level.height
}

/** Une case est libre si elle est dans la grille, hors des murs et hors de toutes les traces. */
export function isFree(state: GameState, p: Point): boolean {
  if (!inside(state.level, p)) return false
  if (state.level.walls.some((w) => samePoint(w, p))) return false
  return !state.players.some((player) => player.trail.some((t) => samePoint(t, p)))
}

/** Toutes les cases libres de la grille (hors cibles déjà posées). */
export function freeCells(state: GameState): Point[] {
  const { width, height } = state.level
  return Array.from({ length: height }, (_, y) =>
    Array.from({ length: width }, (_, x) => ({ x, y })),
  )
    .flat()
    .filter((p) => isFree(state, p))
    .filter((p) => !state.targets.some((t) => samePoint(t, p)))
}

/**
 * Ajoute une cible sur une case libre tirée au hasard.
 * `random` est injecté (et non `Math.random` en dur) pour que les tests et le serveur
 * puissent rejouer une partie à l'identique.
 */
export function spawnTarget(state: GameState, random: () => number): GameState {
  const cells = freeCells(state)
  if (cells.length === 0) return state
  const cell = cells[Math.floor(random() * cells.length)]
  return { ...state, targets: [...state.targets, cell] }
}

/**
 * Fait avancer un joueur d'une case.
 * 1. Si le joueur est mort, rien ne change.
 * 2. La direction demandée est prise en compte sauf si c'est un demi‑tour.
 * 3. La tête avance ; si la case n'est pas libre, le joueur meurt.
 * 4. Si la case contient une cible, le score augmente.
 * 5. La trace garde au plus BASE_LENGTH + score cases.
 */
export function movePlayer(state: GameState, player: Player, wanted: Direction | undefined): Player {
  if (!player.alive) return player
  const direction = wanted !== undefined && wanted !== opposite(player.direction) ? wanted : player.direction
  const head = nextHead(player.trail[0], direction)
  if (!isFree(state, head)) return { ...player, direction, alive: false }
  const ate = state.targets.some((t) => samePoint(t, head))
  const score = ate ? player.score + 1 : player.score
  const trail = [head, ...player.trail].slice(0, BASE_LENGTH + score)
  return { ...player, direction, trail, score }
}

/** Complète les cibles jusqu'à TARGET_COUNT (sans faire avancer personne). */
export function withTargets(state: GameState, random: () => number): GameState {
  let next = state
  while (next.targets.length < TARGET_COUNT) {
    const spawned = spawnTarget(next, random)
    if (spawned === next) break // plus aucune case libre
    next = spawned
  }
  return next
}

/** Crée l'état de départ : chaque joueur sur son point de départ, aucune cible. */
export function createState(level: Level, setups: readonly PlayerSetup[]): GameState {
  const players = setups.map((setup, i): Player => {
    const spawn = level.spawns[i % level.spawns.length]
    return {
      ...setup,
      direction: spawn.direction,
      trail: [{ x: spawn.x, y: spawn.y }],
      alive: true,
      score: 0,
    }
  })
  return { level, players, targets: [], tick: 0, status: 'idle' }
}

/** Un tick complet : tous les joueurs avancent, les cibles mangées sont remplacées. */
export function step(state: GameState, inputs: Inputs, random: () => number): GameState {
  if (state.status !== 'running') return state

  const moved = state.players.map((p) => movePlayer(state, p, inputs[p.id]))

  // Deux têtes sur la même case : les deux joueurs meurent.
  const players = moved.map((p) => {
    if (!p.alive) return p
    const collision = moved.some((o) => o !== p && o.alive && samePoint(o.trail[0], p.trail[0]))
    return collision ? { ...p, alive: false } : p
  })

  const heads = players.filter((p) => p.alive).map((p) => p.trail[0])
  const targets = state.targets.filter((t) => !heads.some((h) => samePoint(h, t)))

  const next = withTargets({ ...state, players, targets, tick: state.tick + 1 }, random)

  const status = players.some((p) => p.alive) ? 'running' : 'over'
  return { ...next, status }
}
