import { useAudio } from "@/assets/audio"
import { useEventListener } from "@/hooks/use-event-listener"
import { Route } from "@/routes/__root"
import { useStore } from "@/store"
import { chain, chatOptions, cn } from "@/util"
import { animated, useSpring } from "@react-spring/web"
import { useNavigate } from "@tanstack/react-router"
import { Group } from "@visx/group"
import { Arc } from "@visx/shape"
import {
  BriefcaseBusinessIcon,
  MessagesSquareIcon,
  Undo2Icon,
  User2Icon,
  Users2Icon,
} from "lucide-react"
import { ComponentProps, useState } from "react"
import { map } from "remeda"
import { MathUtils } from "three"

const AnimatedArc = animated(Arc)
type AnimatedArcProps = ComponentProps<typeof AnimatedArc>

const sectionsIds = [...chatOptions, "back"] as const

type SectionId = (typeof sectionsIds)[number]
const sections = chain(
  createSections({
    totalDeg: 360,
    fromDeg: -90,
    sections: [1, 1, 1, 3] as const,
  }),
)
  .next((ss) => {
    const icons = [
      Users2Icon,
      User2Icon,
      BriefcaseBusinessIcon,
      Undo2Icon,
    ] as const
    const dim = [false, false, false, true] as const
    return map(ss, (s, i) => ({
      section: s,
      option: sectionsIds[i],
      dim: dim[i],
      icon: icons[i],
    }))
  })
  .done()

export default function ChatWheel({
  width,
  height,
}: {
  width: number
  height: number
}) {
  const minSide = Math.min(width, height)
  const radius = minSide / 2
  const centerY = height / 2
  const centerX = width / 2
  const padAngle = 0.025

  const innerRadius = radius * 0.4
  const outerRadius = radius * 0.95
  const outerRadiusHidden = radius * 0.6
  const outerRadiusSelected = radius * 0.99

  const radialGap = innerRadius * padAngle * 2
  const centralCircleRadius = innerRadius - radialGap
  const midRadius = (innerRadius + outerRadius) / 2

  const [show, setShow] = useState(false)
  const [storeSnap, setStore] = useStore()
  const confirmAudio = useAudio("confirm")
  const typewriterAudio = useAudio("typewriter")

  const navigate = useNavigate({ from: Route.fullPath })
  const sp = Route.useSearch()
  const inChatRoute = !!sp.chat

  function onSelect(section: SectionId) {
    if (section === "back") {
      navigate({
        search: (prev) => ({
          ...prev,
          chat: undefined,
        }),
      })
      return
    }
    navigate({
      search: (prev) => ({
        ...prev,
        chat: section,
      }),
    })
  }

  useEventListener("pointerup", () => {
    if (show) {
      setShow(false)
      setStore((d) => {
        d.selectingChatOption = false
      })
    }
  })

  return (
    <menu className="size-full relative">
      <svg width={width} height={height} className="block">
        <Group top={centerY} left={centerX}>
          {sections.map(({ option, section, dim }, i) => {
            return (
              <WheelSector
                key={i}
                show={!(!show || (!inChatRoute && option === "back"))}
                outerRadiusHidden={outerRadiusHidden}
                outerRadius={outerRadius}
                outerRadiusSelected={outerRadiusSelected}
                isSelected={storeSnap.selectingChatOption === option}
                innerRadius={innerRadius}
                startAngle={MathUtils.degToRad(section.range[0])}
                endAngle={MathUtils.degToRad(section.range[1])}
                padAngle={padAngle}
                cornerRadius={10}
                className={cn(
                  "transition-colors cursor-crosshair stroke-1",
                  { "pointer-events-none": !show },
                  dim
                    ? "stroke-zinc-400 fill-zinc-700/80"
                    : "stroke-white fill-zinc-400/80",
                  {
                    "fill-zinc-200/80": option === "you",
                    "fill-white":
                      !dim && option === storeSnap.selectingChatOption,
                    "fill-zinc-600":
                      dim && option === storeSnap.selectingChatOption,
                  },
                )}
                onPointerUp={() => {
                  onSelect(option)
                }}
                onMouseEnter={() => {
                  typewriterAudio.playOverlap()
                  setStore((d) => {
                    d.selectingChatOption = option === "back" ? false : option
                  })
                }}
                onMouseLeave={() => {
                  setStore((d) => {
                    d.selectingChatOption = false
                  })
                }}
              />
            )
          })}
          <circle
            r={centralCircleRadius}
            className="fill-zinc-200/70 active:fill-zinc-200 scale-90 active:scale-99 duration-150 stroke-1 stroke-white cursor-crosshair"
            onPointerDown={() => {
              confirmAudio.playOverlap()
              setShow(true)
              setStore((d) => {
                d.selectingChatOption = true
              })
            }}
          />
          <Arc
            innerRadius={radius * 0}
            outerRadius={radius * 0.3}
            cornerRadius={10}
            className="fill-zinc-200/50 pointer-events-none"
            startAngle={MathUtils.degToRad(-90)}
            endAngle={MathUtils.degToRad(90)}
          />
        </Group>
      </svg>
      {/* button icons */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div
          style={{
            width: minSide,
            height: minSide,
          }}
          className="flex items-center justify-center relative"
        >
          {sections.map((section, i) => {
            const angleRad = MathUtils.degToRad(section.section.dirDeg)
            const iconX = midRadius * Math.sin(angleRad)
            const iconY = -midRadius * Math.cos(angleRad)
            return (
              <section.icon
                key={i}
                style={{
                  top: radius + iconY,
                  left: radius + iconX,
                }}
                className={cn(
                  "absolute -translate-1/2 duration-100 stroke-black size-1/10",
                  {
                    "size-0 opacity-0":
                      !show || (!inChatRoute && section.option === "back"),
                  },
                  { "stroke-white": section.dim },
                )}
              />
            )
          })}
          <MessagesSquareIcon
            className={cn(
              "duration-100 size-1/8 stroke-black",
              show && "scale-85",
            )}
          />
        </div>
      </div>
    </menu>
  )
}

type WheelSectorProps = {
  show: boolean
  isSelected: boolean
  outerRadiusSelected: number
  outerRadiusHidden: number
  outerRadius: number
} & AnimatedArcProps

function WheelSector({
  show,
  outerRadiusHidden,
  isSelected,
  outerRadius,
  outerRadiusSelected,
  ...props
}: WheelSectorProps) {
  const spring = useSpring({
    outerRadius: show
      ? isSelected
        ? outerRadiusSelected
        : outerRadius
      : outerRadiusHidden,
    opacity: show ? 1 : 0,
    config: {
      tension: 1000,
      friction: 40,
    },
  })

  return (
    <AnimatedArc
      outerRadius={spring.outerRadius}
      opacity={spring.opacity}
      {...props}
    />
  )
}

function createSections<const S extends number[]>({
  fromDeg = 0,
  totalDeg = 360,
  sections,
}: {
  fromDeg?: number
  totalDeg: number
  sections: S
}) {
  let degFilled = 0
  return map(sections, (sectionSpan) => {
    const degPerSection = totalDeg / sections.reduce((l, r) => l + r)
    const sectionDeg = degPerSection * sectionSpan
    const sectionFromDeg = fromDeg + degFilled
    degFilled += sectionDeg
    const sectionToDeg = sectionFromDeg + sectionDeg
    const dirDeg = (sectionFromDeg + sectionToDeg) / 2
    return {
      range: [sectionFromDeg, sectionToDeg] as const,
      dirDeg,
    }
  })
}
