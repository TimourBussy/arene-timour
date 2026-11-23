// ACTIVITÉ S5 (60 min) : le lobby.
//
// Contrat (ne pas le changer, LobbyScreen s'en sert) :
//   - `players`       la liste courante, en lecture seule
//   - `onAdd`         appelé avec (pseudo, couleur) quand le formulaire est soumis
//   - `onRemove`      appelé avec l'id du joueur à retirer
//   - `onToggleReady` appelé avec l'id du joueur qui change d'état
//
// L'état des joueurs ne vit PAS ici : il est dans la session (state/session.ts).
// Le lobby ne possède que l'état de son formulaire (pseudo et couleur en cours de saisie).
//
// À faire :
//   1. Afficher la liste des joueurs : une <ul>, un <li> par joueur avec sa couleur (span.swatch),
//      son nom, un bouton « Prêt ✓ » / « Pas prêt » qui appelle onToggleReady, un bouton « × »
//      (aria-label="Retirer <nom>") qui appelle onRemove. Ne pas oublier `key`.
//   2. Un formulaire contrôlé : un <input> pseudo (value + onChange sur un useState), un
//      <input type="color">, un bouton « Ajouter » de type submit. Sur onSubmit : preventDefault,
//      ignorer un pseudo vide (trim), appeler onAdd, vider le champ.
//   3. Quand la liste atteint MAX_PLAYERS : désactiver le champ et le bouton, afficher
//      « 2 joueurs maximum (flèches et ZQSD) ».
//
// Rappel : jamais players.push(...) : la liste est readonly, et de toute façon c'est le parent qui la modifie.

import type { PlayerDraft } from '../state/session.ts'

type Props = {
  readonly players: readonly PlayerDraft[]
  readonly onAdd: (name: string, color: string) => void
  readonly onRemove: (id: string) => void
  readonly onToggleReady: (id: string) => void
}

export function Lobby({ players }: Props) {
  return (
    <section className="panel">
      <h2>Joueurs</h2>
      <p className="muted">À faire (S5) : {players.length} joueur(s) dans la session, à afficher ici.</p>
    </section>
  )
}
