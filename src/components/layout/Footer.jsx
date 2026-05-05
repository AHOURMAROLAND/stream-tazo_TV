export default function Footer() {
  return (
    <footer className="mt-16 border-t border-tazo-border py-6">
      <div className="max-w-6xl mx-auto px-4 flex items-center justify-between">
        <span className="font-display text-tazo-muted tracking-widest text-sm">
          TAZO<span className="text-tazo-accent">TV</span>
        </span>
        <span className="text-tazo-muted text-xs font-mono">
          Stream aggregator — {new Date().getFullYear()}
        </span>
      </div>
    </footer>
  )
}
