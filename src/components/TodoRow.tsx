import clsx from 'clsx'
import { Trash2 } from 'lucide-react'
import type { Todo } from '@/lib/types'
import { Avatar } from './Avatar'
import { formatDate } from '@/lib/date'

export function TodoRow({
  todo,
  assigneeName,
  onToggle,
  onDelete
}: {
  todo: Todo
  assigneeName?: string
  onToggle: (id: string, done: boolean) => void
  onDelete: (id: string) => void
}) {
  return (
    <div className="group flex items-center gap-3 rounded-2xl border border-border bg-surface px-4 py-3 shadow-softer transition hover:shadow-soft">
      <button
        onClick={() => onToggle(todo.id, !todo.is_done)}
        className={clsx(
          'flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 transition',
          todo.is_done ? 'border-moss-500 bg-moss-500 text-white' : 'border-border text-transparent hover:border-moss-400'
        )}
        aria-label="Toggle done"
      >
        ✓
      </button>

      <div className="min-w-0 flex-1">
        <p className={clsx('truncate font-medium', todo.is_done ? 'text-muted line-through' : 'text-ink')}>
          {todo.title}
        </p>
        {todo.due_date && (
          <p className="text-xs text-muted">
            Due {formatDate(todo.due_date)}
          </p>
        )}
      </div>

      {assigneeName && <Avatar name={assigneeName} size="sm" className="shrink-0" />}

      <button
        onClick={() => onDelete(todo.id)}
        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-muted opacity-0 transition hover:bg-surface2 group-hover:opacity-100"
        aria-label="Delete"
      >
        <Trash2 size={15} />
      </button>
    </div>
  )
}
