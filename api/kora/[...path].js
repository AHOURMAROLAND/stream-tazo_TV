// Vercel Serverless Function — proxy vers kora-api.space
// Capture tout : /api/kora/api/matches/2026-05-06/1?t=... → https://kora-api.space/api/matches/...

export default async function handler(req, res) {
  // req.url = /api/kora/api/matches/... → on extrait après /api/kora
  const afterKora = req.url.replace(/^\/api\/kora/, '') || '/'
  const targetUrl = `https://kora-api.space${afterKora}`

  // CORS preflight
  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Origin',  '*')
    res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS')
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
    return res.status(200).end()
  }

  try {
    const upstream = await fetch(targetUrl, {
      method:  req.method,
      headers: {
        'Content-Type': 'application/json',
        'User-Agent':   'Mozilla/5.0 (compatible; TazoTV/1.0)',
        'Accept':       'application/json',
      },
    })

    const contentType = upstream.headers.get('content-type') || ''
    const body = contentType.includes('application/json')
      ? await upstream.json()
      : await upstream.text()

    res.setHeader('Access-Control-Allow-Origin', '*')
    res.setHeader('Cache-Control', 's-maxage=30, stale-while-revalidate=60')

    if (typeof body === 'string') {
      res.status(upstream.status).send(body)
    } else {
      res.status(upstream.status).json(body)
    }

  } catch (err) {
    console.error('[kora proxy]', err.message)
    res.status(502).json({ error: 'Upstream error', message: err.message })
  }
}
