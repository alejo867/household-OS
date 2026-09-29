import { Plus } from 'lucide-react'

export function Fab({ onClick, label }: { onClick: () => void; label: string }) {
  return (
    <button
      onClick={onClick}
      className="fixed bottom-24 right-5 z-30 flex h-14 w-14 items-center justify-center rounded-full bg-moss-500 text-white shadow-soft transition hover:bg-moss-600 active:scale-95 sm:bottom-8"
      aria-label={label}
    >
      <Plus size={26} />
    </button>
  )
}
