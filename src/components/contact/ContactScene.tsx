import { useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { Environment, Float, MeshTransmissionMaterial, Lightformer } from '@react-three/drei'
import * as THREE from 'three'
import { LazyCanvas } from '../three/LazyCanvas'
import { PostFX } from '../three/PostFX'
import { useQuality } from '../three/quality'

function Artifact({ reduced }: { reduced: boolean }) {
  const mesh = useRef<THREE.Mesh>(null)
  const { pointer } = useThree()

  useFrame((state, dt) => {
    if (!mesh.current) return
    const t = state.clock.elapsedTime
    const ry = reduced ? 0 : pointer.x * 0.6 + t * 0.1
    const rx = reduced ? 0 : -pointer.y * 0.5 + t * 0.05
    mesh.current.rotation.y = THREE.MathUtils.damp(mesh.current.rotation.y, ry, 2, dt)
    mesh.current.rotation.x = THREE.MathUtils.damp(mesh.current.rotation.x, rx, 2, dt)
  })

  return (
    <mesh ref={mesh}>
      <icosahedronGeometry args={[1.6, 1]} />
      <MeshTransmissionMaterial
        thickness={1.4}
        roughness={0.05}
        transmission={1}
        ior={1.5}
        chromaticAberration={0.06}
        anisotropy={0.2}
        distortion={0.3}
        distortionScale={0.4}
        temporalDistortion={0.1}
        color="#9ec1ff"
        backside
        resolution={256}
        samples={6}
      />
    </mesh>
  )
}

export function ContactScene() {
  const quality = useQuality()
  return (
    <LazyCanvas
      className="absolute inset-0 h-full w-full"
      camera={{ position: [0, 0, 6], fov: 42 }}
      alwaysRender
      fallback={<div className="aurora absolute inset-0 opacity-40" />}
    >
      <ambientLight intensity={0.5} />
      <directionalLight position={[5, 5, 5]} intensity={2} />
      <Float speed={1.4} rotationIntensity={0.4} floatIntensity={0.8}>
        <Artifact reduced={quality.reduced} />
      </Float>
      <Environment resolution={256}>
        <group>
          <Lightformer intensity={2} position={[0, 4, -6]} scale={[8, 8, 1]} />
          <Lightformer intensity={2} color="#6ea8ff" position={[-4, 0, 2]} scale={[2, 6, 1]} />
          <Lightformer intensity={2} color="#5de4c7" position={[4, 0, 2]} scale={[2, 6, 1]} />
        </group>
      </Environment>
      {quality.postprocessing && <PostFX bloom dof={false} vignette />}
    </LazyCanvas>
  )
}
