import { atomWithImmer } from "jotai-immer"
import { useAtom, useAtomValue, useSetAtom } from "jotai/react"

export const store = atomWithImmer({
  selectingChatOption: false,
})

export const useSetStore = () => useSetAtom(store)
export const useStore = () => useAtom(store)
export const useStoreValue = () => useAtomValue(store)

// const bool = useAtomValue(selectAtom(store, (s) => s.selectingChatOption))
// const set = useSetAtom(store)
// set((d) => {
//   d.selectingChatOption = false
// })
