import Link from "next/link"
import { Search } from "lucide-react"

import { WhatsAppCta } from "@/components/sections/whatsapp-cta"
import { buttonVariants } from "@/components/ui/button"
import { services } from "@/lib/services"

export default function NotFound() {
  return (
    <div className="container-page flex max-w-2xl flex-col items-center gap-6 py-20 text-center">
      <p className="tabular text-7xl font-extrabold text-brand-ink">404</p>
      <h1 className="text-3xl font-extrabold">Página não encontrada</h1>
      <p className="text-lg text-muted-foreground">
        O endereço pode ter mudado com o site novo. Procure um produto na loja, escolha um serviço abaixo ou fale direto com a gente.
      </p>
      <form action="/loja" className="flex w-full max-w-md gap-2" role="search">
        <label htmlFor="busca-404" className="sr-only">
          Buscar produto
        </label>
        <input
          id="busca-404"
          name="q"
          type="search"
          placeholder="Buscar produto na loja…"
          autoComplete="off"
          className="h-11 flex-1 rounded-lg border border-input bg-background px-3 text-base dark:bg-surface"
        />
        <button type="submit" className={buttonVariants({ size: "icon" })} aria-label="Buscar">
          <Search aria-hidden />
        </button>
      </form>
      <ul className="flex flex-wrap justify-center gap-2">
        {services.map((s) => (
          <li key={s.slug}>
            <Link href={`/servicos/${s.slug}`} className={buttonVariants({ variant: "outline", size: "sm" })}>
              {s.name}
            </Link>
          </li>
        ))}
      </ul>
      <WhatsAppCta message="Olá, JMoreira! Não encontrei uma página no site." size="lg" />
    </div>
  )
}
