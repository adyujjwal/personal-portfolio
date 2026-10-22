import { Suspense, useRef, useState, type ReactNode } from 'react'
import { useInView } from 'framer-motion'
import { Canvas, type CanvasProps } from '@react-three/fiber'
import { PerformanceMonitor, AdaptiveEvents } from '@react-three/drei'
import { useQuality } from './quality'
import { useWebGL } from '@/hooks/useWebGL'

interface LazyCanvasProps extends Omit<CanvasProps, 'children'> {
  children: ReactNode
  /** Rendered while the canvas is out of view or loading (e.g. a gradient). */
  fallback?: ReactNode
  className?: string
  /** Keep rendering even when scrolled away (default false → pauses offscreen). */
  alwaysRender?: boolean
}

/**
 * Mounts an R3F <Canvas> only when the container is near the viewport and
 * frameloop pauses when fully offscreen. Keeps GPU work scoped to visible
 * sections. Applies quality-aware DPR + sensible defaults for every scene.
 */
export function LazyCanvas({
  children,
  fallback,
  className,
  alwaysRender = false,
  ...rest
}: LazyCanvasProps) {
  const ref = useRef<HTMLDivElement>(null)
  // Mount far ahead so the context + shaders compile early (no first-render
  // hitch when a lower section like the 3rd laptop finally scrolls in).
  const mounted = useInView(ref, { once: true, margin: '1800px' })
  // Keep rendering across a wide band so content is live (video playing, lids
  // open) by the time it scrolls in — no demand-mode blank frame on fast scroll.
  const onScreen = useInView(ref, { margin: '1100px' })
  const quality = useQuality()
  const webgl = useWebGL()

  // Dynamic resolution: start at the tier's max DPR and let PerformanceMonitor
  // scale it toward the min when the frame rate sags, recovering when it's fine.
  const [dprMin, dprMax] = quality.dpr
  const [dpr, setDpr] = useState(dprMax)

  return (
    <div ref={ref} className={className}>
      {fallback}
      {webgl && mounted && (
        <Canvas
          dpr={dpr}
          frameloop={alwaysRender || onScreen ? 'always' : 'demand'}
          gl={{
            antialias: !quality.isMobile,
            alpha: true,
            powerPreference: 'high-performance',
            stencil: false,
            depth: true,
          }}
          shadows={quality.shadows}
          {...rest}
        >
          <PerformanceMonitor
            onChange={({ factor }) =>
              setDpr(Number((dprMin + (dprMax - dprMin) * factor).toFixed(2)))
            }
          />
          <AdaptiveEvents />
          <Suspense fallback={null}>{children}</Suspense>
        </Canvas>
      )}
    </div>
  )
}
