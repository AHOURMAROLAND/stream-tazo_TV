export default function Footer() {
  return (
    <footer className="relative mt-20 overflow-hidden">
      {/* Top border glow */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-tazo-border2 to-transparent" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-tazo-accent to-tazo-accent2 flex items-center justify-center opacity-80">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                <path d="M4 8l8-4 8 4v8l-8 4-8-4V8z" stroke="white" strokeWidth="1.5" strokeLinejoin="round"/>
              </svg>
            </div>
            <span className="font-display text-lg tracking-[0.2em] text-tazo-muted2">
              TAZO<span className="text-tazo-accent/70">TV</span>
            </span>
          </div>

          <div className="flex items-center gap-6">
            <span className="text-tazo-muted text-xs font-mono">
              Stream aggregator
            </span>
            <span className="w-1 h-1 rounded-full bg-tazo-border2" />
            <span className="text-tazo-muted text-xs font-mono">
              {new Date().getFullYear()}
            </span>
          </div>
        </div>
      </div>
    </footer>
  )
}
