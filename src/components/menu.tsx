import { Route } from "@/routes/__root"
import { store } from "@/store"
import { cn } from "@/util"
import { easings, useSpring } from "@react-spring/three"
import { View, ViewProps } from "@react-three/drei"
import { ParentSize } from "@visx/responsive"
import { useAtom } from "jotai/react"
import { useState } from "react"
import { MathUtils } from "three"
import ChatWheel from "./chat-wheel"
import Planet from "./planet"

export default function Menu() {
  return (
    <div className="fixed top-0 left-0 h-screen w-screen flex flex-col">
      <header className="h-24"></header>
      <MainView className="grow w-full" index={1} />
      <section className="h-80 flex flex-col bg-linear-to-b from-transparent to-zinc-950">
        <div className="grow ">
          <ParentSize className="pointer-events-auto">
            {({ width, height }) => <ChatWheel width={width} height={height} />}
          </ParentSize>
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
  const [stateSnap, setState] = useAtom(store)

  const [planetHovered, setPlanetHowever] = useState(false)
  const [planetSpring] = useSpring(
    stateSnap.selectingChatOption
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
    [stateSnap.selectingChatOption],
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
    </View>
  )
}
