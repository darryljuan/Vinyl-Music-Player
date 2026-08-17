import AlbumArt from '../AlbumArt'
import type { Track } from '../../types/music'

export default function Turntable({
  track,
  isPlaying,
  size = 320,
}: {
  track: Track | null
  isPlaying: boolean
  size?: number
}) {
  const hasTrack = !!track

  return (
    <div className="relative flex items-center justify-center" style={{ width: size * 1.55, height: size * 1.15 }}>
      {/* Walnut base */}
      <div className="absolute inset-0 rounded-3xl bg-gradient-to-b from-walnut-800 to-walnut-950 shadow-2xl" />

      {/* Album sleeve — stationary */}
      <div
        className="absolute z-10 shadow-xl"
        style={{ left: '6%', top: '50%', transform: 'translateY(-50%)', width: size * 0.62, height: size * 0.62 }}
      >
        <AlbumArt
          src={track?.artworkUrl}
          album={track?.album ?? ''}
          artist={track?.artist ?? ''}
          className="h-full w-full"
          rounded="rounded-sm"
        />
      </div>

      {/* Vinyl disc — slides out from behind the sleeve and spins while playing */}
      <div
        className="absolute z-0 rounded-full shadow-vinyl transition-transform duration-700 ease-out"
        style={{
          width: size * 0.72,
          height: size * 0.72,
          right: '6%',
          top: '50%',
          transform: `translateY(-50%) translateX(${hasTrack ? '0%' : '-38%'})`,
          background: 'radial-gradient(circle at 35% 35%, #2a2a2a, #0a0a0a 70%)',
        }}
      >
        <div
          className={`vinyl-grooves vinyl-sheen h-full w-full rounded-full ${isPlaying ? 'vinyl-spin animate-spin-slow' : ''}`}
        >
          {/* Centre label */}
          <div
            className="absolute rounded-full ring-2 ring-black/40"
            style={{
              width: size * 0.26,
              height: size * 0.26,
              left: '50%',
              top: '50%',
              transform: 'translate(-50%, -50%)',
            }}
          >
            <AlbumArt
              src={track?.artworkUrl}
              album={track?.album ?? ''}
              artist={track?.artist ?? ''}
              className="h-full w-full"
              rounded="rounded-full"
            />
          </div>
          {/* Spindle hole */}
          <div
            className="absolute rounded-full bg-stone-950"
            style={{ width: 8, height: 8, left: '50%', top: '50%', transform: 'translate(-50%, -50%)' }}
          />
        </div>
      </div>

      {/* Tonearm */}
      <div
        className="absolute z-20 origin-top-right transition-transform duration-700 ease-out"
        style={{
          width: size * 0.42,
          height: 6,
          right: '10%',
          top: '10%',
          transform: `rotate(${hasTrack && isPlaying ? '28deg' : '-8deg'})`,
        }}
      >
        <div className="h-full w-full rounded-full bg-gradient-to-r from-brass-600 to-brass-400 shadow-md" />
        <div className="absolute -left-1 -top-1.5 h-3 w-3 rounded-full bg-brass-400 shadow" />
      </div>
    </div>
  )
}
