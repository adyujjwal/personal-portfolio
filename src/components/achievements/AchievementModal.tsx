import { useEffect } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { X } from 'lucide-react'
import type { Achievement } from '@/data/achievements'
import { EASE } from '@/lib/constants'

interface AchievementModalProps {
  item: Achievement | null
  onClose: () => void
}

export function AchievementModal({ item, onClose }: AchievementModalProps) {
  useEffect(() => {
    if (!item) return
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [item, onClose])

  return (
    <AnimatePresence>
      {item && (
        <motion.div
          className="fixed inset-0 z-[80] flex items-center justify-center p-4 sm:p-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          role="dialog"
          aria-modal="true"
          aria-label={item.title}
        >
          <div className="absolute inset-0 bg-ink-950/85 backdrop-blur-md" onClick={onClose} />

          <motion.div
            className="relative grid max-h-[88vh] w-full max-w-4xl grid-cols-1 overflow-y-auto overflow-x-hidden rounded-3xl border border-white/10 bg-ink-800/95 md:grid-cols-2"
            initial={{ scale: 0.92, y: 30, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.92, y: 30, opacity: 0 }}
            transition={{ duration: 0.5, ease: EASE }}
          >
            <button
              type="button"
              onClick={onClose}
              aria-label="Close"
              className="absolute right-4 top-4 z-10 flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-black/40 text-bone-100 transition-colors hover:bg-white/10"
            >
              <X size={16} />
            </button>

            <div className="relative aspect-[4/3] md:aspect-auto">
              <img src={item.image} alt={item.title} className="h-full w-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-ink-800/60 to-transparent md:bg-gradient-to-r" />
            </div>

            <div className="flex flex-col justify-center gap-4 p-7 sm:p-10">
              <div className="flex items-center gap-2 text-[0.65rem] font-medium uppercase tracking-[0.2em]" style={{ color: item.accent }}>
                <span>{item.organization}</span>
                <span className="text-bone-400">·</span>
                <span className="text-bone-400">{item.year}</span>
              </div>
              <h3 className="font-display text-2xl font-semibold leading-tight text-bone-100 sm:text-3xl">
                {item.title}
              </h3>
              <p className="text-base leading-relaxed text-bone-300">{item.description}</p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
