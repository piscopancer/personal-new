import { createFileRoute } from "@tanstack/react-router"
import Scene from "@/components/scene"
import Menu from "@/components/menu"
import { ClientOnly } from "@tanstack/react-router"
import { queryKeys } from "@/query"
import { spotifyQueryOptions } from "@/query/spotify"
import { githubQueryOptions } from "@/query/github"

export const Route = createFileRoute("/")({
  component: App,
  loader: async ({ context: { qc } }) => {
    await Promise.all([
      //
      qc.ensureQueryData(spotifyQueryOptions),
      qc.ensureQueryData(githubQueryOptions),
    ])
    console.log(qc.getQueryData(queryKeys.github))
    console.log(qc.getQueryData(queryKeys.spotify))
  },
})

function App() {
  return (
    <>
      <Scene />
      <Menu />
    </>
  )
}
