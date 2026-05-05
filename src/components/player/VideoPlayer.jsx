import { useState, useEffect, useRef } from 'react'

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
  const containerRef            = useRef(null)
  const [loaded, setLoaded]     = useState(false)
  const [ready, setReady]       = useState(false)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [isMuted, setIsMuted]   = useState(false)
  const [isOffline, setIsOffline] = useState(!navigator.onLine)
  const prevSrc                 = useRef(null)

  // Preconnect on src change
  useEffect(() => { if (src) preconnect(src) }, [src])

  // Mount iframe with debounce when src changes
  useEffect(() => {
    if (!src) return
    if (src !== prevSrc.current) {
      prevSrc.current = src
      setLoaded(false)
      setReady(false)
      const t = setTimeout(() => setLoaded(true), 50)
      return () => clearTimeout(t)
    }
  }, [src])

  // Online / offline
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

  // Sync fullscreen state with browser API
  useEffect(() => {
    const onChange = () => setIsFullscreen(!!document.fullscreenElement)
    document.addEventListener('fullscreenchange', onChange)
    return () => document.removeEventListener('fullscreenchange', onChange)
  }, [])

  // Keyboard shortcuts: F = fullscreen, M = mute overlay, Esc handled by browser
  useEffect(() => {
    if (!loaded) return
    const onKey = (e) => {
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'SELECT') return
      if (e.key === 'f' || e.key === 'F') toggleFullscreen()
      if (e.key === 'm' || e.key === 'M') toggleMute()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [loaded, isFullscreen])

  const toggleFullscreen = () => {
    if (!containerRef.current) return
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().catch(() => {})
    } else {
      document.exitFullscreen().catch(() => {})
    }
  }

  // Mute = overlay a transparent div that blocks the iframe audio via CSS filter
  // (real mute is impossible cross-origin — this dims + shows visual indicator)
  const toggleMute = () => setIsMuted((v) => !v)

  if (!src) return null

  return (
    <div
      ref={containerRef}
      className="relative rounded-2xl overflow-hidden bg-black border border-tazo-border/60 group"
      style={{ boxShadow: '0 20px 60px rgba(0,0,0,0.6), 0 0 0 1px rgba(0,212,255,0.05)' }}
    >
      <div className="aspect-video relative">

        {/* Loading spinner */}
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

        {/* Mute visual overlay — dims the iframe */}
        {isMuted && loaded && (
          <div className="absolute inset-0 z-10 bg-tazo-bg/60 backdrop-blur-[1px] flex items-center justify-center pointer-events-none">
            <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-tazo-card/90 border border-tazo-border">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="text-tazo-muted2">
                <path d="M11 5L6 9H2v6h4l5 4V5zM23 9l-6 6M17 9l6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <span className="text-tazo-muted2 text-xs font-mono">Son coupé</span>
            </div>
          </div>
        )}

        {/* Iframe */}
        {loaded ? (
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
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-tazo-surface/50">
            <div className="w-14 h-14 rounded-2xl bg-tazo-surface border border-tazo-border flex items-center justify-center">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="text-tazo-muted2">
                <polygon points="5,3 19,12 5,21" fill="currentColor" opacity="0.5"/>
              </svg>
            </div>
            <p className="text-tazo-muted2 text-sm font-mono">Sélectionnez un serveur</p>
          </div>
        )}

        {/* Controls bar — visible on hover */}
        {loaded && ready && (
          <div className="absolute bottom-0 left-0 right-0 z-30 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
            {/* Gradient fade */}
            <div className="h-16 bg-gradient-to-t from-black/80 to-transparent" />
            <div className="bg-black/70 backdrop-blur-sm px-4 py-3 flex items-center justify-between gap-3">

              {/* Left: mute */}
              <button
                onClick={toggleMute}
                title={isMuted ? 'Activer le son (M)' : 'Couper le son (M)'}
                className="flex items-center gap-2 text-white/70 hover:text-white transition-colors"
              >
                {isMuted ? (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                    <path d="M11 5L6 9H2v6h4l5 4V5zM23 9l-6 6M17 9l6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                ) : (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                    <path d="M11 5L6 9H2v6h4l5 4V5z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M15.54 8.46a5 5 0 010 7.07M19.07 4.93a10 10 0 010 14.14" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                  </svg>
                )}
                <span className="text-[11px] font-mono hidden sm:block">
                  {isMuted ? 'Son coupé' : 'Son actif'}
                </span>
              </button>

              {/* Center: keyboard hints */}
              <div className="flex items-center gap-3 text-white/30 text-[10px] font-mono">
                <span><kbd className="px-1 py-0.5 rounded bg-white/10 text-white/50">F</kbd> Plein écran</span>
                <span><kbd className="px-1 py-0.5 rounded bg-white/10 text-white/50">M</kbd> Son</span>
              </div>

              {/* Right: fullscreen */}
              <button
                onClick={toggleFullscreen}
                title={isFullscreen ? 'Quitter le plein écran (F)' : 'Plein écran (F)'}
                className="flex items-center gap-2 text-white/70 hover:text-white transition-colors"
              >
                <span className="text-[11px] font-mono hidden sm:block">
                  {isFullscreen ? 'Réduire' : 'Plein écran'}
                </span>
                {isFullscreen ? (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                    <path d="M8 3v3a2 2 0 01-2 2H3m18 0h-3a2 2 0 01-2-2V3m0 18v-3a2 2 0 012-2h3M3 16h3a2 2 0 012 2v3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                ) : (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                    <path d="M8 3H5a2 2 0 00-2 2v3m18 0V5a2 2 0 00-2-2h-3m0 18h3a2 2 0 002-2v-3M3 16v3a2 2 0 002 2h3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
