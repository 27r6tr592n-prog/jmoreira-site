"use client"

import Link from "next/link"
import { ClipboardList, Phone } from "lucide-react"

import { WhatsAppIcon } from "@/components/brand/icons"
import { Logo } from "@/components/brand/logo"
import { buttonVariants } from "@/components/ui/button"
import { Sheet, SheetContent, SheetDescription, SheetTitle } from "@/components/ui/sheet"
import { cta } from "@/lib/copy"
import { requestServiceHref, site, telHref } from "@/lib/site"
import { whatsappUrl } from "@/lib/whatsapp"
import { NavLinks } from "./nav-links"

/** Painel do menu no celular (carregado sob demanda pelo MobileNav). */
export function MobileNavSheet({ open, onOpenChange }: { open: boolean; onOpenChange: (open: boolean) => void }) {
  const setOpen = onOpenChange
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="gap-0 p-0 data-[side=right]:w-[88vw] data-[side=right]:max-w-sm">
        <div className="border-b p-4 pr-14">
          <Logo />
        </div>
        <SheetTitle className="sr-only">Menu</SheetTitle>
        <SheetDescription className="sr-only">Navegação principal e contatos da JMoreira</SheetDescription>
        <nav aria-label="Menu" className="p-3">
          <NavLinks vertical onNavigate={() => setOpen(false)} />
          <ul className="mt-2 flex flex-col border-t pt-2">
            {[
              { href: "/dicas", label: "Dicas de reparo" },
              { href: "/seja-prestador", label: "Seja prestador" },
            ].map((l) => (
              <li key={l.href}>
                <Link href={l.href} onClick={() => setOpen(false)} className="flex h-11 items-center rounded-lg px-3 text-sm text-muted-foreground hover:bg-muted hover:text-foreground">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <div className="mt-auto space-y-2 border-t p-4">
          <Link
            href={requestServiceHref}
            onClick={() => setOpen(false)}
            className={buttonVariants({ variant: "outline", size: "lg", className: "w-full" })}
          >
            <ClipboardList aria-hidden />
            Solicitar serviço
          </Link>
          <a
            href={whatsappUrl("Olá, JMoreira! Vim pelo site e preciso de atendimento.")}
            target="_blank"
            rel="noopener noreferrer"
            className={buttonVariants({ variant: "cta", size: "lg", className: "w-full" })}
          >
            <WhatsAppIcon className="size-5" />
            {cta.whatsapp}
          </a>
          <a href={telHref} className={buttonVariants({ variant: "outline", size: "lg", className: "w-full" })}>
            <Phone aria-hidden />
            Ligar {site.phone.display}
          </a>
          <p className="pt-1 text-center text-xs text-muted-foreground">{site.hours.label}</p>
        </div>
      </SheetContent>
    </Sheet>
  )
}
