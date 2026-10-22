import { useRef, useState } from 'react'
import { motion } from 'framer-motion'
import type { ExperienceItem } from '@/data/experience'
import { useIsTouch } from '@/hooks/useMediaQuery'
import { useReducedMotion } from '@/hooks/useReducedMotion'
import { cn } from '@/lib/utils'

interface HolographicBadgeProps {
  item: ExperienceItem
  index: number
  onOpen: () => void
}

/**
 * A hanging employee ID badge: a lanyard + clip above a dark glass card that
 * leads with a large brand logo, then company name, job title and years.
 * On pointer devices it keeps a 3D tilt + light sweep on hover; on touch it
 * comes alive with a gentle hanging sway and an always-on iridescent foil.
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
        {/* Lanyard + card swing together from the top (disabled under reduced motion) */}
        <div
          className={cn('relative', !reduced && 'badge-sway')}
          style={!reduced ? { animationDelay: `${index * -1.37}s` } : undefined}
        >
          {/* ── Lanyard (longer + thicker, coloured + printed per brand) ── */}
          <div className="relative mx-auto h-[100px] w-[160px]" style={{ transform: 'translateZ(10px)' }}>
            <svg viewBox="0 0 160 116" className="h-full w-full" aria-hidden>
              <defs>
                <linearGradient id={`lanShade-${item.id}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0" stopColor="#000" stopOpacity="0" />
                  <stop offset="1" stopColor="#000" stopOpacity="0.22" />
                </linearGradient>
                <clipPath id={`strap-${item.id}`}>
                  <rect x="-16" y="-100" width="32" height="100" rx="5" />
                </clipPath>
              </defs>
              {/* two straps splaying into a V from the clip */}
              {[-1, 1].map((s) => {
                const k = item.logoScale ?? 1
                const w = 22 * k
                const h = 14 * k
                return (
                  <g key={s} transform={`translate(80 100) rotate(${s * 21})`}>
                    {/* strap body in the brand colour + depth shading */}
                    <rect x="-16" y="-100" width="32" height="100" rx="5" fill={item.logoBg} />
                    <rect
                      x="-16"
                      y="-100"
                      width="32"
                      height="100"
                      rx="5"
                      fill={`url(#lanShade-${item.id})`}
                    />
                    <rect x="-16" y="-100" width="5" height="100" fill="#000" opacity="0.12" />
                    <rect x="11" y="-100" width="5" height="100" fill="#fff" opacity="0.12" />
                    {/* repeating company-logo print, clipped to the strap */}
                    <g clipPath={`url(#strap-${item.id})`}>
                      {[-82, -52, -22].map((cy) => (
                        <image
                          key={cy}
                          href={item.logo}
                          x={-w / 2}
                          y={cy - h / 2}
                          width={w}
                          height={h}
                          preserveAspectRatio="xMidYMid meet"
                        />
                      ))}
                    </g>
                  </g>
                )
              })}
              {/* metal clip at the base */}
              <g>
                <rect x="71" y="95" width="18" height="14" rx="3" fill="#c9ccd2" />
                <rect x="71" y="95" width="18" height="5" rx="3" fill="#e9ebee" />
                <rect x="76.5" y="90" width="7" height="7" rx="2" fill="#aab0b8" />
              </g>
            </svg>
          </div>

          {/* ── Card ────────────────────────────────────────────── */}
          <div
            className="relative mx-auto flex aspect-[2/3] w-full flex-col overflow-hidden rounded-[22px] border border-white/10 bg-gradient-to-b from-ink-700/90 to-ink-900/95 backdrop-blur-xl"
            style={{
              transform: 'translateZ(0)',
              boxShadow:
                '0 40px 80px -30px rgba(0,0,0,0.85), 0 0 0 1px rgba(255,255,255,0.04), inset 0 1px 0 rgba(255,255,255,0.1)',
            }}
          >
            {/* hover color glow */}
            <div
              className="pointer-events-none absolute -inset-6 -z-10 opacity-0 blur-2xl transition-opacity duration-500 group-hover:opacity-70"
              style={{ background: `radial-gradient(circle at 50% 25%, ${item.accent}, transparent 70%)` }}
            />
            {/* iridescent holographic foil (always on; sits under the content) */}
            <div className="holo-foil pointer-events-none absolute inset-0" />
            {/* soft top inner highlight for gloss */}
            <div className="pointer-events-none absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-white/[0.09] to-transparent" />
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
                className="relative flex h-[46%] w-full items-center justify-center overflow-hidden rounded-2xl p-5 shadow-lg ring-1 ring-white/10"
                style={{ background: item.logoBg }}
              >
                {/* glossy sheen across the logo tile */}
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-white/20 via-transparent to-black/10" />
                <img
                  src={item.logo}
                  alt={`${item.company} logo`}
                  className="relative max-h-full max-w-full object-contain drop-shadow-sm"
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
              {/* location */}
              <p className="mt-1 text-center text-xs tracking-wide text-bone-400">{item.location}</p>

              {/* years */}
              <div className="mt-auto flex w-full items-center justify-center pt-5">
                <span className="rounded-full border border-white/10 bg-white/5 px-4 py-1.5 font-display text-sm tabular-nums tracking-wide text-bone-200">
                  {item.period}
                </span>
              </div>
            </div>

            {/* bottom accent bar */}
            <div
              className="absolute inset-x-0 bottom-0 h-1.5"
              style={{ background: item.accent, opacity: 0.85 }}
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
        </div>

        {/* enter hint */}
        <p className="mt-4 text-center font-display text-[0.6rem] uppercase tracking-[0.25em] text-bone-400 transition-colors group-hover:text-bone-100">
          Tap to enter →
        </p>
      </button>
    </motion.div>
  )
}
