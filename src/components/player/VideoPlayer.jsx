import { useEffect, useRef, useState } from 'react'
import Hls from 'hls.js'
import { IconFullscreen, IconExitFullscreen } from '../ui/Icons'

/** Limite les iframes tierces : pas de popups ni de navigation de l’onglet parent (souvent utilisé par les pubs). */
const IFRAME_SANDBOX =
  'allow-scripts allow-same-origin allow-presentation allow-fullscreen'

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

export default function VideoPlayer({ src, onStreamError, onReady }) {
  const videoRef     = useRef(null)
  const hlsRef       = useRef(null)
  const containerRef = useRef(null)

  const [ready,        setReady]        = useState(false)
  const [isOffline,    setIsOffline]    = useState(!navigator.onLine)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [volume,       setVolume]       = useState(1)
  const [muted,        setMuted]        = useState(false)

  const isM3u8   = src && (src.includes('.m3u8') || src.includes('m3u8'))
  const isIframe = src && !isM3u8

  useEffect(() => { if (src) preconnect(src) }, [src])
  useEffect(() => {
    setReady(false)
    setVolume(1)
    setMuted(false)
  }, [src])
  useEffect(() => { onReady?.(ready) }, [ready])

  // Timeout de chargement — si pas de signal après 15s (m3u8) ou 20s (iframe), on signale l'erreur
  useEffect(() => {
    if (!src || ready) return
    const timeout = setTimeout(() => {
      if (!ready) onStreamError?.()
    }, isM3u8 ? 15000 : 20000)
    return () => clearTimeout(timeout)
  }, [src, ready])

  useEffect(() => {
    const off = () => setIsOffline(true)
    const on  = () => setIsOffline(false)
    window.addEventListener('offline', off)
    window.addEventListener('online',  on)
    return () => { window.removeEventListener('offline', off); window.removeEventListener('online', on) }
  }, [])

  // Fullscreen change listener
  useEffect(() => {
    const handleFSChange = () => setIsFullscreen(!!document.fullscreenElement)
    document.addEventListener('fullscreenchange', handleFSChange)
    document.addEventListener('webkitfullscreenchange', handleFSChange)
    return () => {
      document.removeEventListener('fullscreenchange', handleFSChange)
      document.removeEventListener('webkitfullscreenchange', handleFSChange)
    }
  }, [])

  const toggleFullscreen = () => {
    const el = containerRef.current
    if (!el) return
    if (!document.fullscreenElement) {
      el.requestFullscreen?.() || el.webkitRequestFullscreen?.()
    } else {
      document.exitFullscreen?.() || document.webkitExitFullscreen?.()
    }
  }

  // HLS setup
  useEffect(() => {
    if (!src || !videoRef.current || isIframe) return
    if (hlsRef.current) { hlsRef.current.destroy(); hlsRef.current = null }
    const video = videoRef.current
    if (Hls.isSupported()) {
      const hls = new Hls({
        maxBufferLength: 30, maxMaxBufferLength: 60,
        maxBufferSize: 60 * 1000 * 1000,
        fragLoadingMaxRetry: 2, manifestLoadingMaxRetry: 1,
        manifestLoadingTimeOut: 8000,
        fragLoadingTimeOut: 8000,
      })
      hls.loadSource(src)
      hls.attachMedia(video)
      hls.on(Hls.Events.MANIFEST_PARSED, () => { setReady(true); video.play().catch(() => {}) })
      hls.on(Hls.Events.ERROR, (_, data) => {
        if (data.fatal) {
          onStreamError?.()
        } else if (data.type === Hls.ErrorTypes.NETWORK_ERROR && data.details === Hls.ErrorDetails.MANIFEST_LOAD_ERROR) {
          // Manifest introuvable même non-fatal → on abandonne directement
          onStreamError?.()
        }
      })
      hlsRef.current = hls
    } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
      video.src = src
      video.addEventListener('loadedmetadata', () => { setReady(true); video.play().catch(() => {}) })
    }
    return () => { if (hlsRef.current) { hlsRef.current.destroy(); hlsRef.current = null } }
  }, [src])

  // Volume (flux natif / HLS uniquement — pas contrôlable depuis l’extérieur pour une iframe)
  useEffect(() => {
    const v = videoRef.current
    if (!v || isIframe) return
    v.volume = volume
    v.muted = muted
  }, [volume, muted, src, isIframe, ready])

  useEffect(() => {
    const v = videoRef.current
    if (!v || isIframe) return
    const onVol = () => {
      setVolume(v.volume)
      setMuted(v.muted)
    }
    v.addEventListener('volumechange', onVol)
    return () => v.removeEventListener('volumechange', onVol)
  }, [src, isIframe])

  if (!src) return null

  // Fullscreen button — shared between both player types
  const FullscreenBtn = (
    <button
      onClick={toggleFullscreen}
      title={isFullscreen ? 'Quitter le plein écran' : 'Plein écran'}
      className="absolute top-2 right-2 z-30 w-9 h-9 rounded-xl bg-black/60 border border-white/10 flex items-center justify-center text-white/60 hover:text-white hover:bg-black/80 hover:border-white/20 transition-all duration-200"
    >
      {isFullscreen
        ? <IconExitFullscreen className="w-4 h-4" />
        : <IconFullscreen    className="w-4 h-4" />
      }
    </button>
  )

  // ── IFRAME ─────────────────────────────────────────────────────
  if (isIframe) {
    return (
      <div
        ref={containerRef}
        className="relative rounded-2xl overflow-hidden bg-black border border-tazo-border/60"
        style={{ boxShadow: '0 20px 60px rgba(0,0,0,0.6)' }}
      >
        <div className="aspect-video relative">

          {/* Offline overlay */}
          {isOffline && (
            <div className="absolute inset-0 z-30 flex flex-col items-center justify-center gap-4 bg-tazo-bg/95 backdrop-blur-sm">
              <div className="w-16 h-16 rounded-2xl bg-tazo-card border border-tazo-red/30 flex items-center justify-center">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#e63946" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="1" y1="1" x2="23" y2="23"/>
                  <path d="M16.72 11.06A10.94 10.94 0 0 1 19 12.55M5 12.55a10.94 10.94 0 0 1 5.17-2.39M10.71 5.05A16 16 0 0 1 22.56 9M1.42 9a15.91 15.91 0 0 1 4.7-2.88M8.53 16.11a6 6 0 0 1 6.95 0M12 20h.01"/>
                </svg>
              </div>
              <div className="text-center">
                <p className="font-display text-xl tracking-widest text-tazo-text mb-1">HORS LIGNE</p>
                <p className="text-tazo-muted2 text-xs font-mono">Vérifiez votre connexion</p>
              </div>
            </div>
          )}

          {/* Loading spinner */}
          {!ready && !isOffline && (
            <div className="absolute inset-0 z-20 flex flex-col items-center justify-center gap-4 bg-tazo-surface pointer-events-none">
              <div className="relative w-14 h-14">
                <div className="absolute inset-0 rounded-full border-2 border-tazo-border" />
                <div className="absolute inset-0 rounded-full border-2 border-tazo-accent border-t-transparent animate-spin" />
              </div>
              <span className="text-tazo-muted2 text-xs font-mono tracking-widest uppercase animate-pulse">
                Connexion au stream…
              </span>
            </div>
          )}

          <iframe
            key={src}
            src={src}
            className="absolute inset-0 w-full h-full border-0"
            sandbox={IFRAME_SANDBOX}
            referrerPolicy="no-referrer-when-downgrade"
            allow="autoplay; fullscreen; encrypted-media; picture-in-picture"
            title="TAZO TV Stream"
            onLoad={() => {
              // Délai court pour laisser le temps à la page de se rendre
              // (évite de marquer ready sur une page d'erreur qui charge instantanément)
              setTimeout(() => setReady(true), 800)
            }}
          />
        </div>

        {/* Fullscreen button outside iframe bounds */}
        {FullscreenBtn}
      </div>
    )
  }

  // ── HLS / native video ──
  return (
    <div ref={containerRef} className="relative rounded-2xl overflow-hidden border border-tazo-border/60 bg-tazo-surface">
      <div className="relative aspect-video">
        {!ready && (
          <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none">
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
          controlsList="nodownload"
        />
        {FullscreenBtn}
      </div>

      {/* Volume hors du petit contrôle natif — évite les clics ratés sur mobile */}
      {ready && (
        <div className="flex items-center gap-3 px-3 py-2.5 border-t border-tazo-border/50 bg-tazo-card/90">
          <button
            type="button"
            onClick={() => {
              const v = videoRef.current
              if (!v) return
              if (v.muted || v.volume === 0) {
                v.muted = false
                if (v.volume === 0) v.volume = 0.8
                setMuted(false)
                setVolume(v.volume)
              } else {
                v.muted = true
                setMuted(true)
              }
            }}
            title={muted ? 'Activer le son' : 'Couper le son'}
            className="shrink-0 w-9 h-9 rounded-lg bg-tazo-surface border border-tazo-border/60 text-tazo-muted2 hover:text-tazo-text hover:border-tazo-border2 flex items-center justify-center transition-colors"
          >
            {muted || volume === 0 ? (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                <path d="M11 5L6 9H2v6h4l5 4V5z" />
                <line x1="23" y1="9" x2="17" y2="15" />
                <line x1="17" y1="9" x2="23" y2="15" />
              </svg>
            ) : (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                <path d="M11 5L6 9H2v6h4l5 4V5z" />
                <path d="M15.54 8.46a5 5 0 010 7.07" />
                <path d="M19.07 4.93a10 10 0 010 14.14" />
              </svg>
            )}
          </button>
          <input
            type="range"
            min={0}
            max={1}
            step={0.01}
            value={muted ? 0 : volume}
            onChange={(e) => {
              const n = Number(e.target.value)
              const v = videoRef.current
              if (v) {
                v.volume = n
                v.muted = n === 0
                setVolume(n)
                setMuted(n === 0)
              }
            }}
            title="Volume"
            className="flex-1 h-1.5 accent-tazo-accent rounded-full bg-tazo-border cursor-pointer"
          />
        </div>
      )}
    </div>
  )
}
