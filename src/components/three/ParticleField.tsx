import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

interface ParticleFieldProps {
  count?: number
  radius?: number
  color?: string
  size?: number
  opacity?: number
}

/** Ambient drifting particle cloud. Cheap, additive, GPU-friendly. */
export function ParticleField({
  count = 400,
  radius = 9,
  color = '#9ec1ff',
  size = 0.03,
  opacity = 0.6,
}: ParticleFieldProps) {
  const ref = useRef<THREE.Points>(null)
  const matRef = useRef<THREE.PointsMaterial>(null)
  const born = useRef(0)

  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      const r = radius * Math.cbrt(Math.random())
      const theta = Math.random() * Math.PI * 2
      const phi = Math.acos(2 * Math.random() - 1)
      arr[i * 3] = r * Math.sin(phi) * Math.cos(theta)
      arr[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta)
      arr[i * 3 + 2] = r * Math.cos(phi)
    }
    return arr
  }, [count, radius])

  useFrame((_, dt) => {
    if (ref.current) {
      ref.current.rotation.y += dt * 0.02
      ref.current.rotation.x += dt * 0.005
    }
    // Gentle fade-in on first appearance.
    if (matRef.current && matRef.current.opacity < opacity) {
      born.current += dt
      matRef.current.opacity = Math.min(opacity, (born.current / 1.4) * opacity)
    }
  })

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        ref={matRef}
        size={size}
        color={color}
        transparent
        opacity={0}
        sizeAttenuation
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  )
}
