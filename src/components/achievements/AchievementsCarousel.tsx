import { useEffect, useRef, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import { Image, Html } from '@react-three/drei'
import * as THREE from 'three'
import { LazyCanvas } from '../three/LazyCanvas'
import type { Achievement } from '@/data/achievements'

const CARD_H = 2.7

type Control = {
  rot: number
  vel: number
  dragging: boolean
  lastX: number
  moved: boolean
}

function Card({
  item,
  index,
  started,
  onOpen,
  control,
}: {
  item: Achievement
  index: number
  started: boolean
  onOpen: () => void
  control: React.MutableRefObject<Control>
}) {
  const g = useRef<THREE.Group>(null)
  const img = useRef<THREE.Mesh>(null)
  const [hovered, setHovered] = useState(false)
  const aspect = item.aspect ?? 1.4
  const w = CARD_H * aspect
  const h = CARD_H
  const localT = useRef(0) // time since the section entered view

  // Render both faces so cards stay visible as they rotate to the back of the ring.
  useEffect(() => {
    const mat = img.current?.material as THREE.Material | undefined
    if (mat) {
      mat.side = THREE.DoubleSide
      mat.transparent = true
      mat.opacity = 0
      mat.needsUpdate = true
    }
  })

  useFrame((_, dt) => {
    if (!g.current) return
    const target = hovered ? 1.08 : 1
    const s = THREE.MathUtils.damp(g.current.scale.x, target, 6, dt)
    g.current.scale.setScalar(s)
    // staggered fade-in once the section scrolls into view
    const mat = img.current?.material as (THREE.Material & { opacity: number }) | undefined
    if (mat) {
      if (started) localT.current += dt
      const begun = localT.current - index * 0.18
      mat.opacity = Math.min(1, Math.max(0, begun) / 0.8)
    }
  })

  return (
    <group>
      <group ref={g}>
        <Image
          ref={img}
          url={item.image}
          scale={[w, h]}
          radius={0.1}
          transparent
          toneMapped={false}
          onPointerOver={(e) => {
            e.stopPropagation()
            setHovered(true)
          }}
          onPointerOut={() => setHovered(false)}
          onClick={(e) => {
            e.stopPropagation()
            if (!control.current.moved) onOpen()
          }}
        />
      </group>
      <Html
        center
        position={[0, -h / 2 - 0.18, 0]}
        distanceFactor={9}
        style={{ pointerEvents: 'none', transition: 'opacity 0.3s', opacity: hovered ? 1 : 0.75 }}
      >
        <div className="w-48 select-none text-center">
          <p className="font-display text-[11px] font-semibold leading-tight text-bone-100">
            {item.title}
          </p>
          <p className="mt-0.5 text-[9px] uppercase tracking-[0.2em]" style={{ color: item.accent }}>
            {item.organization}
            {item.year !== 'TODO' ? ` · ${item.year}` : ''}
          </p>
        </div>
      </Html>
    </group>
  )
}

function Carousel({
  items,
  radius,
  started,
  onOpen,
  control,
}: {
  items: Achievement[]
  radius: number
  started: boolean
  onOpen: (i: number) => void
  control: React.MutableRefObject<Control>
}) {
  const group = useRef<THREE.Group>(null)

  useFrame((_, dt) => {
    const c = control.current
    if (!c.dragging) {
      c.rot += c.vel
      c.vel *= 0.94
      if (Math.abs(c.vel) < 0.0008) c.rot += dt * 0.12 // gentle idle spin
    }
    if (group.current) group.current.rotation.y = c.rot
  })

  return (
    <group ref={group}>
      {items.map((item, i) => {
        const theta = (i / items.length) * Math.PI * 2
        return (
          <group
            key={item.id}
            position={[Math.sin(theta) * radius, 0, Math.cos(theta) * radius]}
            rotation={[0, theta, 0]}
          >
            <Card item={item} index={i} started={started} onOpen={() => onOpen(i)} control={control} />
          </group>
        )
      })}
    </group>
  )
}

export function AchievementsCarousel({
  items,
  onOpen,
  started = true,
}: {
  items: Achievement[]
  onOpen: (i: number) => void
  started?: boolean
}) {
  const control = useRef<Control>({ rot: 0, vel: 0, dragging: false, lastX: 0, moved: false })
  const radius = Math.max(5.2, items.length * 1.1)

  const onDown = (e: React.PointerEvent) => {
    const c = control.current
    c.dragging = true
    c.lastX = e.clientX
    c.vel = 0
    c.moved = false
  }
  const onMove = (e: React.PointerEvent) => {
    const c = control.current
    if (!c.dragging) return
    const dx = e.clientX - c.lastX
    c.lastX = e.clientX
    if (Math.abs(dx) > 3) c.moved = true
    const d = -dx * 0.006
    c.rot += d
    c.vel = d
  }
  const onUp = () => {
    control.current.dragging = false
  }
  const onWheel = (e: React.WheelEvent) => {
    // horizontal gestures spin the ring; vertical scroll still pages the site
    if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) control.current.rot += e.deltaX * 0.002
  }

  return (
    <div
      className="relative h-[62vh] min-h-[440px] w-full cursor-grab touch-pan-y select-none active:cursor-grabbing"
      onPointerDown={onDown}
      onPointerMove={onMove}
      onPointerUp={onUp}
      onPointerLeave={onUp}
      onWheel={onWheel}
      data-cursor="view"
    >
      <LazyCanvas
        className="h-full w-full"
        camera={{ position: [0, 0, radius + 5], fov: 40 }}
        fallback={<div className="aurora absolute inset-0 opacity-25" />}
      >
        <ambientLight intensity={1} />
        <Carousel items={items} radius={radius} started={started} onOpen={onOpen} control={control} />
      </LazyCanvas>

      <p className="pointer-events-none absolute bottom-4 left-1/2 -translate-x-1/2 font-display text-[0.6rem] uppercase tracking-[0.35em] text-bone-400">
        Drag to explore · tap a card
      </p>
    </div>
  )
}
