import { Friend } from "@/api/github"
import { GithubIcon } from "@/assets/github"
import { githubQueryOptions } from "@/query/github"
import { animated } from "@react-spring/three"
import { RoundedBoxGeometry } from "@react-three/drei"
import { Html, Outlines } from "@react-three/drei/web"
import { useSuspenseQuery } from "@tanstack/react-query"
import { ComponentProps } from "react"
import { MathUtils } from "three"

type FriendProps = {
  github: {
    name: Friend
  }
} & ComponentProps<typeof animated.group>

export default function PlanetFriend({ github, ...props }: FriendProps) {
  const { data: friend } = useSuspenseQuery({
    ...githubQueryOptions,
    select(friends) {
      return friends.find((f) => f.username === github.name)!
    },
  })

  return (
    <animated.group {...props} rotation-z={MathUtils.degToRad(30)}>
      <mesh>
        <RoundedBoxGeometry args={[1, 1, 1]} radius={0.1} />
        <meshToonMaterial color={"#000000"} transparent opacity={0.5} />
        <Outlines thickness={2} color={"#ffffff"} transparent opacity={1} />
      </mesh>
      <mesh>
        <RoundedBoxGeometry args={[1.5, 0.01, 1.5]} radius={0} />
        <Outlines thickness={2} color={"#ffffff"} transparent opacity={0.5} />
      </mesh>
      <Html center position-y={0.8}>
        <div className="flex items-center">
          <GithubIcon className="mr-2 size-6 fill-zinc-500" />
          <p className="text-zinc-200">{friend.username}</p>
        </div>
      </Html>
    </animated.group>
  )
}
