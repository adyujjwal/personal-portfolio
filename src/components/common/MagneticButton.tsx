import { useRef, useState, type ReactNode, type Ref } from 'react'
import { motion } from 'framer-motion'
import { useIsTouch } from '@/hooks/useMediaQuery'
import { useReducedMotion } from '@/hooks/useReducedMotion'
import { cn } from '@/lib/utils'

interface MagneticButtonProps {
  children: ReactNode
  href?: string
  onClick?: () => void
  variant?: 'primary' | 'ghost' | 'outline'
  className?: string
  ariaLabel?: string
  icon?: ReactNode
  external?: boolean
}

/**
 * A button/link with a subtle magnetic hover pull (desktop, motion-safe).
 * Falls back to a plain, fully accessible control otherwise.
 */
export function MagneticButton({
  children,
  href,
  onClick,
  variant = 'primary',
  className,
  ariaLabel,
  icon,
  external = true,
}: MagneticButtonProps) {
  const ref = useRef<HTMLElement>(null)
  const [offset, setOffset] = useState({ x: 0, y: 0 })
  const isTouch = useIsTouch()
  const reduced = useReducedMotion()
  const magnetic = !isTouch && !reduced

  const onMove = (e: React.MouseEvent) => {
    if (!magnetic || !ref.current) return
    const rect = ref.current.getBoundingClientRect()
    const x = (e.clientX - (rect.left + rect.width / 2)) * 0.3
    const y = (e.clientY - (rect.top + rect.height / 2)) * 0.3
    setOffset({ x, y })
  }
  const reset = () => setOffset({ x: 0, y: 0 })

  const styles = cn(
    'group relative inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-medium transition-colors duration-300 will-change-transform',
    variant === 'primary' && 'bg-bone-100 text-ink-950 hover:bg-white',
    variant === 'outline' &&
      'border border-white/15 text-bone-100 hover:border-white/40 hover:bg-white/5',
    variant === 'ghost' && 'text-bone-200 hover:text-white',
    className,
  )

  const inner = (
    <motion.span
      className="inline-flex items-center gap-2"
      animate={{ x: offset.x * 0.4, y: offset.y * 0.4 }}
      transition={{ type: 'spring', stiffness: 200, damping: 15 }}
    >
      {children}
      {icon && (
        <span className="transition-transform duration-300 group-hover:translate-x-0.5">{icon}</span>
      )}
    </motion.span>
  )

  const motionProps = {
    animate: { x: offset.x, y: offset.y },
    transition: { type: 'spring' as const, stiffness: 150, damping: 15, mass: 0.1 },
    onMouseMove: onMove,
    onMouseLeave: reset,
  }

  if (href) {
    return (
      <motion.a
        ref={ref as Ref<HTMLAnchorElement>}
        href={href}
        aria-label={ariaLabel}
        className={styles}
        target={external ? '_blank' : undefined}
        rel={external ? 'noopener noreferrer' : undefined}
        {...motionProps}
      >
        {inner}
      </motion.a>
    )
  }

  return (
    <motion.button ref={ref as Ref<HTMLButtonElement>} type="button" onClick={onClick} aria-label={ariaLabel} className={styles} {...motionProps}>
      {inner}
    </motion.button>
  )
}
