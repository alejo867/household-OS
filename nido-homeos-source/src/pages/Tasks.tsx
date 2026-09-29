import { useEffect, useState, useCallback } from 'react'
import { supabase } from '@/lib/supabase'
import { useHousehold } from '@/lib/useHousehold'
import type { RecurringTask } from '@/lib/types'
import { TaskCard } from '@/components/TaskCard'
import { EmptyState } from '@/components/EmptyState'
import { AddTaskModal } from '@/components/AddTaskModal'
import { Fab } from '@/components/Fab'

export function Tasks() {
  const { household, members } = useHousehold()
  const [tasks, setTasks] = useState<RecurringTask[]>([])
  const [modalOpen, setModalOpen] = useState(false)

  const load = useCallback(async () => {
    if (!household) return
    const { data } = await supabase
      .from('recurring_tasks')
      .select('*')
      .eq('household_id', household.id)
      .eq('is_archived', false)
      .order('next_due_at', { ascending: true })
    setTasks((data as RecurringTask[]) ?? [])
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

  return (
    <div>
      <h1 className="font-display text-3xl font-medium text-ink">Recurring tasks</h1>
      <p className="mt-1 text-muted">Filters, laundry, the tank — everything on a schedule.</p>

      <div className="mt-6 space-y-2.5">
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

      <Fab onClick={() => setModalOpen(true)} label="Add task" />
      <AddTaskModal open={modalOpen} onClose={() => setModalOpen(false)} onCreate={createTask} members={members} />
    </div>
  )
}
