import { useState } from 'react'

export default function NotificationBell({ onRequest }) {
  const [status, setStatus] = useState(
    'Notification' in window ? Notification.permission : 'unsupported'
  )

  const handle = async () => {
    if (status === 'granted') return
    const result = await onRequest()
    setStatus(result ? 'granted' : 'denied')
  }

  if (status === 'unsupported') return null

  return (
    <button
      onClick={handle}
      title={
        status === 'granted'
          ? 'Notifications activées'
          : status === 'denied'
            ? 'Notifications bloquées par le navigateur'
            : 'Activer les notifications favoris'
      }
      className={`
        w-10 h-10 rounded-xl flex items-center justify-center border
        transition-all duration-200
        ${status === 'granted'
          ? 'border-tazo-green text-tazo-green bg-tazo-green/10'
          : status === 'denied'
            ? 'border-tazo-red/40 text-tazo-red/50 cursor-not-allowed'
            : 'border-tazo-border text-tazo-muted2 hover:border-tazo-accent/50 hover:text-tazo-accent'
        }
      `}
    >
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
        <path d="M13.73 21a2 2 0 0 1-3.46 0" />
        {status === 'granted' && (
          <circle cx="19" cy="5" r="3" fill="#22c55e" stroke="none" />
        )}
      </svg>
    </button>
  )
}
