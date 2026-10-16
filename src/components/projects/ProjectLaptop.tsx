import { useEffect, useMemo, useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { RoundedBox } from '@react-three/drei'
import * as THREE from 'three'
import { damp } from '@/lib/utils'

interface ProjectLaptopProps {
  media: string
  accent: string
  /** Ref holding 0 (closed) → 1 (open); driven by scroll for a smooth reveal. */
  openRef: React.MutableRefObject<number>
  hovered: boolean
  reduced: boolean
}

const SCREEN_W = 2.6
const SCREEN_H = 1.6

/**
 * Returns a STABLE, non-null texture so the screen material compiles with
 * texture support from first render. MP4 → VideoTexture (auto-updates each
 * frame); image/GIF → TextureLoader (uploads + flags itself on load).
 */
function useScreenTexture(src: string) {
  const isVideo = useMemo(() => /\.(mp4|webm|mov|m4v)$/i.test(src), [src])
  const videoRef = useRef<HTMLVideoElement | null>(null)

  const texture = useMemo(() => {
    if (isVideo) {
      const video = document.createElement('video')
      video.src = src
      video.loop = true
      video.muted = true
      video.defaultMuted = true
      video.autoplay = true
      video.playsInline = true
      video.setAttribute('playsinline', '')
      video.setAttribute('muted', '')
      video.preload = 'auto'
      videoRef.current = video
      const t = new THREE.VideoTexture(video)
      t.colorSpace = THREE.SRGBColorSpace
      t.minFilter = THREE.LinearFilter
      t.magFilter = THREE.LinearFilter
      return t
    }
    const t = new THREE.TextureLoader().load(src)
    t.colorSpace = THREE.SRGBColorSpace
    t.anisotropy = 8
    return t
  }, [src, isVideo])

  useEffect(() => {
    const video = videoRef.current
    if (isVideo && video) {
      const tryPlay = () => void video.play().catch(() => {})
      tryPlay()
      video.addEventListener('canplay', tryPlay, { once: true })
      video.addEventListener('loadeddata', tryPlay, { once: true })
    }
    return () => {
      texture.dispose()
      if (video) {
        video.pause()
        video.removeAttribute('src')
        video.load()
      }
    }
  }, [texture, isVideo])

  // Safety net: keep the video texture fresh on every visible frame.
  useFrame(() => {
    const video = videoRef.current
    if (isVideo && video && video.readyState >= 2) texture.needsUpdate = true
  })

  return texture
}

/**
 * Reusable floating laptop built from primitives (no external model needed).
 * The lid opens via spring, the screen plays the project media as a lit,
 * emissive texture, and the whole unit floats + tilts toward the cursor.
 */
export function ProjectLaptop({ media, accent, openRef, hovered, reduced }: ProjectLaptopProps) {
  const root = useRef<THREE.Group>(null)
  const lid = useRef<THREE.Group>(null)
  const screenMat = useRef<THREE.MeshStandardMaterial>(null)
  const { pointer } = useThree()
  const texture = useScreenTexture(media)

  useFrame((state, dt) => {
    const t = state.clock.elapsedTime
    if (lid.current) {
      // open = 1 → screen upright (slight recline); open = 0 → folded onto base
      const open = openRef.current
      const target = (1 - open) * 1.6 - 0.08 * open
      lid.current.rotation.x = THREE.MathUtils.damp(lid.current.rotation.x, target, 6, dt)
    }
    if (root.current) {
      const floatY = reduced ? 0 : Math.sin(t * 0.8) * 0.06
      // gentle, bounded tilt toward the cursor - no continuous spin
      const tiltX = reduced ? 0 : pointer.y * 0.06 + Math.sin(t * 0.4) * 0.015
      const tiltY = reduced ? 0 : pointer.x * 0.25 + Math.sin(t * 0.3) * 0.04
      root.current.position.y = THREE.MathUtils.damp(root.current.position.y, floatY, 4, dt)
      root.current.rotation.x = THREE.MathUtils.damp(root.current.rotation.x, tiltX, 4, dt)
      root.current.rotation.y = THREE.MathUtils.damp(root.current.rotation.y, tiltY, 3, dt)
    }
    if (screenMat.current) {
      const target = hovered ? 1.1 : 0.7
      screenMat.current.emissiveIntensity +=
        (target - screenMat.current.emissiveIntensity) * damp(5, dt)
    }
  })

  return (
    <group ref={root} scale={1.1}>
      {/* Base / keyboard deck */}
      <RoundedBox args={[SCREEN_W + 0.2, 0.08, SCREEN_H + 0.3]} radius={0.04} smoothness={4} castShadow receiveShadow>
        <meshStandardMaterial color="#2a2a33" metalness={0.9} roughness={0.35} />
      </RoundedBox>
      {/* trackpad hint */}
      <mesh position={[0, 0.045, 0.55]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[0.9, 0.6]} />
        <meshStandardMaterial color="#1b1b22" metalness={0.6} roughness={0.5} />
      </mesh>

      {/* Lid (pivots at the hinge, back edge) */}
      <group ref={lid} position={[0, 0.04, -SCREEN_H / 2 - 0.1]}>
        <group position={[0, SCREEN_H / 2, 0]}>
          {/* lid shell */}
          <RoundedBox
            args={[SCREEN_W + 0.2, SCREEN_H + 0.2, 0.07]}
            radius={0.04}
            smoothness={4}
            castShadow
            position={[0, 0, -0.04]}
          >
            <meshStandardMaterial color="#26262e" metalness={0.9} roughness={0.3} />
          </RoundedBox>
          {/* screen */}
          <mesh position={[0, 0, 0.002]}>
            <planeGeometry args={[SCREEN_W, SCREEN_H]} />
            <meshStandardMaterial
              ref={screenMat}
              map={texture}
              emissive={accent}
              emissiveMap={texture}
              emissiveIntensity={0.7}
              toneMapped={false}
              roughness={0.2}
              metalness={0}
            />
          </mesh>
        </group>
      </group>

      {/* screen bounce light */}
      <pointLight position={[0, 0.6, 0.4]} intensity={hovered ? 6 : 3} distance={4} color={accent} />
    </group>
  )
}
