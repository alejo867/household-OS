import { useState } from 'react'
import { Modal } from './Modal'
import { TASK_CATEGORIES } from '@/lib/types'
import type { HouseholdMember } from '@/lib/types'
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
          <label className="mb-1.5 block text-sm font-medium text-muted">What needs doing?</label>
          <input
            autoFocus
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Change AC filter"
            className="w-full rounded-xl border border-border bg-surface2 px-3.5 py-2.5 text-ink outline-none ring-moss-400 placeholder:text-muted/70 focus:ring-2"
          />
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium text-muted">Category</label>
          <div className="flex flex-wrap gap-2">
            {TASK_CATEGORIES.map((c) => (
              <button
                key={c.id}
                onClick={() => setCategory(c.id)}
                className={clsx(
                  'flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-sm transition',
                  category === c.id
                    ? 'border-moss-500 bg-moss-500/10 text-moss-700 dark:text-moss-300'
                    : 'border-border text-muted hover:border-moss-300'
                )}
              >
                <span>{c.icon}</span> {c.label}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium text-muted">Repeat every</label>
          <div className="flex items-center gap-2">
            <input
              type="number"
              min={1}
              value={interval}
              onChange={(e) => setInterval(Number(e.target.value) || 1)}
              className="w-24 rounded-xl border border-border bg-surface2 px-3.5 py-2.5 text-ink outline-none ring-moss-400 focus:ring-2"
            />
            <span className="text-sm text-muted">days</span>
            <div className="ml-auto flex gap-1.5">
              {[7, 30, 90, 180].map((d) => (
                <button
                  key={d}
                  onClick={() => setInterval(d)}
                  className="rounded-full border border-border px-2.5 py-1 text-xs text-muted transition hover:border-moss-300"
                >
                  {d}d
                </button>
              ))}
            </div>
          </div>
        </div>

        {members.length > 0 && (
          <div>
            <label className="mb-1.5 block text-sm font-medium text-muted">Assign to</label>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setAssignedTo(null)}
                className={clsx(
                  'rounded-full border px-3 py-1.5 text-sm transition',
                  assignedTo === null ? 'border-moss-500 bg-moss-500/10 text-moss-700 dark:text-moss-300' : 'border-border text-muted'
                )}
              >
                Anyone
              </button>
              {members.map((m) => (
                <button
                  key={m.user_id}
                  onClick={() => setAssignedTo(m.user_id)}
                  className={clsx(
                    'rounded-full border px-3 py-1.5 text-sm transition',
                    assignedTo === m.user_id
                      ? 'border-moss-500 bg-moss-500/10 text-moss-700 dark:text-moss-300'
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
          onClick={submit}
          disabled={saving || !title.trim()}
          className="w-full rounded-xl bg-moss-500 py-3 font-medium text-white transition hover:bg-moss-600 disabled:opacity-50"
        >
          {saving ? 'Adding…' : 'Add task'}
        </button>
      </div>
    </Modal>
  )
}
