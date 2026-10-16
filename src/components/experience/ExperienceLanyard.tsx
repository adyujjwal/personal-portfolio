import { useMemo, useRef, useState } from 'react'
import { extend, useFrame, useThree } from '@react-three/fiber'
import { Environment, Lightformer } from '@react-three/drei'
import {
  BallCollider,
  CuboidCollider,
  Physics,
  RigidBody,
  useRopeJoint,
  useSphericalJoint,
  type RapierRigidBody,
} from '@react-three/rapier'
import { MeshLineGeometry, MeshLineMaterial } from 'meshline'
import * as THREE from 'three'
import { LazyCanvas } from '../three/LazyCanvas'
import type { ExperienceItem } from '@/data/experience'

extend({ MeshLineGeometry, MeshLineMaterial })

const CARD_W = 2.05
const CARD_H = 2.85

/** Draws a dark employee-badge face (logo + metadata) to a CanvasTexture. */
function useBadgeTexture(item: ExperienceItem) {
  return useMemo(() => {
    const canvas = document.createElement('canvas')
    canvas.width = 512
    canvas.height = 720
    const ctx = canvas.getContext('2d')!
    const tex = new THREE.CanvasTexture(canvas)
    tex.colorSpace = THREE.SRGBColorSpace
    tex.anisotropy = 8

    const round = (x: number, y: number, w: number, h: number, r: number) => {
      ctx.beginPath()
      ctx.roundRect(x, y, w, h, r)
    }

    const draw = (logo?: HTMLImageElement) => {
      const W = canvas.width
      const H = canvas.height
      ctx.clearRect(0, 0, W, H)
      // card body
      const g = ctx.createLinearGradient(0, 0, 0, H)
      g.addColorStop(0, '#15151c')
      g.addColorStop(1, '#0a0a0f')
      ctx.fillStyle = g
      round(0, 0, W, H, 44)
      ctx.fill()
      // top accent line
      ctx.fillStyle = item.accent
      round(40, 54, W - 80, 4, 2)
      ctx.fill()
      // lanyard slot
      ctx.fillStyle = 'rgba(0,0,0,0.6)'
      round(W / 2 - 46, 22, 92, 16, 8)
      ctx.fill()

      // header
      ctx.fillStyle = 'rgba(245,245,242,0.55)'
      ctx.font = '600 20px "Space Grotesk", Inter, sans-serif'
      ctx.textAlign = 'left'
      ctx.fillText('EMPLOYEE ID', 48, 104)
      ctx.textAlign = 'right'
      ctx.fillStyle = item.accent
      ctx.fillText(item.period, W - 48, 104)

      // logo tile
      const tileX = 48
      const tileY = 150
      const tileW = W - 96
      const tileH = 250
      ctx.fillStyle = item.logoBg
      round(tileX, tileY, tileW, tileH, 24)
      ctx.fill()
      if (logo) {
        const scale = Math.min(((tileW - 80) / logo.width), ((tileH - 80) / logo.height)) * (item.logoScale ?? 1)
        const lw = logo.width * scale
        const lh = logo.height * scale
        ctx.drawImage(logo, tileX + (tileW - lw) / 2, tileY + (tileH - lh) / 2, lw, lh)
      }

      // company name
      ctx.textAlign = 'left'
      ctx.fillStyle = '#f5f5f2'
      ctx.font = '700 42px "Space Grotesk", Inter, sans-serif'
      ctx.fillText(item.company, 48, 480)
      // role
      ctx.fillStyle = item.accent
      ctx.font = '600 26px Inter, sans-serif'
      ctx.fillText(item.role, 48, 522)
      // location
      ctx.fillStyle = 'rgba(245,245,242,0.5)'
      ctx.font = '400 22px Inter, sans-serif'
      ctx.fillText(item.location, 48, 560)

      // bottom accent bar
      ctx.fillStyle = item.accent
      round(0, H - 14, W, 14, 0)
      ctx.fill()

      tex.needsUpdate = true
    }

    draw()
    const img = new Image()
    img.onload = () => draw(img)
    img.src = item.logo
    return tex
  }, [item])
}

