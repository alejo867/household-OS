import { useEffect, useState, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/lib/useAuth'
import { useHousehold } from '@/lib/useHousehold'
import type { RecurringTask, Todo, PantryItem } from '@/lib/types'
import { TaskCard } from '@/components/TaskCard'
import { TodoRow } from '@/components/TodoRow'
import { PantryRow } from '@/components/PantryRow'
import { EmptyState } from '@/components/EmptyState'
import { Avatar } from '@/components/Avatar'
import { AlertTriangle, Sparkles, Refrigerator } from 'lucide-react'

function greeting() {
  const h = new Date().getHours()
  if (h < 5) return 'Still up'
  if (h < 12) return 'Good morning'
  if (h < 18) return 'Good afternoon'
  return 'Good evening'
}

export function Dashboard() {
  const { profile } = useAuth()
  const { household, members } = useHousehold()
  const [tasks, setTasks] = useState<RecurringTask[]>([])
  const [todos, setTodos] = useState<Todo[]>([])
  const [pantry, setPantry] = useState<PantryItem[]>([])
  const [loading, setLoading] = useState(true)

  const load = useCallback(async () => {
    if (!household) return
    setLoading(true)
    const [{ data: t }, { data: d }, { data: p }] = await Promise.all([
      supabase
        .from('recurring_tasks')
        .select('*')
        .eq('household_id', household.id)
        .eq('is_archived', false)
        .order('next_due_at', { ascending: true }),
      supabase
        .from('todos')
        .select('*')
        .eq('household_id', household.id)
        .eq('is_done', false)
        .order('due_date', { ascending: true, nullsFirst: false }),
      supabase.from('pantry_items').select('*').eq('household_id', household.id).order('expires_on', { ascending: true })
    ])
    setTasks((t as RecurringTask[]) ?? [])
    setTodos((d as Todo[]) ?? [])
    setPantry((p as PantryItem[]) ?? [])
    setLoading(false)
  }, [household])

  useEffect(() => {
    load()
  }, [load])

  const nameFor = (userId: string | null) => members.find((m) => m.user_id === userId)?.profile?.display_name ?? undefined

  const now = new Date()
  const overdue = tasks.filter((t) => new Date(t.next_due_at) < now)
  const dueSoon = tasks.filter((t) => {
    const days = (new Date(t.next_due_at).getTime() - now.getTime()) / 86400000
    return days >= 0 && days <= 7
  })
  const needsAttention = [...overdue, ...dueSoon].slice(0, 3)
  const todaysTodos = todos.slice(0, 5)
  const expiringPantry = pantry
    .filter((p) => (new Date(p.expires_on).getTime() - now.getTime()) / 86400000 <= 3)
    .slice(0, 3)

  const completeTask = async (id: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== id))
    await supabase.rpc('complete_recurring_task', { p_task_id: id })
    load()
  }

  const deleteTask = async (id: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== id))
    await supabase.from('recurring_tasks').delete().eq('id', id)
  }

  const toggleTodo = async (id: string, done: boolean) => {
    setTodos((prev) => prev.filter((t) => t.id !== id))
    await supabase.from('todos').update({ is_done: done, done_at: done ? new Date().toISOString() : null }).eq('id', id)
  }

  const deleteTodo = async (id: string) => {
    setTodos((prev) => prev.filter((t) => t.id !== id))
    await supabase.from('todos').delete().eq('id', id)
  }

  const deletePantryItem = async (id: string) => {
    setPantry((prev) => prev.filter((p) => p.id !== id))
    await supabase.from('pantry_items').delete().eq('id', id)
  }

  const firstName = (profile?.display_name || '').split(' ')[0]

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-3xl font-medium text-ink">
          {greeting()}{firstName ? `, ${firstName}` : ''}
        </h1>
        <p className="mt-1 text-muted">Here's what {household?.name ?? 'your home'} needs from you.</p>
      </div>

      <div className="flex items-center gap-2 overflow-x-auto scrollbar-none pb-1">
        {members.map((m) => (
          <div key={m.user_id} className="flex shrink-0 items-center gap-2 rounded-full bg-surface px-3 py-1.5 shadow-softer">
            <Avatar name={m.profile?.display_name ?? 'Member'} src={m.profile?.avatar_url} size="sm" />
            <span className="text-sm text-ink">{m.profile?.display_name ?? 'Member'}</span>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-3 gap-3">
        <div className="rounded-2xl bg-surface p-4 text-center shadow-softer">
          <p className="font-display text-2xl text-clay-600">{overdue.length}</p>
          <p className="text-xs text-muted">Overdue</p>
        </div>
        <div className="rounded-2xl bg-surface p-4 text-center shadow-softer">
          <p className="font-display text-2xl text-moss-600">{dueSoon.length}</p>
          <p className="text-xs text-muted">Due this week</p>
        </div>
        <div className="rounded-2xl bg-surface p-4 text-center shadow-softer">
          <p className="font-display text-2xl text-ink">{todos.length}</p>
          <p className="text-xs text-muted">Open todos</p>
        </div>
      </div>

      <section>
        <div className="mb-3 flex items-center gap-2">
          <Sparkles size={16} className="text-moss-500" />
          <h2 className="font-medium text-ink">Todos</h2>
        </div>
        {!loading && todaysTodos.length === 0 && (
          <EmptyState icon="📝" title="No open todos" subtitle="Add one from the Todos tab whenever something comes up." />
        )}
        <div className="space-y-2.5">
          {todaysTodos.map((t) => (
            <TodoRow key={t.id} todo={t} assigneeName={nameFor(t.assigned_to)} onToggle={toggleTodo} onDelete={deleteTodo} />
          ))}
        </div>
        {todos.length > 0 && (
          <Link to="/todos" className="mt-3 inline-block text-sm font-medium text-moss-600 hover:underline">
            View all todos →
          </Link>
        )}
      </section>

      <section>
        <div className="mb-3 flex items-center gap-2">
          <AlertTriangle size={16} className="text-clay-500" />
          <h2 className="font-medium text-ink">Needs attention</h2>
        </div>
        {!loading && needsAttention.length === 0 && (
          <EmptyState icon="✨" title="All caught up" subtitle="Nothing's due around the house right now." />
        )}
        <div className="space-y-2">
          {needsAttention.map((t) => (
            <TaskCard key={t.id} task={t} assigneeName={nameFor(t.assigned_to)} onComplete={completeTask} onDelete={deleteTask} compact />
          ))}
        </div>
        {tasks.length > 0 && (
          <Link to="/tasks" className="mt-3 inline-block text-sm font-medium text-moss-600 hover:underline">
            View all tasks →
          </Link>
        )}
      </section>

      {expiringPantry.length > 0 && (
        <section>
          <div className="mb-3 flex items-center gap-2">
            <Refrigerator size={16} className="text-sky-500" />
            <h2 className="font-medium text-ink">Expiring soon</h2>
          </div>
          <div className="space-y-2.5">
            {expiringPantry.map((p) => (
              <PantryRow key={p.id} item={p} onDelete={deletePantryItem} />
            ))}
          </div>
          <Link to="/tasks" className="mt-3 inline-block text-sm font-medium text-moss-600 hover:underline">
            View pantry →
          </Link>
        </section>
      )}
    </div>
  )
}
