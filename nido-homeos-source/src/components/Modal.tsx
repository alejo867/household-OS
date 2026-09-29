import { ReactNode } from 'react'
import { X } from 'lucide-react'

export function Modal({
  open,
  onClose,
  title,
  children
}: {
  open: boolean
  onClose: () => void
  title: string
  children: ReactNode
}) {
  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center">
      <div className="absolute inset-0 bg-ink/30 backdrop-blur-sm animate-pop" onClick={onClose} />
      <div className="relative z-10 w-full max-w-md animate-pop rounded-t-3xl sm:rounded-3xl bg-surface p-6 shadow-soft max-h-[85vh] overflow-y-auto">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-display text-xl font-medium text-ink">{title}</h2>
          <button
            onClick={onClose}
            className="rounded-full p-1.5 text-muted transition hover:bg-surface2 hover:text-ink"
            aria-label="Close"
          >
            <X size={18} />
          </button>
        </div>
        {children}
      </div>
    </div>
  )
}
