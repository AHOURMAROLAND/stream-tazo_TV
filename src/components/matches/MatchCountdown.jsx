import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import useCountdown from '../../hooks/useCountdown'
import useAppStore from '../../store/useAppStore'
import { formatTime } from '../../utils/time'

function Digit({ value, label }) {
  const str = String(value).padStart(2, '0')
  return (
    <div className="flex flex-col items-center gap-1">
      <div className="flex gap-1">
        {str.split('').map((d, i) => (
          <div
            key={i}
            className="w-12 h-14 sm:w-16 sm:h-20 rounded-xl bg-tazo-surface border border-tazo-border/60 flex items-center justify-center"
          >
            <span className="font-display text-3xl sm:text-5xl text-tazo-text tracking-wider leading-none">
              {d}
            </span>
          </div>
        ))}
      </div>
      <span className="text-tazo-muted text-[10px] font-mono tracking-widest uppercase">{label}</span>
    </div>
  )
}

export default function MatchCountdown({ match }) {
  const navigate   = useNavigate()
  const timezone   = useAppStore((s) => s.timezone)

  const { timeLeft, kicked } = useCountdown(match, timezone, () => {
    // Auto-redirect when kickoff time arrives
    navigate(`/match/${match.id}`, { replace: true })
  })

  if (!timeLeft) return null

  const kickoffDisplay = formatTime(match.time, timezone)

  return (
    <div className="relative overflow-hidden rounded-3xl">
      <div className="absolute inset-0 bg-tazo-card" />
      <div className="absolute inset-0 bg-gradient-to-br from-tazo-accent/5 to-transparent" />
      <div className="absolute inset-0 rounded-3xl border border-tazo-accent/20" />

      {/* Grid pattern */}
      <div className="absolute inset-0 opacity-[0.02] pointer-events-none" style={{
        backgroundImage: 'linear-gradient(rgba(168,85,247,1) 1px, transparent 1px), linear-gradient(90deg, rgba(168,85,247,1) 1px, transparent 1px)',
        backgroundSize: '30px 30px'
      }} />

      <div className="relative p-6 sm:p-8 flex flex-col items-center gap-6">
        {/* Label */}
        <div className="flex flex-col items-center gap-1">
          <div className="flex items-center gap-2">
            <div className="h-px w-8 bg-tazo-accent/60" />
            <span className="text-tazo-accent text-[10px] font-mono tracking-[0.3em] uppercase">
              Coup d'envoi dans
            </span>
            <div className="h-px w-8 bg-tazo-accent/60" />
          </div>
          <span className="text-tazo-muted2 text-xs font-mono">
            {match.date} à {kickoffDisplay} (heure locale)
          </span>
        </div>

        {/* Countdown digits */}
        <div className="flex items-start gap-3 sm:gap-4">
          <Digit value={timeLeft.h} label="Heures" />
          <span className="font-display text-3xl sm:text-5xl text-tazo-accent/60 mt-2 leading-none">:</span>
          <Digit value={timeLeft.m} label="Minutes" />
          <span className="font-display text-3xl sm:text-5xl text-tazo-accent/60 mt-2 leading-none">:</span>
          <Digit value={timeLeft.s} label="Secondes" />
        </div>

        {/* Auto-redirect notice */}
        <p className="text-tazo-muted text-xs font-mono text-center">
          La page se rechargera automatiquement au coup d'envoi
        </p>
      </div>
    </div>
  )
}
