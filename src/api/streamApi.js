import axios from 'axios'
import { MESHIFY_BASE } from '../utils/constants'

// Obtenir le token meshify avec le nom de la chaîne
export const fetchStreamToken = async (ch) => {
  try {
    const res = await axios.post(`${MESHIFY_BASE}/v1/channel`, {
      channel: ch,
    }, {
      headers: {
        'Content-Type': 'application/json',
        'Origin':        'https://vip.kora-top.zip',
        'Referer':       'https://vip.kora-top.zip/',
        'User-Agent':    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      }
    })
    return res.data
  } catch (e) {
    console.error('[TAZO] Meshify error:', e.message)
    return null
  }
}

// Construire l'URL m3u8 depuis la réponse meshify
export const buildM3u8Url = (meshifyData, ch) => {
  if (!meshifyData) return null

  // Cas 1 — meshify retourne directement l'URL
  if (meshifyData.url)    return meshifyData.url
  if (meshifyData.stream) return meshifyData.stream
  if (meshifyData.link)   return meshifyData.link

  // Cas 2 — meshify retourne token + host
  if (meshifyData.token && meshifyData.host) {
    return `${meshifyData.host}/watch/${ch}.m3u8?token=${meshifyData.token}`
  }

  // Cas 3 — meshify retourne token seul → on utilise le host connu
  if (meshifyData.token) {
    return `https://a3.kora-plus.dad/watch/${ch}.m3u8?token=${meshifyData.token}`
  }

  return null
}

// Passer l'URL m3u8 par le proxy Vercel pour contourner le geo-blocage
export const proxyM3u8 = (m3u8Url) => {
  if (!m3u8Url) return null
  return `/api/proxy?url=${encodeURIComponent(m3u8Url)}`
}

export const getStreamUrl = async (channel) => {
  const ch = channel.ch || channel.key || null
  if (!ch) return null

  console.log('[TAZO] Fetching token for channel:', ch)

  const data = await fetchStreamToken(ch)
  console.log('[TAZO] Meshify response:', data)

  const url = buildM3u8Url(data, ch)
  console.log('[TAZO] Final m3u8:', url)

  return url
}
