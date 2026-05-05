import { Link } from 'react-router-dom'
import useAppStore from '../../store/useAppStore'

const TIMEZONES = [
  { label: 'GMT',    offset: 0 },
  { label: 'Lomé',   offset: 0 },
  { label: 'Paris',  offset: 2 },
  { label: 'Alger',  offset: 1 },
  { label: 'Riyadh', offset: 3 },
  { label: 'Cairo',  offset: 2 },
]

export default function Header() {
  const { timezone, setTimezone } = useAppStore()

  return (
    <header className="sticky top-0 z-50 bg-tazo-bg/80 backdrop-blur-md border-b border-tazo-border">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-tazo-accent flex items-center justify-center">
            <span className="font-display text-tazo-bg text-sm">T</span>
          </div>
          <span className="font-display text-2xl text-tazo-text tracking-widest">
            TAZO<span className="text-tazo-accent">TV</span>
          </span>
        </Link>

        <div className="flex items-center gap-3">
          <select
            value={timezone}
            onChange={(e) => setTimezone(Number(e.target.value))}
            className="bg-tazo-card border border-tazo-border text-tazo-muted text-xs font-mono rounded-lg px-3 py-1.5 outline-none focus:border-tazo-accent transition-colors cursor-pointer"
          >
            {TIMEZONES.map((tz) => (
              <option key={tz.label} value={tz.offset}>
                {tz.label} (GMT{tz.offset >= 0 ? '+' : ''}{tz.offset})
              </option>
            ))}
          </select>
        </div>
      </div>
    </header>
  )
}
