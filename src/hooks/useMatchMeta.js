import { useEffect } from 'react'

// Dynamically injects Open Graph / Twitter meta tags for match sharing
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
      ? `Match en direct : ${match.home_en} ${match.score} ${match.away_en} — ${match.league_en}. Regardez le stream sur TAZO TV.`
      : isFinished
        ? `Résultat : ${match.home_en} ${match.score} ${match.away_en} — ${match.league_en}`
        : `${match.home_en} vs ${match.away_en} le ${match.date} à ${match.time} — ${match.league_en}. Stream disponible sur TAZO TV.`

    const image = `https://cdn.kora-api.space/uploads/team/${match.home_logo}`
    const url   = window.location.href

    const setMeta = (property, content, attr = 'property') => {
      let el = document.querySelector(`meta[${attr}="${property}"]`)
      if (!el) {
        el = document.createElement('meta')
        el.setAttribute(attr, property)
        document.head.appendChild(el)
      }
      el.setAttribute('content', content)
    }

    // Document title
    document.title = title

    // Open Graph
    setMeta('og:title',       title)
    setMeta('og:description', description)
    setMeta('og:image',       image)
    setMeta('og:url',         url)
    setMeta('og:type',        'website')
    setMeta('og:site_name',   'TAZO TV')

    // Twitter Card
    setMeta('twitter:card',        'summary_large_image', 'name')
    setMeta('twitter:title',       title,                 'name')
    setMeta('twitter:description', description,           'name')
    setMeta('twitter:image',       image,                 'name')

    return () => {
      document.title = 'TAZO TV'
    }
  }, [match?.id, match?.status, match?.score])
}
