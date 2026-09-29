import { useState } from 'react'
import { Copy, Check } from 'lucide-react'
import { useHousehold } from '@/lib/useHousehold'
import { Avatar } from '@/components/Avatar'

export function HouseholdPage() {
  const { household, members, createInvite } = useHousehold()
  const [code, setCode] = useState<string | null>(null)
  const [generating, setGenerating] = useState(false)
  const [copied, setCopied] = useState(false)

  const generate = async () => {
    setGenerating(true)
    try {
      const c = await createInvite()
      setCode(c)
      setCopied(false)
    } finally {
      setGenerating(false)
    }
  }

  const copy = async () => {
    if (!code) return
    try {
      await navigator.clipboard.writeText(code)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      /* clipboard not available */
    }
  }

  return (
    <div>
      <h1 className="font-display text-3xl font-medium text-ink">{household?.name ?? 'Household'}</h1>
      <p className="mt-1 text-muted">Everyone here shares the same tasks, todos, and reminders.</p>

      <section className="mt-6">
        <h2 className="mb-3 font-medium text-ink">Members</h2>
        <div className="space-y-2.5">
          {members.map((m) => (
            <div key={m.user_id} className="flex items-center gap-3 rounded-2xl bg-surface px-4 py-3 shadow-softer">
              <Avatar name={m.profile?.display_name ?? 'Member'} src={m.profile?.avatar_url} />
              <div className="min-w-0 flex-1">
                <p className="truncate font-medium text-ink">{m.profile?.display_name ?? 'Member'}</p>
                <p className="truncate text-xs text-muted">{m.profile?.email}</p>
              </div>
              <span className="rounded-full bg-surface2 px-2.5 py-1 text-xs capitalize text-muted">{m.role}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-8 rounded-3xl border border-dashed border-border bg-surface/60 p-6">
        <h2 className="font-medium text-ink">Invite someone</h2>
        <p className="mt-1 text-sm text-muted">
          Generate a code and send it to them. They'll create an account and enter it to join {household?.name}.
        </p>

        {code ? (
          <div className="mt-4 flex items-center justify-between rounded-2xl bg-surface2 px-4 py-3">
            <span className="font-mono text-xl tracking-[0.3em] text-ink">{code}</span>
            <button
              onClick={copy}
              className="flex items-center gap-1.5 rounded-xl bg-moss-500 px-3 py-2 text-sm font-medium text-white transition hover:bg-moss-600"
            >
              {copied ? <Check size={15} /> : <Copy size={15} />}
              {copied ? 'Copied' : 'Copy'}
            </button>
          </div>
        ) : (
          <button
            onClick={generate}
            disabled={generating}
            className="mt-4 rounded-xl bg-moss-500 px-4 py-2.5 font-medium text-white transition hover:bg-moss-600 disabled:opacity-50"
          >
            {generating ? 'Generating…' : 'Generate invite code'}
          </button>
        )}
        <p className="mt-3 text-xs text-muted">Codes expire after 14 days.</p>
      </section>
    </div>
  )
}
