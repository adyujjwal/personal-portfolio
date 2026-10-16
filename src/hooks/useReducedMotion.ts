import { useMediaQuery } from './useMediaQuery'

/** True when the user has requested reduced motion. */
export function useReducedMotion(): boolean {
  return useMediaQuery('(prefers-reduced-motion: reduce)')
}
