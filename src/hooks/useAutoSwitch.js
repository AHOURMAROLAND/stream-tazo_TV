import { useEffect, useRef } from 'react'

// Timeout is 20s on first attempt, then 30s on subsequent ones.
// This avoids kicking users with unstable connections too aggressively.
// The timer only starts after the iframe fires onLoad (ready=true is passed in).
const BASE_TIMEOUT  = 20000  // 20s — first attempt
const RETRY_TIMEOUT = 30000  // 30s — after first switch

export default function useAutoSwitch(streamUrl, channels, activeChannel, onSwitch, iframeReady = false) {
  const timerRef   = useRef(null)
  const attemptRef = useRef(0)

  const clearTimer = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current)
      timerRef.current = null
    }
  }

  useEffect(() => {
    // Only one channel — nothing to switch to
    if (!streamUrl || !channels || channels.length <= 1) return

    clearTimer()

    // If iframe already loaded fine, don't auto-switch
    if (iframeReady) return

    const delay = attemptRef.current === 0 ? BASE_TIMEOUT : RETRY_TIMEOUT

    timerRef.current = setTimeout(() => {
      // Double-check iframe still not ready before switching
      const currentIndex = channels.findIndex((c) => c.id === activeChannel?.id)
      const nextIndex    = (currentIndex + 1) % channels.length

      if (nextIndex !== currentIndex) {
        attemptRef.current += 1
        onSwitch(channels[nextIndex])
      }
    }, delay)

    return () => clearTimer()
  }, [streamUrl, activeChannel, iframeReady])

  // Reset attempt counter when user manually picks a server
  const resetAttempts = () => { attemptRef.current = 0 }

  return { attempt: attemptRef.current, resetAttempts }
}
