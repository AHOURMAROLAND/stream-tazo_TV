import { ImageResponse } from '@vercel/og'

export const config = { runtime: 'edge' }

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

  const homeLogoUrl = `https://cdn.kora-api.space/uploads/team/${home}`
  const awayLogoUrl = `https://cdn.kora-api.space/uploads/team/${away}`

  const center      = isLive || isFinished ? score : time
  const centerLabel = isLive ? '🔴 EN DIRECT' : isFinished ? 'FT' : 'KO'
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
          fontFamily: '"system-ui", "sans-serif"',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Top accent bar */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '4px',
            background: `linear-gradient(90deg, transparent 0%, ${accentColor} 50%, transparent 100%)`,
          }}
        />

        {/* Bottom accent bar */}
        <div
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: '2px',
            background: 'linear-gradient(90deg, transparent 0%, #a855f730 50%, transparent 100%)',
          }}
        />

        {/* League name */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            marginBottom: '40px',
            color: '#666',
            fontSize: '18px',
            letterSpacing: '0.25em',
            textTransform: 'uppercase',
          }}
        >
          <div style={{ width: '32px', height: '1px', background: '#444', display: 'flex' }} />
          {league}
          <div style={{ width: '32px', height: '1px', background: '#444', display: 'flex' }} />
        </div>

        {/* Teams + score row */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0px',
            width: '100%',
            padding: '0 60px',
          }}
        >
          {/* Home */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '20px',
              flex: 1,
            }}
          >
            <div
              style={{
                width: '140px',
                height: '140px',
                background: 'rgba(255,255,255,0.04)',
                borderRadius: '28px',
                border: '1px solid rgba(255,255,255,0.08)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <img
                src={homeLogoUrl}
                width={110}
                height={110}
                style={{ objectFit: 'contain' }}
              />
            </div>
            <span
              style={{
                color: '#e8e8e8',
                fontSize: '22px',
                fontWeight: '600',
                textAlign: 'center',
                maxWidth: '220px',
              }}
            >
              {hn}
            </span>
          </div>

          {/* Center score / time */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '12px',
              padding: '0 48px',
            }}
          >
            <div
              style={{
                background: `linear-gradient(135deg, rgba(255,255,255,0.06), rgba(255,255,255,0.02))`,
                border: `1px solid ${accentColor}30`,
                borderRadius: '20px',
                padding: '20px 40px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '10px',
              }}
            >
              <span
                style={{
                  color: '#ffffff',
                  fontSize: '64px',
                  fontWeight: '700',
                  letterSpacing: '0.08em',
                  lineHeight: 1,
                }}
              >
                {center}
              </span>
              <span
                style={{
                  color: accentColor,
                  fontSize: '13px',
                  letterSpacing: '0.35em',
                  textTransform: 'uppercase',
                  fontWeight: '600',
                }}
              >
                {centerLabel}
              </span>
            </div>
          </div>

          {/* Away */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '20px',
              flex: 1,
            }}
          >
            <div
              style={{
                width: '140px',
                height: '140px',
                background: 'rgba(255,255,255,0.04)',
                borderRadius: '28px',
                border: '1px solid rgba(255,255,255,0.08)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <img
                src={awayLogoUrl}
                width={110}
                height={110}
                style={{ objectFit: 'contain' }}
              />
            </div>
            <span
              style={{
                color: '#e8e8e8',
                fontSize: '22px',
                fontWeight: '600',
                textAlign: 'center',
                maxWidth: '220px',
              }}
            >
              {an}
            </span>
          </div>
        </div>

        {/* Footer branding */}
        <div
          style={{
            position: 'absolute',
            bottom: '28px',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            color: '#444',
            fontSize: '15px',
            letterSpacing: '0.25em',
            textTransform: 'uppercase',
          }}
        >
          TAZO TV — Football Live
        </div>
      </div>
    ),
    {
      width:  1200,
      height: 630,
    }
  )
}
