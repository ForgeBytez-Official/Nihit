// Share a paper via Web Share API when available, falling back to a clipboard
// link. Pure function — no React state, so it can be called from a button.

export interface ShareTarget {
  title: string
  text: string
  url: string
}

export async function sharePaper(target: ShareTarget): Promise<'shared' | 'copied' | 'unavailable'> {
  if (typeof navigator !== 'undefined' && 'share' in navigator && typeof navigator.share === 'function') {
    try {
      await navigator.share(target)
      return 'shared'
    } catch {
      // user cancelled or share failed — fall through to clipboard
    }
  }
  if (typeof navigator !== 'undefined' && navigator.clipboard) {
    try {
      await navigator.clipboard.writeText(target.url)
      return 'copied'
    } catch {
      // ignore
    }
  }
  return 'unavailable'
}

/**
 * True when the app is being served from a local development server
 * (localhost / loopback). Sharing does not behave reliably there, so the
 * share button is degraded to a "copy the address bar" toast instead.
 */
export function isLocalhost(): boolean {
  if (typeof window === 'undefined') return false
  const host = window.location.hostname
  return host === '' || host === 'localhost' || host === '127.0.0.1' || host === '::1'
}

/**
 * Copy text to the clipboard, with a synchronous fallback for contexts where
 * the async Clipboard API is unavailable or blocked (e.g. plain http://
 * localhost). Resolves true on success.
 */
export async function copyToClipboard(text: string): Promise<boolean> {
  // Prefer the async Clipboard API when available.
  if (typeof navigator !== 'undefined' && navigator.clipboard && typeof navigator.clipboard.writeText === 'function') {
    try {
      await navigator.clipboard.writeText(text)
      return true
    } catch {
      // fall through to synchronous fallback
    }
  }

  // Synchronous fallback using a hidden textarea. Works in insecure contexts
  // (http://localhost) where the async Clipboard API is restricted.
  if (typeof document !== 'undefined' && typeof document.execCommand === 'function') {
    let textarea: HTMLTextAreaElement | null = null
    try {
      textarea = document.createElement('textarea')
      textarea.value = text
      textarea.setAttribute('readonly', '')
      textarea.style.position = 'absolute'
      textarea.style.opacity = '0'
      textarea.style.pointerEvents = 'none'
      document.body.appendChild(textarea)
      textarea.select()
      document.execCommand('copy')
      return true
    } catch {
      // ignore
    } finally {
      if (textarea && textarea.parentNode) {
        textarea.parentNode.removeChild(textarea)
      }
    }
  }

  return false
}

export function paperShareTarget(paper: { title: string; doi: string; id: string }): ShareTarget {
  const url = typeof window !== 'undefined' ? `${window.location.origin}/library/${paper.id}` : paper.doi
  return {
    title: paper.title,
    text: paper.doi,
    url,
  }
}

export default { sharePaper, paperShareTarget }