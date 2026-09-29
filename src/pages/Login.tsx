import { useAuth } from '@/lib/useAuth'

export function Login() {
  const { signInWithGoogle } = useAuth()

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

        <button
          onClick={signInWithGoogle}
          className="mt-8 flex w-full items-center justify-center gap-3 rounded-2xl bg-ink px-5 py-3.5 font-medium text-bg shadow-soft transition hover:opacity-90"
        >
          <svg width="18" height="18" viewBox="0 0 48 48">
            <path
              fill="#FFC107"
              d="M43.6 20.5h-1.9V20H24v8h11.3c-1.6 4.7-6.1 8-11.3 8-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.9 1.2 8 3.1l5.7-5.7C34.6 6.1 29.6 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.7-.4-3.5z"
            />
            <path
              fill="#FF3D00"
              d="M6.3 14.7l6.6 4.8C14.6 15.9 18.9 13 24 13c3.1 0 5.9 1.2 8 3.1l5.7-5.7C34.6 6.1 29.6 4 24 4c-7.4 0-13.8 4.1-17.1 10.1z"
            />
            <path
              fill="#4CAF50"
              d="M24 44c5.5 0 10.4-2.1 14.1-5.6l-6.5-5.5c-2 1.5-4.6 2.4-7.6 2.4-5.2 0-9.6-3.3-11.3-7.9l-6.6 5.1C9.9 39.6 16.4 44 24 44z"
            />
            <path
              fill="#1976D2"
              d="M43.6 20.5H24v8h11.3c-.8 2.3-2.2 4.2-4.1 5.6l6.5 5.5C41.4 36.6 44 30.8 44 24c0-1.3-.1-2.7-.4-3.5z"
            />
          </svg>
          Continue with Google
        </button>

        <p className="mt-4 text-xs text-muted">
          Sign in, then create your household or join your partner's with an invite code.
        </p>
      </div>
    </div>
  )
}
