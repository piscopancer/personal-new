import { animated } from "@react-spring/three"
import { ComponentProps, useRef } from "react"
import { BackSide, MeshBasicMaterial } from "three"

type DarkSphereProps = {
  opacity?: number
} & ComponentProps<typeof animated.mesh>

export default function DarkSphere({ opacity, ...props }: DarkSphereProps) {
  const matRef = useRef<MeshBasicMaterial>(null!)

  return (
    <animated.mesh raycast={() => null} {...props}>
      <sphereGeometry args={[1.5, 20, 10]} />
      <animated.meshBasicMaterial
        ref={matRef}
        transparent
        color="#0066ff"
        side={BackSide}
        opacity={opacity}
        toneMapped={false}
        depthWrite={false}
      />
    </animated.mesh>
  )
}
