import { useState } from 'react'
import { useHousehold } from '@/lib/useHousehold'
import { useAuth } from '@/lib/useAuth'

export function Onboarding() {
  const { createHousehold, joinHousehold } = useHousehold()
  const { profile, signOut } = useAuth()
  const [mode, setMode] = useState<'choose' | 'create' | 'join'>('choose')
  const [name, setName] = useState('Our Home')
  const [code, setCode] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)

  const firstName = (profile?.display_name || '').split(' ')[0] || 'there'

  const submitCreate = async () => {
    setBusy(true)
    setError(null)
    try {
      await createHousehold(name.trim() || 'Our Home')
    } catch (e: any) {
      setError(e.message ?? 'Something went wrong')
    } finally {
      setBusy(false)
    }
  }

  const submitJoin = async () => {
    setBusy(true)
    setError(null)
    const { error: err } = await joinHousehold(code)
    if (err) setError(err)
    setBusy(false)
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-bg px-6">
      <div className="blob-accent -left-20 top-10 h-80 w-80 bg-moss-300" />
      <div className="blob-accent -right-24 bottom-0 h-96 w-96 bg-clay-200" />

      <div className="relative z-10 w-full max-w-sm rounded-3xl bg-surface p-7 shadow-soft">
        <h1 className="font-display text-2xl font-medium text-ink">Welcome, {firstName}</h1>
        <p className="mt-1.5 text-sm text-muted">Every home needs a nest. Start a new one, or join your partner's.</p>

        {mode === 'choose' && (
          <div className="mt-6 space-y-3">
            <button
              onClick={() => setMode('create')}
              className="w-full rounded-2xl bg-moss-500 px-4 py-3.5 text-left font-medium text-white transition hover:bg-moss-600"
            >
              Start a new household
              <span className="block text-xs font-normal opacity-80">You'll get an invite code to share</span>
            </button>
            <button
              onClick={() => setMode('join')}
              className="w-full rounded-2xl border border-border px-4 py-3.5 text-left font-medium text-ink transition hover:border-moss-400"
            >
              Join with an invite code
              <span className="block text-xs font-normal text-muted">Someone already started one</span>
            </button>
            <button onClick={signOut} className="mt-2 w-full text-center text-xs text-muted underline">
              Sign out
            </button>
          </div>
        )}

        {mode === 'create' && (
          <div className="mt-6 space-y-4">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-muted">Household name</label>
              <input
                autoFocus
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full rounded-xl border border-border bg-surface2 px-3.5 py-2.5 text-ink outline-none ring-moss-400 focus:ring-2"
              />
            </div>
            {error && <p className="text-sm text-clay-600">{error}</p>}
            <button
              onClick={submitCreate}
              disabled={busy}
              className="w-full rounded-xl bg-moss-500 py-3 font-medium text-white transition hover:bg-moss-600 disabled:opacity-50"
            >
              {busy ? 'Creating…' : 'Create household'}
            </button>
            <button onClick={() => setMode('choose')} className="w-full text-center text-xs text-muted underline">
              Back
            </button>
          </div>
        )}

        {mode === 'join' && (
          <div className="mt-6 space-y-4">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-muted">Invite code</label>
              <input
                autoFocus
                value={code}
                onChange={(e) => setCode(e.target.value.toUpperCase())}
                placeholder="ABC123"
                className="w-full rounded-xl border border-border bg-surface2 px-3.5 py-2.5 text-center font-mono text-lg tracking-widest text-ink outline-none ring-moss-400 focus:ring-2"
                maxLength={6}
              />
            </div>
            {error && <p className="text-sm text-clay-600">{error}</p>}
            <button
              onClick={submitJoin}
              disabled={busy || code.length < 4}
              className="w-full rounded-xl bg-moss-500 py-3 font-medium text-white transition hover:bg-moss-600 disabled:opacity-50"
            >
              {busy ? 'Joining…' : 'Join household'}
            </button>
            <button onClick={() => setMode('choose')} className="w-full text-center text-xs text-muted underline">
              Back
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
