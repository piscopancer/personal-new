import Planet from "@/components/planet"
import { animated, useSpring } from "@react-spring/three"
import { Stars } from "@react-three/drei"
import { Canvas, useFrame } from "@react-three/fiber"
import { Bloom, EffectComposer, Vignette } from "@react-three/postprocessing"
import { ClientOnly } from "@tanstack/react-router"
import { useRef } from "react"
import { type Points } from "three"
import { SceneCtx, useSceneCtx } from "./context"

const AnimatedStars = animated(Stars)

function RotatingStars() {
  const starsRef = useRef<Points>(null!)
  const sceneCtx = useSceneCtx()

  const spring = useSpring({
    factor: sceneCtx.chatting ? 0 : 4,
    speed: sceneCtx.chatting ? 0 : 1,
    count: sceneCtx.chatting ? 0 : 10000,
    config: {
      duration: 500,
    },
  })

  useFrame((state, delta) => {
    starsRef.current.rotation.y += delta * 0.001
    starsRef.current.rotation.x += delta * 0.01
    starsRef.current.rotation.z += delta * 0.001
  })

  return (
    <AnimatedStars
      ref={starsRef}
      radius={100}
      depth={10}
      count={spring.count}
      factor={spring.factor}
      saturation={0}
      fade
      speed={spring.speed}
    />
  )
}

export default function Scene(props: SceneCtx) {
  return (
    <sceneCtx.Provider
      value={{
        chatting: sp.q !== null,
      }}
    >
      <div className='h-screen w-full bg-zinc-950 font-["Cascadia_Code"]'>
        <ClientOnly fallback={""}>
          <Canvas camera={{ position: [0, 0, 5], fov: 45 }}>
            <ambientLight intensity={0.1} />
            <directionalLight position={[5, 5, 5]} intensity={2} castShadow />
            <RotatingStars />
            <Planet />
            <EffectComposer>
              <Bloom
                intensity={1}
                luminanceThreshold={0.2}
                luminanceSmoothing={0.5}
                mipmapBlur
              />
              <Vignette eskil={false} offset={0.1} darkness={1.1} />
            </EffectComposer>
          </Canvas>
        </ClientOnly>
      </div>
    </sceneCtx.Provider>
  )
}
