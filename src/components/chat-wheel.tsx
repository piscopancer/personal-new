import { useEventListener } from "@/hooks/use-event-listener"
import { Route } from "@/routes/__root"
import { cn } from "@/util"
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
import { MathUtils } from "three"
import { ArrayIndices } from "type-fest"

const AnimatedArc = animated(Arc)
type AnimatedArcProps = ComponentProps<typeof AnimatedArc>

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

  const sections = [
    [-90, -30],
    [-30, 30],
    [30, 90],
  ] as const satisfies [number, number][]
  type SectionI = ArrayIndices<typeof sections>

  const [show, setShow] = useState(false)
  const [selected, setSelected] = useState<SectionI | "back" | null>(null)

  const navigate = useNavigate({ from: Route.fullPath })

  function onSelect(section: NonNullable<typeof selected>) {
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
        chat: (() => {
          switch (section) {
            case 0:
              return "wyd"
            case 1:
              return "you"
            case 2:
              return "friends"
          }
        })(),
      }),
    })
  }

  useEventListener("pointerup", () => {
    if (show) {
      setShow(false)
      setSelected(null)
    }
  })

  const sp = Route.useSearch()
  const inChatRoute = sp.chat !== null
  const midRadius = (innerRadius + outerRadius) / 2
  const icons = (
    [
      [-60, BriefcaseBusinessIcon, false],
      [0, User2Icon, false],
      [60, Users2Icon, false],
      [180, Undo2Icon, true],
    ] as const
  ).map(([deg, icon, onDark]) => ({
    deg,
    icon,
    onDark,
  }))

  return (
    <menu className="size-full relative">
      <svg width={width} height={height} className="block">
        <Group top={centerY} left={centerX}>
          {sections.map((section, _i) => {
            const i = _i as SectionI
            return (
              <WheelSector
                key={i}
                show={show}
                outerRadiusHidden={outerRadiusHidden}
                outerRadius={outerRadius}
                outerRadiusSelected={outerRadiusSelected}
                isSelected={selected === i}
                innerRadius={innerRadius}
                startAngle={MathUtils.degToRad(section[0])}
                endAngle={MathUtils.degToRad(section[1])}
                padAngle={padAngle}
                cornerRadius={10}
                className={cn(
                  "transition-colors cursor-crosshair stroke-1 stroke-white",
                  show ? "" : "pointer-events-none",
                  selected === i
                    ? "fill-white"
                    : i === 1
                      ? "fill-zinc-200/80"
                      : "fill-zinc-400/80",
                )}
                onPointerUp={() => {
                  if (i !== null) {
                    onSelect(i)
                  }
                }}
                onMouseEnter={() => setSelected(i)}
                onMouseLeave={() => setSelected(null)}
              />
            )
          })}
          <circle
            r={centralCircleRadius}
            className="fill-zinc-200/70 active:fill-zinc-200 scale-90 active:scale-99 duration-150 stroke-1 stroke-white cursor-crosshair"
            onPointerDown={() => {
              setShow(true)
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
          {inChatRoute && (
            <WheelSector
              isSelected={selected === "back"}
              show={show}
              outerRadiusHidden={outerRadiusHidden}
              outerRadius={outerRadius}
              outerRadiusSelected={outerRadiusSelected}
              innerRadius={innerRadius}
              startAngle={MathUtils.degToRad(90)}
              endAngle={MathUtils.degToRad(270)}
              padAngle={padAngle}
              cornerRadius={10}
              className={cn(
                "transition-colors cursor-crosshair stroke-1 stroke-zinc-400",
                selected === "back" ? "fill-zinc-600" : "fill-zinc-700/80",
              )}
              onPointerUp={() => {
                onSelect("back")
              }}
              onMouseEnter={() => setSelected("back")}
              onMouseLeave={() => setSelected(null)}
            />
          )}
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
          {icons.map((icon, i) => {
            if (!inChatRoute && i === 3) {
              return null
            }
            const angleRad = MathUtils.degToRad(icon.deg)
            const iconX = midRadius * Math.sin(angleRad)
            const iconY = -midRadius * Math.cos(angleRad)
            return (
              <icon.icon
                key={i}
                style={{
                  top: radius + iconY,
                  left: radius + iconX,
                }}
                className={cn(
                  "absolute -translate-1/2 duration-100",
                  show ? "size-1/10 opacity-100" : "size-0 opacity-0",
                  icon.onDark ? "stroke-white" : "stroke-black",
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
      tension: 1000, // Сильно увеличили силу
      friction: 40, // Достаточно трения, чтобы не было лишней тряски (bounce)
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
