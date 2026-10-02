import Link from "next/link"
import { CarFront, ChevronRight, ClipboardList, Droplets, ShoppingBag, Sun, Zap, type LucideIcon } from "lucide-react"
import { cn } from "cn"

// Atalhos do herói: cada serviço uma vez, com o escopo em uma linha.
// Substitui o card animado "Seu atendimento", que repetia os passos do "Como funciona".
const shortcuts: { href: string; label: string; detail: string; icon: LucideIcon; highlight?: boolean }[] = [
  { href: "/servicos/eletricista", label: "Eletricista", detail: "Quadro, disjuntores, tomadas e chuveiro", icon: Zap },
  { href: "/servicos/encanador", label: "Encanador", detail: "Vazamento, desentupimento e caixa d'água", icon: Droplets },
  { href: "/servicos/limpeza-placas-solares", label: "Limpeza de placas solares", detail: "Módulos fotovoltaicos, sem produto abrasivo", icon: Sun },
  { href: "/leva-e-traz", label: "Leva e Traz", detail: "Pessoas, encomendas pequenas e transporte executivo", icon: CarFront, highlight: true },
  { href: "/servico-particular", label: "Serviço particular", detail: "Pedido sob medida, com orçamento", icon: ClipboardList },
  { href: "/loja", label: "E-commerce", detail: "Peças hidráulicas e baterias", icon: ShoppingBag },
]

export function HeroShortcuts() {
  return (
    <nav aria-label="Atalhos de serviços" className="relative rounded-3xl border bg-card/95 p-2 shadow-lift backdrop-blur">
      <p className="px-3 pt-2 pb-1 text-sm font-semibold text-muted-foreground">Serviços e atendimentos</p>
      <ul>
        {shortcuts.map(({ href, label, detail, icon: Icon, highlight }, i) => (
          <li key={href} className="animate-rise-in" style={{ animationDelay: `${180 + i * 60}ms` }}>
            {/* prefetch desligado: seis rotas pré-carregadas na abertura pesavam no celular */}
            <Link
              href={href}
              prefetch={false}
              className={cn(
                "group flex min-h-16 items-center gap-3 rounded-2xl px-3 py-2.5 transition-colors hover:bg-muted",
                highlight && "bg-cta/10 ring-1 ring-cta/40 hover:bg-cta/15",
              )}
            >
              <span
                className={cn(
                  "grid size-10 shrink-0 place-items-center rounded-xl",
                  highlight ? "bg-cta text-cta-foreground" : "bg-brand-soft text-brand-soft-ink",
                )}
              >
                <Icon className="size-5" aria-hidden />
              </span>
              <span className="min-w-0 flex-1">
                <span className="flex items-center gap-2 font-semibold">
                  {label}
                  {highlight && <span className="rounded-full bg-cta px-2 py-0.5 text-[0.7rem] font-bold text-cta-foreground">Novo</span>}
                </span>
                <span className="block truncate text-sm text-muted-foreground">{detail}</span>
              </span>
              <ChevronRight className="size-4 shrink-0 text-muted-foreground transition-transform duration-200 group-hover:translate-x-0.5" aria-hidden />
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  )
}
