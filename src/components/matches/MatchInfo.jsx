import { CDN_LOGOS, CDN_LEAGUES } from '../../utils/constants'

export default function MatchInfo({ match }) {
  const { league_en, league_logo, home_en, home_logo, away_en, away_logo, date, time, start_stream, end_stream } = match

  return (
    <div className="relative overflow-hidden rounded-3xl">
      <div className="absolute inset-0 bg-tazo-card" />
      <div className="absolute inset-0 rounded-3xl border border-tazo-border/60" />

      <div className="relative p-6">
        <div className="flex items-center gap-3 mb-5">
          <div className="w-1 h-5 rounded-full bg-tazo-accent/60" />
          <h3 className="font-display text-xl text-tazo-text tracking-wider">INFOS DU MATCH</h3>
        </div>

        {/* Tournament */}
        <div className="flex items-center gap-3 p-3 rounded-2xl bg-tazo-surface/60 border border-tazo-border/40 mb-4">
          <div className="w-10 h-10 rounded-xl bg-tazo-surface border border-tazo-border/60 flex items-center justify-center overflow-hidden flex-shrink-0">
            <img
              src={`${CDN_LEAGUES}/${league_logo}`}
              alt={league_en}
              className="w-8 h-8 object-contain"
              onError={(e) => { e.target.style.display = 'none' }}
            />
          </div>
          <div>
            <p className="text-[10px] font-mono text-tazo-muted tracking-wider uppercase mb-0.5">Compétition</p>
            <p className="text-tazo-text text-sm font-medium">{league_en}</p>
          </div>
        </div>

        {/* Teams face-off */}
        <div className="flex items-center gap-3 mb-4">
          <TeamPill name={home_en} logo={home_logo} />
          <span className="text-tazo-muted font-mono text-xs flex-shrink-0">vs</span>
          <TeamPill name={away_en} logo={away_logo} />
        </div>

        {/* Date / Time info */}
        <div className="grid grid-cols-2 gap-2">
          <InfoCell label="Date" value={date} />
          <InfoCell label="Coup d'envoi" value={time} accent />
          {start_stream && <InfoCell label="Stream début" value={start_stream?.split(' ')[1]?.slice(0,5)} />}
          {end_stream   && <InfoCell label="Stream fin"   value={end_stream?.split(' ')[1]?.slice(0,5)} />}
        </div>
      </div>
    </div>
  )
}

function TeamPill({ name, logo }) {
  return (
    <div className="flex items-center gap-2 flex-1 min-w-0 p-2 rounded-xl bg-tazo-surface/40 border border-tazo-border/30">
      <div className="w-7 h-7 rounded-lg bg-tazo-surface border border-tazo-border/60 flex items-center justify-center overflow-hidden flex-shrink-0">
        <img
          src={`https://cdn.kora-api.space/uploads/team/${logo}`}
          alt={name}
          className="w-6 h-6 object-contain"
          onError={(e) => { e.target.style.display = 'none' }}
        />
      </div>
      <span className="text-tazo-text text-xs font-medium truncate">{name}</span>
    </div>
  )
}

function InfoCell({ label, value, accent = false }) {
  return (
    <div className="p-2.5 rounded-xl bg-tazo-surface/40 border border-tazo-border/30">
      <p className="text-[9px] font-mono text-tazo-muted tracking-wider uppercase mb-1">{label}</p>
      <p className={`text-sm font-mono font-medium ${accent ? 'text-tazo-accent' : 'text-tazo-text'}`}>{value || '—'}</p>
    </div>
  )
}
