"use client"

import { useState } from "react"
import dynamic from "next/dynamic"
import { Menu } from "lucide-react"

import { Button } from "@/components/ui/button"
import { useIdle } from "@/lib/use-idle"

// O painel (Dialog do Base UI) é carregado sob demanda: o botão já nasce pronto.
const MobileNavSheet = dynamic(() => import("./mobile-nav-sheet").then((m) => m.MobileNavSheet), { ssr: false })

export function MobileNav() {
  const [open, setOpen] = useState(false)
  const idle = useIdle()
  return (
    <>
      <Button variant="ghost" size="icon" className="lg:hidden" aria-label="Abrir menu" aria-haspopup="dialog" aria-expanded={open} onClick={() => setOpen(true)}>
        <Menu className="size-6" aria-hidden />
      </Button>
      {(idle || open) && <MobileNavSheet open={open} onOpenChange={setOpen} />}
    </>
  )
}