/** Repeating "COMPANY · COMPANY ·" print for the fabric strap. */
function useStrapTexture(item: ExperienceItem) {
  return useMemo(() => {
    const canvas = document.createElement('canvas')
    canvas.width = 1024
    canvas.height = 256
    const ctx = canvas.getContext('2d')!
    ctx.fillStyle = '#0a0a0f'
    ctx.fillRect(0, 0, 1024, 256)
    const label = `${item.company.toUpperCase()}   ·   `
    ctx.fillStyle = '#f1f1ee'
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    // scale font so the label fits the strap length
    let size = 104
    ctx.font = `700 ${size}px "Space Grotesk", Inter, sans-serif`
    while (ctx.measureText(label).width > 960 && size > 40) {
      size -= 4
      ctx.font = `700 ${size}px "Space Grotesk", Inter, sans-serif`
    }
    ctx.fillText(label, 512, 150)
    // accent tick
    ctx.fillStyle = item.accent
    ctx.fillRect(472, 52, 80, 7)
    const tex = new THREE.CanvasTexture(canvas)
    tex.wrapS = THREE.RepeatWrapping
    tex.wrapT = THREE.RepeatWrapping
    tex.colorSpace = THREE.SRGBColorSpace
    tex.anisotropy = 8
    return tex
  }, [item])
}

const SEG = {
  type: 'dynamic' as const,
  canSleep: true,
  colliders: false as const,
  angularDamping: 2,
  linearDamping: 2,
}

