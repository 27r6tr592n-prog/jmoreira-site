"use client"

import { useEffect } from "react"

/** Pede confirmação do navegador ao sair da página com um formulário preenchido e não enviado. */
export function useUnsavedWarning(active: boolean) {
  useEffect(() => {
    if (!active) return
    const warn = (e: BeforeUnloadEvent) => e.preventDefault()
    window.addEventListener("beforeunload", warn)
    return () => window.removeEventListener("beforeunload", warn)
  }, [active])
}
