import { Clock, Phone, Star } from "lucide-react"

import { Logo } from "@/components/brand/logo"
import { CartButton } from "@/components/shop/cart-button"
import { buttonVariants } from "@/components/ui/button"
import { site, telHref } from "@/lib/site"
import { MobileNav } from "./mobile-nav"
import { NavLinks } from "./nav-links"
import { StickyHeader } from "./sticky-header"

export function Header() {
  return (
    <>
      <a
        href="#conteudo"
        className="sr-only z-50 rounded-lg bg-brand px-4 py-2 font-semibold text-white focus:not-sr-only focus:absolute focus:top-2 focus:left-2"
      >
        Pular para o conteúdo
      </a>

      {/* Faixa de serviço: horário, telefone e nota do Google */}
      <aside aria-label="Atendimento" className="bg-navy text-navy-foreground">
        <div className="container-page flex h-9 items-center justify-between gap-4 text-xs sm:text-[0.8rem]">
          <p className="flex items-center gap-1.5 whitespace-nowrap">
            <Clock className="size-3.5 text-cta" aria-hidden />
            <span>
              Atendimento {site.hours.short}
              <span className="hidden sm:inline"> · {site.serviceArea}</span>
            </span>
          </p>
          <div className="flex items-center gap-4">
            <p className="hidden items-center gap-1 md:flex">
              <Star className="size-3.5 fill-cta text-cta" aria-hidden />
              <span>
                <strong className="font-bold">{site.rating.value.toLocaleString("pt-BR")}</strong> no Google ·{" "}
                {site.rating.count} avaliações
              </span>
            </p>
            <a href={telHref} className="flex h-9 items-center gap-1.5 font-semibold whitespace-nowrap hover:underline">
              <Phone className="size-3.5" aria-hidden />
              {site.phone.display}
            </a>
          </div>
        </div>
      </aside>

      <StickyHeader>
        <div className="container-page flex h-16 items-center justify-between gap-4">
          <Logo />
          <nav aria-label="Principal" className="hidden lg:block">
            <NavLinks />
          </nav>
          <div className="flex items-center gap-1.5 sm:gap-2">
            <a href={telHref} className={buttonVariants({ variant: "outline", className: "hidden xl:inline-flex" })}>
              <Phone aria-hidden />
              {site.phone.display}
            </a>
            <CartButton />
            <MobileNav />
          </div>
        </div>
      </StickyHeader>
    </>
  )
}
