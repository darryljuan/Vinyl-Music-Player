import { useMusicLibrary } from '../hooks/useMusicLibrary'
import SongRow from '../components/SongRow'
import { LoadingGrid, NoMusicFoundState } from '../components/States'

export default function SongsPage() {
  const { tracks, isLoading, isEmpty } = useMusicLibrary()

  if (isLoading) return <LoadingGrid />
  if (isEmpty) return <NoMusicFoundState />

  return (
    <div>
      <h1 className="mb-5 text-xl font-semibold">Songs</h1>
      <div className="space-y-0.5">
        {tracks.map((track, i) => (
          <SongRow key={track.id} track={track} index={i} queueContext={tracks} showAlbum />
        ))}
      </div>
    </div>
  )
}
