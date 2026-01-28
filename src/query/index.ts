import { QueryClient, QueryKey } from "@tanstack/react-query"

export const queryKeys = {
  spotify: ["spotify"],
  github: ["github"],
} as const satisfies Record<string, QueryKey | ((...key: any) => QueryKey)>
