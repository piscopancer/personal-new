import { atomWithImmer } from "jotai-immer"
import { useAtom, useAtomValue, useSetAtom } from "jotai/react"
import { ChatOption } from "./util"

type Store = {
  selectingChatOption: ChatOption | boolean
}

export const store = atomWithImmer<Store>({
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
