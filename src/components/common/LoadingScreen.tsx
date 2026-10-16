import { AnimatePresence, motion } from 'framer-motion'
import { profile } from '@/data/profile'
import { EASE } from '@/lib/constants'

interface LoadingScreenProps {
  progress: number // 0..100
  done: boolean
}

export function LoadingScreen({ progress, done }: LoadingScreenProps) {
  return (
    <AnimatePresence>
      {!done && (
        <motion.div
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-ink-950"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8, ease: EASE }}
          aria-live="polite"
          aria-busy="true"
        >
          <div className="aurora pointer-events-none absolute inset-0 opacity-40" />
          <div className="relative flex flex-col items-center gap-6">
            <motion.h1
              className="flex font-display text-5xl font-bold tracking-tight text-bone-100 sm:text-6xl"
              initial="hidden"
              animate="show"
              aria-label={profile.firstName}
            >
              {profile.firstName.toUpperCase().split('').map((ch, i) => (
                <motion.span
                  key={i}
                  className="inline-block"
                  variants={{
                    hidden: { opacity: 0, y: 40, rotateX: -90, filter: 'blur(8px)' },
                    show: {
                      opacity: 1,
                      y: 0,
                      rotateX: 0,
                      filter: 'blur(0px)',
                      transition: { duration: 0.7, delay: 0.1 + i * 0.09, ease: EASE },
                    },
                  }}
                  style={{ transformOrigin: 'bottom', color: i === 0 ? '#5de4c7' : undefined }}
                >
                  {ch}
                </motion.span>
              ))}
            </motion.h1>
            <motion.span
              className="font-display text-[0.65rem] uppercase tracking-[0.5em] text-bone-400"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.6 }}
            >
              Initializing Experience
            </motion.span>

            <div className="mt-2 h-px w-56 overflow-hidden bg-white/10">
              <motion.div
                className="h-full bg-accent"
                initial={{ width: 0 }}
                animate={{ width: `${Math.min(100, progress)}%` }}
                transition={{ ease: 'linear', duration: 0.3 }}
              />
            </div>
            <span className="font-display text-xs tabular-nums tracking-widest text-bone-400">
              {Math.round(Math.min(100, progress))}%
            </span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
