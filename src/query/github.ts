import { queryGithub } from "@/api/github"
import { queryOptions } from "@tanstack/react-query"
import { queryKeys } from "."

export const githubQueryOptions = queryOptions({
  queryKey: queryKeys.github,
  queryFn: queryGithub,
})
