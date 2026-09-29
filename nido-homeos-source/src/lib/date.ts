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
