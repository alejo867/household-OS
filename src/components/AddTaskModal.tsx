import { useState } from 'react'
import { Modal } from './Modal'
import { TASK_CATEGORIES } from '@/lib/types'
import type { HouseholdMember } from '@/lib/types'
import { CATEGORY_STYLES } from '@/lib/colors'
import clsx from 'clsx'

export function AddTaskModal({
  open,
  onClose,
  onCreate,
  members
}: {
  open: boolean
  onClose: () => void
  onCreate: (input: {
    title: string
    category: string
    icon: string
    interval_days: number
    assigned_to: string | null
  }) => Promise<void>
  members: HouseholdMember[]
}) {
  const [title, setTitle] = useState('')
  const [category, setCategory] = useState(TASK_CATEGORIES[0].id as string)
  const [interval, setInterval] = useState(30)
  const [assignedTo, setAssignedTo] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)

  const selectedCategory = TASK_CATEGORIES.find((c) => c.id === category) ?? TASK_CATEGORIES[0]

  const reset = () => {
    setTitle('')
    setCategory(TASK_CATEGORIES[0].id)
    setInterval(30)
    setAssignedTo(null)
  }

  const submit = async () => {
    if (!title.trim()) return
    setSaving(true)
    await onCreate({
      title: title.trim(),
      category,
      icon: selectedCategory.icon,
      interval_days: interval,
      assigned_to: assignedTo
    })
    setSaving(false)
    reset()
    onClose()
  }

  return (
    <Modal open={open} onClose={onClose} title="New recurring task">
      <div className="space-y-4">
        <div>
          <label htmlFor="task-title" className="mb-1.5 block text-sm font-medium text-muted">
            What needs doing?
          </label>
          <input
            id="task-title"
            autoFocus
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Change AC filter"
            className="w-full rounded-xl border border-border bg-surface2 px-3.5 py-2.5 text-ink outline-none ring-sky-400 placeholder:text-muted/70 focus:ring-2"
          />
        </div>

        <div>
          <span id="task-category-label" className="mb-1.5 block text-sm font-medium text-muted">
            Category
          </span>
          <div role="group" aria-labelledby="task-category-label" className="flex flex-wrap gap-2">
            {TASK_CATEGORIES.map((c) => {
              const styles = CATEGORY_STYLES[c.color]
              const active = category === c.id
              return (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => setCategory(c.id)}
                  aria-pressed={active}
                  className={clsx(
                    'flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-sm transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring',
                    active ? styles.chipActive : clsx('border-border text-muted', styles.chipHover)
                  )}
                >
                  <span>{c.icon}</span> {c.label}
                </button>
              )
            })}
          </div>
        </div>

        <div>
          <label htmlFor="task-interval" className="mb-1.5 block text-sm font-medium text-muted">
            Repeat every
          </label>
          <div className="flex items-center gap-2">
            <input
              id="task-interval"
              type="number"
              min={1}
              value={interval}
              onChange={(e) => setInterval(Number(e.target.value) || 1)}
              className="w-24 rounded-xl border border-border bg-surface2 px-3.5 py-2.5 text-ink outline-none ring-sky-400 focus:ring-2"
            />
            <span className="text-sm text-muted">days</span>
            <div className="ml-auto flex gap-1.5">
              {[7, 30, 90, 180].map((d) => (
                <button
                  key={d}
                  type="button"
                  onClick={() => setInterval(d)}
                  aria-label={`Repeat every ${d} days`}
                  className="rounded-full border border-border px-2.5 py-1 text-xs text-muted transition hover:border-sky-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
                >
                  {d}d
                </button>
              ))}
            </div>
          </div>
        </div>

        {members.length > 0 && (
          <div>
            <span id="task-assignee-label" className="mb-1.5 block text-sm font-medium text-muted">
              Assign to
            </span>
            <div role="group" aria-labelledby="task-assignee-label" className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => setAssignedTo(null)}
                aria-pressed={assignedTo === null}
                className={clsx(
                  'rounded-full border px-3 py-1.5 text-sm transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring',
                  assignedTo === null ? 'border-sky-500 bg-sky-500/10 text-sky-700 dark:text-sky-300' : 'border-border text-muted'
                )}
              >
                Anyone
              </button>
              {members.map((m) => (
                <button
                  key={m.user_id}
                  type="button"
                  onClick={() => setAssignedTo(m.user_id)}
                  aria-pressed={assignedTo === m.user_id}
                  className={clsx(
                    'rounded-full border px-3 py-1.5 text-sm transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring',
                    assignedTo === m.user_id
                      ? 'border-sky-500 bg-sky-500/10 text-sky-700 dark:text-sky-300'
                      : 'border-border text-muted'
                  )}
                >
                  {m.profile?.display_name ?? 'Member'}
                </button>
              ))}
            </div>
          </div>
        )}

        <button
          type="button"
          onClick={submit}
          disabled={saving || !title.trim()}
          className="w-full rounded-xl bg-moss-500 py-3 font-medium text-white transition hover:bg-moss-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring disabled:opacity-50"
        >
          {saving ? 'Adding…' : 'Add task'}
        </button>
      </div>
    </Modal>
  )
}
