import { Stars } from "@react-three/drei"
import { useFrame } from "@react-three/fiber"
import { ComponentRef, useRef } from "react"

export default function RotatingStars() {
  const starsRef = useRef<ComponentRef<typeof Stars>>(null!)

  useFrame((state, delta) => {
    starsRef.current.rotation.y += delta * 0.001
    starsRef.current.rotation.x += delta * 0.01
    starsRef.current.rotation.z += delta * 0.001
  })

  return (
    <Stars
      ref={starsRef}
      radius={100}
      count={5000}
      factor={10}
      fade
      speed={1}
      depth={50}
    />
  )
}
