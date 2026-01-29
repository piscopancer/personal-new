import { ParentSize } from "@visx/responsive"
import ChatWheel from "./chat-wheel"

export default function Menu() {
  return (
    <div className='fixed inset-0 font-["Cascadia_Code"] flex'>
      <menu className="mt-auto flex flex-col w-full">
        <div className="h-64">
          <ParentSize>
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
        </nav>
      </menu>
    </div>
  )
}
