import { useState } from 'react'
import { IconBell } from './Icons'

export default function NotificationBell({ onRequest }) {
  const [status, setStatus] = useState(
    'Notification' in window ? Notification.permission : 'unsupported'
  )

  const handle = async () => {
    if (status === 'granted' || status === 'denied') return
    const result = await onRequest()
    setStatus(result ? 'granted' : 'denied')
  }

  if (status === 'unsupported') return null

  return (
    <button
      onClick={handle}
      title={
        status === 'granted' ? 'Notifications activées'
        : status === 'denied' ? 'Notifications bloquées par le navigateur'
        : 'Activer les notifications favoris'
      }
      className={`
        relative w-10 h-10 rounded-xl flex items-center justify-center border
        transition-all duration-200
        ${status === 'granted'
          ? 'border-tazo-green text-tazo-green bg-tazo-green/10'
          : status === 'denied'
            ? 'border-tazo-red/40 text-tazo-red/50 cursor-not-allowed'
            : 'border-tazo-border text-tazo-muted2 hover:border-tazo-accent/50 hover:text-tazo-accent'
        }
      `}
    >
      <IconBell className="w-4 h-4" />
      {status === 'granted' && (
        <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-tazo-green border border-tazo-bg" />
      )}
    </button>
  )
}
