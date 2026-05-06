import { useState } from 'react'

export default function ShareButton({ match }) {
  const [copied, setCopied] = useState(false)

  const handleShare = async () => {
    const url   = window.location.href
    const title = `${match.home_en} vs ${match.away_en} — TAZO TV`
    const text  = parseInt(match.status) === 1
      ? `🔴 En direct : ${match.home_en} ${match.score} ${match.away_en} · ${match.league_en}`
      : `⏰ ${match.home_en} vs ${match.away_en} · ${match.time} · ${match.league_en}`

    // Native share API (mobile)
    if (navigator.share) {
      try {
        await navigator.share({ title, text, url })
        return
      } catch (_) {}
    }

    // Fallback — copy to clipboard
    try {
      await navigator.clipboard.writeText(`${text}\n${url}`)
      setCopied(true)
      setTimeout(() => setCopied(false), 2500)
    } catch (_) {}
  }

  return (
    <button
      onClick={handleShare}
      className={`
        flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-mono
        border transition-all duration-200
        ${copied
          ? 'bg-tazo-green/15 border-tazo-green/40 text-tazo-green'
          : 'bg-tazo-card border-tazo-border text-tazo-muted2 hover:border-tazo-accent/50 hover:text-tazo-accent'
        }
      `}
      title="Partager ce match"
    >
      {copied ? (
        <>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12"/>
          </svg>
          Lien copié !
        </>
      ) : (
        <>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/>
            <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/>
            <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/>
          </svg>
          Partager
        </>
      )}
    </button>
  )
}
