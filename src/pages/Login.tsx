import { useState, FormEvent } from 'react'
import { useAuth } from '@/lib/useAuth'

export function Login() {
  const { signInWithPassword, signUp } = useAuth()
  const [mode, setMode] = useState<'signin' | 'signup'>('signin')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [fullName, setFullName] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [info, setInfo] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError(null)
    setInfo(null)
    setBusy(true)

    const result =
      mode === 'signin'
        ? await signInWithPassword(email, password)
        : await signUp(email, password, fullName || email.split('@')[0])

    setBusy(false)

    if (result.error) {
      setError(result.error)
      return
    }

    if (mode === 'signup') {
      setInfo('Account created! You can sign in now.')
      setMode('signin')
    }
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-bg px-6">
      <div className="blob-accent -left-20 top-10 h-80 w-80 bg-moss-300" />
      <div className="blob-accent -right-24 bottom-0 h-96 w-96 bg-clay-200" />
      <div className="blob-accent left-1/2 top-1/2 h-56 w-56 -translate-x-1/2 -translate-y-1/2 bg-moss-100" />

      <div className="relative z-10 w-full max-w-sm text-center">
        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-blob bg-moss-500/15 text-4xl">
          🌿
        </div>
        <h1 className="font-display text-4xl font-medium text-ink">Nido</h1>
        <p className="mt-3 text-muted">
          The little operating system for your home — filters, chores, the tank, and the to‑dos, all in one calm
          place you and your person can share.
        </p>

        <form onSubmit={handleSubmit} className="mt-8 space-y-3 text-left">
          {mode === 'signup' && (
            <div>
              <label htmlFor="login-name" className="sr-only">
                Your name
              </label>
              <input
                id="login-name"
                type="text"
                placeholder="Your name"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full rounded-2xl border border-ink/10 bg-white/70 px-4 py-3 text-ink shadow-soft outline-none placeholder:text-muted focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring dark:bg-surface2"
              />
            </div>
          )}
          <div>
            <label htmlFor="login-email" className="sr-only">
              Email
            </label>
            <input
              id="login-email"
              type="email"
              required
              autoComplete="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-2xl border border-ink/10 bg-white/70 px-4 py-3 text-ink shadow-soft outline-none placeholder:text-muted focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring dark:bg-surface2"
            />
          </div>
          <div>
            <label htmlFor="login-password" className="sr-only">
              Password
            </label>
            <input
              id="login-password"
              type="password"
              required
              minLength={6}
              autoComplete={mode === 'signin' ? 'current-password' : 'new-password'}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-2xl border border-ink/10 bg-white/70 px-4 py-3 text-ink shadow-soft outline-none placeholder:text-muted focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring dark:bg-surface2"
            />
          </div>

          {error && (
            <p role="alert" className="text-sm text-clay-600 dark:text-clay-300">
              {error}
            </p>
          )}
          {info && (
            <p role="status" className="text-sm text-moss-600 dark:text-moss-300">
              {info}
            </p>
          )}

          <button
            type="submit"
            disabled={busy}
            className="flex w-full items-center justify-center gap-3 rounded-2xl bg-ink px-5 py-3.5 font-medium text-bg shadow-soft transition hover:opacity-90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring disabled:opacity-60"
          >
            {busy ? 'Please wait…' : mode === 'signin' ? 'Sign in' : 'Create account'}
          </button>
        </form>

        <button
          onClick={() => {
            setMode(mode === 'signin' ? 'signup' : 'signin')
            setError(null)
            setInfo(null)
          }}
          className="mt-4 rounded text-sm font-medium text-moss-600 underline-offset-4 hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring dark:text-moss-300"
        >
          {mode === 'signin' ? "New here? Create an account" : 'Already have an account? Sign in'}
        </button>

        <p className="mt-4 text-xs text-muted">
          Sign in, then create your household or join your partner's with an invite code.
        </p>
      </div>
    </div>
  )
}
