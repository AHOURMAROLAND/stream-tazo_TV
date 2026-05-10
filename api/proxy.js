export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS')

  if (req.method === 'OPTIONS') return res.status(200).end()

  const { url } = req.query
  if (!url) return res.status(400).json({ error: 'Missing url' })

  const target = decodeURIComponent(url)

  // Adapter le Referer selon la source du stream
  const isYalla = target.includes('yallashoooootlive') || target.includes('yallashootttv') ||
                  target.includes('shootwithyalla') || target.includes('yallaliveshoot') ||
                  target.includes('kora-live-live') || target.includes('yallaliveshoot.info')
  const referer = isYalla ? 'https://vv.shootwithyalla.com/' : 'https://vip.kora-top.zip/'
  const origin  = isYalla ? 'https://vv.shootwithyalla.com'  : 'https://vip.kora-top.zip'

  try {
    const response = await fetch(target, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        'Referer':    referer,
        'Origin':     origin,
      },
    })

    const contentType = response.headers.get('content-type') || ''
    res.setHeader('Content-Type', contentType)
    res.setHeader('Cache-Control', 'no-cache')

    // Si c'est une playlist m3u8 — réécrire les URLs des segments
    if (contentType.includes('mpegurl') || target.includes('.m3u8')) {
      let text = await response.text()

      // Extraire le base URL
      const baseUrl = target.substring(0, target.lastIndexOf('/') + 1)

      // Réécrire les URLs relatives en URLs proxifiées
      text = text.replace(/^(?!#)(.+\.ts.*)$/gm, (match) => {
        const segUrl = match.startsWith('http')
          ? match
          : baseUrl + match
        return `/api/proxy?url=${encodeURIComponent(segUrl)}`
      })

      // Réécrire aussi les .key AES-128
      text = text.replace(/URI="([^"]+)"/g, (match, uri) => {
        const keyUrl = uri.startsWith('http') ? uri : baseUrl + uri
        return `URI="/api/proxy?url=${encodeURIComponent(keyUrl)}"`
      })

      return res.status(200).send(text)
    }

    // Sinon streamer les bytes directement (.ts, .key)
    const buffer = await response.arrayBuffer()
    return res.status(200).send(Buffer.from(buffer))

  } catch (e) {
    console.error('[PROXY]', e.message)
    return res.status(500).json({ error: e.message })
  }
}
