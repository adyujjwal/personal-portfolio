import { useEffect, type ReactNode } from 'react'
import Lenis from 'lenis'
import { useReducedMotion } from '@/hooks/useReducedMotion'

/**
 * Lightweight smooth scrolling via Lenis; disabled under reduced-motion.
 * `start` gates initialisation so smooth scroll only begins after the
 * preloader intro-reveal completes.
 */
export function SmoothScroll({ children, start = true }: { children: ReactNode; start?: boolean }) {
  const reduced = useReducedMotion()

  useEffect(() => {
    if (reduced || !start) return
    const lenis = new Lenis({
      duration: 1.1,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      touchMultiplier: 1.5,
    })
    let raf = 0
    const loop = (time: number) => {
      lenis.raf(time)
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)
    return () => {
      cancelAnimationFrame(raf)
      lenis.destroy()
    }
  }, [reduced, start])

  return <>{children}</>
}
