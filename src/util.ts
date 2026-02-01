import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import z from "zod"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function chain<T>(val: T) {
  return {
    next: <U>(fn: (curr: T) => U) => chain(fn(val)),
    done: () => val,
  }
}

export const chatOptions = ["friends", "you", "wyd"] as const

export const searchParamsSchema = z.object({
  chat: z.enum(chatOptions).optional().catch(undefined),
})

export type ChatOption = (typeof chatOptions)[number]
