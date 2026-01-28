import { QueryClient } from "@tanstack/react-query"
import { createRouter } from "@tanstack/react-router"
import { setupRouterSsrQueryIntegration } from "@tanstack/react-router-ssr-query"
import { routeTree } from "./routeTree.gen"

export function getRouter() {
  const qc = new QueryClient({
    defaultOptions: {
      queries: {
        gcTime: Infinity,
        refetchInterval: 60_000,
        refetchOnWindowFocus: true,
      },
    },
  })

  const router = createRouter({
    context: {
      qc,
    },
    routeTree,
    scrollRestoration: true,
  })
  setupRouterSsrQueryIntegration({
    router,
    queryClient: qc,
  })
  return router
}

declare module "@tanstack/react-router" {
  interface Register {
    router: ReturnType<typeof getRouter>
  }
}
