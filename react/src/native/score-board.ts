// <score-board value="0" label="Score"></score-board>
// Un Custom Element autonome : une classe qui étend HTMLElement, enregistrée sous un nom à tiret.

export class ScoreBoard extends HTMLElement {
  /** Les attributs dont les changements déclenchent attributeChangedCallback. */
  static readonly observedAttributes = ['value', 'label'] as const

  /** Propriété `value`, reflétée vers l'attribut : `board.value = 3` équivaut à value="3". */
  get value(): number {
    return Number(this.getAttribute('value') ?? 0)
  }
  set value(value: number) {
    this.setAttribute('value', String(value))
  }

  get label(): string {
    return this.getAttribute('label') ?? 'Score'
  }
  set label(label: string) {
    this.setAttribute('label', label)
  }

  /** Inséré dans le document : premier rendu. */
  connectedCallback(): void {
    this.render()
  }

  /** Un attribut observé a changé (aussi appelé avant connectedCallback pour les attributs initiaux). */
  attributeChangedCallback(): void {
    this.render()
  }

  private render(): void {
    this.textContent = `${this.label} : ${this.value}`
  }
}

customElements.define('score-board', ScoreBoard)

// Dit au compilateur que document.querySelector('score-board') renvoie un ScoreBoard.
declare global {
  interface HTMLElementTagNameMap {
    'score-board': ScoreBoard
  }
}
