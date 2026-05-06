import { useEffect } from 'react'

/**
 * Dynamically injects Open Graph / Twitter meta tags for match sharing.
 * Uses /api/og for the og:image so both team logos appear in previews.
 * Note: social-media crawlers also get these tags server-side via /api/match.
 */
export default function useMatchMeta(match) {
  useEffect(() => {
    if (!match) return

    const isLive     = parseInt(match.status) === 1
    const isFinished = parseInt(match.status) === 2

    const title = isLive
      ? `🔴 LIVE ${match.score} · ${match.home_en} vs ${match.away_en} — TAZO TV`
      : isFinished
        ? `FT ${match.score} · ${match.home_en} vs ${match.away_en} — TAZO TV`
        : `${match.home_en} vs ${match.away_en} · ${match.time} — TAZO TV`

    const description = isLive
      ? `En direct : ${match.home_en} ${match.score} ${match.away_en} · ${match.league_en}. Stream gratuit sur TAZO TV.`
      : isFinished
        ? `Résultat : ${match.home_en} ${match.score} ${match.away_en} · ${match.league_en}`
        : `${match.home_en} vs ${match.away_en} le ${match.date} à ${match.time} · ${match.league_en}. Stream sur TAZO TV.`

    // Build og:image URL pointing to the edge function (both logos)
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

    const ogImage = `${window.location.origin}/api/og?${ogParams}`
    const url     = `${window.location.origin}/match/${match.id}`

    const setMeta = (property, content, attr = 'property') => {
      let el = document.querySelector(`meta[${attr}="${property}"]`)
      if (!el) {
        el = document.createElement('meta')
        el.setAttribute(attr, property)
        document.head.appendChild(el)
      }
      el.setAttribute('content', content)
    }

    document.title = title

    // Open Graph
    setMeta('og:title',        title)
    setMeta('og:description',  description)
    setMeta('og:image',        ogImage)
    setMeta('og:image:width',  '1200')
    setMeta('og:image:height', '630')
    setMeta('og:url',          url)
    setMeta('og:type',         'website')
    setMeta('og:site_name',    'TAZO TV')

    // Twitter Card
    setMeta('twitter:card',        'summary_large_image', 'name')
    setMeta('twitter:title',       title,                 'name')
    setMeta('twitter:description', description,           'name')
    setMeta('twitter:image',       ogImage,               'name')

    return () => {
      document.title = 'TAZO TV'
    }
  }, [match?.id, match?.status, match?.score])
}
