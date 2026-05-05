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
    <header className="sticky top-0 z-50">
      {/* Blur backdrop */}
      <div className="absolute inset-0 bg-tazo-bg/85 backdrop-blur-xl border-b border-tazo-border/50" />
      {/* Top accent line */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-tazo-accent/60 to-transparent" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">

        {/* Logo */}
        <Link to="/" className="flex items-center gap-3 group">
          <div className="relative w-9 h-9">
            <div className="absolute inset-0 rounded-xl bg-tazo-accent/20 blur-md group-hover:bg-tazo-accent/40 transition-all duration-300" />
            <div className="relative w-9 h-9 rounded-xl bg-gradient-to-br from-tazo-accent to-tazo-accent2 flex items-center justify-center shadow-lg">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <path d="M4 8l8-4 8 4v8l-8 4-8-4V8z" stroke="white" strokeWidth="1.5" strokeLinejoin="round"/>
                <path d="M12 4v16M4 8l8 4 8-4" stroke="white" strokeWidth="1.5"/>
              </svg>
            </div>
          </div>
          <div className="flex flex-col leading-none">
            <span className="font-display text-2xl tracking-[0.2em] text-tazo-text group-hover:text-white transition-colors">
              TAZO<span className="text-tazo-accent">TV</span>
            </span>
            <span className="text-[9px] font-mono text-tazo-muted2 tracking-[0.3em] uppercase">
              Live Streams
            </span>
          </div>
        </Link>

        {/* Right side */}
        <div className="flex items-center gap-3">
          {/* Live indicator */}
          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-tazo-red/10 border border-tazo-red/20">
            <span className="w-1.5 h-1.5 rounded-full bg-tazo-red animate-pulse-live live-glow" />
            <span className="text-tazo-red text-[10px] font-mono font-medium tracking-wider uppercase">Live</span>
          </div>

          {/* Timezone selector */}
          <div className="relative">
            <select
              value={timezone}
              onChange={(e) => setTimezone(Number(e.target.value))}
              className="appearance-none bg-tazo-card/80 border border-tazo-border text-tazo-muted2 text-xs font-mono rounded-xl pl-3 pr-7 py-2 outline-none focus:border-tazo-accent/60 focus:text-tazo-text transition-all cursor-pointer hover:border-tazo-border2"
            >
              {TIMEZONES.map((tz) => (
                <option key={tz.label} value={tz.offset}>
                  {tz.label} (GMT{tz.offset >= 0 ? '+' : ''}{tz.offset})
                </option>
              ))}
            </select>
            <svg className="absolute right-2 top-1/2 -translate-y-1/2 w-3 h-3 text-tazo-muted2 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>
      </div>
    </header>
  )
}
