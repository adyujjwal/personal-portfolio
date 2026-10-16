import { Suspense, useEffect, useMemo, useRef, useState, Component, type ReactNode } from 'react'
import { Canvas } from '@react-three/fiber'
import { useGLTF, useAnimations, Environment, Lightformer, OrbitControls } from '@react-three/drei'
import * as THREE from 'three'

/**
 * Dev-only preview tool. Open the site with `?lab` in the URL to browse every
 * animation clip on the avatar and decide which to use. Not part of the site.
 */

const BASE = 'https://raw.githubusercontent.com/readyplayerme/animation-library/master/masculine/glb'

type Clip = { label: string; url: string }

const CLIPS: Clip[] = [
  ...[1, 2, 3, 4, 5, 6, 7, 8, 9, 11].map((n) => ({
    label: `Dance ${n}`,
    url: `${BASE}/dance/M_Dances_${String(n).padStart(3, '0')}.glb`,
  })),
  ...[1, 2, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18].map((n) => ({
    label: `Gesture ${n}`,
    url: `${BASE}/expression/M_Standing_Expressions_${String(n).padStart(3, '0')}.glb`,
  })),
  ...[1, 2, 3, 4, 5].map((n) => ({
    label: `Idle var ${n}`,
    url: `${BASE}/idle/M_Standing_Idle_Variations_${String(n).padStart(3, '0')}.glb`,
  })),
]

class ClipBoundary extends Component<{ url: string; children: ReactNode }, { err: boolean }> {
  state = { err: false }
  static getDerivedStateFromError() {
    return { err: true }
  }
  componentDidUpdate(prev: { url: string }) {
    if (prev.url !== this.props.url && this.state.err) this.setState({ err: false })
  }
  render() {
    return this.state.err ? null : this.props.children
  }
}

function LabAvatar({ url }: { url: string }) {
  const group = useRef<THREE.Group>(null)
  const { scene } = useGLTF('/images/downloaded/model.glb')
  const { animations } = useGLTF(url)
  const { actions, names } = useAnimations(animations, group)

  useEffect(() => {
    const a = actions[names[0]]
    a?.reset().fadeIn(0.25).setLoop(THREE.LoopRepeat, Infinity).play()
    return () => void a?.fadeOut(0.25)
  }, [actions, names])

  return (
    <group ref={group} position={[0, -1.5, 0]} scale={1.4}>
      <primitive object={scene} />
    </group>
  )
}

export function AnimationLab() {
  const [i, setI] = useState(0)
  const clip = CLIPS[i]
  const next = () => setI((v) => (v + 1) % CLIPS.length)
  const prev = () => setI((v) => (v - 1 + CLIPS.length) % CLIPS.length)
  const grouped = useMemo(() => CLIPS.map((c, idx) => ({ ...c, idx })), [])

  return (
    <div className="fixed inset-0 bg-ink-950 text-bone-100">
      <Canvas camera={{ position: [0, 0.2, 4.2], fov: 35 }} dpr={[1, 2]}>
        <ambientLight intensity={0.9} />
        <directionalLight position={[3, 6, 4]} intensity={2} />
        <Suspense fallback={null}>
          <ClipBoundary url={clip.url}>
            <LabAvatar url={clip.url} />
          </ClipBoundary>
          <Environment resolution={128}>
            <Lightformer intensity={1.6} position={[0, 3, 3]} scale={[7, 7, 1]} />
          </Environment>
        </Suspense>
        <OrbitControls enablePan={false} minDistance={2.5} maxDistance={7} target={[0, 0, 0]} />
      </Canvas>

      {/* Controls */}
      <div className="pointer-events-none absolute inset-x-0 top-0 flex flex-col items-center gap-2 p-5">
        <div className="pointer-events-auto flex items-center gap-3 rounded-full border border-white/10 bg-ink-800/80 px-4 py-2 backdrop-blur">
          <button onClick={prev} className="rounded-full px-3 py-1 hover:bg-white/10">←</button>
          <span className="min-w-[9rem] text-center font-display font-semibold">{clip.label}</span>
          <button onClick={next} className="rounded-full px-3 py-1 hover:bg-white/10">→</button>
        </div>
        <p className="text-xs text-bone-400">{clip.url.split('/').pop()}</p>
      </div>

      {/* Full list */}
      <div className="absolute bottom-0 left-0 right-0 max-h-[34vh] overflow-y-auto border-t border-white/10 bg-ink-900/85 p-4 backdrop-blur">
        <div className="flex flex-wrap gap-2">
          {grouped.map((c) => (
            <button
              key={c.idx}
              onClick={() => setI(c.idx)}
              className={`rounded-lg border px-3 py-1.5 text-sm transition-colors ${
                c.idx === i
                  ? 'border-accent bg-accent/20 text-white'
                  : 'border-white/10 text-bone-300 hover:bg-white/5'
              }`}
            >
              {c.label}
            </button>
          ))}
        </div>
        <p className="mt-3 text-xs text-bone-400">
          Drag to rotate · scroll to zoom. Note the labels you like and tell me which to use for the
          wave / dance / gestures.
        </p>
      </div>
    </div>
  )
}
