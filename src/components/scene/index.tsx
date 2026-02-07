import { cn } from "@/util"
import { View } from "@react-three/drei"
import RotatingStars from "./stars"

export default function Scene() {
  return (
    <View
      className={cn(
        "absolute top-0 left-0 h-screen w-screen pointer-events-none",
      )}
    >
      <RotatingStars />
    </View>
  )
}
