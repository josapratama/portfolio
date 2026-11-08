interface SkeletonProps {
  className?: string
  lines?: number
}

export function Skeleton({ className = '', lines = 1 }: SkeletonProps) {
  if (lines === 1) return <div className={`skeleton h-4 ${className}`} />
  return (
    <div className={`space-y-2 ${className}`}>
      {Array.from({ length: lines }).map((_, i) => (
        <div key={i} className={`skeleton h-4 ${i === lines - 1 ? 'w-3/4' : 'w-full'}`} />
      ))}
    </div>
  )
}

export function CardSkeleton() {
  return (
    <div className="card-glass p-6 space-y-4">
      <div className="skeleton h-48 rounded-lg" />
      <div className="skeleton h-5 w-2/3" />
      <Skeleton lines={2} />
      <div className="flex gap-2">
        <div className="skeleton h-6 w-16 rounded-full" />
        <div className="skeleton h-6 w-20 rounded-full" />
        <div className="skeleton h-6 w-14 rounded-full" />
      </div>
    </div>
  )
}

export function PageLoadSkeleton() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="w-8 h-8 rounded-full border-2 border-accent border-t-transparent animate-spin" />
        <p className="text-sm text-text-muted">Loading...</p>
      </div>
    </div>
  )
}

export function ErrorState({ message = 'Something went wrong' }: { message?: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 gap-4">
      <div className="w-12 h-12 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-400 text-xl">!</div>
      <p className="text-text-secondary text-sm">{message}</p>
    </div>
  )
}

export function EmptyState({ message = 'Nothing here yet' }: { message?: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 gap-3">
      <div className="w-12 h-12 rounded-full bg-surface-2 border border-border flex items-center justify-center text-text-muted text-xl">∅</div>
      <p className="text-text-secondary text-sm">{message}</p>
    </div>
  )
}
