import { MessagesSquareIcon } from "lucide-react"

export default function Menu() {
  return (
    <div className='fixed inset-0 font-["Cascadia_Code"] flex'>
      <menu className='mt-auto flex grow flex-col'>
        <button className='bg-zinc-200 mb-12 size-20 rounded-full mx-auto flex items-center justify-center outline-4 outline-white/40 outline-offset-2 hover:outline-offset-4 hover:outline-8 hover:outline-white/20 duration-200 ease-out hover:scale-105'>
          <MessagesSquareIcon className='size-8' />
        </button>
        <nav className='text-sm text-zinc-500 justify-center flex'>
          <a className='px-4 py-2 block hover:underline hover:text-zinc-400 cursor-pointer'>telegram</a>
          <a className='px-4 py-2 block hover:underline hover:text-zinc-400 cursor-pointer'>whatsapp</a>
          <a className='px-4 py-2 block hover:underline hover:text-zinc-400 cursor-pointer'>github</a>
        </nav>
      </menu>
    </div>
  )
}
