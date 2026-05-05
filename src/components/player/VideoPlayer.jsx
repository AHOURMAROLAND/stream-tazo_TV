export default function VideoPlayer({ src, iframeSrc }) {
  // Si on a une URL iframe (page HTML), on l'affiche directement
  const url = iframeSrc || src

  if (!url) return null

  return (
    <div
      className="relative rounded-2xl overflow-hidden bg-black border border-tazo-border/60"
      style={{ boxShadow: '0 20px 60px rgba(0,0,0,0.6), 0 0 0 1px rgba(0,212,255,0.05)' }}
    >
      <div className="aspect-video">
        <iframe
          src={url}
          className="w-full h-full"
          allowFullScreen
          scrolling="no"
          frameBorder="0"
          allow="autoplay; fullscreen"
          title="Stream"
        />
      </div>
    </div>
  )
}
