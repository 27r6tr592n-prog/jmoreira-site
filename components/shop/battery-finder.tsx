"use client"

import Image from "next/image"
import Link from "next/link"
import { useState } from "react"
import { ArrowRight, BatteryCharging, Bike, Car, CarFront, Info, MonitorSmartphone, Sun, Truck, type LucideIcon } from "lucide-react"
import { cn } from "cn"

import { WhatsAppIcon } from "@/components/brand/icons"
import { formatBRL } from "@/lib/format"
import { whatsappUrl } from "@/lib/whatsapp"

export type FinderProduct = {
  slug: string
  name: string
  brand: string
  image: string
  price: number
  amperage: number
  inStock: boolean
  /** slug da categoria: baterias-automotivas | baterias-moto | baterias-estacionarias */
  category: string
}

const AUTO = "baterias-automotivas"
const MOTO = "baterias-moto"
const ESTACIONARIA = "baterias-estacionarias"

// Referências de mercado. Sempre confira o manual ou a bateria atual.
const uses: { id: string; label: string; detail: string; icon: LucideIcon; category: string; ah: number[]; note: string }[] = [
  { id: "compacto", category: AUTO, label: "Carro compacto", detail: "Uno, Palio, Celta, Ka antigos", icon: Car, ah: [40], note: "Carros compactos mais antigos costumam usar 40Ah." },
  { id: "hatch", category: AUTO, label: "Hatch ou sedã 1.0 a 1.6", detail: "Onix, HB20, Gol, Argo, Polo", icon: CarFront, ah: [50, 60], note: "A maioria dos carros populares atuais usa entre 50Ah e 60Ah." },
  { id: "suv", category: AUTO, label: "SUV, sedã 2.0 ou com muitos acessórios", detail: "Compass, T-Cross, Corolla Cross", icon: CarFront, ah: [70], note: "Carros maiores ou com som, rastreador e câmeras pedem 70Ah." },
  { id: "picape", category: AUTO, label: "Picape diesel, van ou utilitário", detail: "Hilux, S10, Ranger, Sprinter", icon: Truck, ah: [100], note: "Motores a diesel e utilitários grandes usam 100Ah ou mais." },
  { id: "moto", category: MOTO, label: "Moto até 160 cc", detail: "CG, Fan, Titan, Biz, Factor", icon: Bike, ah: [5], note: "Motos de 110 a 160 cc usam, em geral, 5Ah." },
  { id: "moto-media", category: MOTO, label: "Moto de 250 a 300 cc", detail: "Fazer, Twister, CB 300", icon: Bike, ah: [8], note: "Motos de média cilindrada usam em torno de 8Ah." },
  { id: "nobreak", category: ESTACIONARIA, label: "Nobreak, alarme ou portão", detail: "Equipamentos de 12V", icon: MonitorSmartphone, ah: [7], note: "A bateria padrão de nobreak e central de alarme é a 12V 7Ah." },
  { id: "solar", category: ESTACIONARIA, label: "Energia solar ou backup", detail: "Sistemas off-grid e banco de baterias", icon: Sun, ah: [70, 115], note: "Use bateria estacionária de ciclo profundo. A quantidade depende do consumo." },
]

