import Menu from "@/components/menu"
import Scene from "@/components/scene"
import { View } from "@react-three/drei"
import { Canvas } from "@react-three/fiber"
import { createFileRoute } from "@tanstack/react-router"

export const Route = createFileRoute("/")({
  component: App,
})

function App() {
  return (
    <div className="relative h-screen overflow-hidden font-[Cascadia_Code] bg-zinc-950">
      <Canvas
        camera={{ fov: 30 }}
        id="canvas"
        eventSource={document?.body ?? undefined}
        className="w-screen h-screen fixed top-0 left-0 transparent"
      >
        <View.Port />
      </Canvas>
      <Scene />

      <Menu />
    </div>
  )
}
