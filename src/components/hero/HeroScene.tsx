import { useRef, lazy, Suspense } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import { LazyCanvas } from '../three/LazyCanvas'
import { PostFX } from '../three/PostFX'
import { useQuality } from '../three/quality'

// Physics (Rapier) is a large bundle - stream it in rather than block first paint.
const HeroExperience = lazy(() =>
  import('./HeroExperience').then((m) => ({ default: m.HeroExperience })),
)

/** Smoothly parallaxes the camera toward the cursor; eases away on scroll. */
function CameraRig({ scrollRef }: { scrollRef: React.MutableRefObject<number> }) {
  const { camera } = useThree()
  const target = useRef(new THREE.Vector3())

  useFrame((state, dt) => {
    const scroll = scrollRef.current // 0..1 within hero
    const px = state.pointer.x
    const py = state.pointer.y
    target.current.set(px * 1.6, 1 + py * 1.0 + scroll * 3, 12 + scroll * 6)
    camera.position.lerp(target.current, 1 - Math.pow(0.001, dt))
    camera.lookAt(0, scroll * 2, 0)
  })
  return null
}

interface HeroSceneProps {
  scrollRef: React.MutableRefObject<number>
}

export function HeroScene({ scrollRef }: HeroSceneProps) {
  const quality = useQuality()

  return (
    <LazyCanvas
      className="absolute inset-0 h-full w-full"
      camera={{ position: [0, 1, 12], fov: 42 }}
      fallback={<div className="aurora absolute inset-0" />}
    >
      <CameraRig scrollRef={scrollRef} />
      <Suspense fallback={null}>
        <HeroExperience quality={quality} />
      </Suspense>
      {quality.postprocessing && (
        <PostFX bloom dof={!quality.isMobile} bokehScale={3} focalLength={0.04} />
      )}
    </LazyCanvas>
  )
}
