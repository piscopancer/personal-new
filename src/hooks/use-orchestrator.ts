// /*
// когда sp.chat = null
// - планета крутится
// - звезды видно
// - друзей не видно

// когда sp.chat = friends
// - планета не крутится
// - звезды не видно
// - друзья видны

// когда sp.chat = friends & sp.friend = nekoreal
// - друг виден и появляется на перднем плане
// - планета отдаляется на задний план
// - друзья не видны

// использует useSpring и передает анимированные значения вниз своим чебупелям.
// */

// import { Route } from "@/routes/__root"
// import { useSpring } from "@react-spring/three"
// import { createContext, useContext } from "react"

// type UseOrchestratorProps = {}

// export function useOrchestrator({}: UseOrchestratorProps) {
//   const sp = Route.useSearch()

//   const darkSphereSpring = useSpring({
//     opacity: sp.chat ? 0.9 : 0,
//     config: {
//       duration: 200,
//     },
//   })

//   const planetSpring = useSpring({})
//   const friendsSpring = useSpring({
//     // todo
//   })

//   return {
//     darkSphereSpring
//     planetSpring,
//     friendsSpring,
//   }
// }

// type OrchestratorContext = ReturnType<typeof useOrchestrator>

// const orchestratorCtx = createContext<OrchestratorContext | null>(null)

// export const OrchestratorContextProvider = orchestratorCtx.Provider

// export function useOrchestratorCtx() {
//   return useContext(orchestratorCtx)
// }