/** One draggable badge hanging from a rope lanyard (Rapier). */
function Lanyard({
  item,
  anchorX,
  onOpen,
}: {
  item: ExperienceItem
  anchorX: number
  onOpen: () => void
}) {
  const fixed = useRef<RapierRigidBody>(null)
  const j1 = useRef<RapierRigidBody>(null)
  const j2 = useRef<RapierRigidBody>(null)
  const j3 = useRef<RapierRigidBody>(null)
  const card = useRef<RapierRigidBody>(null)
  const band = useRef<THREE.Mesh>(null)
  const { width, height } = useThree((s) => s.size)
  const texture = useBadgeTexture(item)
  const strap = useStrapTexture(item)

  const [dragged, setDragged] = useState<false | THREE.Vector3>(false)
  const moved = useRef(false)

  const vec = useMemo(() => new THREE.Vector3(), [])
  const dir = useMemo(() => new THREE.Vector3(), [])
  const ang = useMemo(() => new THREE.Vector3(), [])
  const rot = useMemo(() => new THREE.Vector3(), [])
  const curve = useMemo(
    () =>
      new THREE.CatmullRomCurve3(
        [new THREE.Vector3(), new THREE.Vector3(), new THREE.Vector3(), new THREE.Vector3()],
        false,
        'chordal',
      ),
    [],
  )

  useRopeJoint(fixed, j1, [[0, 0, 0], [0, 0, 0], 0.6])
  useRopeJoint(j1, j2, [[0, 0, 0], [0, 0, 0], 0.6])
  useRopeJoint(j2, j3, [[0, 0, 0], [0, 0, 0], 0.6])
  useSphericalJoint(j3, card, [[0, 0, 0], [0, CARD_H / 2 + 0.3, 0]])

  useFrame((state, delta) => {
    if (dragged && card.current) {
      vec.set(state.pointer.x, state.pointer.y, 0.5).unproject(state.camera)
      dir.copy(vec).sub(state.camera.position).normalize()
      vec.add(dir.multiplyScalar(state.camera.position.length()))
      ;[card, j1, j2, j3, fixed].forEach((r) => r.current?.wakeUp())
      card.current.setNextKinematicTranslation({
        x: vec.x - dragged.x,
        y: vec.y - dragged.y,
        z: vec.z - dragged.z,
      })
    }
    if (fixed.current && j1.current && j2.current && j3.current && band.current) {
      // smooth the rope so it doesn't jitter
      ;[j1, j2].forEach((r) => {
        const ref = r.current as RapierRigidBody & { lerped?: THREE.Vector3 }
        if (!ref.lerped) ref.lerped = new THREE.Vector3().copy(ref.translation())
        const dist = Math.max(0.1, Math.min(1, ref.lerped.distanceTo(ref.translation())))
        ref.lerped.lerp(ref.translation(), delta * (10 + dist * 40))
      })
      const l1 = (j1.current as RapierRigidBody & { lerped: THREE.Vector3 }).lerped
      const l2 = (j2.current as RapierRigidBody & { lerped: THREE.Vector3 }).lerped
      curve.points[0].copy(j3.current.translation())
      curve.points[1].copy(l2)
      curve.points[2].copy(l1)
      curve.points[3].copy(fixed.current.translation())
      ;(band.current.geometry as MeshLineGeometry).setPoints(curve.getPoints(32))
      // ease the card back to face forward
      if (card.current) {
        ang.copy(card.current.angvel() as THREE.Vector3)
        rot.copy(card.current.rotation() as unknown as THREE.Vector3)
        card.current.setAngvel({ x: ang.x, y: ang.y - rot.y * 0.25, z: ang.z }, false)
      }
    }
  })

  return (
    <>
      <group position={[anchorX, 2.2, 0]}>
        <RigidBody ref={fixed} {...SEG} type="fixed" />
        <RigidBody position={[0.3, 0, 0]} ref={j1} {...SEG}>
          <BallCollider args={[0.1]} />
        </RigidBody>
        <RigidBody position={[0.6, 0, 0]} ref={j2} {...SEG}>
          <BallCollider args={[0.1]} />
        </RigidBody>
        <RigidBody position={[0.9, 0, 0]} ref={j3} {...SEG}>
          <BallCollider args={[0.1]} />
        </RigidBody>
        <RigidBody
          position={[1.2, 0, 0]}
          ref={card}
          {...SEG}
          type={dragged ? 'kinematicPosition' : 'dynamic'}
        >
          <CuboidCollider args={[CARD_W / 2, CARD_H / 2, 0.01]} />
          <group
            onPointerCancel={() => setDragged(false)}
            onPointerUp={(e) => {
              ;(e.target as Element).releasePointerCapture?.(e.pointerId)
              setDragged(false)
              if (!moved.current) onOpen()
            }}
            onPointerDown={(e) => {
              e.stopPropagation()
              ;(e.target as Element).setPointerCapture?.(e.pointerId)
              moved.current = false
              setDragged(new THREE.Vector3().copy(e.point).sub(vec.copy(card.current!.translation())))
            }}
            onPointerMove={(e) => {
              if (dragged && (Math.abs(e.nativeEvent.movementX) + Math.abs(e.nativeEvent.movementY) > 2))
                moved.current = true
            }}
          >
            {/* clip: plastic clamp + metal ring connecting strap to card */}
            <group position={[0, CARD_H / 2 + 0.02, 0]}>
              <mesh position={[0, 0.14, 0]}>
                <boxGeometry args={[0.7, 0.28, 0.1]} />
                <meshStandardMaterial color="#17171d" roughness={0.5} metalness={0.3} />
              </mesh>
              <mesh position={[0, 0.33, 0]} rotation={[Math.PI / 2, 0, 0]}>
                <torusGeometry args={[0.13, 0.032, 14, 28]} />
                <meshStandardMaterial color="#c2c6cc" metalness={1} roughness={0.25} />
              </mesh>
            </group>
            {/* card face */}
            <mesh>
              <planeGeometry args={[CARD_W, CARD_H]} />
              <meshStandardMaterial
                map={texture}
                side={THREE.DoubleSide}
                roughness={0.4}
                metalness={0}
              />
            </mesh>
          </group>
        </RigidBody>
      </group>

      <mesh ref={band}>
        <meshLineGeometry />
        <meshLineMaterial
          color="#ffffff"
          depthTest={false}
          resolution={[width, height]}
          useMap={1}
          map={strap}
          repeat={[-2, 1]}
          lineWidth={0.95}
        />
      </mesh>
    </>
  )
}

export function ExperienceLanyard({
  items,
  onOpen,
  paused = false,
}: {
  items: ExperienceItem[]
  onOpen: (i: number) => void
  paused?: boolean
}) {
  const spacing = 4
  const start = -((items.length - 1) * spacing) / 2
  return (
    <LazyCanvas
      className="h-[72vh] min-h-[460px] w-full"
      camera={{ position: [0, 0, 13], fov: 25 }}
      fallback={<div className="aurora absolute inset-0 opacity-20" />}
    >
      <ambientLight intensity={1} />
      <directionalLight position={[4, 6, 6]} intensity={1.6} />
      <Physics gravity={[0, -34, 0]} timeStep={1 / 60} paused={paused}>
        {items.map((item, i) => (
          <Lanyard key={item.id} item={item} anchorX={start + i * spacing} onOpen={() => onOpen(i)} />
        ))}
      </Physics>
      <Environment resolution={128}>
        <Lightformer intensity={2} position={[0, 4, 4]} scale={[8, 8, 1]} />
        <Lightformer intensity={1.4} color="#6ea8ff" position={[-4, 1, 3]} scale={[2, 6, 1]} />
      </Environment>
    </LazyCanvas>
  )
}
