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
  calendar_token?: string | null
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
  { id: 'filters', label: 'Filters', icon: '💧', color: 'sky' },
  { id: 'laundry', label: 'Laundry', icon: '🧺', color: 'berry' },
  { id: 'tank', label: 'Fish Tank', icon: '🐠', color: 'sky' },
  { id: 'plants', label: 'Plants', icon: '🌿', color: 'moss' },
  { id: 'cleaning', label: 'Cleaning', icon: '🧹', color: 'berry' },
  { id: 'kitchen', label: 'Kitchen', icon: '🍳', color: 'sun' },
  { id: 'car', label: 'Vehicle', icon: '🚗', color: 'clay' },
  { id: 'general', label: 'General', icon: '🏡', color: 'moss' }
] as const

export type CategoryColor = (typeof TASK_CATEGORIES)[number]['color']
