// Dit à JSX que nos balises natives existent, et quelles props elles acceptent.
// Même idée que HTMLElementTagNameMap (S2) : on augmente une interface existante.
import type { DetailedHTMLProps, HTMLAttributes } from 'react'

declare module 'react' {
  namespace JSX {
    interface IntrinsicElements {
      'score-board': DetailedHTMLProps<HTMLAttributes<HTMLElement>, HTMLElement> & { value?: number; label?: string }
    }
  }
}
