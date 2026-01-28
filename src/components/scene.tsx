import { Stars } from "@react-three/drei"
import { Canvas, useFrame } from "@react-three/fiber"
import { Bloom, EffectComposer, Vignette } from "@react-three/postprocessing"
import { useRef } from "react"
import { type Points } from "three"
import Planet from "@/components/planet"

function RotatingStars() {
  const starsRef = useRef<Points>(null!)

  useFrame((state, delta) => {
    starsRef.current.rotation.y += delta * 0.001
    starsRef.current.rotation.x += delta * 0.01
    starsRef.current.rotation.z += delta * 0.001
  })

  return <Stars ref={starsRef} radius={100} depth={10} count={10000} factor={4} saturation={0} fade speed={1} />
}

export default function Scene() {
  return (
    <div className='h-screen w-full bg-zinc-950 font-["Cascadia_Code"]'>
      <Canvas camera={{ position: [0, 0, 5], fov: 45 }}>
        <ambientLight intensity={0.1} />
        <directionalLight position={[5, 5, 5]} intensity={2} castShadow />
        <RotatingStars />
        <Planet />
        <EffectComposer>
          <Bloom
            intensity={1} // Strength of the glow
            luminanceThreshold={0.2} // How bright an object must be to glow (0 to 1)
            luminanceSmoothing={0.5} // Smoothness of the glow transition
            mipmapBlur // Higher quality blur
          />
          <Vignette eskil={false} offset={0.1} darkness={1.1} />
        </EffectComposer>
      </Canvas>
    </div>
  )
}
