import { useState } from 'react'
import { Modal } from './Modal'
import { PANTRY_ICONS } from '@/lib/types'
import clsx from 'clsx'
import { format, addDays } from 'date-fns'

export function AddPantryModal({
  open,
  onClose,
  onCreate
}: {
  open: boolean
  onClose: () => void
  onCreate: (input: { name: string; icon: string; expires_on: string }) => Promise<void>
}) {
  const [name, setName] = useState('')
  const [icon, setIcon] = useState<string>(PANTRY_ICONS[0])
  const [expiresOn, setExpiresOn] = useState(format(addDays(new Date(), 7), 'yyyy-MM-dd'))
  const [saving, setSaving] = useState(false)

  const reset = () => {
    setName('')
    setIcon(PANTRY_ICONS[0])
    setExpiresOn(format(addDays(new Date(), 7), 'yyyy-MM-dd'))
  }

  const submit = async () => {
    if (!name.trim() || !expiresOn) return
    setSaving(true)
    await onCreate({ name: name.trim(), icon, expires_on: expiresOn })
    setSaving(false)
    reset()
    onClose()
  }

  return (
    <Modal open={open} onClose={onClose} title="Track an item">
      <div className="space-y-4">
        <div>
          <label htmlFor="pantry-name" className="mb-1.5 block text-sm font-medium text-muted">
            What is it?
          </label>
          <input
            id="pantry-name"
            autoFocus
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Milk"
            className="w-full rounded-xl border border-border bg-surface2 px-3.5 py-2.5 text-ink outline-none ring-sky-400 placeholder:text-muted/70 focus:ring-2"
          />
        </div>

        <div>
          <span id="pantry-icon-label" className="mb-1.5 block text-sm font-medium text-muted">
            Icon
          </span>
          <div role="group" aria-labelledby="pantry-icon-label" className="flex flex-wrap gap-2">
            {PANTRY_ICONS.map((i) => (
              <button
                key={i}
                type="button"
                onClick={() => setIcon(i)}
                aria-pressed={icon === i}
                className={clsx(
                  'flex h-10 w-10 items-center justify-center rounded-xl border text-lg transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring',
                  icon === i ? 'border-sky-500 bg-sky-500/10' : 'border-border hover:border-sky-300'
                )}
              >
                {i}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label htmlFor="pantry-expires" className="mb-1.5 block text-sm font-medium text-muted">
            Expires on
          </label>
          <input
            id="pantry-expires"
            type="date"
            value={expiresOn}
            onChange={(e) => setExpiresOn(e.target.value)}
            className="w-full rounded-xl border border-border bg-surface2 px-3.5 py-2.5 text-ink outline-none ring-sky-400 focus:ring-2"
          />
          <div className="mt-2 flex gap-1.5">
            {[3, 7, 14, 30].map((d) => (
              <button
                key={d}
                type="button"
                onClick={() => setExpiresOn(format(addDays(new Date(), d), 'yyyy-MM-dd'))}
                className="rounded-full border border-border px-2.5 py-1 text-xs text-muted transition hover:border-sky-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
              >
                {d}d
              </button>
            ))}
          </div>
        </div>

        <button
          type="button"
          onClick={submit}
          disabled={saving || !name.trim()}
          className="w-full rounded-xl bg-moss-500 py-3 font-medium text-white transition hover:bg-moss-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring disabled:opacity-50"
        >
          {saving ? 'Adding…' : 'Add to pantry'}
        </button>
      </div>
    </Modal>
  )
}
