import { render } from 'preact'
import { Widget } from './components/Widget'
import styles from './styles.css?inline'
import type { SupprtConfig } from './types'

export type { SupprtConfig }

interface SupprtInstance {
  destroy: () => void
}

let instance: SupprtInstance | null = null
let shadowHost: HTMLElement | null = null

/**
 * Initialize the Supprt chat widget
 */
export function init(config: SupprtConfig): SupprtInstance {
  if (!config.publicKey) {
    console.error('[Supprt] publicKey is required')
    throw new Error('publicKey is required')
  }

  // Destroy existing instance
  if (instance) {
    instance.destroy()
  }

  // Create shadow host
  shadowHost = document.createElement('div')
  shadowHost.id = 'supprt-widget-host'
  shadowHost.style.cssText = 'all: initial; position: fixed; z-index: 2147483647;'
  document.body.appendChild(shadowHost)

  // Create shadow root for style isolation
  const shadowRoot = shadowHost.attachShadow({ mode: 'open' })

  // Inject styles into shadow DOM
  const styleEl = document.createElement('style')
  styleEl.textContent = styles
  shadowRoot.appendChild(styleEl)

  // Create container inside shadow DOM
  const container = document.createElement('div')
  container.id = 'supprt-container'
  shadowRoot.appendChild(container)

  // Render widget
  render(<Widget config={config} />, container)

  instance = {
    destroy: () => {
      if (shadowHost) {
        render(null, container)
        shadowHost.remove()
        shadowHost = null
      }
      instance = null
    },
  }

  return instance
}

/**
 * Destroy the widget instance
 */
export function destroy(): void {
  if (instance) {
    instance.destroy()
  }
}

/**
 * Check if widget is initialized
 */
export function isInitialized(): boolean {
  return instance !== null
}

// Expose globally for script tag usage
if (typeof window !== 'undefined') {
  ;(window as any).Supprt = { init, destroy, isInitialized }

  // Auto-init from script data attributes
  const initFromScript = () => {
    const scripts = document.querySelectorAll('script[data-public-key]')
    const script = scripts[scripts.length - 1] as HTMLScriptElement | null

    if (script) {
      const publicKey = script.getAttribute('data-public-key')
      const position = script.getAttribute('data-position') as 'bottom-right' | 'bottom-left' | null
      const primaryColor = script.getAttribute('data-primary-color')

      if (publicKey) {
        init({
          publicKey,
          position: position || undefined,
          primaryColor: primaryColor || undefined,
        })
      }
    }
  }

  // Wait for DOM to be ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initFromScript)
  } else {
    initFromScript()
  }
}
