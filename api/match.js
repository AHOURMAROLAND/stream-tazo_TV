/**
 * Vercel Serverless Function — /match/:id
 * Injects Open Graph / Twitter meta tags into the SPA HTML so that
 * social-media crawlers (WhatsApp, Telegram, Twitter…) see proper previews.
 */

const esc = (s) =>
  String(s ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')

export default async function handler(req, res) {
  const id = req.query.id
  if (!id) return res.status(400).send('Missing match id')

  const origin = `https://${req.headers.host}`

  try {
    // Fetch match data + SPA shell in parallel
    const [matchRes, spaRes] = await Promise.all([
      fetch(`https://kora-api.space/api/matche/${id}/en?t=${Date.now()}`),
      fetch(`${origin}/_spa`),
    ])

    const match = await matchRes.json()
    let html    = await spaRes.text()

    const isLive     = parseInt(match.status) === 1
    const isFinished = parseInt(match.status) === 2

    // ── Texts ──────────────────────────────────────────────────
    const title = isLive
      ? `🔴 LIVE ${match.score} · ${match.home_en} vs ${match.away_en} — TAZO TV`
      : isFinished
        ? `FT ${match.score} · ${match.home_en} vs ${match.away_en} — TAZO TV`
        : `${match.home_en} vs ${match.away_en} · ${match.time} — TAZO TV`

    const description = isLive
      ? `En direct : ${match.home_en} ${match.score} ${match.away_en} · ${match.league_en}. Stream gratuit sur TAZO TV.`
      : isFinished
        ? `Résultat : ${match.home_en} ${match.score} ${match.away_en} · ${match.league_en}`
        : `${match.home_en} vs ${match.away_en} le ${match.date} à ${match.time} · ${match.league_en}. Stream gratuit sur TAZO TV.`

    // ── OG image URL (both team logos via edge fn) ─────────────
    const ogParams = new URLSearchParams({
      home:   match.home_logo  || '',
      away:   match.away_logo  || '',
      hn:     match.home_en    || '',
      an:     match.away_en    || '',
      score:  match.score      || '-',
      time:   match.time       || '',
      status: String(match.status ?? 0),
      league: match.league_en  || '',
    }).toString()

    // In HTML attributes, & must be &amp;
    const ogImageUrl     = `${origin}/api/og?${ogParams}`
    const ogImageUrlHtml = ogImageUrl.replace(/&/g, '&amp;')
    const matchUrl       = `${origin}/match/${id}`

    // ── Build meta block ───────────────────────────────────────
    const metaTags = `
  <title>${esc(title)}</title>
  <meta name="description" content="${esc(description)}" />
  <meta property="og:title"       content="${esc(title)}" />
  <meta property="og:description" content="${esc(description)}" />
  <meta property="og:image"       content="${ogImageUrlHtml}" />
  <meta property="og:image:width" content="1200" />
  <meta property="og:image:height" content="630" />
  <meta property="og:url"         content="${matchUrl}" />
  <meta property="og:type"        content="website" />
  <meta property="og:site_name"   content="TAZO TV" />
  <meta name="twitter:card"        content="summary_large_image" />
  <meta name="twitter:title"       content="${esc(title)}" />
  <meta name="twitter:description" content="${esc(description)}" />
  <meta name="twitter:image"       content="${ogImageUrl}" />`

    // ── Inject into SPA shell ──────────────────────────────────
    html = html
      .replace(/<title>[^<]*<\/title>/,        '')       // remove default title
      .replace(/<meta\s+name="description"[^>]*>/g, '')  // remove default description
      .replace(/<meta\s+property="og:[^>]*>/g,     '')   // remove default og tags
      .replace(/<meta\s+name="twitter:[^>]*>/g,    '')   // remove default twitter tags
      .replace('</head>', `${metaTags}\n</head>`)

    res.setHeader('Content-Type', 'text/html; charset=utf-8')
    res.setHeader(
      'Cache-Control',
      isLive
        ? 'no-cache, no-store, must-revalidate'
        : 's-maxage=60, stale-while-revalidate=300'
    )
    res.send(html)
  } catch (err) {
    console.error('[api/match]', err)
    // Fallback — serve unmodified SPA shell
    try {
      const spaRes = await fetch(`${origin}/_spa`)
      const html   = await spaRes.text()
      res.setHeader('Content-Type', 'text/html; charset=utf-8')
      res.send(html)
    } catch {
      res.status(302).setHeader('Location', '/').end()
    }
  }
}
