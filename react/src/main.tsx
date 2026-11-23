import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import './native/score-board.ts' // enregistre <score-board> (composant natif de la S2)
import { App } from './App.tsx'

const root = document.getElementById('root')
if (root === null) throw new Error('#root introuvable')

createRoot(root).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
