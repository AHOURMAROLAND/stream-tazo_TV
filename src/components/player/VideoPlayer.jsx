import { useEffect, useRef, useState } from 'react'
import Hls from 'hls.js'

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

export default function VideoPlayer({ src, onStreamError }) {
  const videoRef              = useRef(null)
  const hlsRef                = useRef(null)
  const containerRef          = useRef(null)
  const [ready, setReady]     = useState(false)
  const [error, setError]     = useState(null)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [isOffline, setIsOffline]       = useState(!navigator.onLine)

  const isM3u8   = src && src.includes('.m3u8')
  const isIframe = src && !isM3u8

  // Preconnect on src change
  useEffect(() => { if (src) preconnect(src) }, [src])

  // Reset state on src change
  useEffect(() => {
    setReady(false)
    setError(null)
  }, [src])

  // Fullscreen sync
  useEffect(() => {
    const onChange = () => setIsFullscreen(!!document.fullscreenElement)
    document.addEventListener('fullscreenchange', onChange)
    return () => document.removeEventListener('fullscreenchange', onChange)
  }, [])

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

  // Keyboard: F = fullscreen
  useEffect(() => {
    const onKey = (e) => {
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'SELECT') return
      if (e.key === 'f' || e.key === 'F') toggleFullscreen()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [isFullscreen])

  // HLS setup for m3u8 sources
  useEffect(() => {
    if (!src || !videoRef.current || isIframe) return

    if (hlsRef.current) {
      hlsRef.current.destroy()
      hlsRef.current = null
    }

    const video = videoRef.current

    if (Hls.isSupported()) {
      const hls = new Hls({
        maxBufferLength:         30,
        maxMaxBufferLength:      60,
        maxBufferSize:           60 * 1000 * 1000,
        fragLoadingMaxRetry:     6,
        manifestLoadingMaxRetry: 4,
      })

      hls.loadSource(src)
      hls.attachMedia(video)

      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        setReady(true)
        video.play().catch(() => {})
      })

      hls.on(Hls.Events.ERROR, (_, data) => {
        if (data.fatal) {
          setError('Stream indisponible')
          onStreamError && onStreamError()
        }
      })

      hlsRef.current = hls

    } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
      video.src = src
      video.addEventListener('loadedmetadata', () => {
        setReady(true)
        video.play().catch(() => {})
      })
    }

    return () => {
      if (hlsRef.current) {
        hlsRef.current.destroy()
        hlsRef.current = null
      }
    }
  }, [src])

  const toggleFullscreen = () => {
    if (!containerRef.current) return
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().catch(() => {})
    } else {
      document.exitFullscreen().catch(() => {})
    }
  }

  if (!src) return null

  if (error) {
    return (
      <div className="aspect-video bg-tazo-surface rounded-2xl flex flex-col items-center justify-center gap-3 border border-tazo-red/20">
        <div className="w-12 h-12 rounded-2xl bg-tazo-red/10 border border-tazo-red/20 flex items-center justify-center">
          <span className="text-tazo-red text-xl">✕</span>
        </div>
        <p className="text-tazo-red font-mono text-sm">{error}</p>
      </div>
    )
  }

  // ── IFRAME player ──────────────────────────────────────────────
  if (isIframe) {
    return (
      <div
        ref={containerRef}
        className="relative rounded-2xl overflow-hidden bg-black border border-tazo-border/60 group"
        style={{ boxShadow: '0 20px 60px rgba(0,0,0,0.6)' }}
      >
        <div className="aspect-video relative">

          {/* Offline overlay */}
          {isOffline && (
            <div className="absolute inset-0 z-30 flex flex-col items-center justify-center gap-4 bg-tazo-bg/95 backdrop-blur-sm">
              <div className="w-16 h-16 rounded-2xl bg-tazo-card border border-tazo-red/30 flex items-center justify-center">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" className="text-tazo-red">
                  <path d="M1 1l22 22M16.72 11.06A10.94 10.94 0 0119 12.55M5 12.55a10.94 10.94 0 015.17-2.8M10.71 5.05A16 16 0 0122.56 9M1.42 9a15.91 15.91 0 014.7-2.88M8.53 16.11a6 6 0 016.95 0M12 20h.01"
                    stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <p className="font-display text-xl tracking-widest text-tazo-text">HORS LIGNE</p>
            </div>
          )}

          {/* Loading spinner */}
          {!ready && (
            <div className="absolute inset-0 z-20 flex flex-col items-center justify-center gap-4 bg-tazo-surface">
              <div className="relative w-14 h-14">
                <div className="absolute inset-0 rounded-full border-2 border-tazo-border" />
                <div className="absolute inset-0 rounded-full border-2 border-tazo-accent border-t-transparent animate-spin" />
              </div>
              <span className="text-tazo-muted2 text-xs font-mono tracking-widest uppercase animate-pulse">
                Connexion au stream…
              </span>
            </div>
          )}

          {/* The iframe */}
          <iframe
            key={src}
            src={src}
            className="w-full h-full border-0"
            allowFullScreen
            allow="autoplay; fullscreen; encrypted-media; picture-in-picture"
            sandbox="allow-scripts allow-same-origin allow-forms allow-presentation"
            title="TAZO TV Stream"
            onLoad={() => setReady(true)}
          />

          {/* Anti-pub overlays — block clicks on edges where ads usually sit */}
          <div className="absolute top-0    left-0 right-0  h-[10%] z-10" />
          <div className="absolute bottom-0 left-0 right-0  h-[10%] z-10" />
          <div className="absolute top-0    left-0 bottom-0 w-[8%]  z-10" />
          <div className="absolute top-0    right-0 bottom-0 w-[8%] z-10" />

          {/* Controls bar — appears on hover */}
          {ready && (
            <div className="absolute bottom-0 left-0 right-0 z-20 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
              <div className="h-12 bg-gradient-to-t from-black/80 to-transparent" />
              <div className="bg-black/70 backdrop-blur-sm px-4 py-2.5 flex items-center justify-end gap-3">
                <span className="text-white/30 text-[10px] font-mono mr-auto">
                  <kbd className="px-1 py-0.5 rounded bg-white/10 text-white/50">F</kbd> Plein écran
                </span>
                <button
                  onClick={toggleFullscreen}
                  className="text-white/70 hover:text-white transition-colors"
                  title={isFullscreen ? 'Quitter (F)' : 'Plein écran (F)'}
                >
                  {isFullscreen ? (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                      <path d="M8 3v3a2 2 0 01-2 2H3m18 0h-3a2 2 0 01-2-2V3m0 18v-3a2 2 0 012-2h3M3 16h3a2 2 0 012 2v3"
                        stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  ) : (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                      <path d="M8 3H5a2 2 0 00-2 2v3m18 0V5a2 2 0 00-2-2h-3m0 18h3a2 2 0 002-2v-3M3 16v3a2 2 0 002 2h3"
                        stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
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

  // ── HLS / native video player ──────────────────────────────────
  return (
    <div
      ref={containerRef}
      className="relative aspect-video bg-tazo-surface rounded-2xl overflow-hidden border border-tazo-border/60"
    >
      {!ready && (
        <div className="absolute inset-0 flex items-center justify-center z-10">
          <div className="relative w-14 h-14">
            <div className="absolute inset-0 rounded-full border-2 border-tazo-border" />
            <div className="absolute inset-0 rounded-full border-2 border-tazo-accent border-t-transparent animate-spin" />
          </div>
        </div>
      )}
      <video
        ref={videoRef}
        controls
        playsInline
        className="w-full h-full object-contain"
      />
    </div>
  )
}
