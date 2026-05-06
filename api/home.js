/**
 * Vercel Serverless Function — /
 * Injects OG tags for the home page: site logo + today's match count.
 */

const esc = (s) =>
  String(s ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')

export default async function handler(req, res) {
  const origin = `https://${req.headers.host}`

  // Today in YYYY-MM-DD (UTC)
  const today = new Date().toISOString().split('T')[0]

  try {
    const [matchesRes, spaRes] = await Promise.all([
      fetch(`https://kora-api.space/api/matches/${today}/1?t=${Date.now()}`),
      fetch(`${origin}/_spa`),
    ])

    const data  = await matchesRes.json()
    let html    = await spaRes.text()

    const total = data?.matches?.length ?? 0
    const live  = data?.matches?.filter((m) => parseInt(m.status) === 1).length ?? 0

    // ── Texts ──────────────────────────────────────────────────
    const title = 'TAZO TV — Football Live'
    const description = total > 0
      ? `${total} match${total > 1 ? 's' : ''} aujourd'hui${live > 0 ? ` · ${live} en direct` : ''} — Regardez le foot gratuitement sur TAZO TV.`
      : 'Regardez les matchs de football en direct sur TAZO TV. Streams gratuits, toutes compétitions.'

    // ── OG image URL ───────────────────────────────────────────
    const ogParams      = new URLSearchParams({ total: String(total), live: String(live) }).toString()
    const ogImageUrl    = `${origin}/api/og-home?${ogParams}`
    const ogImageUrlHtml = ogImageUrl.replace(/&/g, '&amp;')

    // ── Build meta block ───────────────────────────────────────
    const metaTags = `
  <title>${esc(title)}</title>
  <meta name="description" content="${esc(description)}" />
  <meta property="og:title"       content="${esc(title)}" />
  <meta property="og:description" content="${esc(description)}" />
  <meta property="og:image"       content="${ogImageUrlHtml}" />
  <meta property="og:image:width" content="1200" />
  <meta property="og:image:height" content="630" />
  <meta property="og:url"         content="${origin}/" />
  <meta property="og:type"        content="website" />
  <meta property="og:site_name"   content="TAZO TV" />
  <meta name="twitter:card"        content="summary_large_image" />
  <meta name="twitter:title"       content="${esc(title)}" />
  <meta name="twitter:description" content="${esc(description)}" />
  <meta name="twitter:image"       content="${ogImageUrl}" />`

    html = html
      .replace(/<title>[^<]*<\/title>/,        '')
      .replace(/<meta\s+name="description"[^>]*>/g, '')
      .replace(/<meta\s+property="og:[^>]*>/g,     '')
      .replace(/<meta\s+name="twitter:[^>]*>/g,    '')
      .replace('</head>', `${metaTags}\n</head>`)

    res.setHeader('Content-Type', 'text/html; charset=utf-8')
    // Cache 5 min on CDN (match count doesn't change often)
    res.setHeader('Cache-Control', 's-maxage=300, stale-while-revalidate=600')
    res.send(html)
  } catch (err) {
    console.error('[api/home]', err)
    try {
      const spaRes = await fetch(`${origin}/_spa`)
      const html   = await spaRes.text()
      res.setHeader('Content-Type', 'text/html; charset=utf-8')
      res.send(html)
    } catch {
      res.status(302).setHeader('Location', '/?_fb=1').end()
    }
  }
}
