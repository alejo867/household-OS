import { NavLink, Outlet } from 'react-router-dom'
import { Home, ListChecks, ListTodo, Users, Moon, Sun, LogOut } from 'lucide-react'
import { useAuth } from '@/lib/useAuth'
import { useTheme } from '@/lib/useTheme'
import { Avatar } from './Avatar'
import clsx from 'clsx'

const NAV_ITEMS = [
  { to: '/', label: 'Home', icon: Home, end: true },
  { to: '/tasks', label: 'Tasks', icon: ListChecks, end: false },
  { to: '/todos', label: 'Todos', icon: ListTodo, end: false },
  { to: '/household', label: 'Household', icon: Users, end: false }
]

export function Layout() {
  const { profile, signOut } = useAuth()
  const { theme, toggle } = useTheme()

  return (
    <div className="relative min-h-screen bg-bg">
      <div className="blob-accent -left-24 -top-24 h-72 w-72 bg-moss-300" />
      <div className="blob-accent -right-16 top-40 h-64 w-64 bg-clay-200" />

      <header className="sticky top-0 z-20 border-b border-border bg-bg/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-3xl items-center justify-between px-5 py-4">
          <div className="flex items-center gap-2">
            <span className="text-xl">🌿</span>
            <span className="font-display text-lg font-medium text-ink">Nido</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={toggle}
              className="flex h-9 w-9 items-center justify-center rounded-full text-muted transition hover:bg-surface2 hover:text-ink"
              aria-label="Toggle theme"
            >
              {theme === 'light' ? <Moon size={17} /> : <Sun size={17} />}
            </button>
            <button
              onClick={signOut}
              className="flex h-9 w-9 items-center justify-center rounded-full text-muted transition hover:bg-surface2 hover:text-ink"
              aria-label="Sign out"
            >
              <LogOut size={17} />
            </button>
            <Avatar name={profile?.display_name || 'You'} src={profile?.avatar_url} size="sm" />
          </div>
        </div>
      </header>

      <main className="relative z-10 mx-auto max-w-3xl px-5 pb-28 pt-6">
        <Outlet />
      </main>

      <nav className="fixed inset-x-0 bottom-0 z-30 border-t border-border bg-surface/90 backdrop-blur-md">
        <div className="mx-auto flex max-w-3xl items-center justify-around px-2 py-2">
          {NAV_ITEMS.map(({ to, label, icon: Icon, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) =>
                clsx(
                  'flex flex-col items-center gap-1 rounded-xl px-4 py-1.5 text-xs font-medium transition',
                  isActive ? 'text-moss-600 dark:text-moss-300' : 'text-muted hover:text-ink'
                )
              }
            >
              <Icon size={20} />
              {label}
            </NavLink>
          ))}
        </div>
      </nav>
    </div>
  )
}
