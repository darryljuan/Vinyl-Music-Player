import { useRouter } from 'next/router'
import { useMusicLibrary } from '../../hooks/useMusicLibrary'
import AlbumCard from '../../components/AlbumCard'
import { LoadingGrid, EmptyState } from '../../components/States'

export default function ArtistPage() {
  const router = useRouter()
  const { id } = router.query
  const { artists, isLoading } = useMusicLibrary()

  if (isLoading) return <LoadingGrid />

  const artist = artists.find(a => a.id === id)
  if (!artist) return <EmptyState title="Artist not found" />

  return (
    <div>
      <h1 className="mb-1 text-2xl font-bold text-stone-50">{artist.name}</h1>
      <p className="mb-5 text-sm text-stone-500">
        {artist.albumCount} album{artist.albumCount === 1 ? '' : 's'}
      </p>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
        {artist.albums.map(a => (
          <AlbumCard key={a.id} album={a} />
        ))}
      </div>
    </div>
  )
}
