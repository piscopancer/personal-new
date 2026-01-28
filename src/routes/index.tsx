import { createFileRoute } from "@tanstack/react-router"
import Scene from "@/components/scene"
import Menu from "@/components/menu"
import { queryGithub } from "@/api/github"
import { ClientOnly } from "@tanstack/react-router"
import { querySpotify } from "@/api/spotify"

export const Route = createFileRoute("/")({
  component: App,
  loader: async () => {
    await Promise.all([querySpotify, queryGithub])
  },
})

function App() {
  return (
    <>
      <ClientOnly fallback={""}>
        <Scene />
      </ClientOnly>
      <Menu />
    </>
  )
}
