import { useMemo, useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import {
  Environment,
  Lightformer,
  MeshTransmissionMaterial,
  ContactShadows,
} from '@react-three/drei'
import {
  BallCollider,
  Physics,
  RigidBody,
  type RapierRigidBody,
} from '@react-three/rapier'
import * as THREE from 'three'
import { ParticleField } from '../three/ParticleField'
import type { QualityProfile } from '../three/quality'

const ACCENTS = ['#6ea8ff', '#9ec1ff', '#5de4c7', '#c58fff', '#ffffff', '#2d5bd7']

interface SphereProps {
  position: [number, number, number]
  scale: number
  color: string
  glass: boolean
  delay: number
  /** Geometry segments (lowered on weaker devices). */
  segments: number
  /** Transmission sample count — the main glass cost. */
  samples: number
  /** Transmission render-target resolution. */
  resolution: number
}

/** A single floating body gently pulled back toward the origin. */
function Sphere({ position, scale, color, glass, delay, segments, samples, resolution }: SphereProps) {
  const api = useRef<RapierRigidBody>(null)
  const meshRef = useRef<THREE.Mesh>(null)
  const born = useRef(0)
  const vec = useMemo(() => new THREE.Vector3(), [])

  useFrame((_, dt) => {
    // Entrance: grow in from nothing with a per-sphere stagger (easeOutCubic).
    if (meshRef.current) {
      born.current += dt
      const t = THREE.MathUtils.clamp((born.current - delay) / 0.7, 0, 1)
      meshRef.current.scale.setScalar(1 - Math.pow(1 - t, 3))
    }

    const body = api.current
    if (!body) return
    const t = body.translation()
    // Soft spring toward origin keeps the cluster centered and alive.
    vec.set(-t.x, -t.y, -t.z).multiplyScalar(0.0012)
    body.applyImpulse(vec, true)
  })

  return (
    <RigidBody
      ref={api}
      position={position}
      colliders={false}
      linearDamping={1.2}
      angularDamping={0.6}
      friction={0.1}
      restitution={0.3}
    >
      <BallCollider args={[scale]} />
      <mesh ref={meshRef} scale={0} castShadow receiveShadow>
        <sphereGeometry args={[scale, segments, segments]} />
        {glass ? (
          <MeshTransmissionMaterial
            thickness={scale * 1.2}
            roughness={0.08}
            transmission={1}
            ior={1.4}
            chromaticAberration={0.04}
            color={color}
            resolution={resolution}
            samples={samples}
          />
        ) : (
          <meshStandardMaterial
            color={color}
            metalness={1}
            roughness={0.15}
            envMapIntensity={1.2}
          />
        )}
      </mesh>
    </RigidBody>
  )
}

/** Invisible kinematic body that follows the cursor and nudges the spheres. */
function Pointer() {
  const ref = useRef<RapierRigidBody>(null)
  const { viewport } = useThree()
  const vec = useMemo(() => new THREE.Vector3(), [])

  useFrame(({ pointer }) => {
    vec.set((pointer.x * viewport.width) / 2, (pointer.y * viewport.height) / 2, 0)
    ref.current?.setNextKinematicTranslation(vec)
  })

  return (
    <RigidBody ref={ref} type="kinematicPosition" colliders={false}>
      <BallCollider args={[1.1]} />
    </RigidBody>
  )
}

export function HeroExperience({ quality }: { quality: QualityProfile }) {
  const count = Math.max(6, Math.round(14 * quality.density))

  // Per-tier glass + geometry cost. Transmission is the heaviest material in
  // the scene, so sample count / resolution scale down hard on weaker devices.
  const segments = quality.isMobile ? 24 : 32
  const samples = quality.tier === 'high' ? 4 : 2
  const resolution = quality.isMobile ? 64 : quality.tier === 'high' ? 160 : 128

  const bodies = useMemo(
    () =>
      Array.from({ length: count }, (_, i) => {
        const scale = 0.5 + Math.random() * 0.7
        return {
          key: i,
          position: [
            THREE.MathUtils.randFloatSpread(6),
            THREE.MathUtils.randFloatSpread(6) + 2,
            THREE.MathUtils.randFloatSpread(3),
          ] as [number, number, number],
          scale,
          color: ACCENTS[i % ACCENTS.length],
          glass: i % 3 === 0,
        }
      }),
    [count],
  )

  return (
    <>
      <color attach="background" args={['#050507']} />
      <fog attach="fog" args={['#050507', 10, 24]} />

      <ambientLight intensity={0.4} />
      <directionalLight
        position={[6, 8, 4]}
        intensity={1.6}
        castShadow={quality.shadows}
        shadow-mapSize={[1024, 1024]}
      />
      <spotLight position={[-8, 6, 6]} intensity={40} angle={0.5} penumbra={1} color="#6ea8ff" />

      <Physics gravity={[0, 0, 0]} timeStep="vary">
        <Pointer />
        {bodies.map(({ key, ...rest }, i) => (
          <Sphere
            key={key}
            delay={i * 0.07}
            segments={segments}
            samples={samples}
            resolution={resolution}
            {...rest}
          />
        ))}
      </Physics>

      <ParticleField count={Math.round(400 * quality.density)} radius={10} />

      {quality.shadows && (
        <ContactShadows
          position={[0, -4.5, 0]}
          opacity={0.5}
          scale={30}
          blur={2.6}
          far={9}
          color="#000000"
        />
      )}

      <Environment resolution={256}>
        <group rotation={[0, 0, 1]}>
          <Lightformer intensity={2} position={[0, 5, -9]} scale={[10, 10, 1]} />
          <Lightformer intensity={1.5} color="#6ea8ff" position={[-5, 1, -1]} scale={[2, 10, 1]} />
          <Lightformer intensity={1.5} color="#9ec1ff" position={[5, -1, -1]} scale={[2, 10, 1]} />
          <Lightformer intensity={1} color="#5de4c7" position={[0, -5, -1]} scale={[10, 2, 1]} />
        </group>
      </Environment>
    </>
  )
}
