import { getYesterday, getToday, getTomorrow } from '../../utils/time'

const TABS = [
  { label: 'Hier',        emoji: '◀',  date: getYesterday() },
  { label: "Aujourd'hui", emoji: '●',  date: getToday()     },
  { label: 'Demain',      emoji: '▶',  date: getTomorrow()  },
]

export default function MatchFilter({ activeDate, onChange }) {
  return (
    <div className="flex gap-1 sm:gap-2 mb-8 p-1 bg-tazo-surface/60 rounded-2xl border border-tazo-border/50 w-full sm:w-fit">
      {TABS.map((tab) => {
        const isActive = activeDate === tab.date
        return (
          <button
            key={tab.date}
            onClick={() => onChange(tab.date)}
            className={`
              relative flex-1 sm:flex-none px-3 sm:px-5 py-2 sm:py-2.5 rounded-xl
              text-xs sm:text-sm font-mono font-medium
              transition-all duration-250 overflow-hidden
              ${isActive
                ? 'text-tazo-bg'
                : 'text-tazo-muted2 hover:text-tazo-text'
              }
            `}
          >
            {isActive && (
              <>
                <span className="absolute inset-0 bg-gradient-to-br from-tazo-accent to-tazo-accent2 rounded-xl" />
                <span className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent rounded-xl" />
              </>
            )}
            <span className="relative flex items-center justify-center gap-1.5 sm:gap-2">
              <span className={`text-[9px] sm:text-[10px] ${isActive ? 'opacity-80' : 'opacity-40'}`}>
                {tab.emoji}
              </span>
              {tab.label}
            </span>
          </button>
        )
      })}
    </div>
  )
}
