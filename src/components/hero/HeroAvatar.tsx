import { useEffect, useMemo, useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { useGLTF, useAnimations, Environment, Lightformer } from '@react-three/drei'
import * as THREE from 'three'
import { LazyCanvas } from '../three/LazyCanvas'

// A rigged human avatar + retargeted idle/wave/gesture/dance clips (RPM skeleton).
const AVATAR = '/images/downloaded/model.glb'
const IDLE = '/models/avatar-idle.glb'
const WAVE = '/models/avatar-wave.glb'
const DANCE = '/models/avatar-dance.glb'
const GESTURE1 = '/models/avatar-gesture-1.glb'
const GESTURE2 = '/models/avatar-gesture-2.glb'

function Avatar({ reduced }: { reduced: boolean }) {
  const group = useRef<THREE.Group>(null)
  const { scene } = useGLTF(AVATAR)
  const { animations: idleAnim } = useGLTF(IDLE)
  const { animations: waveAnim } = useGLTF(WAVE)
  const { animations: danceAnim } = useGLTF(DANCE)
  const { animations: g1Anim } = useGLTF(GESTURE1)
  const { animations: g2Anim } = useGLTF(GESTURE2)
  const { pointer } = useThree()

  const clips = useMemo(() => {
    const named = (arr: THREE.AnimationClip[], name: string) => {
      const c = arr[0]?.clone()
      if (c) c.name = name
      return c
    }
    return [
      named(idleAnim, 'Idle'),
      named(waveAnim, 'Wave'),
      named(danceAnim, 'Dance'),
      named(g1Anim, 'Gesture1'),
      named(g2Anim, 'Gesture2'),
    ].filter(Boolean) as THREE.AnimationClip[]
  }, [idleAnim, waveAnim, danceAnim, g1Anim, g2Anim])

  const { actions, mixer } = useAnimations(clips, group)
  // Click handler trigger, set once actions are ready.
  const reactRef = useRef<(() => void) | null>(null)
  const dancing = useRef(false)
  // Manual weight crossfade: from -> to over `dur`, weights always sum to 1.
  const tr = useRef<{
    from: THREE.AnimationAction | null
    to: THREE.AnimationAction | null
    t: number
    dur: number
  }>({ from: null, to: null, t: 1, dur: 0 })

  useEffect(() => {
    scene.traverse((o) => {
      const m = o as THREE.Mesh
      if (m.isMesh) {
        m.castShadow = true
        m.frustumCulled = false
      }
    })
  }, [scene])

  useEffect(() => {
    const idle = actions['Idle']
    const dance = actions['Dance']
    const wave = actions['Wave']
    if (!idle) return

    idle.reset().setLoop(THREE.LoopRepeat, Infinity).play()
    idle.setEffectiveWeight(0)
    ;['Wave', 'Dance', 'Gesture1', 'Gesture2'].forEach((n) => actions[n]?.setEffectiveWeight(0))

    const transitionTo = (
      next: THREE.AnimationAction | null,
      loop: boolean,
      dur = 0.4,
      resetTime = true,
    ) => {
      if (!next) return
      if (resetTime) next.reset()
      next.setLoop(loop ? THREE.LoopRepeat : THREE.LoopOnce, loop ? Infinity : 1)
      next.clampWhenFinished = !loop
      next.enabled = true
      next.play()
      const prev = tr.current.to
      if (prev === next) return
      next.setEffectiveWeight(0)
      tr.current = { from: prev, to: next, t: 0, dur }
    }

    const playOneShot = (name: string, dur = 0.35) => transitionTo(actions[name] ?? null, false, dur)

    // Loop the hi-wave continuously as the character's resting motion.
    if (!reduced && wave) {
      wave.reset().setLoop(THREE.LoopRepeat, Infinity).play()
      wave.time = 0.35 // start a touch in so the greeting reads immediately
      wave.setEffectiveWeight(1)
      tr.current = { from: null, to: wave, t: 1, dur: 0 }
    } else {
      idle.setEffectiveWeight(1)
      tr.current = { from: null, to: idle, t: 1, dur: 0 }
    }

    const onFinished = (e: { action: THREE.AnimationAction }) => {
      if (e.action !== tr.current.to) return
      // After a one-shot dance, fade back into the looping wave.
      if (e.action === dance) {
        dancing.current = false
        transitionTo(wave ?? idle, true, 0.4)
      }
    }
    mixer.addEventListener('finished', onFinished as never)

    // Click → dance, then (via onFinished) back to the wave loop.
    reactRef.current = () => {
      if (dancing.current || !dance) return
      dancing.current = true
      playOneShot('Dance', 0.3)
    }

    return () => {
      mixer.removeEventListener('finished', onFinished as never)
      reactRef.current = null
    }
  }, [actions, mixer, reduced])

  useFrame((state, dt) => {
    // Manual crossfade — weights always sum to 1, so the bind pose never shows.
    const x = tr.current
    if (x.to && x.t < 1) {
      x.t = Math.min(1, x.t + dt / Math.max(0.001, x.dur))
      x.to.setEffectiveWeight(x.t)
      if (x.from && x.from !== x.to) x.from.setEffectiveWeight(1 - x.t)
    }

    if (!group.current) return
    const t = state.clock.elapsedTime
    const targetY = reduced ? 0 : pointer.x * 0.2
    group.current.rotation.y = THREE.MathUtils.damp(group.current.rotation.y, targetY, 3, dt)
    group.current.position.y = -1.3 + (reduced ? 0 : Math.sin(t * 1.1) * 0.03)
  })

  return (
    <group
      ref={group}
      position={[0.2, -1.3, 0]}
      rotation={[0, 0, 0]}
      scale={1.2}
      onClick={(e) => {
        e.stopPropagation()
        reactRef.current?.()
      }}
    >
      <primitive object={scene} />
    </group>
  )
}

function AvatarContents() {
  const reduced =
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches
  return (
    <>
      <ambientLight intensity={0.8} />
      <directionalLight position={[3, 6, 4]} intensity={2.2} castShadow shadow-mapSize={[1024, 1024]} />
      <pointLight position={[-4, 2, 3]} intensity={30} color="#6ea8ff" />
      <pointLight position={[4, 0, 2]} intensity={16} color="#5de4c7" />
      <Avatar reduced={reduced} />
      <Environment resolution={128}>
        <Lightformer intensity={1.8} position={[0, 3, 3]} scale={[7, 7, 1]} />
        <Lightformer intensity={1.4} color="#6ea8ff" position={[-4, 1, 3]} scale={[2, 6, 1]} />
        <Lightformer intensity={1.2} color="#ffffff" position={[4, 1, 2]} scale={[2, 6, 1]} />
      </Environment>
    </>
  )
}

export function HeroAvatar() {
  return (
    <LazyCanvas className="h-full w-full" camera={{ position: [0, 0.2, 4.3], fov: 34 }} fallback={null}>
      <AvatarContents />
    </LazyCanvas>
  )
}

useGLTF.preload(AVATAR)
useGLTF.preload(IDLE)
useGLTF.preload(WAVE)
useGLTF.preload(DANCE)
useGLTF.preload(GESTURE1)
useGLTF.preload(GESTURE2)
