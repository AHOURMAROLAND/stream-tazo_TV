import { ImageResponse } from '@vercel/og'

export const config = { runtime: 'edge' }

/** Fetch an image URL and return a base64 data URI (so Satori can embed it reliably). */
async function toDataUri(url) {
  if (!url) return null
  try {
    const res = await fetch(url, { headers: { Accept: 'image/*' } })
    if (!res.ok) return null
    const buf   = await res.arrayBuffer()
    const bytes = new Uint8Array(buf)
    let binary  = ''
    const chunk = 8192
    for (let i = 0; i < bytes.length; i += chunk) {
      binary += String.fromCharCode(...bytes.subarray(i, i + chunk))
    }
    const b64  = btoa(binary)
    const mime = res.headers.get('content-type') || 'image/png'
    return `data:${mime};base64,${b64}`
  } catch {
    return null
  }
}

/** Fallback team logo — simple shield SVG rendered as data URI */
const FALLBACK = `data:image/svg+xml;base64,${btoa(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 80">
  <rect width="80" height="80" rx="16" fill="#1e1e2e"/>
  <text x="40" y="52" text-anchor="middle" font-size="32" fill="#444">⚽</text>
</svg>`)}`

export default async function handler(req) {
  const { searchParams } = new URL(req.url)

  const home   = searchParams.get('home')   || ''
  const away   = searchParams.get('away')   || ''
  const hn     = searchParams.get('hn')     || ''
  const an     = searchParams.get('an')     || ''
  const score  = searchParams.get('score')  || '-'
  const time   = searchParams.get('time')   || ''
  const status = searchParams.get('status') || '0'
  const league = searchParams.get('league') || ''

  const isLive     = status === '1'
  const isFinished = status === '2'

  // Pre-fetch both logos as base64 data URIs in parallel
  const [homeSrc, awaySrc] = await Promise.all([
    toDataUri(`https://cdn.kora-api.space/uploads/team/${home}`),
    toDataUri(`https://cdn.kora-api.space/uploads/team/${away}`),
  ])

  const center      = isLive || isFinished ? score : time
  const centerLabel = isLive ? '🔴 EN DIRECT' : isFinished ? 'FT' : '⏰ KO'
  const accentColor = isLive ? '#ef4444' : '#a855f7'

  return new ImageResponse(
    (
      <div
        style={{
          width: '1200px',
          height: '630px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #0a0a0f 0%, #12121e 60%, #0f0f1a 100%)',
          fontFamily: '"system-ui", sans-serif',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Top accent line */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '4px',
            background: `linear-gradient(90deg, transparent, ${accentColor}, transparent)`,
            display: 'flex',
          }}
        />

        {/* League label */}
        {league ? (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              marginBottom: '36px',
              color: '#666',
              fontSize: '17px',
              letterSpacing: '0.25em',
              textTransform: 'uppercase',
            }}
          >
            <div style={{ width: '28px', height: '1px', background: '#333', display: 'flex' }} />
            {league}
            <div style={{ width: '28px', height: '1px', background: '#333', display: 'flex' }} />
          </div>
        ) : null}

        {/* Main row: home — center — away */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '100%',
            padding: '0 80px',
            gap: '0px',
          }}
        >
          {/* Home team */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '18px',
              flex: 1,
            }}
          >
            <div
              style={{
                width: '150px',
                height: '150px',
                background: 'rgba(255,255,255,0.04)',
                borderRadius: '28px',
                border: '1px solid rgba(255,255,255,0.08)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                overflow: 'hidden',
              }}
            >
              <img
                src={homeSrc || FALLBACK}
                width={120}
                height={120}
                style={{ objectFit: 'contain' }}
              />
            </div>
            <span
              style={{
                color: '#e0e0e0',
                fontSize: '22px',
                fontWeight: '600',
                textAlign: 'center',
                maxWidth: '230px',
                lineHeight: 1.3,
              }}
            >
              {hn}
            </span>
          </div>

          {/* Center — score or time */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '10px',
              padding: '0 40px',
              flexShrink: 0,
            }}
          >
            <div
              style={{
                background: 'rgba(255,255,255,0.05)',
                border: `1px solid ${accentColor}35`,
                borderRadius: '20px',
                padding: '18px 44px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '8px',
              }}
            >
              <span
                style={{
                  color: '#ffffff',
                  fontSize: isLive || isFinished ? '68px' : '52px',
                  fontWeight: '800',
                  letterSpacing: '0.06em',
                  lineHeight: 1,
                }}
              >
                {center}
              </span>
              <span
                style={{
                  color: accentColor,
                  fontSize: '13px',
                  letterSpacing: '0.3em',
                  textTransform: 'uppercase',
                  fontWeight: '600',
                }}
              >
                {centerLabel}
              </span>
            </div>
          </div>

          {/* Away team */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '18px',
              flex: 1,
            }}
          >
            <div
              style={{
                width: '150px',
                height: '150px',
                background: 'rgba(255,255,255,0.04)',
                borderRadius: '28px',
                border: '1px solid rgba(255,255,255,0.08)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                overflow: 'hidden',
              }}
            >
              <img
                src={awaySrc || FALLBACK}
                width={120}
                height={120}
                style={{ objectFit: 'contain' }}
              />
            </div>
            <span
              style={{
                color: '#e0e0e0',
                fontSize: '22px',
                fontWeight: '600',
                textAlign: 'center',
                maxWidth: '230px',
                lineHeight: 1.3,
              }}
            >
              {an}
            </span>
          </div>
        </div>

        {/* Footer */}
        <div
          style={{
            position: 'absolute',
            bottom: '24px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            color: '#3a3a4a',
            fontSize: '14px',
            letterSpacing: '0.25em',
            textTransform: 'uppercase',
          }}
        >
          TAZO TV — Football Live
        </div>
      </div>
    ),
    { width: 1200, height: 630 }
  )
}
