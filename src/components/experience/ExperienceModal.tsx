import { useEffect } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { X } from 'lucide-react'
import type { ExperienceItem } from '@/data/experience'
import { EASE } from '@/lib/constants'

/** Expanded career profile shown when a badge is tapped. */
export function ExperienceModal({
  item,
  onClose,
}: {
  item: ExperienceItem | null
  onClose: () => void
}) {
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
          aria-label={`${item.company} career details`}
        >
          <motion.div className="absolute inset-0 bg-ink-950/80 backdrop-blur-md" onClick={onClose} />
          <motion.div
            className="pointer-events-none absolute left-1/2 top-1/2 h-[60vmin] w-[60vmin] -translate-x-1/2 -translate-y-1/2 rounded-full blur-3xl"
            style={{ background: `radial-gradient(circle, ${item.accent}55, transparent 70%)` }}
            initial={{ scale: 0.2, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.2, opacity: 0 }}
            transition={{ duration: 0.6, ease: EASE }}
          />

          <motion.div
            className="relative max-h-[85vh] w-full max-w-2xl overflow-y-auto overflow-x-hidden rounded-3xl border border-white/10 bg-ink-800/95 p-7 backdrop-blur-2xl sm:p-10"
            initial={{ scale: 0.9, y: 30, opacity: 0, rotateX: 10 }}
            animate={{ scale: 1, y: 0, opacity: 1, rotateX: 0 }}
            exit={{ scale: 0.9, y: 30, opacity: 0 }}
            transition={{ duration: 0.5, ease: EASE }}
            style={{ perspective: 1000 }}
          >
            <div
              className="pointer-events-none absolute inset-x-0 top-0 h-px"
              style={{ background: `linear-gradient(90deg, transparent, ${item.accent}, transparent)` }}
            />
            <button
              type="button"
              onClick={onClose}
              aria-label="Close"
              className="absolute right-5 top-5 flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-ink-900/60 text-bone-300 transition-colors hover:bg-white/10 hover:text-white"
            >
              <X size={16} />
            </button>

            <div className="flex items-center gap-4">
              <div
                className="flex h-14 w-14 items-center justify-center rounded-2xl border border-white/10 p-2.5"
                style={{ background: item.logoBg }}
              >
                <img src={item.logo} alt={`${item.company} logo`} className="h-full w-full object-contain" />
              </div>
              <div>
                <h3 className="font-display text-2xl font-semibold text-bone-100">{item.company}</h3>
                <p className="text-sm font-medium" style={{ color: item.accent }}>
                  {item.role}
                </p>
              </div>
            </div>

            <div className="mt-5 flex flex-wrap gap-x-6 gap-y-1 text-sm text-bone-400">
              <span className="tabular-nums">{item.period}</span>
              <span>{item.location}</span>
            </div>

            <p className="mt-5 text-base leading-relaxed text-bone-200">{item.summary}</p>

            <ul className="mt-5 space-y-2">
              {item.highlights.map((h) => (
                <li key={h} className="flex gap-3 text-sm text-bone-300">
                  <span className="mt-2 h-1 w-1 flex-none rounded-full" style={{ background: item.accent }} />
                  {h}
                </li>
              ))}
            </ul>

            <div className="mt-6 flex flex-wrap gap-2">
              {item.technologies.map((t) => (
                <span
                  key={t}
                  className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-bone-200"
                >
                  {t}
                </span>
              ))}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
