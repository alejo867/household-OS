export type Profile = {
  id: string
  email: string | null
  display_name: string | null
  avatar_url: string | null
}

export type Household = {
  id: string
  name: string
  created_by: string | null
  created_at: string
}

export type HouseholdMember = {
  household_id: string
  user_id: string
  role: 'owner' | 'member'
  joined_at: string
  profile?: Profile
}

export type RecurringTask = {
  id: string
  household_id: string
  title: string
  category: string
  icon: string
  interval_days: number
  last_completed_at: string | null
  next_due_at: string
  assigned_to: string | null
  notes: string | null
  is_archived: boolean
  created_by: string | null
  created_at: string
}

export type Todo = {
  id: string
  household_id: string
  title: string
  notes: string | null
  due_date: string | null
  assigned_to: string | null
  is_done: boolean
  done_at: string | null
  created_by: string | null
  created_at: string
}

export const TASK_CATEGORIES = [
  { id: 'filters', label: 'Filters', icon: '💧' },
  { id: 'laundry', label: 'Laundry', icon: '🧺' },
  { id: 'tank', label: 'Fish Tank', icon: '🐠' },
  { id: 'plants', label: 'Plants', icon: '🌿' },
  { id: 'cleaning', label: 'Cleaning', icon: '🧹' },
  { id: 'kitchen', label: 'Kitchen', icon: '🍳' },
  { id: 'car', label: 'Vehicle', icon: '🚗' },
  { id: 'general', label: 'General', icon: '🏡' }
] as const
