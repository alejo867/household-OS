import clsx from 'clsx'
import { Check, MoreHorizontal, Trash2 } from 'lucide-react'
import { useState } from 'react'
import { dueLabel, TONE_STYLES } from '@/lib/date'
import { TASK_CATEGORIES } from '@/lib/types'
import type { RecurringTask } from '@/lib/types'
import { CATEGORY_STYLES } from '@/lib/colors'
import { Avatar } from './Avatar'

export function TaskCard({
  task,
  assigneeName,
  onComplete,
  onDelete
}: {
  task: RecurringTask
  assigneeName?: string
  onComplete: (id: string) => void
  onDelete: (id: string) => void
}) {
  const [busy, setBusy] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const { label, tone } = dueLabel(task.next_due_at)
  const category = TASK_CATEGORIES.find((c) => c.id === task.category)
  const iconStyle = category ? CATEGORY_STYLES[category.color].icon : 'bg-surface2 text-ink'

  const complete = async () => {
    setBusy(true)
    await onComplete(task.id)
    setBusy(false)
  }

  return (
    <div className="group relative flex items-center gap-3 rounded-2xl border border-border bg-surface p-4 shadow-softer transition hover:shadow-soft">
      <div className={clsx('flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl text-xl', iconStyle)}>
        {task.icon}
      </div>

      <div className="min-w-0 flex-1">
        <p className="truncate font-medium text-ink">{task.title}</p>
        <div className="mt-1 flex flex-wrap items-center gap-2">
          <span className={clsx('rounded-full px-2 py-0.5 text-xs font-medium', TONE_STYLES[tone])}>{label}</span>
          <span className="text-xs text-muted">every {task.interval_days}d</span>
        </div>
      </div>

      {assigneeName && <Avatar name={assigneeName} size="sm" className="shrink-0" />}

      <button
        onClick={complete}
        disabled={busy}
        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-moss-500 text-white transition hover:bg-moss-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring disabled:opacity-50"
        aria-label="Mark done"
      >
        <Check size={18} />
      </button>

      <div className="relative">
        <button
          onClick={() => setMenuOpen((v) => !v)}
          className="flex h-9 w-9 items-center justify-center rounded-full text-muted transition hover:bg-surface2"
          aria-label="More"
        >
          <MoreHorizontal size={18} />
        </button>
        {menuOpen && (
          <div className="absolute right-0 top-10 z-10 w-36 overflow-hidden rounded-xl border border-border bg-surface shadow-soft animate-pop">
            <button
              onClick={() => {
                setMenuOpen(false)
                onDelete(task.id)
              }}
              className="flex w-full items-center gap-2 px-3 py-2 text-sm text-clay-600 hover:bg-surface2"
            >
              <Trash2 size={14} /> Delete
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
