import { useState } from 'react'
import { Modal } from './Modal'
import type { HouseholdMember } from '@/lib/types'
import clsx from 'clsx'

export function AddTodoModal({
  open,
  onClose,
  onCreate,
  members
}: {
  open: boolean
  onClose: () => void
  onCreate: (input: { title: string; due_date: string | null; assigned_to: string | null }) => Promise<void>
  members: HouseholdMember[]
}) {
  const [title, setTitle] = useState('')
  const [dueDate, setDueDate] = useState('')
  const [assignedTo, setAssignedTo] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)

  const submit = async () => {
    if (!title.trim()) return
    setSaving(true)
    await onCreate({ title: title.trim(), due_date: dueDate || null, assigned_to: assignedTo })
    setSaving(false)
    setTitle('')
    setDueDate('')
    setAssignedTo(null)
    onClose()
  }

  return (
    <Modal open={open} onClose={onClose} title="New todo">
      <div className="space-y-4">
        <div>
          <label className="mb-1.5 block text-sm font-medium text-muted">What's the task?</label>
          <input
            autoFocus
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Pick up dry cleaning"
            className="w-full rounded-xl border border-border bg-surface2 px-3.5 py-2.5 text-ink outline-none ring-moss-400 placeholder:text-muted/70 focus:ring-2"
          />
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium text-muted">Due date (optional)</label>
          <input
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            className="w-full rounded-xl border border-border bg-surface2 px-3.5 py-2.5 text-ink outline-none ring-moss-400 focus:ring-2"
          />
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
          {saving ? 'Adding…' : 'Add todo'}
        </button>
      </div>
    </Modal>
  )
}
