// Charge la liste des niveaux dans un effet, gère chargement et erreur.

import { useEffect, useState } from 'react'
import { loadLevelIndex, type LevelEntry } from '../levels.ts'

type Props = { readonly value: string; readonly onChange: (file: string) => void }

export function LevelPicker({ value, onChange }: Props) {
  const [entries, setEntries] = useState<readonly LevelEntry[]>([])
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    loadLevelIndex()
      .then((list) => {
        if (!cancelled) setEntries(list)
      })
      .catch((e: unknown) => {
        if (!cancelled) setError(e instanceof Error ? e.message : String(e))
      })
    return () => {
      cancelled = true
    }
  }, [])

  if (error !== null) return <p className="error">Niveaux indisponibles : {error}</p>

  return (
    <label className="row">
      <span className="muted">Niveau</span>
      <select value={value} onChange={(e) => onChange(e.target.value)} disabled={entries.length === 0}>
        {entries.map((entry) => (
          <option key={entry.file} value={entry.file}>
            {entry.name}
          </option>
        ))}
      </select>
    </label>
  )
}
