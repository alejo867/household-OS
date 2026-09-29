import { differenceInCalendarDays, format, isPast, isToday, isTomorrow } from 'date-fns'

export function dueLabel(dateStr: string): { label: string; tone: 'overdue' | 'today' | 'soon' | 'later' } {
  const date = new Date(dateStr)
  const days = differenceInCalendarDays(date, new Date())

  if (isPast(date) && !isToday(date)) {
    const overdueDays = Math.abs(days)
    return { label: `${overdueDays}d overdue`, tone: 'overdue' }
  }
  if (isToday(date)) return { label: 'Due today', tone: 'today' }
  if (isTomorrow(date)) return { label: 'Due tomorrow', tone: 'soon' }
  if (days <= 7) return { label: `Due in ${days}d`, tone: 'soon' }
  return { label: `Due ${format(date, 'MMM d')}`, tone: 'later' }
}

export function formatDate(dateStr: string) {
  return format(new Date(dateStr), 'MMM d, yyyy')
}

export const TONE_STYLES: Record<'overdue' | 'today' | 'soon' | 'later', string> = {
  overdue: 'bg-clay-500/10 text-clay-600 dark:bg-clay-500/15 dark:text-clay-300',
  today: 'bg-sun-500/10 text-sun-700 dark:bg-sun-500/15 dark:text-sun-300',
  soon: 'bg-sky-500/10 text-sky-700 dark:bg-sky-500/15 dark:text-sky-300',
  later: 'bg-surface2 text-muted'
}
