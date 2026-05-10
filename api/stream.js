/**
 * Vercel Serverless Function — /api/stream?ch=b1
 * Appelle meshify depuis le serveur (pas le browser) pour contourner
 * la restriction des headers Origin/Referer/User-Agent côté client.
 * Fallback : teste les domaines yalla en séquence.
 */

const MESHIFY_BASE = 'https://us.meshify.cloud'

const YALLA_DOMAINS = [
  'yallashoooootlive.online',
  'yallashootttv.com',
  'shootwithyalla.online',
  'yallaliveshoot.online',
  'kora-live-live.info',
  'yallaliveshoot.info',
]

async function fetchMeshify(ch) {
  try {
    const res = await fetch(`${MESHIFY_BASE}/v1/channel`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Origin':       'https://vip.kora-top.zip',
        'Referer':      'https://vip.kora-top.zip/',
        'User-Agent':   'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      },
      body: JSON.stringify({ channel: ch }),
    })
    if (!res.ok) return null
    return await res.json()
  } catch {
    return null
  }
}

function buildM3u8FromMeshify(data, ch) {
  if (!data) return null
  if (data.url)    return data.url
  if (data.stream) return data.stream
  if (data.link)   return data.link
  if (data.token && data.host) return `${data.host}/watch/${ch}.m3u8?token=${data.token}`
  if (data.token)  return `https://a3.kora-plus.dad/watch/${ch}.m3u8?token=${data.token}`
  return null
}

async function findYallaUrl(ch) {
  for (const domain of YALLA_DOMAINS) {
    const url = `https://${domain}/hls/${ch}/master.m3u8`
    try {
      const res = await fetch(url, {
        method: 'HEAD',
        headers: {
          'Origin':  'https://vv.shootwithyalla.com',
          'Referer': 'https://vv.shootwithyalla.com/',
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        },
      })
      if (res.ok) return url
    } catch {
      // domaine mort, on essaie le suivant
    }
  }
  return null
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS')
  if (req.method === 'OPTIONS') return res.status(200).end()

  const { ch } = req.query
  if (!ch) return res.status(400).json({ error: 'Missing ch parameter' })

  // 1. Essayer meshify
  const meshifyData = await fetchMeshify(ch)
  const meshifyUrl  = buildM3u8FromMeshify(meshifyData, ch)

  if (meshifyUrl) {
    return res.status(200).json({ url: meshifyUrl, source: 'meshify' })
  }

  // 2. Fallback yalla
  const yallaUrl = await findYallaUrl(ch)
  if (yallaUrl) {
    return res.status(200).json({ url: yallaUrl, source: 'yalla' })
  }

  // 3. Rien trouvé
  return res.status(404).json({ error: 'No stream found', ch })
}
