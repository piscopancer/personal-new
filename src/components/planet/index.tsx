import { animated } from "@react-spring/three"
import { Html, Outlines, RoundedBox } from "@react-three/drei"
import { useFrame, type ThreeElements } from "@react-three/fiber"
import { useRef, useState } from "react"
import { MathUtils, type Mesh } from "three"
import Headphones from "./headphones"

const AnimatedRoundedBox = animated(RoundedBox)

type PlanetProps = {
  listening?: boolean
} & ThreeElements["group"]

export default function Planet({ listening, ...props }: PlanetProps) {
  const planetRef = useRef<Mesh>(null!)
  const [active, setActive] = useState(false)

  useFrame((state, delta) => {
    const speed = 1
    const time = state.clock.getElapsedTime()
    planetRef.current.rotation.x += MathUtils.degToRad(Math.sin(time) * 0.1)
    planetRef.current.rotation.y += delta * -0.2 * speed
  })

  return (
    <group
      ref={planetRef}
      rotation={[
        MathUtils.degToRad(0),
        MathUtils.degToRad(0),
        MathUtils.degToRad(10),
      ]}
      {...props}
    >
      <AnimatedRoundedBox
        ref={planetRef}
        args={[1, 1, 1]}
        radius={0.1}
        smoothness={4}
        bevelSegments={4}
        onPointerOver={() => setActive(true)}
        onPointerOut={() => setActive(false)}
      >
        <Html
          distanceFactor={1}
          position={[0, 0, 0.52]}
          transform
          occlude
          pointerEvents="none"
        >
          <div className="select-none translate-y-1/2 ">
            <ul className="flex gap-4 justify-center">
              <div className="w-28 h-16 bg-white rounded-b-[4rem] rounded-t-xl rotate-1"></div>
              <div className="w-28 h-16 bg-white rounded-b-[4rem] rounded-t-xl -rotate-1" />
            </ul>
            <div className="h-2 w-8 bg-white mx-auto mt-6 rounded-[1px]" />
          </div>
        </Html>
        <meshToonMaterial transparent opacity={0.98} color="#111111" />
        <Outlines thickness={2} color={"#ffffff"} transparent opacity={1} />
      </AnimatedRoundedBox>
      <Headphones headWidth={1} position={[0, 0, 0]} />
    </group>
  )
}
