// Meilleur score par niveau, persisté dans localStorage.
// Lecture paresseuse à l'initialisation, écriture dans un effet quand la valeur change.

import { useCallback, useEffect, useState } from 'react'

const key = (levelName: string): string => `arene:best:${levelName}`

function read(levelName: string): number {
  try {
    return Number(localStorage.getItem(key(levelName)) ?? 0)
  } catch {
    return 0
  }
}

export function useBestScore(levelName: string): [number, (candidate: number) => void] {
  const [best, setBest] = useState(() => read(levelName))

  useEffect(() => {
    setBest(read(levelName))
  }, [levelName])

  useEffect(() => {
    try {
      localStorage.setItem(key(levelName), String(best))
    } catch {
      /* stockage indisponible (navigation privée) : on ignore */
    }
  }, [levelName, best])

  const submit = useCallback((candidate: number): void => setBest((current) => Math.max(current, candidate)), [])
  return [best, submit]
}
