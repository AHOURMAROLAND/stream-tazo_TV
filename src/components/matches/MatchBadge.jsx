import { getStatusLabel } from '../../utils/status'

export default function MatchBadge({ status }) {
  const { label, color, dot } = getStatusLabel(status)

  return (
    <span className={`flex items-center gap-1.5 text-xs font-mono font-medium ${color}`}>
      {dot && (
        <span className="w-1.5 h-1.5 rounded-full bg-tazo-red animate-pulse-live" />
      )}
      {label}
    </span>
  )
}
