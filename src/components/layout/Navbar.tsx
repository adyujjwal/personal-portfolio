import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Menu, X } from 'lucide-react'
import { profile } from '@/data/profile'
import { SECTIONS } from '@/lib/constants'
import { useScrollProgress, useActiveSection } from '@/hooks/useScrollProgress'
import { scrollToSection, cn } from '@/lib/utils'
import { EASE } from '@/lib/constants'

const ids = SECTIONS.map((s) => s.id)

export function Navbar() {
  const [open, setOpen] = useState(false)
  const progress = useScrollProgress()
  const active = useActiveSection(ids)
  const scrolled = progress > 0.01

  const go = (id: string) => {
    setOpen(false)
    scrollToSection(id)
  }

  return (
    <>
      <motion.header
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.2, ease: EASE }}
        className="fixed inset-x-0 top-0 z-50 flex justify-center px-4 pt-4"
      >
        <nav
          className={cn(
            'relative flex w-full max-w-content items-center justify-between rounded-full border px-5 py-2.5 transition-all duration-500',
            scrolled
              ? 'border-white/10 bg-ink-900/70 backdrop-blur-xl'
              : 'border-transparent bg-transparent',
          )}
        >
          <button
            type="button"
            onClick={() => go('hero')}
            data-cursor="interactive"
            className="font-display text-sm font-bold tracking-[0.2em] text-bone-100"
            aria-label="Back to top"
          >
            {profile.firstName.toUpperCase()}
          </button>

          {/* desktop links */}
          <ul className="hidden items-center gap-1 md:flex md:absolute md:left-1/2 md:-translate-x-1/2">
            {SECTIONS.map((s) => (
              <li key={s.id}>
                <button
                  type="button"
                  onClick={() => go(s.id)}
                  data-cursor="interactive"
                  className={cn(
                    'relative rounded-full px-3.5 py-1.5 text-sm transition-colors',
                    active === s.id ? 'text-bone-100' : 'text-bone-400 hover:text-bone-200',
                  )}
                >
                  {active === s.id && (
                    <motion.span
                      layoutId="nav-active"
                      className="absolute inset-0 rounded-full bg-white/10"
                      transition={{ duration: 0.4, ease: EASE }}
                    />
                  )}
                  <span className="relative">{s.label}</span>
                </button>
              </li>
            ))}
          </ul>

          {/* mobile toggle */}
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-label={open ? 'Close menu' : 'Open menu'}
            aria-expanded={open}
            className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 text-bone-100 md:hidden"
          >
            {open ? <X size={18} /> : <Menu size={18} />}
          </button>
        </nav>
      </motion.header>

      {/* mobile overlay menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 flex flex-col justify-center bg-ink-950/95 px-8 backdrop-blur-xl md:hidden"
          >
            <ul className="flex flex-col gap-2">
              {SECTIONS.map((s, i) => (
                <motion.li
                  key={s.id}
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.05 * i + 0.1, ease: EASE }}
                >
                  <button
                    type="button"
                    onClick={() => go(s.id)}
                    className={cn(
                      'font-display text-4xl font-semibold tracking-tight transition-colors',
                      active === s.id ? 'text-bone-100' : 'text-bone-400',
                    )}
                  >
                    {s.label}
                  </button>
                </motion.li>
              ))}
            </ul>
            <motion.a
              href={profile.links.topmate}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, ease: EASE }}
              className="mt-10 inline-flex w-fit rounded-full bg-bone-100 px-6 py-3 text-sm font-medium text-ink-950"
            >
              Book a 1:1
            </motion.a>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
