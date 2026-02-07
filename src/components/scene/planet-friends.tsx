import { type Friend } from "@/api/github"
import { animated } from "@react-spring/three"
import { ComponentProps } from "react"
import { Vector3 } from "three"
import PlanetFriend from "./planet-friend"

type FriendsProps = {
  friends: {
    name: Friend
  }[]
} & ComponentProps<typeof animated.group>

export default function PlanetFriends({ friends, ...props }: FriendsProps) {
  const distance = 1.5
  const positions = circularPositions(friends.length, distance, "z")

  return (
    <animated.group {...props}>
      {friends.map((friend, i) => {
        const pos = positions[i]
        return (
          <PlanetFriend
            scale={0.8}
            position-y={pos.y}
            position-x={pos.x}
            position-z={pos.z}
            key={i}
            github={{
              name: friend.name,
            }}
          />
        )
      })}
    </animated.group>
  )
}

function circularPositions(
  posCount: number,
  distance: number,
  alongAxis: "z" | "y" | "x",
) {
  const positions = []
  for (let i = 0; i < posCount; i++) {
    const angle = (i / posCount) * Math.PI * 2
    const x = Math.cos(angle) * distance
    const z = Math.sin(angle) * distance
    let pos
    if (alongAxis === "y") {
      pos = new Vector3(x, 0, z)
    } else if (alongAxis === "z") {
      pos = new Vector3(x, z, 0)
    } else {
      pos = new Vector3(0, x, z)
    }
    positions.push(pos)
  }
  return positions
}
