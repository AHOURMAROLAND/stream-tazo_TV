export default function SearchBar({ query, onChange }) {
  return (
    <div className="relative">
      <svg
        className="absolute left-3 top-1/2 -translate-y-1/2 text-tazo-muted w-4 h-4 pointer-events-none"
        fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"
      >
        <circle cx="11" cy="11" r="8" />
        <path d="m21 21-4.35-4.35" />
      </svg>
      <input
        type="text"
        value={query}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Rechercher équipe, compétition..."
        className="w-full bg-tazo-card border border-tazo-border rounded-xl pl-9 pr-10 py-2.5 text-sm font-mono text-tazo-text placeholder-tazo-muted outline-none focus:border-tazo-accent/60 transition-colors"
      />
      {query && (
        <button
          onClick={() => onChange('')}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-tazo-muted hover:text-tazo-accent transition-colors text-sm"
        >
          ✕
        </button>
      )}
    </div>
  )
}
