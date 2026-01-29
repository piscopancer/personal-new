import Menu from "@/components/menu"
import Scene from "@/components/scene"
import { createFileRoute } from "@tanstack/react-router"
import { z } from "zod"

export const Route = createFileRoute("/chat/")({
  component: RouteComponent,
  validateSearch(search) {
    return z
      .object({
        q: z.enum(["you", "friends", "wyd"]).nullable().catch(null),
      })
      .parse(search)
  },
})

function RouteComponent() {
  const sp = Route.useSearch()

  return (
    <>
      <Scene chatting={sp.q !== null} />
      <Menu />
    </>
  )
}
