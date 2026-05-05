import { useEffect, useRef, useState } from 'react'
import Hls from 'hls.js'

export default function VideoPlayer({ src }) {
  const videoRef = useRef(null)
  const hlsRef   = useRef(null)
  const [ready, setReady]   = useState(false)
  const [error, setError]   = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!src || !videoRef.current) return

    setReady(false)
    setError(null)
    setLoading(true)

    const video = videoRef.current

    // Destroy previous instance
    if (hlsRef.current) {
      hlsRef.current.destroy()
      hlsRef.current = null
    }

    if (Hls.isSupported()) {
      const hls = new Hls({
        maxBufferLength:         30,
        maxMaxBufferLength:      60,
        maxBufferSize:           60 * 1000 * 1000,
        fragLoadingMaxRetry:     6,
        manifestLoadingMaxRetry: 4,
        xhrSetup: (xhr) => {
          xhr.setRequestHeader('Origin',  'https://vip.kora-top.zip')
          xhr.setRequestHeader('Referer', 'https://vip.kora-top.zip/')
        },
      })

      hls.loadSource(src)
      hls.attachMedia(video)

      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        setLoading(false)
        setReady(true)
        video.play().catch(() => {})
      })

      hls.on(Hls.Events.ERROR, (_, data) => {
        if (data.fatal) {
          setError('Stream indisponible — essayez un autre serveur')
          setLoading(false)
        }
      })

      hlsRef.current = hls

    } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
      video.src = src
      video.addEventListener('loadedmetadata', () => {
        setLoading(false)
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

  if (error) {
    return (
      <div className="aspect-video bg-tazo-surface rounded-2xl flex flex-col items-center justify-center gap-3 border border-tazo-red/20">
        <div className="w-12 h-12 rounded-2xl bg-tazo-red/10 border border-tazo-red/20 flex items-center justify-center">
          <span className="text-tazo-red text-xl">✕</span>
        </div>
        <p className="text-tazo-red font-mono text-sm text-center px-4">{error}</p>
      </div>
    )
  }

  return (
    <div className="relative rounded-2xl overflow-hidden bg-black border border-tazo-border/60"
      style={{ boxShadow: '0 20px 60px rgba(0,0,0,0.6), 0 0 0 1px rgba(0,212,255,0.05)' }}
    >
      {/* Loading overlay */}
      {loading && (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-tazo-surface z-10">
          <div className="relative">
            <div className="w-14 h-14 rounded-full border-2 border-tazo-border" />
            <div className="absolute inset-0 w-14 h-14 rounded-full border-2 border-tazo-accent border-t-transparent animate-spin" />
          </div>
          <span className="text-tazo-muted2 text-xs font-mono tracking-widest uppercase animate-pulse">
            Chargement du stream...
          </span>
        </div>
      )}

      <div className="aspect-video">
        <video
          ref={videoRef}
          controls
          playsInline
          className="w-full h-full object-contain"
        />
      </div>
    </div>
  )
}
