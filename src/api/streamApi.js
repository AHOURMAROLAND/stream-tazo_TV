/**
 * streamApi.js
 * Appelle /api/stream (serverless Vercel) qui gère meshify + fallback yalla
 * côté serveur — les headers Origin/Referer/User-Agent sont bloqués par le browser.
 */

// Passer l'URL m3u8 par le proxy Vercel pour contourner le geo-blocage
export const proxyM3u8 = (m3u8Url) => {
  if (!m3u8Url) return null
  return `/api/proxy?url=${encodeURIComponent(m3u8Url)}`
}

export const getStreamUrl = async (channel) => {
  const ch = channel.ch || channel.key || null

  // Pas de clé → pas de m3u8, le fallback iframe (link/mobile_link) sera utilisé
  if (!ch) return null

  try {
    const res  = await fetch(`/api/stream?ch=${encodeURIComponent(ch)}`)
    if (!res.ok) return null
    const data = await res.json()
    if (!data.url) return null

    // Passer l'URL m3u8 par le proxy pour contourner le geo-blocage
    return proxyM3u8(data.url)
  } catch {
    return null
  }
}
