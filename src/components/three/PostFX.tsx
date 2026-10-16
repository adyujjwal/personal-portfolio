import {
  EffectComposer,
  Bloom,
  DepthOfField,
  Vignette,
  Noise,
  SMAA,
} from '@react-three/postprocessing'
import { BlendFunction } from 'postprocessing'

interface PostFXProps {
  bloom?: boolean
  dof?: boolean
  focusDistance?: number
  focalLength?: number
  bokehScale?: number
  vignette?: boolean
}

/**
 * Shared, cinematic postprocessing stack. Rendered only on mid/high tiers
 * (gated by the caller via `quality.postprocessing`).
 */
export function PostFX({
  bloom = true,
  dof = true,
  focusDistance = 0.01,
  focalLength = 0.05,
  bokehScale = 4,
  vignette = true,
}: PostFXProps) {
  return (
    <EffectComposer multisampling={0} enableNormalPass={false}>
      <SMAA />
      {bloom ? (
        <Bloom
          intensity={0.6}
          luminanceThreshold={0.75}
          luminanceSmoothing={0.2}
          mipmapBlur
        />
      ) : (
        <></>
      )}
      {dof ? (
        <DepthOfField
          focusDistance={focusDistance}
          focalLength={focalLength}
          bokehScale={bokehScale}
        />
      ) : (
        <></>
      )}
      {vignette ? <Vignette eskil={false} offset={0.3} darkness={0.75} /> : <></>}
      <Noise premultiply blendFunction={BlendFunction.OVERLAY} opacity={0.035} />
    </EffectComposer>
  )
}
