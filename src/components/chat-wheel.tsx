import { useEventListener } from "@/hooks/use-event-listener"
import { cn } from "@/util"
import { animated, useSpring } from "@react-spring/web"
import { Group } from "@visx/group"
import { Arc } from "@visx/shape"
import { ArrowDownIcon, ArrowRightCircleIcon, ArrowUpIcon } from "lucide-react"
import { ComponentProps, useState } from "react"
import colors from "tailwindcss/colors"
import { MathUtils } from "three"

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
  const outerRadius = radius * 0.9
  const outerRadiusHidden = radius * 0.6
  const outerRadiusSelected = radius * 1

  const radialGap = innerRadius * padAngle * 2
  const centralCircleRadius = innerRadius - radialGap

  const sections = [
    { start: -90, end: -30, color: colors.zinc[400] },
    { start: -30, end: 30, color: colors.zinc[300] },
    { start: 30, end: 90, color: colors.zinc[400] },
  ]

  const [show, setShow] = useState(false)
  const [selected, setSelected] = useState<number | null>(null)

  function onSelect(sectionI: number) {
    alert(sectionI)
  }

  useEventListener("pointerup", () => {
    if (show) {
      setShow(false)
      setSelected(null)
    }
  })

  const midRadius = (innerRadius + outerRadius) / 2
  const icons = (
    [
      [-60, ArrowUpIcon],
      [0, ArrowRightCircleIcon],
      [60, ArrowDownIcon],
    ] as const
  ).map(([deg, icon]) => ({
    deg,
    icon,
  }))

  return (
    <menu className="size-full relative">
      <svg width={width} height={height} className="block">
        <Group top={centerY} left={centerX}>
          {sections.map((section, i) => (
            <g key={i} style={{ cursor: "pointer" }}>
              <WheelSector
                show={show}
                outerRadiusHidden={outerRadiusHidden}
                outerRadius={outerRadius}
                outerRadiusSelected={outerRadiusSelected}
                isSelected={selected === i}
                innerRadius={innerRadius}
                startAngle={MathUtils.degToRad(section.start)}
                endAngle={MathUtils.degToRad(section.end)}
                padAngle={padAngle}
                cornerRadius={10}
                fill={selected === i ? "white" : section.color}
                stroke="white"
                strokeWidth={1}
                className="transition-colors"
                onPointerUp={() => {
                  onSelect(i)
                }}
                onMouseEnter={() => setSelected(i)}
                onMouseLeave={() => setSelected(null)}
              />
            </g>
          ))}
          <circle
            r={centralCircleRadius}
            className="fill-zinc-200/50 active:fill-zinc-200 scale-90 active:scale-100 duration-150"
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
        </Group>
      </svg>
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div
          style={{
            width: minSide,
            height: minSide,
          }}
          className="flex items-center justify-center relative"
        >
          {icons.map((icon) => {
            const angleRad = MathUtils.degToRad(icon.deg)
            const iconX = midRadius * Math.sin(angleRad)
            const iconY = -midRadius * Math.cos(angleRad)
            return (
              <icon.icon
                style={{
                  top: radius + iconY,
                  left: radius + iconX,
                }}
                className={cn(
                  "absolute stroke-black -translate-1/2",
                  show ? "size-1/10 opacity-100" : "size-0 opacity-0",
                )}
              />
            )
          })}
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
