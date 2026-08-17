import useSWR from 'swr'
import axios from 'axios'
import type { Album, Artist, Track } from '../types/music'

type LibraryResponse = {
  tracks: Track[]
  albums: Album[]
  artists: Artist[]
  generatedAt: number
}

const fetcher = (url: string) => axios.get<LibraryResponse>(url).then(r => r.data)

// library.json is generated at build time by scripts/build-library.js from
// whatever is in public/music/ — see that script for the folder convention.
export function useMusicLibrary() {
  const { data, error, isLoading, mutate } = useSWR<LibraryResponse>('/library.json', fetcher, {
    revalidateOnFocus: false,
    dedupingInterval: 60_000,
  })

  return {
    tracks: data?.tracks ?? [],
    albums: data?.albums ?? [],
    artists: data?.artists ?? [],
    isLoading,
    isEmpty: !isLoading && !error && (data?.tracks.length ?? 0) === 0,
    error,
    refresh: () => mutate(),
  }
}
