import { createContext, useContext } from "react"

export type SceneCtx = {
  chatting: boolean
}

export const sceneCtx = createContext<SceneCtx>(null!)

export function useSceneCtx() {
  return useContext(sceneCtx)
}
