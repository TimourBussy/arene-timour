// ACTIVITÉ S6 (45 min, partie 2) : le moteur dans React.
//
// Le canvas est un élément DOM que React ne redessine pas : c'est le renderer qui le fait à chaque tick.
// React se charge du HUD (les <score-board>) et du cycle de vie : créer la partie quand le composant
// est monté, l'arrêter quand il est démonté.
//
// À faire, dans un useEffect dépendant de [level, players] :
//   1. Récupérer le canvas via canvasRef.current (peut être null : sortir si c'est le cas).
//   2. Créer `new Game(level, players)`, un renderer avec createRenderer(canvas, game.snapshot),
//      dessiner une première fois.
//   3. S'abonner : 'tick' → draw ; 'score' → mettre à jour `scores` (setScores avec une copie :
//      { ...s, [playerId]: score }) ; 'over' → handleOver.
//   4. Brancher le clavier : ARROWS sur le premier joueur, WASD sur le second s'il existe
//      (bindKeyboard renvoie la fonction qui débranche).
//   5. game.start().
//   6. Renvoyer la fonction de nettoyage : game.stop() et TOUTES les fonctions de désabonnement.
//      (StrictMode monte, démonte et remonte le composant en développement : si le nettoyage est
//      incomplet, vous entendrez deux parties tourner en même temps.)
//
// Pourquoi handleOver et pas onOver directement dans l'effet ? Parce que onOver change à chaque
// rendu du parent : l'effet redémarrerait la partie. useEffectEvent donne une fonction stable qui
// voit toujours la dernière version de onOver.

import { useEffectEvent, useRef, useState } from 'react'
import type { GameState, Level, PlayerSetup } from '../engine/types.ts'

type Props = {
  readonly level: Level
  readonly players: readonly PlayerSetup[]
  readonly onOver: (final: GameState) => void
}

export function GameScene({ level, players, onOver }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [scores] = useState<Readonly<Record<string, number>>>({})
  const handleOver = useEffectEvent((final: GameState) => onOver(final))
  void handleOver // à utiliser dans l'effet

  return (
    <section className="panel">
      <div className="row">
        {players.map((p) => (
          <score-board key={p.id} value={scores[p.id] ?? 0} label={p.name} style={{ color: p.color }} />
        ))}
        <span className="muted" style={{ marginLeft: 'auto' }}>
          À faire (S6) : niveau « {level.name} », {players.length} joueur(s)
        </span>
      </div>
      <canvas ref={canvasRef} width={600} height={440} />
    </section>
  )
}
