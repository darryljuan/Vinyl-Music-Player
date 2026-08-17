import { useRouter } from 'next/router'
import { FaPlay, FaHeart, FaRegHeart, FaRandom } from 'react-icons/fa'
import { useMusicLibrary } from '../../hooks/useMusicLibrary'
import { usePlayer } from '../../hooks/PlayerContext'
import AlbumArt from '../../components/AlbumArt'
import SongRow from '../../components/SongRow'
import { LoadingGrid, EmptyState } from '../../components/States'

export default function AlbumPage() {
  const router = useRouter()
  const { id } = router.query
  const { albums, isLoading } = useMusicLibrary()
  const { playTrack, favouriteAlbums, toggleFavouriteAlbum } = usePlayer()

  if (isLoading) return <LoadingGrid />

  const album = albums.find(a => a.id === id)
  if (!album) return <EmptyState title="Album not found" />

  const isFav = favouriteAlbums.has(album.id)
  const totalSeconds = album.tracks.reduce((sum, t) => sum + (t.duration ?? 0), 0)
  const totalMinutes = Math.round(totalSeconds / 60)

  return (
    <div>
      <div className="mb-6 flex flex-col gap-5 sm:flex-row sm:items-end">
        <AlbumArt src={album.artworkUrl} album={album.name} artist={album.artist} className="h-40 w-40 flex-shrink-0 shadow-2xl sm:h-48 sm:w-48" />
        <div className="min-w-0">
          <div className="text-xs uppercase tracking-wide text-stone-500">Album</div>
          <h1 className="mt-1 truncate text-2xl font-bold text-stone-50">{album.name}</h1>
          <p className="mt-1 text-sm text-stone-400">
            {album.artist}
            {album.year ? ` · ${album.year}` : ''} · {album.tracks.length} songs, {totalMinutes} min
          </p>
          <div className="mt-4 flex items-center gap-4">
            <button
              onClick={() => album.tracks[0] && playTrack(album.tracks[0], album.tracks)}
              className="flex items-center gap-2 rounded-full bg-amber-600 px-5 py-2.5 text-sm font-medium text-stone-950 hover:bg-amber-500"
            >
              <FaPlay size={12} /> Play
            </button>
            <button
              onClick={() => {
                const shuffled = [...album.tracks].sort(() => Math.random() - 0.5)
                if (shuffled[0]) playTrack(shuffled[0], shuffled)
              }}
              className="flex items-center gap-2 rounded-full border border-stone-700 px-5 py-2.5 text-sm font-medium text-stone-200 hover:border-stone-500"
            >
              <FaRandom size={12} /> Shuffle
            </button>
            <button onClick={() => toggleFavouriteAlbum(album.id)} aria-label="Toggle favourite" className="text-stone-400 hover:text-amber-500">
              {isFav ? <FaHeart size={18} className="text-amber-500" /> : <FaRegHeart size={18} />}
            </button>
          </div>
        </div>
      </div>

      <div className="space-y-0.5">
        {album.tracks.map((track, i) => (
          <SongRow key={track.id} track={track} index={i} queueContext={album.tracks} />
        ))}
      </div>
    </div>
  )
}
