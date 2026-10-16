import { useEffect, useState } from 'react'

/**
 * Normalized pointer position in range [-1, 1] for both axes.
 * Center of viewport = (0, 0). Smoothed consumption is left to callers.
 */
export function useMousePosition() {
  const [pos, setPos] = useState({ x: 0, y: 0 })

  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      setPos({
        x: (e.clientX / window.innerWidth) * 2 - 1,
        y: -((e.clientY / window.innerHeight) * 2 - 1),
      })
    }
    window.addEventListener('pointermove', onMove, { passive: true })
    return () => window.removeEventListener('pointermove', onMove)
  }, [])

  return pos
}
