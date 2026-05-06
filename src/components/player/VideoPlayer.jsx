import { useEffect, useRef } from 'react'
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

export default function VideoPlayer({ src, onStreamError, onReady }) {
  const videoRef = useRef(null)
  const hlsRef   = useRef(null)

  const isM3u8   = src && src.includes('.m3u8')
  const isIframe = src && !isM3u8

  useEffect(() => { if (src) preconnect(src) }, [src])

  // HLS setup for direct m3u8 streams
  useEffect(() => {
    if (!src || !videoRef.current || isIframe) return
    if (hlsRef.current) { hlsRef.current.destroy(); hlsRef.current = null }
    const video = videoRef.current
    if (Hls.isSupported()) {
      const hls = new Hls({
        maxBufferLength: 30, maxMaxBufferLength: 60,
        maxBufferSize: 60 * 1000 * 1000,
        fragLoadingMaxRetry: 6, manifestLoadingMaxRetry: 4,
      })
      hls.loadSource(src)
      hls.attachMedia(video)
      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        onReady?.(true)
        video.play().catch(() => {})
      })
      hls.on(Hls.Events.ERROR, (_, data) => {
        if (data.fatal) onStreamError?.()
      })
      hlsRef.current = hls
    } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
      video.src = src
      video.addEventListener('loadedmetadata', () => {
        onReady?.(true)
        video.play().catch(() => {})
      })
    }
    return () => { if (hlsRef.current) { hlsRef.current.destroy(); hlsRef.current = null } }
  }, [src])

  if (!src) return null

  // ── IFRAME — sandbox bloque popups et redirections, rien d'autre ──
  if (isIframe) {
    return (
      <iframe
        key={src}
        src={src}
        style={{ width: '100%', aspectRatio: '16/9', display: 'block', border: 'none', borderRadius: '12px' }}
        allowFullScreen
        allow="autoplay; fullscreen; encrypted-media; picture-in-picture"
        sandbox="allow-scripts allow-same-origin allow-forms allow-presentation"
        title="TAZO TV Stream"
      />
    )
  }

  // ── HLS / native video ──
  return (
    <div style={{ position: 'relative', aspectRatio: '16/9', background: '#0d1220', borderRadius: '12px', overflow: 'hidden' }}>
      <video
        ref={videoRef}
        controls
        playsInline
        style={{ width: '100%', height: '100%', objectFit: 'contain' }}
      />
    </div>
  )
}
