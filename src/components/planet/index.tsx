import { useStore } from "@/store"
import { a, useSpring } from "@react-spring/three"
import { Html, Outlines, RoundedBox } from "@react-three/drei"
import { ComponentProps, useState } from "react"
import { MathUtils } from "three"
import Headphones from "./headphones"

const AnimatedRoundedBox = a(RoundedBox)

type PlanetProps = {
  listening?: boolean
  hovered?: boolean
  setHovered?: (v: boolean) => void
} & ComponentProps<typeof a.group>

export default function Planet({
  listening,
  hovered,
  setHovered,
  ...props
}: PlanetProps) {
  const [stateSnap] = useStore()

  const [headphonesSpring] = useSpring(
    {
      ...(stateSnap.selectingChatOption
        ? {
            posX: 0,
            posY: 0.5,
            posZ: 0,
            rotX: -50,
          }
        : {
            posX: 0,
            posY: 0,
            posZ: 0,
            rotX: 0,
          }),
      config: {
        tension: 500,
      },
    },
    [stateSnap.selectingChatOption],
  )

  const [tapped, setTapped] = useState(false)
  const [planetSpring] = useSpring(
    {
      scaleY: tapped ? 0.9 : 1,
      config: {
        friction: 10,
        tension: 500,
      },
    },
    [tapped],
  )

  return (
    <a.group {...props}>
      <AnimatedRoundedBox
        args={[1, 1, 1]}
        radius={0.1}
        smoothness={4}
        bevelSegments={4}
        scale-y={planetSpring.scaleY}
        onPointerDown={() => {
          setTapped(true)
        }}
        onPointerUp={() => {
          setTapped(false)
        }}
        onPointerEnter={() => setHovered?.(true)}
        onPointerLeave={() => {
          if (tapped) {
            setTapped(false)
          }
          setHovered?.(false)
        }}
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
      <Headphones
        headWidth={1}
        position-x={headphonesSpring.posX}
        position-y={headphonesSpring.posY}
        position-z={headphonesSpring.posZ}
        rotation-x={headphonesSpring.rotX.to((v) => MathUtils.degToRad(v))}
      />
    </a.group>
  )
}
