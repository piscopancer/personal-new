import { useStoreValue } from "@/store"
import { cn } from "@/util"
import { animated, useSpring } from "@react-spring/three"
import { View } from "@react-three/drei"
import { BackSide } from "three"
import RotatingStars from "./stars"

export default function Scene() {
  const { selectingChatOption } = useStoreValue()
  const [value] = useSpring(
    {
      sphereOpacity: selectingChatOption ? 1 : 0,
    },
    [selectingChatOption],
  )

  return (
    <View
      className={cn(
        "absolute top-0 left-0 h-screen w-screen pointer-events-none",
      )}
    >
      <RotatingStars />
      <mesh>
        <sphereGeometry args={[100]} />
        <animated.meshBasicMaterial
          // depthWrite={false}
          side={BackSide}
          opacity={value.sphereOpacity}
          transparent
          color="#09090b"
        />
      </mesh>
    </View>
  )
}
