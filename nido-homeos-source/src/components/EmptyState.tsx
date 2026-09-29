import { ReactNode } from 'react'

export function EmptyState({
  icon,
  title,
  subtitle,
  action
}: {
  icon: ReactNode
  title: string
  subtitle?: string
  action?: ReactNode
}) {
  return (
    <div className="flex flex-col items-center justify-center gap-2 rounded-3xl border border-dashed border-border bg-surface/60 px-6 py-12 text-center">
      <div className="mb-1 text-3xl">{icon}</div>
      <p className="font-display text-lg text-ink">{title}</p>
      {subtitle && <p className="max-w-xs text-sm text-muted">{subtitle}</p>}
      {action && <div className="mt-3">{action}</div>}
    </div>
  )
}
