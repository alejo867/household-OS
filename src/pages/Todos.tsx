import { useEffect, useState, useCallback } from 'react'
import clsx from 'clsx'
import { supabase } from '@/lib/supabase'
import { useHousehold } from '@/lib/useHousehold'
import type { Todo } from '@/lib/types'
import { TodoRow } from '@/components/TodoRow'
import { EmptyState } from '@/components/EmptyState'
import { AddTodoModal } from '@/components/AddTodoModal'
import { Fab } from '@/components/Fab'

export function Todos() {
  const { household, members } = useHousehold()
  const [todos, setTodos] = useState<Todo[]>([])
  const [modalOpen, setModalOpen] = useState(false)
  const [filter, setFilter] = useState<'open' | 'done' | 'all'>('open')

  const load = useCallback(async () => {
    if (!household) return
    const { data } = await supabase
      .from('todos')
      .select('*')
      .eq('household_id', household.id)
      .order('created_at', { ascending: false })
    setTodos((data as Todo[]) ?? [])
  }, [household])

  useEffect(() => {
    load()
  }, [load])

  const nameFor = (userId: string | null) => members.find((m) => m.user_id === userId)?.profile?.display_name ?? undefined

  const toggleTodo = async (id: string, done: boolean) => {
    setTodos((prev) => prev.map((t) => (t.id === id ? { ...t, is_done: done } : t)))
    await supabase.from('todos').update({ is_done: done, done_at: done ? new Date().toISOString() : null }).eq('id', id)
  }

  const deleteTodo = async (id: string) => {
    setTodos((prev) => prev.filter((t) => t.id !== id))
    await supabase.from('todos').delete().eq('id', id)
  }

  const createTodo = async (input: { title: string; due_date: string | null; assigned_to: string | null }) => {
    if (!household) return
    await supabase.from('todos').insert({
      household_id: household.id,
      title: input.title,
      due_date: input.due_date,
      assigned_to: input.assigned_to
    })
    load()
  }

  const filtered = todos.filter((t) => (filter === 'all' ? true : filter === 'open' ? !t.is_done : t.is_done))

  return (
    <div>
      <h1 className="font-display text-3xl font-medium text-ink">Todos</h1>
      <p className="mt-1 text-muted">The one-off stuff, for anyone in the house.</p>

      <div className="mt-5 flex gap-2">
        {(['open', 'done', 'all'] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={clsx(
              'rounded-full border px-3.5 py-1.5 text-sm font-medium capitalize transition',
              filter === f ? 'border-moss-500 bg-moss-500/10 text-moss-700 dark:text-moss-300' : 'border-border text-muted'
            )}
          >
            {f}
          </button>
        ))}
      </div>

      <div className="mt-4 space-y-2.5">
        {filtered.length === 0 ? (
          <EmptyState icon="📝" title="Nothing here" subtitle="Add a todo and it'll show up for the whole household." />
        ) : (
          filtered.map((t) => (
            <TodoRow key={t.id} todo={t} assigneeName={nameFor(t.assigned_to)} onToggle={toggleTodo} onDelete={deleteTodo} />
          ))
        )}
      </div>

      <Fab onClick={() => setModalOpen(true)} label="Add todo" />
      <AddTodoModal open={modalOpen} onClose={() => setModalOpen(false)} onCreate={createTodo} members={members} />
    </div>
  )
}
