// Vercel Serverless Function — proxy vers us.meshify.cloud

export default async function handler(req, res) {
  const afterMeshify = req.url.replace(/^\/api\/meshify/, '') || '/'
  const targetUrl    = `https://us.meshify.cloud${afterMeshify}`

  // CORS preflight
  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Origin',  '*')
    res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS')
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
    return res.status(200).end()
  }

  try {
    const bodyText = req.method !== 'GET' && req.method !== 'HEAD'
      ? JSON.stringify(req.body)
      : undefined

    const upstream = await fetch(targetUrl, {
      method:  req.method,
      headers: {
        'Content-Type': 'application/json',
        'Origin':       'https://vip.kora-top.zip',
        'Referer':      'https://vip.kora-top.zip/',
        'User-Agent':   'Mozilla/5.0 (compatible; TazoTV/1.0)',
      },
      body: bodyText,
    })

    const contentType = upstream.headers.get('content-type') || ''
    const body = contentType.includes('application/json')
      ? await upstream.json()
      : await upstream.text()

    res.setHeader('Access-Control-Allow-Origin', '*')

    if (typeof body === 'string') {
      res.status(upstream.status).send(body)
    } else {
      res.status(upstream.status).json(body)
    }

  } catch (err) {
    console.error('[meshify proxy]', err.message)
    res.status(502).json({ error: 'Upstream error', message: err.message })
  }
}
