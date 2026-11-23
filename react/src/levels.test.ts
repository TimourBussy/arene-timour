import { afterEach, describe, expect, it, vi } from 'vitest'
import { isLevel, loadLevel, loadLevelIndex } from './levels.ts'

const valid = {
  name: 'Test',
  width: 4,
  height: 3,
  walls: [{ x: 0, y: 0 }],
  spawns: [{ x: 1, y: 1, direction: 'right' }],
}

function fakeFetch(status: number, body: unknown): typeof fetch {
  return vi.fn(async () => new Response(JSON.stringify(body), { status })) as unknown as typeof fetch
}

afterEach(() => vi.unstubAllGlobals())

describe('isLevel', () => {
  it('accepte un niveau bien formé', () => {
    expect(isLevel(valid)).toBe(true)
  })
  it('refuse une direction inconnue', () => {
    expect(isLevel({ ...valid, spawns: [{ x: 1, y: 1, direction: 'north' }] })).toBe(false)
  })
  it('refuse un mur sans coordonnées', () => {
    expect(isLevel({ ...valid, walls: [{ x: 'a' }] })).toBe(false)
  })
  it('refuse null et les chaînes', () => {
    expect(isLevel(null)).toBe(false)
    expect(isLevel('niveau')).toBe(false)
  })
})

describe('loadLevel', () => {
  it('renvoie le niveau quand tout va bien', async () => {
    vi.stubGlobal('fetch', fakeFetch(200, valid))
    await expect(loadLevel('test.json')).resolves.toEqual(valid)
  })
  it('rejette sur une erreur HTTP', async () => {
    vi.stubGlobal('fetch', fakeFetch(404, {}))
    await expect(loadLevel('absent.json')).rejects.toThrow('404')
  })
  it('rejette un JSON qui n\'est pas un niveau', async () => {
    vi.stubGlobal('fetch', fakeFetch(200, { name: 'x' }))
    await expect(loadLevel('bad.json')).rejects.toThrow('format invalide')
  })
})

describe('loadLevelIndex', () => {
  it('renvoie la liste', async () => {
    vi.stubGlobal('fetch', fakeFetch(200, [{ file: 'a.json', name: 'A' }]))
    await expect(loadLevelIndex()).resolves.toEqual([{ file: 'a.json', name: 'A' }])
  })
  it('rejette une liste mal formée', async () => {
    vi.stubGlobal('fetch', fakeFetch(200, [{ file: 1 }]))
    await expect(loadLevelIndex()).rejects.toThrow('invalide')
  })
})
