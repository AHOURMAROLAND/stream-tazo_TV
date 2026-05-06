import { useRef, useEffect } from 'react'
import { getDateRange, getToday } from '../../utils/time'

export default function DateSlider({ activeDate, onChange }) {
  const dates     = getDateRange()
  const scrollRef = useRef(null)
  const today     = getToday()

  // Scroll active date into view on mount and on change
  useEffect(() => {
    if (!scrollRef.current) return
    const active = scrollRef.current.querySelector('[data-active="true"]')
    if (active) {
      active.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' })
    }
  }, [activeDate])

  return (
    <div className="relative mb-6">
      <div
        ref={scrollRef}
        className="flex gap-2 overflow-x-auto pb-2"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {dates.map((d) => {
          const isActive = d.date === activeDate
          const isToday  = d.date === today

          return (
            <button
              key={d.date}
              data-active={isActive}
              onClick={() => onChange(d.date)}
              className={`
                flex flex-col items-center min-w-[56px] px-2 py-2.5 rounded-xl
                border transition-all duration-200 flex-shrink-0
                ${isActive
                  ? 'bg-tazo-accent border-tazo-accent text-tazo-bg'
                  : isToday
                    ? 'bg-tazo-card border-tazo-accent/50 text-tazo-accent'
                    : 'bg-tazo-card border-tazo-border text-tazo-muted hover:border-tazo-accent/50 hover:text-tazo-text'
                }
              `}
            >
              <span className={`text-[10px] font-mono uppercase tracking-wider ${
                isActive ? 'text-tazo-bg/70' : 'text-tazo-muted'
              }`}>
                {d.day}
              </span>
              <span className={`text-sm font-bold font-mono mt-0.5 ${
                isActive ? 'text-tazo-bg' : ''
              }`}>
                {d.label.length <= 5 ? d.label : d.date.slice(8)}
              </span>
              {isToday && !isActive && (
                <span className="w-1 h-1 rounded-full bg-tazo-accent mt-1" />
              )}
            </button>
          )
        })}
      </div>

      {/* Fade edges */}
      <div className="absolute left-0 top-0 bottom-2 w-8 bg-gradient-to-r from-tazo-bg to-transparent pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-2 w-8 bg-gradient-to-l from-tazo-bg to-transparent pointer-events-none" />
    </div>
  )
}
