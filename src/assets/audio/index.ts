import { useRef } from "react"
import bleep from "./bleep.wav"
import confirm from "./confirm.wav"
import typewriter from "./typewriter.wav"

const audioFiles = {
  bleep,
  typewriter,
  confirm,
} as const

export function useAudio(audioFileSrc: keyof typeof audioFiles) {
  const audioRef = useRef<HTMLAudioElement | null>(null!)
  if (!audioRef.current) {
    audioRef.current = new Audio(audioFiles[audioFileSrc])
  }
  function playOverlap() {
    const clone = audioRef.current!.cloneNode() as HTMLAudioElement
    return clone.play()
  }
  return {
    current: audioRef.current,
    playOverlap,
  }
}
