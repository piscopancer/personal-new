import coverUrl from "@/assets/mercurial_world.jpeg"
import { createServerFn } from "@tanstack/react-start"

type SpotifyInfo = {
  audio: {
    coverUrl: string
    title: string
    artist: string
    url: string
  } | null
}

export const querySpotify = createServerFn({ method: "GET" }).handler(
  async () => {
    return {
      audio: {
        artist: "Magdalena Bay",
        coverUrl,
        title: "Mercurial World",
        url: "gofuckyourself.com",
      },
    } satisfies SpotifyInfo
  },
)
