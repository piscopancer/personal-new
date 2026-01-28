import { QueryClient, QueryKey } from "@tanstack/react-query"

const queryKeys = {
  spotify: ["spotify"],
  github: ["github"],
} as const satisfies Record<string, QueryKey | ((...key: any) => QueryKey)>

export const qc = new QueryClient({
  defaultOptions: {
    queries: {
      gcTime: Infinity,
      refetchInterval: 60_000,
    },
  },
})
