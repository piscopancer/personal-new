import { githubQueryOptions } from "@/query/github"
import { animated } from "@react-spring/three"
import { RoundedBoxGeometry } from "@react-three/drei"
import { Html } from "@react-three/drei/web"
import { useSuspenseQuery } from "@tanstack/react-query"
import { ComponentProps } from "react"

type FriendProps = {
  github: {
    name: string
  }
} & ComponentProps<typeof animated.group>

export default function Friend({ github, ...props }: FriendProps) {
  // const orch = useOrchestratorCtx()

  const { data: friend } = useSuspenseQuery({
    ...githubQueryOptions,
    select(friends) {
      return friends.find((f) => f.username === github.name)!
    },
  })

  return (
    <animated.group {...props}>
      <mesh>
        <RoundedBoxGeometry args={[1, 1, 1]} radius={4} />
        <meshToonMaterial color={"#000000"} transparent opacity={0.9} />
      </mesh>
      <Html>
        <div className="text-zinc-200">{friend.username}</div>
      </Html>
    </animated.group>
  )
}
