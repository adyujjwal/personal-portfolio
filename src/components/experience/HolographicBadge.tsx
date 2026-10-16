import { useRef, useState } from 'react'
import { motion } from 'framer-motion'
import type { ExperienceItem } from '@/data/experience'
import { useIsTouch } from '@/hooks/useMediaQuery'
import { useReducedMotion } from '@/hooks/useReducedMotion'

interface HolographicBadgeProps {
  item: ExperienceItem
  index: number
  onOpen: () => void
}

/**
 * A hanging employee ID badge: a lanyard + clip above a dark glass card that
 * leads with a large brand logo, then company name, job title and years.
 * Keeps the pointer-driven 3D tilt, hover glow and a glassy light sweep.
 */
export function HolographicBadge({ item, index, onOpen }: HolographicBadgeProps) {
  const ref = useRef<HTMLButtonElement>(null)
  const [tilt, setTilt] = useState({ rx: 0, ry: 0, gx: 50, gy: 50 })
  const isTouch = useIsTouch()
  const reduced = useReducedMotion()
  const interactive = !isTouch && !reduced

  const onMove = (e: React.MouseEvent) => {
    if (!interactive || !ref.current) return
    const r = ref.current.getBoundingClientRect()
    const px = (e.clientX - r.left) / r.width
    const py = (e.clientY - r.top) / r.height
    setTilt({ ry: (px - 0.5) * 14, rx: -(py - 0.5) * 14, gx: px * 100, gy: py * 100 })
  }
  const reset = () => setTilt({ rx: 0, ry: 0, gx: 50, gy: 50 })

  return (
    <motion.div
      initial={{ opacity: 0, y: 60, rotateX: -12 }}
      whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.9, delay: index * 0.12, ease: [0.16, 1, 0.3, 1] }}
      style={{ perspective: 1200 }}
      className="flex w-full flex-col items-center"
    >
      <button
        ref={ref}
        type="button"
        onMouseMove={onMove}
        onMouseLeave={reset}
        onClick={onOpen}
        data-cursor="view"
        aria-label={`Open ${item.company} career details`}
        className="group relative block w-full max-w-[320px] text-left outline-none"
        style={{
          transform: `rotateX(${tilt.rx}deg) rotateY(${tilt.ry}deg)`,
          transformStyle: 'preserve-3d',
          transition: interactive ? 'transform 0.15s ease-out' : undefined,
        }}
      >
        {/* ── Lanyard ─────────────────────────────────────────── */}
        <div className="relative mx-auto h-[70px] w-[150px]" style={{ transform: 'translateZ(10px)' }}>
          <svg viewBox="0 0 150 72" className="h-full w-full" aria-hidden>
            <defs>
              <linearGradient id={`lan-${item.id}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0" stopColor={item.accent} />
                <stop offset="1" stopColor={item.accent} stopOpacity="0.75" />
              </linearGradient>
            </defs>
            <path d="M2 0 H24 L84 60 H62 Z" fill={`url(#lan-${item.id})`} />
            <path d="M148 0 H126 L66 60 H88 Z" fill={`url(#lan-${item.id})`} />
            <path d="M2 0 H10 L70 60 H62 Z" fill="#000" opacity="0.12" />
            <path d="M148 0 H140 L80 60 H88 Z" fill="#fff" opacity="0.12" />
          </svg>
          <div className="absolute bottom-0 left-1/2 h-6 w-7 -translate-x-1/2 translate-y-1 rounded-md bg-gradient-to-b from-zinc-300 to-zinc-500 shadow-md">
            <div className="absolute left-1/2 top-1.5 h-1 w-3.5 -translate-x-1/2 rounded-full bg-zinc-700/70" />
          </div>
        </div>

        {/* ── Card ────────────────────────────────────────────── */}
        <div
          className="relative mx-auto flex aspect-[2/3] w-full flex-col overflow-hidden rounded-[22px] border border-white/10 bg-gradient-to-b from-ink-700/90 to-ink-900/95 backdrop-blur-xl"
          style={{
            transform: 'translateZ(0)',
            boxShadow: '0 30px 70px -25px rgba(0,0,0,0.8), inset 0 1px 0 rgba(255,255,255,0.08)',
          }}
        >
          {/* hover color glow */}
          <div
            className="pointer-events-none absolute -inset-6 -z-10 opacity-0 blur-2xl transition-opacity duration-500 group-hover:opacity-70"
            style={{ background: `radial-gradient(circle at 50% 25%, ${item.accent}, transparent 70%)` }}
          />
          {/* top accent line */}
          <div
            className="pointer-events-none absolute inset-x-0 top-0 h-px"
            style={{ background: `linear-gradient(90deg, transparent, ${item.accent}, transparent)` }}
          />
          {/* lanyard slot */}
          <div className="absolute left-1/2 top-3 h-2 w-12 -translate-x-1/2 rounded-full bg-black/40 ring-1 ring-white/10" />

          {/* content */}
          <div className="relative flex h-full flex-col items-center px-6 pb-7 pt-9">
            {/* BIG brand logo */}
            <div
              className="flex h-[46%] w-full items-center justify-center rounded-2xl p-5 shadow-lg ring-1 ring-black/5"
              style={{ background: item.logoBg }}
            >
              <img
                src={item.logo}
                alt={`${item.company} logo`}
                className="max-h-full max-w-full object-contain drop-shadow-sm"
                style={{ transform: `scale(${item.logoScale ?? 1})`, transformOrigin: 'center center' }}
                loading="lazy"
                decoding="async"
              />
            </div>

            {/* company name */}
            <h3 className="mt-6 text-center font-display text-xl font-semibold leading-tight text-bone-100">
              {item.company}
            </h3>
            {/* job title */}
            <p className="mt-1.5 text-center text-base font-semibold leading-snug" style={{ color: item.accent }}>
              {item.role}
            </p>

            {/* years */}
            <div className="mt-auto flex w-full items-center justify-center pt-5">
              <span className="rounded-full border border-white/10 bg-white/5 px-4 py-1.5 font-display text-base tabular-nums tracking-wide text-bone-200">
                {item.period}
              </span>
            </div>
          </div>

          {/* bottom accent bar */}
          <div
            className="absolute inset-x-0 bottom-0 h-1.5"
            style={{ background: item.accent, opacity: 0.8 }}
          />

          {/* glassy light sweep on hover */}
          {!reduced && (
            <div
              className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
              style={{
                background: `linear-gradient(105deg, transparent 35%, rgba(255,255,255,0.14) ${tilt.gx / 2 + 25}%, transparent 65%)`,
              }}
            />
          )}
        </div>

        {/* enter hint */}
        <p className="mt-4 text-center font-display text-[0.6rem] uppercase tracking-[0.25em] text-bone-400 transition-colors group-hover:text-bone-100">
          Tap to enter →
        </p>
      </button>
    </motion.div>
  )
}
