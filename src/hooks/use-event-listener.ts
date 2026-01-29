import { useEffect, useRef } from "react"

export function useEventListener<K extends keyof WindowEventMap>(
  eventName: K,
  handler: (event: WindowEventMap[K]) => void,
  element?: Window | HTMLElement | null,
) {
  const savedHandler = useRef(handler)
  useEffect(() => {
    savedHandler.current = handler
  }, [handler])
  useEffect(() => {
    const targetElement: Window | HTMLElement = element ?? window
    if (!(targetElement && targetElement.addEventListener)) return
    const eventListener = (event: WindowEventMap[K]) =>
      savedHandler.current(event)
    targetElement.addEventListener(eventName, eventListener as EventListener)
    return () => {
      targetElement.removeEventListener(
        eventName,
        eventListener as EventListener,
      )
    }
  }, [eventName, element])
}
