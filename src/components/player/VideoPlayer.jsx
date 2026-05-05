import { useEffect, useRef, useState } from 'react'
import Hls from 'hls.js'

export default function VideoPlayer({ src }) {
  const videoRef = useRef(null)
  const hlsRef   = useRef(null)
  const [ready, setReady] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!src || !videoRef.current) return

    const video = videoRef.current

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
        setReady(true)
        video.play().catch(() => {})
      })

      hls.on(Hls.Events.ERROR, (_, data) => {
        if (data.fatal) setError('Erreur de chargement du stream')
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

  if (error) {
    return (
      <div className="aspect-video bg-tazo-surface rounded-xl flex items-center justify-center">
        <p className="text-tazo-red font-mono text-sm">{error}</p>
      </div>
    )
  }

  return (
    <div className="relative aspect-video bg-tazo-surface rounded-xl overflow-hidden">
      {!ready && (
        <div className="absolute inset-0 flex items-center justify-center z-10">
          <div className="w-10 h-10 border-2 border-tazo-accent border-t-transparent rounded-full animate-spin" />
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
