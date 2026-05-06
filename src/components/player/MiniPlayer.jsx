import { useNavigate } from 'react-router-dom'
import useAppStore from '../../store/useAppStore'
import { IconClose } from '../ui/Icons'

export default function MiniPlayer() {
  const navigate = useNavigate()
  const { miniPlayer, clearMiniPlayer } = useAppStore()

  if (!miniPlayer) return null

  const { matchId, src, homeName, awayName, homeLogo, awayLogo, score, isLive } = miniPlayer
  const isM3u8  = src && src.includes('.m3u8')
  const scores  = score && score !== '-' ? score.split(' - ') : ['-', '-']

  const goToMatch = () => {
    clearMiniPlayer()
    navigate(`/match/${matchId}`)
  }

  return (
    <div
      className="fixed z-[200] motion-enter
        bottom-0 left-0 right-0
        sm:bottom-6 sm:right-6 sm:left-auto sm:w-72"
      style={{ animationDelay: '0.05s' }}
    >
      <div
        className="
          flex flex-col overflow-hidden border border-tazo-border bg-tazo-card
          sm:rounded-2xl
          shadow-2xl
        "
        style={{ boxShadow: '0 20px 60px rgba(0,0,0,0.6), 0 0 0 1px rgba(168,85,247,0.12)' }}
      >

        {/* ── Header strip ─────────────────────────────────────── */}
        <div className="flex items-center justify-between px-3 py-2 bg-tazo-surface border-b border-tazo-border/50 shrink-0">
          <div className="flex items-center gap-2">
            {isLive && (
              <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-tazo-red animate-pulse-live" />
                <span className="text-tazo-red text-[10px] font-mono font-bold tracking-widest uppercase">Live</span>
              </div>
            )}
            <span className="text-tazo-muted2 text-[10px] font-mono">Stream en cours</span>
          </div>
          <button
            onClick={clearMiniPlayer}
            title="Fermer"
            className="w-6 h-6 rounded-lg bg-tazo-card border border-tazo-border flex items-center justify-center text-tazo-muted2 hover:text-tazo-text hover:border-tazo-border2 transition-all"
          >
            <IconClose className="w-3 h-3" />
          </button>
        </div>

        {/* ── Video area ───────────────────────────────────────── */}
        <div className="relative bg-black" style={{ paddingBottom: '56.25%' }}>
          {isM3u8 ? (
            <video
              key={src}
              src={src}
              autoPlay
              muted
              playsInline
              className="absolute inset-0 w-full h-full object-contain"
            />
          ) : (
            <iframe
              key={src}
              src={src}
              className="absolute inset-0 w-full h-full border-0"
              allowFullScreen
              allow="autoplay; fullscreen; encrypted-media"
              sandbox="allow-scripts allow-same-origin allow-forms allow-presentation"
              title="TAZO TV Mini Player"
            />
          )}
        </div>

        {/* ── Match info / navigate back ───────────────────────── */}
        <button
          onClick={goToMatch}
          title="Retour au match"
          className="flex items-center gap-2 px-3 py-2.5 bg-tazo-card hover:bg-tazo-surface transition-colors group shrink-0"
        >
          {/* Home team */}
          <div className="flex items-center gap-1.5 flex-1 min-w-0">
            <img
              src={homeLogo}
              alt={homeName}
              className="w-5 h-5 object-contain shrink-0"
              onError={(e) => { e.target.style.display = 'none' }}
            />
            <span className="text-tazo-text text-[11px] font-mono truncate leading-none">{homeName}</span>
          </div>

          {/* Score / vs */}
          <span className="text-tazo-accent text-[12px] font-mono font-bold shrink-0 px-1">
            {(isLive && scores[0] !== '-') ? `${scores[0]}–${scores[1]}` : 'vs'}
          </span>

          {/* Away team */}
          <div className="flex items-center gap-1.5 flex-1 min-w-0 justify-end">
            <span className="text-tazo-text text-[11px] font-mono truncate text-right leading-none">{awayName}</span>
            <img
              src={awayLogo}
              alt={awayName}
              className="w-5 h-5 object-contain shrink-0"
              onError={(e) => { e.target.style.display = 'none' }}
            />
          </div>

          {/* Arrow */}
          <svg
            width="10" height="10" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" strokeWidth="2.5"
            className="text-tazo-muted2 group-hover:text-tazo-accent transition-colors shrink-0"
          >
            <path d="M9 18l6-6-6-6"/>
          </svg>
        </button>
      </div>
    </div>
  )
}
