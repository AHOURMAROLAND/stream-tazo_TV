import { ImageResponse } from '@vercel/og'

export const config = { runtime: 'edge' }

export default function handler(req) {
  const { searchParams } = new URL(req.url)
  const total = parseInt(searchParams.get('total') || '0', 10)
  const live  = parseInt(searchParams.get('live')  || '0', 10)

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
        {/* Top accent */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '4px',
            background: 'linear-gradient(90deg, transparent 0%, #a855f7 50%, transparent 100%)',
          }}
        />

        {/* TAZO TV Logo text */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '16px',
          }}
        >
          {/* Brand name */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
            }}
          >
            <div
              style={{
                width: '10px',
                height: '10px',
                borderRadius: '50%',
                background: '#a855f7',
                display: 'flex',
              }}
            />
            <span
              style={{
                color: '#a855f7',
                fontSize: '14px',
                letterSpacing: '0.4em',
                textTransform: 'uppercase',
              }}
            >
              Football Live
            </span>
          </div>

          <span
            style={{
              color: '#ffffff',
              fontSize: '96px',
              fontWeight: '700',
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              lineHeight: 1,
            }}
          >
            TAZO TV
          </span>

          {/* Match count */}
          {total > 0 && (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '20px',
                marginTop: '8px',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  background: 'rgba(168,85,247,0.1)',
                  border: '1px solid rgba(168,85,247,0.25)',
                  borderRadius: '14px',
                  padding: '12px 28px',
                }}
              >
                <span style={{ color: '#a855f7', fontSize: '32px', fontWeight: '700' }}>
                  {total}
                </span>
                <span
                  style={{
                    color: '#888',
                    fontSize: '16px',
                    letterSpacing: '0.15em',
                    textTransform: 'uppercase',
                  }}
                >
                  matchs aujourd'hui
                </span>
              </div>

              {live > 0 && (
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    background: 'rgba(239,68,68,0.1)',
                    border: '1px solid rgba(239,68,68,0.3)',
                    borderRadius: '14px',
                    padding: '12px 28px',
                  }}
                >
                  <div
                    style={{
                      width: '10px',
                      height: '10px',
                      borderRadius: '50%',
                      background: '#ef4444',
                      display: 'flex',
                    }}
                  />
                  <span style={{ color: '#ef4444', fontSize: '32px', fontWeight: '700' }}>
                    {live}
                  </span>
                  <span
                    style={{
                      color: '#ef444488',
                      fontSize: '16px',
                      letterSpacing: '0.15em',
                      textTransform: 'uppercase',
                    }}
                  >
                    en direct
                  </span>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div
          style={{
            position: 'absolute',
            bottom: '28px',
            color: '#333',
            fontSize: '14px',
            letterSpacing: '0.25em',
            textTransform: 'uppercase',
            display: 'flex',
          }}
        >
          tazo.tv — Regardez le foot en direct
        </div>
      </div>
    ),
    {
      width:  1200,
      height: 630,
    }
  )
}
