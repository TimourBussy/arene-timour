export class ScoreBoard extends HTMLElement {
    static readonly observedAttributes = ['value', 'label'] as const

    connectedCallback() {
        this.textContent = 'Score : 0'
    }

    attributeChangedCallback(name: string, _old: string | null, value: string | null) {
        if (name === 'value') this.render()
        if (name === 'label') this.render()
    }

    private render() {
        this.textContent = `${this.getAttribute('label') ?? 'Score'} : ${Number(this.getAttribute('value') ?? 0)}`
    }
}

customElements.define('score-board', ScoreBoard)
