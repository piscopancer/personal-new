import Menu from "@/components/menu"
import Scene from "@/components/scene"
import { createFileRoute } from "@tanstack/react-router"

export const Route = createFileRoute("/")({
  component: App,
})

function App() {
  return (
    <div className="font-[Cascadia_Code]">
      <Scene />
      <Menu />
    </div>
  )
}
