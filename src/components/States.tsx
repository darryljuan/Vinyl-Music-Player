export function LoadingGrid() {
  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
      {Array.from({ length: 10 }).map((_, i) => (
        <div key={i} className="animate-pulse">
          <div className="aspect-square rounded-lg bg-stone-900" />
          <div className="mt-2 h-3.5 w-4/5 rounded bg-stone-900" />
          <div className="mt-1.5 h-3 w-3/5 rounded bg-stone-900" />
        </div>
      ))}
    </div>
  )
}

export function EmptyState({ title, description }: { title: string; description?: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-24 text-center">
      <div className="mb-4 h-16 w-16 rounded-full border-2 border-stone-800" />
      <h3 className="text-base font-medium text-stone-300">{title}</h3>
      {description && <p className="mt-1 max-w-xs text-sm text-stone-500">{description}</p>}
    </div>
  )
}

export function NoMusicFoundState() {
  return (
    <EmptyState
      title="No music found"
      description="Add MP3s to public/music/<Artist>/<Album>/ in your repo, then redeploy."
    />
  )
}
