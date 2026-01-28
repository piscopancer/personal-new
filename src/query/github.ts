import { queryOptions, useQuery, useSuspenseQuery } from "@tanstack/react-query"
import { queryKeys } from "."
import { queryGithub } from "@/api/github"

export const githubQueryOptions = queryOptions({
  queryKey: queryKeys.github,
  queryFn: queryGithub,
})

export function useGithubQuery() {
  return useSuspenseQuery(githubQueryOptions)
}
