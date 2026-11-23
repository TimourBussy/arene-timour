export class XTimer extends HTMLElement {
    static readonly observedAttributes = ['value', 'label'] as const

    private interval: number | null = null

    connectedCallback() {
        this.start()
    }

    disconnectedCallback() {
        this.stop()
    }

    private start() {
        if (this.interval !== null) return

        this.interval = setInterval(() => {
            const nextSeconds = (Number(this.getAttribute('value') ?? '0') || 0) + 1

            this.setAttribute('value', nextSeconds.toString())
            this.textContent = `${this.getAttribute('label') ?? 'Temps'} : ` + this.formatTime(nextSeconds)
        }, 1000)
    }

    public stop() {
        if (this.interval !== null) {
            const seconds = Number(this.getAttribute('value') ?? '0') || 0

            this.textContent = `${this.getAttribute('label') ?? 'Temps'} : ` + this.formatTime(seconds)

            clearInterval(this.interval)
            this.interval = null
        }
    }

    public reset() {
        this.stop()
        this.setAttribute('value', '0')
        this.textContent = `${this.getAttribute('label') ?? 'Temps'} : ` + this.formatTime(0)
        this.start()
    }

    private formatTime(seconds: number): string {
        const minutes = Math.floor(seconds / 60)
        const remainingSeconds = seconds % 60
        return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`
    }
}

customElements.define('x-timer', XTimer)

declare global {
    interface HTMLElementTagNameMap {
        'x-timer': XTimer
    }
}
