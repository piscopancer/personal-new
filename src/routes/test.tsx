import ChatWheel from "@/components/chat-wheel"
import { animated } from "@react-spring/web"
import { createFileRoute } from "@tanstack/react-router"
import { ParentSize } from "@visx/responsive"
import { Arc } from "@visx/shape"
import { ComponentProps } from "react"

const AnimatedArc = animated(Arc)
type AnimatedArcProps = ComponentProps<typeof AnimatedArc>

export const Route = createFileRoute("/test")({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <div className='w-108 h-140 bg-red-500/20 font-["cascadia_code"]'>
      <ParentSize>
        {({ width, height }) => <ChatWheel width={width} height={height} />}
      </ParentSize>
    </div>
  )
}
