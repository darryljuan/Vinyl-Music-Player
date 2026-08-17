import { useMusicLibrary } from '../../hooks/useMusicLibrary'
import AlbumCard from '../../components/AlbumCard'
import { LoadingGrid, NoMusicFoundState } from '../../components/States'

export default function AlbumsPage() {
  const { albums, isLoading, isEmpty } = useMusicLibrary()

  if (isLoading) return <LoadingGrid />
  if (isEmpty) return <NoMusicFoundState />

  return (
    <div>
      <h1 className="mb-5 text-xl font-semibold">Albums</h1>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
        {albums.map(a => (
          <AlbumCard key={a.id} album={a} />
        ))}
      </div>
    </div>
  )
}
