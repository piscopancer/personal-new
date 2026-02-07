/// <reference types="vite/client" />
import { githubQueryOptions } from "@/query/github"
import { spotifyQueryOptions } from "@/query/spotify"
import style from "@/style.css?url"
import { searchParamsSchema } from "@/util"
import { QueryClient } from "@tanstack/react-query"
import {
  createRootRouteWithContext,
  HeadContent,
  Outlet,
  Scripts,
} from "@tanstack/react-router"
import type { ReactNode } from "react"

export const Route = createRootRouteWithContext<{
  qc: QueryClient
}>()({
  loader: async ({ context: { qc } }) => {
    await Promise.allSettled([
      qc.ensureQueryData(spotifyQueryOptions),
      qc.ensureQueryData(githubQueryOptions),
    ])
  },
  validateSearch(search) {
    return searchParamsSchema.parse(search)
  },
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "piscodev" },
    ],
    links: [
      { rel: "icon", type: "image/svg+xml", href: "/favicon.svg" },
      { rel: "stylesheet", href: style },
    ],
  }),
  component: RootComponent,
})

function RootDocument({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html className="scheme-only-dark [scrollbar-width:thin]">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  )
}

function RootComponent() {
  return (
    <RootDocument>
      <Outlet />
    </RootDocument>
  )
}
