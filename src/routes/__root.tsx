/// <reference types="vite/client" />
import type { ReactNode } from "react"
import { Outlet, createRootRoute, createRootRouteWithContext, HeadContent, Scripts } from "@tanstack/react-router"
import style from "@/style.css?url"
import { QueryClient, QueryClientConfig, QueryClientProvider } from "@tanstack/react-query"

export const Route = createRootRouteWithContext<{
  qc: QueryClient
}>()({
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

function RootComponent() {
  return (
    <RootDocument>
      <Outlet />
    </RootDocument>
  )
}

function RootDocument({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html>
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
