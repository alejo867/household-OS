import { useState } from 'react'
import { Copy, Check, Bell, BellOff, CalendarDays } from 'lucide-react'
import { useHousehold } from '@/lib/useHousehold'
import { usePush } from '@/lib/usePush'
import { Avatar } from '@/components/Avatar'

const CALENDAR_FEED_HOST = 'jlhvikhgejdhikckrqdc.supabase.co/functions/v1/calendar-feed'

export function HouseholdPage() {
  const { household, members, createInvite } = useHousehold()
  const push = usePush()
  const [code, setCode] = useState<string | null>(null)
  const [generating, setGenerating] = useState(false)
  const [copied, setCopied] = useState(false)
  const [calendarCopied, setCalendarCopied] = useState(false)
  const [pushError, setPushError] = useState<string | null>(null)

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

  const calendarUrl = household?.calendar_token
    ? `https://${CALENDAR_FEED_HOST}?household=${household.id}&token=${household.calendar_token}`
    : null
  const webcalUrl = calendarUrl ? calendarUrl.replace('https://', 'webcal://') : null

  const copyCalendarLink = async () => {
    if (!calendarUrl) return
    try {
      await navigator.clipboard.writeText(calendarUrl)
      setCalendarCopied(true)
      setTimeout(() => setCalendarCopied(false), 2000)
    } catch {
      /* clipboard not available */
    }
  }

  const togglePush = async () => {
    setPushError(null)
    if (push.subscribed) {
      await push.unsubscribe()
    } else {
      const { error } = await push.subscribe()
      if (error) setPushError(error)
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

      <section className="mt-8 space-y-4">
        <h2 className="font-medium text-ink">Notifications &amp; calendar</h2>

        <div className="flex items-center gap-4 rounded-2xl border border-border bg-surface p-5 shadow-softer">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-sun-100 text-sun-700 dark:bg-sun-500/15 dark:text-sun-300">
            {push.subscribed ? <Bell size={20} /> : <BellOff size={20} />}
          </div>
          <div className="min-w-0 flex-1">
            <p className="font-medium text-ink">Push reminders</p>
            <p className="text-sm text-muted">
              {push.supported
                ? push.subscribed
                  ? 'This device gets a notification when something is due.'
                  : 'Get a notification on this device when a task or to-do is due.'
                : "This browser doesn't support push notifications."}
            </p>
            {pushError && (
              <p role="alert" className="mt-1 text-xs text-clay-600 dark:text-clay-300">
                {pushError}
              </p>
            )}
          </div>
          <button
            onClick={togglePush}
            disabled={!push.supported || push.loading || !push.checked}
            className={
              push.subscribed
                ? 'shrink-0 rounded-xl border border-border px-3.5 py-2 text-sm font-medium text-muted transition hover:border-clay-300 hover:text-clay-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring disabled:opacity-50'
                : 'shrink-0 rounded-xl bg-sun-500 px-3.5 py-2 text-sm font-medium text-white transition hover:bg-sun-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring disabled:opacity-50'
            }
          >
            {push.loading ? 'Working…' : push.subscribed ? 'Turn off' : 'Turn on'}
          </button>
        </div>

        <div className="flex items-center gap-4 rounded-2xl border border-border bg-surface p-5 shadow-softer">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-berry-100 text-berry-700 dark:bg-berry-500/15 dark:text-berry-300">
            <CalendarDays size={20} />
          </div>
          <div className="min-w-0 flex-1">
            <p className="font-medium text-ink">Apple Calendar</p>
            <p className="text-sm text-muted">
              Subscribe to a live feed of every task and to-do due date. On iPhone or Mac: Settings/Calendar app →
              Add Subscription Calendar → paste this link.
            </p>
          </div>
        </div>

        {calendarUrl && (
          <div className="flex items-center gap-2 rounded-2xl bg-surface2 px-4 py-3">
            <span className="min-w-0 flex-1 truncate font-mono text-xs text-muted">{calendarUrl}</span>
            {webcalUrl && (
              <a
                href={webcalUrl}
                className="shrink-0 rounded-xl border border-border px-3 py-2 text-sm font-medium text-ink transition hover:border-berry-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
              >
                Subscribe
              </a>
            )}
            <button
              onClick={copyCalendarLink}
              className="flex shrink-0 items-center gap-1.5 rounded-xl bg-berry-500 px-3 py-2 text-sm font-medium text-white transition hover:bg-berry-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
            >
              {calendarCopied ? <Check size={15} /> : <Copy size={15} />}
              {calendarCopied ? 'Copied' : 'Copy'}
            </button>
          </div>
        )}
      </section>
    </div>
  )
}
