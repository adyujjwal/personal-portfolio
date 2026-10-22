import { useMemo } from 'react'
import { useIsMobile, useIsTablet } from '@/hooks/useMediaQuery'
import { useReducedMotion } from '@/hooks/useReducedMotion'

export interface QualityProfile {
  tier: 'low' | 'mid' | 'high'
  dpr: [number, number]
  postprocessing: boolean
  shadows: boolean
  /** Scales particle / physics object counts. */
  density: number
  reduced: boolean
  isMobile: boolean
}

/**
 * Derives a rendering quality profile from device + user preferences.
 * Every scene reads this to scale DPR, postprocessing, shadows and counts.
 */
export function useQuality(): QualityProfile {
  const isMobile = useIsMobile()
  const isTablet = useIsTablet()
  const reduced = useReducedMotion()

  return useMemo(() => {
    const cores = typeof navigator !== 'undefined' ? navigator.hardwareConcurrency || 4 : 4
    const lowEnd = isMobile || cores <= 4

    if (isMobile) {
      return {
        tier: 'low',
        dpr: [1, 1.25],
        postprocessing: false,
        shadows: false,
        density: 0.45,
        reduced,
        isMobile,
      }
    }
    if (isTablet || lowEnd) {
      return {
        tier: 'mid',
        dpr: [1, 1.5],
        postprocessing: !reduced,
        shadows: true,
        density: 0.7,
        reduced,
        isMobile,
      }
    }
    return {
      tier: 'high',
      dpr: [1, 1.75],
      postprocessing: !reduced,
      shadows: true,
      density: 1,
      reduced,
      isMobile,
    }
  }, [isMobile, isTablet, reduced])
}
