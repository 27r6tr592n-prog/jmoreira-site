"use client"

import { useEffect } from "react"

// Só anima navegações no cliente: a primeira carga já chega pintada pelo
// servidor (animar aqui atrasaria o LCP e geraria um "piscar").
let navigated = false

/** Transição de página: fade + 12 px de subida (350 ms). Reduzido: só fade de 120 ms (CSS). */
export default function Template({ children }: { children: React.ReactNode }) {
  const firstLoad = !navigated
  useEffect(() => {
    navigated = true
  }, [])
  return <div className={firstLoad ? undefined : "page-enter"}>{children}</div>
}
