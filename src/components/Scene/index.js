import { EffectComposer, SSAO, Bloom, Noise } from '@react-three/postprocessing'

import { useFrame } from '@react-three/fiber'

import { BlendFunction } from 'postprocessing'

import Rotate from '../Rotate'
import UnitCube from '../UnitCube'
import WienerProcess from '../WienerProcess'
import GlitchComposer from '../GlitchComposer'
import PixelationGlitch from '../PixelationGlitch'
import CameraGlitch from '../CameraGlitch'
import ChromaticAberrationGlitch from '../ChromaticAberrationGlitch'

import { rotationCallback, wienerProcessParameters, glitchParameters } from './constants'

import { useMouseVelocity } from './hooks'

export default function Scene({ setHueRotation }) {
  useFrame(() => setHueRotation((currentHueRotation) => (currentHueRotation + 1) % 360))

  const { delay, randomizeDelay, duration, intensity, randomizeDuration, pixelizationGranularity, randomizePixelizationGranularity } =
    glitchParameters

  const { velocity: mouseVelocity, setVelocity, trapTriggered, setTrapTriggered } = useMouseVelocity({ accelerationTrapThreshold: 0.1 })

  return (
    <>
      <Rotate callback={rotationCallback}>
        <UnitCube />

        <WienerProcess parameters={{ mouseVelocity, ...wienerProcessParameters }} />
      </Rotate>

      <EffectComposer smaa>
        <GlitchComposer
          isGlitched={trapTriggered}
          delay={delay}
          randomizeDelay={randomizeDelay}
          duration={duration}
          randomizeDuration={randomizeDuration}
          setTrapTriggered={setTrapTriggered}
          setVelocity={setVelocity}>
          <CameraGlitch intensity={intensity} />

          <ChromaticAberrationGlitch offset={[0, 0]} intensity={intensity} />

          <PixelationGlitch
            granularity={pixelizationGranularity}
            randomizeGranularity={randomizePixelizationGranularity}
            intensity={intensity}
          />
        </GlitchComposer>

        <Noise blendFunction={BlendFunction.SOFT_LIGHT} />

        <Bloom intensity={2} luminanceThreshold={0.0} luminanceSmoothing={1} mipmapBlur={true} />

        <SSAO />
      </EffectComposer>
    </>
  )
}
