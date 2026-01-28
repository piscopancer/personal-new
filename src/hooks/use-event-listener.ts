import { useEffect, useRef } from "react"

export function useEventListener<K extends keyof WindowEventMap>(
  eventName: K,
  handler: (event: WindowEventMap[K]) => void,
  element: Window | HTMLElement = window,
) {
  const savedHandler = useRef(handler)
  useEffect(() => {
    savedHandler.current = handler
  }, [handler])
  useEffect(() => {
    const isSupported = element && element.addEventListener
    if (!isSupported) return
    const eventListener = (event: WindowEventMap[K]) =>
      savedHandler.current(event)
    element.addEventListener(eventName, eventListener as EventListener)

    return () => {
      element.removeEventListener(eventName, eventListener as EventListener)
    }
  }, [eventName, element])
}
