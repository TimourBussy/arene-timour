// Chargement des niveaux : fetch + JSON + validation.
// Ce qui arrive du réseau est `unknown` tant qu'on ne l'a pas vérifié.

import type { Direction, Level, Point, Spawn } from './engine/types.ts'

export type LevelEntry = { readonly file: string; readonly name: string }

const BASE = `${import.meta.env.BASE_URL}levels/`
const DIRECTIONS: readonly Direction[] = ['up', 'down', 'left', 'right']

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null
}

function isPoint(value: unknown): value is Point {
  return isRecord(value) && typeof value.x === 'number' && typeof value.y === 'number'
}

function isSpawn(value: unknown): value is Spawn {
  if (!isRecord(value)) return false
  const direction = value.direction // lu avant le rétrécissement en Point
  return isPoint(value) && typeof direction === 'string' && (DIRECTIONS as readonly string[]).includes(direction)
}

function isLevelEntry(value: unknown): value is LevelEntry {
  return isRecord(value) && typeof value.file === 'string' && typeof value.name === 'string'
}

/** Vérifie qu'une valeur inconnue a bien la forme d'un Level. */
export function isLevel(value: unknown): value is Level {
  return (
    isRecord(value) &&
    typeof value.name === 'string' &&
    typeof value.width === 'number' &&
    typeof value.height === 'number' &&
    Array.isArray(value.walls) &&
    value.walls.every(isPoint) &&
    Array.isArray(value.spawns) &&
    value.spawns.length > 0 &&
    value.spawns.every(isSpawn)
  )
}

/** La liste des niveaux disponibles (public/levels/index.json). */
export async function loadLevelIndex(): Promise<LevelEntry[]> {
  const response = await fetch(`${BASE}index.json`)
  if (!response.ok) throw new Error(`Index des niveaux : HTTP ${response.status}`)
  const data: unknown = await response.json()
  if (!Array.isArray(data) || !data.every(isLevelEntry)) throw new Error('Index des niveaux invalide')
  return data
}

/**
 * ACTIVITÉ S6 (45 min, partie 1) : un niveau, par nom de fichier.
 * Rejette si le fichier manque (`Niveau x : HTTP 404`) ou n'a pas la bonne forme (`Niveau x : format invalide`).
 * Modèle : loadLevelIndex juste au-dessus. Les tests de levels.test.ts vérifient les trois cas.
 */
export async function loadLevel(file: string): Promise<Level> {
  throw new Error(`TODO : loadLevel(${file}) n'est pas encore implémentée`)
}
