import Planet from "@/components/planet"
import { Route } from "@/routes/__root"
import { easings, useSpring } from "@react-spring/three"
import { Canvas } from "@react-three/fiber"
import { Bloom, EffectComposer, Vignette } from "@react-three/postprocessing"
import { ClientOnly } from "@tanstack/react-router"
import { useState } from "react"
import { MathUtils } from "three"
import DarkSphere from "./dark-sphere"
import RotatingStars from "./stars"

export default function Scene() {
  const sp = Route.useSearch()

  const darkSphereSpring = useSpring({
    opacity: sp.chat ? 0.9 : 0,
    config: {
      duration: 200,
    },
  })

  const [planetHovered, setPlanetHovered] = useState(false)
  const [planetSpring] = useSpring(
    planetHovered
      ? {
          rotX: 0,
          rotY: 0,
          rotZ: 0,
          config: {
            duration: 500,
            easing: easings.easeOutBack,
          },
        }
      : {
          rotX: 3, // bob
          rotY: -360, // spin
          rotZ: -10, // roll
          from: {
            rotX: 0,
            rotY: 0,
            rotZ: -10,
          },
          config: {
            duration: 30000,
            easing: easings.linear,
          },
          loop: true,
          onChange: (r) => console.log(r.value),
        },
    [planetHovered],
  )

  const friendsSpring = useSpring({})

  return (
    <div className="h-screen bg-zinc-950">
      <ClientOnly fallback={null}>
        <Canvas camera={{ position: [0, 0, 5], fov: 45 }}>
          <ambientLight intensity={0.1} />
          <directionalLight position={[5, 5, 5]} intensity={2} />
          <RotatingStars />
          <DarkSphere opacity={darkSphereSpring.opacity.get()} />
          <Planet
            rotation-x={planetSpring.rotX.to({
              range: [0, 1, 2, 3],
              output: [0, 15, -15, 0].map((v) => MathUtils.degToRad(v ?? 0)),
              easing: easings.easeInOutCubic,
            })}
            rotation-y={planetSpring.rotY.to((v) => MathUtils.degToRad(v))}
            rotation-z={planetSpring.rotZ.to((v) => MathUtils.degToRad(v))}
            hovered={planetHovered}
            setHovered={setPlanetHovered}
          />
          <EffectComposer>
            <Bloom
              intensity={1}
              luminanceThreshold={0.9}
              luminanceSmoothing={0.5}
              mipmapBlur
            />
            <Vignette eskil={false} offset={0.1} darkness={1.1} />
          </EffectComposer>
        </Canvas>
      </ClientOnly>
    </div>
  )
}
