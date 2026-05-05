import { getStatusLabel } from '../../utils/status'

export default function MatchBadge({ status, size = 'sm' }) {
  const { label, dot } = getStatusLabel(status)
  const isLive     = parseInt(status) === 1
  const isFinished = parseInt(status) === 2

  if (isLive) {
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-tazo-red/15 border border-tazo-red/30 live-glow">
        <span className="w-1.5 h-1.5 rounded-full bg-tazo-red animate-pulse-live" />
        <span className="text-tazo-red text-[10px] font-mono font-bold tracking-widest uppercase">Live</span>
      </span>
    )
  }

  if (isFinished) {
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-tazo-muted/10 border border-tazo-muted/20">
        <span className="text-tazo-muted text-[10px] font-mono tracking-wider uppercase">Terminé</span>
      </span>
    )
  }

  return (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-tazo-accent/10 border border-tazo-accent/20">
      <span className="text-tazo-accent text-[10px] font-mono tracking-wider uppercase">À venir</span>
    </span>
  )
}
