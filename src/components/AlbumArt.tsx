import { useState } from 'react'
import { colourFromString, initials } from '../lib/format'

export default function AlbumArt({
  src,
  album,
  artist,
  className = '',
  rounded = 'rounded-md',
}: {
  src?: string
  album: string
  artist: string
  className?: string
  rounded?: string
}) {
  const [failed, setFailed] = useState(!src)

  if (failed) {
    return (
      <div
        className={`flex items-center justify-center ${rounded} ${className}`}
        style={{
          background: `linear-gradient(135deg, ${colourFromString(album + artist)}, #1c1512)`,
        }}
      >
        <span className="font-serif text-2xl font-semibold tracking-wide text-cream-100/80">
          {initials(album || artist)}
        </span>
      </div>
    )
  }

  // eslint-disable-next-line @next/next/no-img-element
  return <img src={src} alt={`${album} — ${artist}`} className={`${rounded} object-cover ${className}`} onError={() => setFailed(true)} />
}
