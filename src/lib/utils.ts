/** Tailwind-friendly className combiner (no external dep). */
export function cn(...classes: Array<string | false | null | undefined>): string {
  return classes.filter(Boolean).join(' ')
}

export const clamp = (v: number, min: number, max: number) => Math.min(max, Math.max(min, v))

export const lerp = (a: number, b: number, t: number) => a + (b - a) * t

/** Map a value from one range to another. */
export function mapRange(
  v: number,
  inMin: number,
  inMax: number,
  outMin: number,
  outMax: number,
): number {
  const t = (v - inMin) / (inMax - inMin)
  return outMin + clamp(t, 0, 1) * (outMax - outMin)
}

/** Smooth, frame-rate independent damping factor. */
export const damp = (lambda: number, dt: number) => 1 - Math.exp(-lambda * dt)

/** Detect WebGL availability without creating a lingering context. */
export function isWebGLAvailable(): boolean {
  if (typeof window === 'undefined') return false
  try {
    const canvas = document.createElement('canvas')
    const gl =
      canvas.getContext('webgl2') ||
      canvas.getContext('webgl') ||
      canvas.getContext('experimental-webgl')
    const ok = !!gl
    if (gl && 'getExtension' in gl) {
      const lose = (gl as WebGLRenderingContext).getExtension('WEBGL_lose_context')
      lose?.loseContext()
    }
    return ok
  } catch {
    return false
  }
}

export const scrollToSection = (id: string) => {
  const el = document.getElementById(id)
  if (!el) return
  el.scrollIntoView({ behavior: 'smooth', block: 'start' })
}
