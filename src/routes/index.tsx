import Menu from "@/components/menu"
import Scene from "@/components/scene"
import { queryKeys } from "@/query"
import { githubQueryOptions } from "@/query/github"
import { spotifyQueryOptions } from "@/query/spotify"
import { createFileRoute } from "@tanstack/react-router"

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
