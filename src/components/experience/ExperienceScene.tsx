import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Float } from '@react-three/drei'
import * as THREE from 'three'
import { LazyCanvas } from '../three/LazyCanvas'
import { ParticleField } from '../three/ParticleField'
import { useQuality } from '../three/quality'

function Rings() {
  const g = useRef<THREE.Group>(null)
  useFrame((_, dt) => {
    if (g.current) g.current.rotation.z += dt * 0.04
  })
  return (
    <group ref={g}>
      {[3.2, 4.4, 5.8].map((r, i) => (
        <mesh key={r} rotation={[Math.PI / 2.2, i * 0.4, 0]}>
          <torusGeometry args={[r, 0.012, 16, 128]} />
          <meshBasicMaterial color="#6ea8ff" transparent opacity={0.25 - i * 0.05} />
        </mesh>
      ))}
    </group>
  )
}

/** Subtle depth backdrop behind the experience badges. */
export function ExperienceScene() {
  const quality = useQuality()
  return (
    <LazyCanvas
      className="pointer-events-none absolute inset-0 h-full w-full opacity-70"
      camera={{ position: [0, 0, 10], fov: 45 }}
      fallback={null}
    >
      <ambientLight intensity={0.6} />
      <Float speed={1.2} rotationIntensity={0.3} floatIntensity={0.6}>
        <Rings />
      </Float>
      <ParticleField count={Math.round(300 * quality.density)} radius={9} opacity={0.4} />
    </LazyCanvas>
  )
}
