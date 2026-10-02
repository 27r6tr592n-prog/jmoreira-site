"use client"

import { useEffect, useState } from "react"

/** true depois que o navegador fica ocioso (ou após `timeout` ms). Para pré-carregar o que não é urgente. */
export function useIdle(timeout = 3000) {
  const [idle, setIdle] = useState(false)
  useEffect(() => {
    const ric = window.requestIdleCallback ?? ((cb: () => void) => window.setTimeout(cb, 1500))
    const cancel = window.cancelIdleCallback ?? window.clearTimeout
    const id = ric(() => setIdle(true), { timeout })
    return () => cancel(id)
  }, [timeout])
  return idle
}
