import { getStatusLabel } from '../../utils/status'

export default function MatchBadge({ status }) {
  const isLive     = parseInt(status) === 1
  const isFinished = parseInt(status) === 2

  if (isLive) {
    return (
      <span className="motion-scale inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-tazo-red/15 border border-tazo-red/30 live-glow">
        {/* Dual-ring live dot */}
        <span className="relative flex items-center justify-center w-2 h-2">
          <span className="absolute w-2 h-2 rounded-full bg-tazo-red animate-pulse-live" />
          <span className="absolute w-2 h-2 rounded-full bg-tazo-red/60"
            style={{ animation: 'ripple 1.8s ease-out infinite' }} />
        </span>
        <span className="text-tazo-red text-[10px] font-mono font-bold tracking-widest uppercase">
          Live
        </span>
      </span>
    )
  }

  if (isFinished) {
    return (
      <span className="motion-fade inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-tazo-muted/10 border border-tazo-muted/20">
        <span className="w-1 h-1 rounded-full bg-tazo-muted/60" />
        <span className="text-tazo-muted text-[10px] font-mono tracking-wider uppercase">Terminé</span>
      </span>
    )
  }

  return (
    <span className="motion-fade inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-tazo-accent/10 border border-tazo-accent/20">
      <span className="w-1 h-1 rounded-full bg-tazo-accent/60" />
      <span className="text-tazo-accent text-[10px] font-mono tracking-wider uppercase">À venir</span>
    </span>
  )
}
