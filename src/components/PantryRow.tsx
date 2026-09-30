import clsx from 'clsx'
import { Trash2 } from 'lucide-react'
import type { PantryItem } from '@/lib/types'
import { expiryLabel, TONE_STYLES } from '@/lib/date'

export function PantryRow({ item, onDelete }: { item: PantryItem; onDelete: (id: string) => void }) {
  const { label, tone } = expiryLabel(item.expires_on)

  return (
    <div className="group flex items-center gap-3 rounded-2xl border border-border bg-surface px-4 py-3 shadow-softer transition hover:shadow-soft">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-surface2 text-lg">
        {item.icon}
      </div>

      <div className="min-w-0 flex-1">
        <p className="truncate font-medium text-ink">{item.name}</p>
        <span className={clsx('mt-1 inline-block rounded-full px-2 py-0.5 text-xs font-medium', TONE_STYLES[tone])}>
          {label}
        </span>
      </div>

      <button
        onClick={() => onDelete(item.id)}
        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-muted opacity-0 transition hover:bg-surface2 group-hover:opacity-100 focus-visible:opacity-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
        aria-label={`Remove ${item.name}`}
      >
        <Trash2 size={15} />
      </button>
    </div>
  )
}
