import { useEffect, useState } from 'react'
import { isWebGLAvailable } from '@/lib/utils'

/** Resolves WebGL availability once on mount. Null = still checking. */
export function useWebGL(): boolean {
  const [ok, setOk] = useState(true)
  useEffect(() => {
    setOk(isWebGLAvailable())
  }, [])
  return ok
}
