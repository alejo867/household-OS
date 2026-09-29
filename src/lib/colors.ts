import type { CategoryColor } from './types'

// Static, fully-written Tailwind class strings so the JIT compiler can see them.
export const CATEGORY_STYLES: Record<
  CategoryColor,
  { icon: string; chipActive: string; chipHover: string; dot: string }
> = {
  sky: {
    icon: 'bg-sky-100 text-sky-700 dark:bg-sky-500/15 dark:text-sky-300',
    chipActive: 'border-sky-500 bg-sky-500/10 text-sky-700 dark:text-sky-300',
    chipHover: 'hover:border-sky-300',
    dot: 'bg-sky-500'
  },
  berry: {
    icon: 'bg-berry-100 text-berry-700 dark:bg-berry-500/15 dark:text-berry-300',
    chipActive: 'border-berry-500 bg-berry-500/10 text-berry-700 dark:text-berry-300',
    chipHover: 'hover:border-berry-300',
    dot: 'bg-berry-500'
  },
  sun: {
    icon: 'bg-sun-100 text-sun-700 dark:bg-sun-500/15 dark:text-sun-300',
    chipActive: 'border-sun-500 bg-sun-500/10 text-sun-700 dark:text-sun-300',
    chipHover: 'hover:border-sun-300',
    dot: 'bg-sun-500'
  },
  moss: {
    icon: 'bg-moss-100 text-moss-700 dark:bg-moss-500/15 dark:text-moss-300',
    chipActive: 'border-moss-500 bg-moss-500/10 text-moss-700 dark:text-moss-300',
    chipHover: 'hover:border-moss-300',
    dot: 'bg-moss-500'
  },
  clay: {
    icon: 'bg-clay-100 text-clay-700 dark:bg-clay-500/15 dark:text-clay-300',
    chipActive: 'border-clay-500 bg-clay-500/10 text-clay-700 dark:text-clay-300',
    chipHover: 'hover:border-clay-300',
    dot: 'bg-clay-500'
  }
}

export const AVATAR_PALETTE = [
  'bg-sky-500',
  'bg-berry-500',
  'bg-sun-600',
  'bg-moss-500',
  'bg-clay-500',
  'bg-sky-700',
  'bg-berry-700',
  'bg-moss-700'
]
