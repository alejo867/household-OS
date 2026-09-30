import { useEffect, useState, useCallback } from 'react'
import clsx from 'clsx'
import { supabase } from '@/lib/supabase'
import { useHousehold } from '@/lib/useHousehold'
import type { RecurringTask, PantryItem } from '@/lib/types'
import { TaskCard } from '@/components/TaskCard'
import { PantryRow } from '@/components/PantryRow'
import { EmptyState } from '@/components/EmptyState'
import { AddTaskModal } from '@/components/AddTaskModal'
import { AddPantryModal } from '@/components/AddPantryModal'
import { Fab } from '@/components/Fab'

export function Tasks() {
  const { household, members } = useHousehold()
  const [tab, setTab] = useState<'chores' | 'pantry'>('chores')
  const [tasks, setTasks] = useState<RecurringTask[]>([])
  const [pantry, setPantry] = useState<PantryItem[]>([])
  const [modalOpen, setModalOpen] = useState(false)

  const load = useCallback(async () => {
    if (!household) return
    const [{ data: taskRows }, { data: pantryRows }] = await Promise.all([
      supabase
        .from('recurring_tasks')
        .select('*')
        .eq('household_id', household.id)
        .eq('is_archived', false)
        .order('next_due_at', { ascending: true }),
      supabase.from('pantry_items').select('*').eq('household_id', household.id).order('expires_on', { ascending: true })
    ])
    setTasks((taskRows as RecurringTask[]) ?? [])
    setPantry((pantryRows as PantryItem[]) ?? [])
  }, [household])

  useEffect(() => {
    load()
  }, [load])

  const nameFor = (userId: string | null) => members.find((m) => m.user_id === userId)?.profile?.display_name ?? undefined

  const completeTask = async (id: string) => {
    await supabase.rpc('complete_recurring_task', { p_task_id: id })
    load()
  }

  const deleteTask = async (id: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== id))
    await supabase.from('recurring_tasks').delete().eq('id', id)
  }

  const createTask = async (input: {
    title: string
    category: string
    icon: string
    interval_days: number
    assigned_to: string | null
  }) => {
    if (!household) return
    await supabase.from('recurring_tasks').insert({
      household_id: household.id,
      title: input.title,
      category: input.category,
      icon: input.icon,
      interval_days: input.interval_days,
      assigned_to: input.assigned_to,
      next_due_at: new Date().toISOString()
    })
    load()
  }

  const deletePantryItem = async (id: string) => {
    setPantry((prev) => prev.filter((p) => p.id !== id))
    await supabase.from('pantry_items').delete().eq('id', id)
  }

  const createPantryItem = async (input: { name: string; icon: string; expires_on: string }) => {
    if (!household) return
    await supabase.from('pantry_items').insert({
      household_id: household.id,
      name: input.name,
      icon: input.icon,
      expires_on: input.expires_on
    })
    load()
  }

  return (
    <div>
      <h1 className="font-display text-3xl font-medium text-ink">Recurring</h1>
      <p className="mt-1 text-muted">Filters, the tank, cleaning schedules — and what's about to expire.</p>

      <div role="tablist" className="mt-5 inline-flex rounded-full bg-surface2 p-1">
        <button
          role="tab"
          aria-selected={tab === 'chores'}
          onClick={() => setTab('chores')}
          className={clsx(
            'rounded-full px-4 py-1.5 text-sm font-medium transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring',
            tab === 'chores' ? 'bg-surface text-ink shadow-softer' : 'text-muted'
          )}
        >
          🔁 Chores
        </button>
        <button
          role="tab"
          aria-selected={tab === 'pantry'}
          onClick={() => setTab('pantry')}
          className={clsx(
            'rounded-full px-4 py-1.5 text-sm font-medium transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring',
            tab === 'pantry' ? 'bg-surface text-ink shadow-softer' : 'text-muted'
          )}
        >
          🥛 Pantry
        </button>
      </div>

      {tab === 'chores' ? (
        <div className="mt-5 space-y-2.5">
          {tasks.length === 0 ? (
            <EmptyState
              icon="🔁"
              title="No recurring tasks yet"
              subtitle="Add the things you do again and again — change the filter, do laundry, top off the tank."
            />
          ) : (
            tasks.map((t) => (
              <TaskCard key={t.id} task={t} assigneeName={nameFor(t.assigned_to)} onComplete={completeTask} onDelete={deleteTask} />
            ))
          )}
        </div>
      ) : (
        <div className="mt-5 space-y-2.5">
          {pantry.length === 0 ? (
            <EmptyState
              icon="🥛"
              title="Nothing tracked yet"
              subtitle="Add perishables with an expiration date and they'll show up here color-coded as they get close."
            />
          ) : (
            pantry.map((p) => <PantryRow key={p.id} item={p} onDelete={deletePantryItem} />)
          )}
        </div>
      )}

      <Fab onClick={() => setModalOpen(true)} label={tab === 'chores' ? 'Add task' : 'Add pantry item'} />
      <AddTaskModal open={tab === 'chores' && modalOpen} onClose={() => setModalOpen(false)} onCreate={createTask} members={members} />
      <AddPantryModal open={tab === 'pantry' && modalOpen} onClose={() => setModalOpen(false)} onCreate={createPantryItem} />
    </div>
  )
}
