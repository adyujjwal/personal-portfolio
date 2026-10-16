import { useEffect, useRef, useState } from 'react'
import { useIsTouch } from '@/hooks/useMediaQuery'

type CursorMode = 'default' | 'interactive' | 'view' | 'open'

/**
 * Custom desktop cursor that morphs based on the hovered element's
 * `data-cursor` attribute. Never rendered on touch devices.
 */
export function CustomCursor() {
  const isTouch = useIsTouch()
  const dotRef = useRef<HTMLDivElement>(null)
  const ringRef = useRef<HTMLDivElement>(null)
  const [mode, setMode] = useState<CursorMode>('default')
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    if (isTouch) return
    document.body.classList.add('custom-cursor')

    const target = { x: window.innerWidth / 2, y: window.innerHeight / 2 }
    const ring = { x: target.x, y: target.y }
    let raf = 0

    const onMove = (e: PointerEvent) => {
      target.x = e.clientX
      target.y = e.clientY
      setVisible(true)
      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0)`
      }
      const el = (e.target as HTMLElement)?.closest<HTMLElement>('[data-cursor]')
      setMode((el?.dataset.cursor as CursorMode) ?? 'default')
    }

    const loop = () => {
      ring.x += (target.x - ring.x) * 0.18
      ring.y += (target.y - ring.y) * 0.18
      if (ringRef.current) {
        ringRef.current.style.transform = `translate3d(${ring.x}px, ${ring.y}px, 0)`
      }
      raf = requestAnimationFrame(loop)
    }
    loop()

    const onLeave = () => setVisible(false)
    window.addEventListener('pointermove', onMove, { passive: true })
    window.addEventListener('pointerout', onLeave)
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('pointerout', onLeave)
      document.body.classList.remove('custom-cursor')
    }
  }, [isTouch])

  if (isTouch) return null

  const label = mode === 'view' ? 'VIEW' : mode === 'open' ? 'OPEN' : ''
  const expanded = mode !== 'default'

  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 z-[90] hidden md:block"
      style={{ opacity: visible ? 1 : 0, transition: 'opacity 0.3s' }}
    >
      <div
        ref={dotRef}
        className="absolute -left-1 -top-1 h-2 w-2 rounded-full bg-white mix-blend-difference"
        style={{ opacity: label ? 0 : 1 }}
      />
      <div
        ref={ringRef}
        className="absolute flex items-center justify-center rounded-full border border-white/60 mix-blend-difference transition-[width,height] duration-300 ease-smooth"
        style={{
          width: label ? 64 : expanded ? 44 : 32,
          height: label ? 64 : expanded ? 44 : 32,
          marginLeft: label ? -32 : expanded ? -22 : -16,
          marginTop: label ? -32 : expanded ? -22 : -16,
        }}
      >
        {label && (
          <span className="font-display text-[0.6rem] font-semibold tracking-widest text-white">
            {label}
          </span>
        )}
      </div>
    </div>
  )
}
