import { queryOptions, useQuery, useSuspenseQuery } from "@tanstack/react-query"
import { queryKeys } from "."
import { querySpotify } from "@/api/spotify"

export const spotifyQueryOptions = queryOptions({
  queryKey: queryKeys.spotify,
  queryFn: querySpotify,
})

export function useGithubQuery() {
  return useSuspenseQuery(spotifyQueryOptions)
}
