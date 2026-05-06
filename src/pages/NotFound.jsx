import { Link } from 'react-router-dom'
import { IconPlay } from '../components/ui/Icons'

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-6 bg-tazo-bg">
      <div className="ambient-top" />
      <div className="relative z-10 flex flex-col items-center gap-4 text-center px-4">
        <div className="font-display text-[80px] sm:text-[120px] lg:text-[160px] leading-none shimmer-text">
          404
        </div>
        <p className="text-tazo-muted2 font-mono text-sm tracking-wider">
          Cette page n'existe pas
        </p>
        <Link
          to="/"
          className="mt-4 px-6 py-3 rounded-xl btn-accent text-tazo-bg font-mono font-bold text-sm tracking-wider"
        >
          ← Retour à l'accueil
        </Link>
      </div>
    </div>
  )
}
