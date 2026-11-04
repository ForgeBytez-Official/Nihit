// Translation helper. niheet's corpus is Bengali-origin scholarship, so a
// translate toggle is a first-class feature. This module is intentionally
// dependency-free: the actual translation call is injected in (so the app can
// wire it to a provider or a local model later) and this function just
// orchestrates caching + fallback.

export interface TranslateRequest {
  text: string
  from: string
  to: string
}

export interface TranslateResult {
  text: string
  source: 'cache' | 'provider' | 'passthrough'
}

const cache = new Map<string, string>()

function cacheKey(req: TranslateRequest): string {
  return `${req.from}:${req.to}:${req.text}`
}

export async function translate(
  req: TranslateRequest,
  provider: (r: TranslateRequest) => Promise<string>,
): Promise<TranslateResult> {
  const key = cacheKey(req)
  const cached = cache.get(key)
  if (cached) return { text: cached, source: 'cache' }

  if (!req.text) return { text: '', source: 'passthrough' }
  try {
    const out = await provider(req)
    cache.set(key, out)
    return { text: out, source: 'provider' }
  } catch {
    return { text: req.text, source: 'passthrough' }
  }
}

export function clearTranslateCache() {
  cache.clear()
}

export default { translate, clearTranslateCache }