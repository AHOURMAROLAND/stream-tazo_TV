import { getYesterday, getToday, getTomorrow } from '../../utils/time'

const TABS = [
  { label: 'Hier',        date: getYesterday() },
  { label: "Aujourd'hui", date: getToday()      },
  { label: 'Demain',      date: getTomorrow()   },
]

export default function MatchFilter({ activeDate, onChange }) {
  return (
    <div className="flex gap-2 mb-6">
      {TABS.map((tab) => (
        <button
          key={tab.date}
          onClick={() => onChange(tab.date)}
          className={`
            px-4 py-2 rounded-lg text-sm font-medium font-mono transition-all duration-200
            ${activeDate === tab.date
              ? 'bg-tazo-accent text-tazo-bg font-bold'
              : 'bg-tazo-card text-tazo-muted border border-tazo-border hover:border-tazo-accent hover:text-tazo-accent'
            }
          `}
        >
          {tab.label}
        </button>
      ))}
    </div>
  )
}
