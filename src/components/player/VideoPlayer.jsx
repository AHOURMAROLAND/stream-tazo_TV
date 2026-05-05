import { useState, useEffect, useRef } from 'react'

// Inject a <link rel="preconnect"> for a given URL domain
function preconnect(url) {
  if (!url) return
  try {
    const { origin } = new URL(url)
    if (document.querySelector(`link[href="${origin}"]`)) return
    const link = document.createElement('link')
    link.rel  = 'preconnect'
    link.href = origin
    document.head.appendChild(link)
  } catch (_) {}
}

export default function VideoPlayer({ src }) {
  const [loaded, setLoaded]   = useState(false)   // iframe injected
  const [ready, setReady]     = useState(false)   // iframe onload fired
  const [isOffline, setIsOffline] = useState(!navigator.onLine)
  const prevSrc = useRef(null)

  // Preconnect as soon as we get a src, before user even clicks play
  useEffect(() => {
    if (src) preconnect(src)
  }, [src])

  // Auto-load iframe when src arrives (or changes)
  useEffect(() => {
    if (!src) return
    if (src !== prevSrc.current) {
      prevSrc.current = src
      setLoaded(false)
      setReady(false)
      // Small tick so React unmounts old iframe first
      const t = setTimeout(() => setLoaded(true), 50)
      return () => clearTimeout(t)
    }
  }, [src])

  // Online / offline detection
  useEffect(() => {
    const off = () => setIsOffline(true)
    const on  = () => setIsOffline(false)
    window.addEventListener('offline', off)
    window.addEventListener('online',  on)
    return () => {
      window.removeEventListener('offline', off)
      window.removeEventListener('online',  on)
    }
  }, [])

  if (!src) return null

  return (
    <div
      className="relative rounded-2xl overflow-hidden bg-black border border-tazo-border/60"
      style={{ boxShadow: '0 20px 60px rgba(0,0,0,0.6), 0 0 0 1px rgba(0,212,255,0.05)' }}
    >
      <div className="aspect-video relative">

        {/* Loading spinner — shown until iframe fires onLoad */}
        {loaded && !ready && (
          <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-4 bg-tazo-surface">
            <div className="relative w-14 h-14">
              <div className="absolute inset-0 rounded-full border-2 border-tazo-border" />
              <div className="absolute inset-0 rounded-full border-2 border-tazo-accent border-t-transparent animate-spin" />
            </div>
            <span className="text-tazo-muted2 text-xs font-mono tracking-widest uppercase animate-pulse">
              Connexion au stream…
            </span>
          </div>
        )}

        {/* Offline overlay */}
        {isOffline && (
          <div className="absolute inset-0 z-20 flex flex-col items-center justify-center gap-4 bg-tazo-bg/95 backdrop-blur-sm">
            <div className="w-16 h-16 rounded-2xl bg-tazo-card border border-tazo-red/30 flex items-center justify-center">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" className="text-tazo-red">
                <path d="M1 1l22 22M16.72 11.06A10.94 10.94 0 0119 12.55M5 12.55a10.94 10.94 0 015.17-2.8M10.71 5.05A16 16 0 0122.56 9M1.42 9a15.91 15.91 0 014.7-2.88M8.53 16.11a6 6 0 016.95 0M12 20h.01"
                  stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <div className="text-center px-6">
              <p className="font-display text-xl tracking-widest text-tazo-text mb-1">HORS LIGNE</p>
              <p className="text-tazo-muted2 text-xs font-mono">Vérifiez votre connexion</p>
            </div>
          </div>
        )}

        {/* The iframe — only mounted after 50ms debounce */}
        {loaded && (
          <iframe
            key={src}
            src={src}
            className="w-full h-full"
            allowFullScreen
            scrolling="no"
            frameBorder="0"
            allow="autoplay; fullscreen; encrypted-media; picture-in-picture"
            title="Stream"
            onLoad={() => setReady(true)}
          />
        )}

        {/* Placeholder before any server is selected */}
        {!loaded && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-tazo-surface/50">
            <div className="w-14 h-14 rounded-2xl bg-tazo-surface border border-tazo-border flex items-center justify-center">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="text-tazo-muted2">
                <polygon points="5,3 19,12 5,21" fill="currentColor" opacity="0.5"/>
              </svg>
            </div>
            <p className="text-tazo-muted2 text-sm font-mono">Sélectionnez un serveur</p>
          </div>
        )}
      </div>
    </div>
  )
}
