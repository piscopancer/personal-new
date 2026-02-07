import { Friend } from "@/api/github"
import { githubQueryOptions } from "@/query/github"
import { Route } from "@/routes/__root"
import { useStoreValue } from "@/store"
import { cn } from "@/util"
import { easings, useSpring } from "@react-spring/three"
import { View, ViewProps } from "@react-three/drei"
import { useSuspenseQuery } from "@tanstack/react-query"
import { ParentSize } from "@visx/responsive"
import { AnimatePresence, motion } from "motion/react"
import { useState } from "react"
import { MathUtils } from "three"
import { match } from "ts-pattern"
import ChatWheel from "./chat-wheel"
import Planet from "./planet"
import PlanetFriends from "./scene/planet-friends"

export default function Menu() {
  const { selectingChatOption } = useStoreValue()
  return (
    <div className="fixed top-0 left-0 h-screen w-screen flex flex-col">
      <header className="h-24"></header>
      <div className="grow flex items-center justify-center">
        <MainView className="size-full overflow-visible" />
      </div>
      <section className="flex flex-col bg-linear-to-b from-transparent to-zinc-950">
        <div className="w-full">
          <AnimatePresence mode="popLayout">
            <motion.p
              key={String(selectingChatOption)}
              exit={{ y: -10, opacity: 0.5, scaleY: 0 }}
              animate={{ y: 0, opacity: 1, scaleY: 1 }}
              initial={{ y: 10, opacity: 0.5, scaleY: 0 }}
              transition={{ duration: 0.15, ease: "easeOut" }}
              className="text-zinc-200 h-lh text-center mb-4"
            >
              {match(selectingChatOption)
                .with("friends", () => "Кто твои друзья?")
                .with("wyd", () => "Чем ты занимаешься?")
                .with("you", () => "Кто ты?")
                .with(true, () => "...")
                .otherwise(() => null)}
            </motion.p>
          </AnimatePresence>
          <div className="h-64">
            <ParentSize className="pointer-events-auto">
              {({ width, height }) => (
                <ChatWheel width={width} height={height} />
              )}
            </ParentSize>
          </div>
        </div>
        <nav className="text-sm text-zinc-500 justify-center flex items-center">
          <a className="px-4 py-2 block hover:underline hover:text-zinc-400 cursor-pointer">
            telegram
          </a>
          <span>/</span>
          <a className="px-4 py-2 block hover:underline hover:text-zinc-400 cursor-pointer">
            github
          </a>
          {/* <ErrorBoundary
            FallbackComponent={({ error }) => (
              <span>{(error as Error).message}</span>
            )}
          >
            <GH />
          </ErrorBoundary> */}
        </nav>
      </section>
    </div>
  )
}

function MainView(props: ViewProps) {
  const sp = Route.useSearch()
  const storeSnap = useStoreValue()
  const { data: friends } = useSuspenseQuery(githubQueryOptions)

  const [planetHovered, setPlanetHowever] = useState(false)
  const [planetSpring] = useSpring(
    storeSnap.selectingChatOption
      ? {
          rotX: 0,
          rotY: 0,
          rotZ: 0,
          config: {
            duration: 500,
            easing: easings.easeOutBack,
          },
        }
      : {
          rotX: 3, // bob
          rotY: -360, // spin
          rotZ: -10, // roll
          from: {
            rotX: 0,
            rotY: 0,
            rotZ: -10,
          },
          config: {
            duration: 30000,
            easing: easings.linear,
          },
          loop: true,
        },
    [storeSnap.selectingChatOption],
  )

  const friendsSpring = useSpring({})

  return (
    <View
      {...props}
      className={cn(
        "relative",
        {
          "cursor-pointer": planetHovered,
        },
        props.className,
      )}
    >
      <ambientLight intensity={0.1} />
      <directionalLight position={[5, 5, 5]} intensity={2} />
      <Planet
        rotation-x={planetSpring.rotX.to({
          range: [0, 1, 2, 3],
          output: [0, 15, -15, 0].map((v) => MathUtils.degToRad(v ?? 0)),
          easing: easings.easeInOutCubic,
        })}
        rotation-y={planetSpring.rotY.to((v) => MathUtils.degToRad(v))}
        rotation-z={planetSpring.rotZ.to((v) => MathUtils.degToRad(v))}
        hovered={planetHovered}
        setHovered={(v) => {
          setPlanetHowever(v)
        }}
      />
      {sp.chat === "friends" && (
        <PlanetFriends
          friends={friends
            .filter((f) => f.username !== "piscopancer")
            .map((f) => ({ name: f.username as Friend }))}
        />
      )}
    </View>
  )
}
