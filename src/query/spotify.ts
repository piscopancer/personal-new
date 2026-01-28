import { querySpotify } from "@/api/spotify"
import { queryOptions, useSuspenseQuery } from "@tanstack/react-query"
import { queryKeys } from "."

export const spotifyQueryOptions = queryOptions({
  queryKey: queryKeys.spotify,
  queryFn: querySpotify,
})

export function useGithubQuery() {
  return useSuspenseQuery(spotifyQueryOptions)
}