export function BatteryFinder({ products }: { products: FinderProduct[] }) {
  const [selected, setSelected] = useState<string | null>(null)
  const chosen = uses.find((u) => u.id === selected) ?? null
  const matches = chosen
    ? products
        .filter((p) => p.category === chosen.category && chosen.ah.includes(p.amperage))
        .sort((a, b) => Number(b.inStock) - Number(a.inStock) || a.price - b.price)
    : []

  return (
    <section aria-labelledby="qual-bateria" className="glow-border rounded-3xl border bg-card p-5 shadow-soft sm:p-7">
      <div className="flex items-start gap-3">
        <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-brand text-white">
          <BatteryCharging className="size-6" aria-hidden />
        </span>
        <div>
          <h2 id="qual-bateria" className="text-xl font-semibold sm:text-2xl">
            Qual bateria serve no seu veículo?
          </h2>
          <p className="text-sm text-muted-foreground">Escolha o tipo e mostramos a amperagem indicada e as opções do E-commerce.</p>
        </div>
      </div>

      <div role="group" aria-label="Tipo de veículo ou equipamento" className="mt-5 grid grid-cols-2 gap-2 md:grid-cols-4 [&>*]:min-w-0">
        {uses.map((u) => {
          const active = u.id === selected
          return (
            <button
              key={u.id}
              type="button"
              aria-pressed={active}
              onClick={() => setSelected(active ? null : u.id)}
              className={cn(
                "lift group flex min-h-20 flex-col items-start gap-1.5 rounded-xl border-2 p-3 text-left",
                active ? "border-brand bg-brand-soft" : "border-border hover:border-brand-ink/30",
              )}
            >
              <u.icon
                className={cn("size-5 transition-transform group-hover:scale-110", active ? "text-brand-soft-ink" : "text-brand-ink")}
                aria-hidden
              />
              <span className={cn("text-sm leading-tight font-bold", active && "text-brand-soft-ink")}>{u.label}</span>
              <span className="text-xs leading-tight text-muted-foreground">{u.detail}</span>
            </button>
          )
        })}
      </div>

      <div aria-live="polite">
        {chosen && (
          <div key={chosen.id} className="mt-5 space-y-4 border-t pt-5">
            <div className="animate-rise-in flex flex-wrap items-center gap-3">
              <p className="tabular rounded-xl bg-navy px-4 py-2 text-2xl font-bold text-white">
                {chosen.ah.join(" a ")} Ah
              </p>
              <p className="max-w-xl text-sm">{chosen.note}</p>
            </div>

            {matches.length > 0 ? (
              <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {matches.map((p, i) => (
                  <li key={p.slug} className="animate-rise-in min-w-0" style={{ animationDelay: `${100 + i * 70}ms` }}>
                    <Link
                      href={`/loja/${p.slug}`}
                      className="lift group flex items-center gap-3 rounded-xl border bg-background p-3 hover:border-brand-ink/40"
                    >
                      <span className="relative size-16 shrink-0 overflow-hidden rounded-lg bg-surface">
                        <Image src={p.image} alt="" fill sizes="64px" className="object-cover" />
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block text-xs font-semibold text-muted-foreground uppercase">{p.brand}</span>
                        <span className="block truncate text-sm font-bold">{p.name}</span>
                        <span className="tabular block text-sm font-bold">
                          {formatBRL(p.price)}
                          {!p.inStock && <span className="ml-1.5 text-xs font-semibold text-muted-foreground">sem estoque</span>}
                        </span>
                      </span>
                      <ArrowRight className="size-4 shrink-0 text-brand-ink transition-transform group-hover:translate-x-1" aria-hidden />
                    </Link>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-muted-foreground">Ainda não temos essa medida no E-commerce. Fale com a gente no WhatsApp.</p>
            )}

            <div className="animate-rise-in flex flex-col gap-2 rounded-xl bg-surface p-3 text-sm sm:flex-row sm:items-center sm:justify-between" style={{ animationDelay: "350ms" }}>
              <p className="flex gap-2 text-muted-foreground">
                <Info className="mt-0.5 size-4 shrink-0" aria-hidden />
                Referência geral: confira a amperagem e a polaridade no manual ou na bateria atual.
              </p>
              <a
                href={whatsappUrl("Olá, JMoreira! Vou mandar a foto da minha bateria atual para saber qual comprar.")}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-10 shrink-0 items-center gap-1.5 font-bold text-brand-ink hover:underline"
              >
                <WhatsAppIcon className="size-4 text-whatsapp" />
                Mandar foto da bateria
              </a>
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
