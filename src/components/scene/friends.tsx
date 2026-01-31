import { animated } from "@react-spring/three"
import { ComponentType } from "react"
import Friend from "./friend"

type FriendsProps = {
  friends: {
    name: string
  }[]
} & ComponentType<typeof animated.group>

export default function Friends({ friends, ...props }: FriendsProps) {
  return (
    <animated.group {...props}>
      {friends.map((friend, i) => (
        <Friend
          key={i}
          github={{
            name: friend.name,
          }}
        />
      ))}
    </animated.group>
  )
}
