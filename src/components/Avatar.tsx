import clsx from 'clsx'
import { AVATAR_PALETTE } from '@/lib/colors'

function hashName(name: string) {
  let hash = 0
  for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash)
  return Math.abs(hash)
}

export function Avatar({
  name,
  src,
  size = 'md',
  className
}: {
  name: string
  src?: string | null
  size?: 'sm' | 'md' | 'lg'
  className?: string
}) {
  const initials = name
    .split(' ')
    .map((p) => p[0])
    .slice(0, 2)
    .join('')
    .toUpperCase()

  const sizeClasses = {
    sm: 'h-6 w-6 text-[10px]',
    md: 'h-9 w-9 text-xs',
    lg: 'h-14 w-14 text-lg'
  }[size]

  if (src) {
    return (
      <img
        src={src}
        alt={name}
        className={clsx('rounded-full object-cover ring-2 ring-surface', sizeClasses, className)}
      />
    )
  }

  const color = AVATAR_PALETTE[hashName(name || 'H') % AVATAR_PALETTE.length]

  return (
    <div
      className={clsx(
        'flex items-center justify-center rounded-full font-semibold text-white ring-2 ring-surface',
        color,
        sizeClasses,
        className
      )}
      title={name}
    >
      {initials || '?'}
    </div>
  )
}
