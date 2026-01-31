import { a, useSpring } from "@react-spring/three"
import { Html, Outlines, RoundedBox } from "@react-three/drei"
import { ComponentProps, useState } from "react"
import Headphones from "./headphones"

const AnimatedRoundedBox = a(RoundedBox)

type PlanetProps = {
  listening?: boolean
  hovered?: boolean
  setHovered?: (v: boolean) => void
} & ComponentProps<typeof a.mesh>

export default function Planet({
  listening,
  // hovered,
  // setHovered,
  ...props
}: PlanetProps) {
  const [planetHovered, setPlanetHovered] = useState(false)
  const [planetSpring] = useSpring(
    planetHovered
      ? {
          rotX: 0.5,
          rotY: 0,
          rotZ: 0,
          config: {
            duration: 1000,
          },
        }
      : {
          rotX: 1, // bob
          rotY: 30,
          rotZ: 30,
          // from: [
          //   {
          //     rotX: 0,
          //     rotY: 360,
          //   },
          // ],
          config: {
            duration: 3000,
          },
          loop: true,
          onChange: (r) => console.log(r.value),
        },
    [planetHovered],
  )

  return (
    <a.group
      scale={planetSpring.rotX}
      rotation={[
        // planetSpring.rotX.to((x) => MathUtils.degToRad(x)),
        // planetSpring.rotX.get(),
        0, 0, 0,
        // planetSpring.rotY.to((y) => MathUtils.degToRad(y)),
        // planetSpring.rotZ.to((z) => MathUtils.degToRad(z)),
      ]}
    >
      <AnimatedRoundedBox
        args={[1, 1, 1]}
        radius={0.1}
        smoothness={4}
        bevelSegments={4}
        // onPointerOver={() => setHovered?.(true)}
        // onPointerOut={() => setHovered?.(false)}
        onPointerOver={() => setPlanetHovered(true)}
        onPointerOut={() => setPlanetHovered(false)}
      >
        <meshToonMaterial transparent opacity={0.98} color="#111111" />
        <Outlines thickness={2} color={"#ffffff"} transparent opacity={1} />
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
      </AnimatedRoundedBox>
      <Headphones headWidth={1} position={[0, 0, 0]} />
    </a.group>
  )
}
