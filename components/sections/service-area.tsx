import { MapPin, Navigation } from "lucide-react"

import { Reveal } from "@/components/motion/reveal"
import { SectionHeading } from "@/components/sections/section-heading"
import { AreaChecker } from "./area-checker"
import { buttonVariants } from "@/components/ui/button"
import { fullAddress, mapsEmbedUrl, mapsUrl, nearbyCities, neighborhoods, site } from "@/lib/site"

export function MapEmbed({ className = "" }: { className?: string }) {
  return (
    <div className={`overflow-hidden rounded-2xl border bg-surface ${className}`}>
      <iframe
        title={`Mapa: ${site.name}, ${fullAddress}`}
        src={mapsEmbedUrl}
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        className="aspect-[4/3] h-full w-full border-0 lg:aspect-auto lg:min-h-[420px]"
      />
    </div>
  )
}

export function ServiceArea() {
  return (
    <section aria-labelledby="area-atendimento" className="border-t bg-surface py-16 sm:py-24">
      <div className="container-page grid gap-10 lg:grid-cols-2 lg:items-start">
        <div className="space-y-8">
          <SectionHeading
            id="area-atendimento"
            eyebrow="Área de atendimento"
            title="Atendemos toda São José do Rio Preto"
            description="A sede fica no Jardim Alvorada, e daqui saem os técnicos para todos os bairros da cidade e para as cidades vizinhas."
          />
          <Reveal delay={80}>
            <AreaChecker />
          </Reveal>
          <div>
            <h3 className="text-sm font-bold">Bairros mais atendidos</h3>
            <ul className="mt-3 flex flex-wrap gap-2">
              {neighborhoods.map((n) => (
                <li key={n} className="rounded-full border bg-background px-3 py-1 text-sm">
                  {n}
                </li>
              ))}
              <li className="rounded-full bg-brand-soft px-3 py-1 text-sm font-semibold text-brand-soft-ink">e todos os outros</li>
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-bold">Cidades da região</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              {nearbyCities.join(", ")}. {site.promises.arrivalCaveat}
            </p>
          </div>
          <div className="flex flex-col gap-3 rounded-2xl border bg-background p-5 sm:flex-row sm:items-center sm:justify-between">
            <p className="flex gap-2.5 text-sm">
              <MapPin className="mt-0.5 size-5 shrink-0 text-brand-ink" aria-hidden />
              <span>
                <strong className="block">Loja e sede</strong>
                {fullAddress}
              </span>
            </p>
            <a href={mapsUrl} target="_blank" rel="noopener noreferrer" className={buttonVariants({ variant: "outline", className: "shrink-0" })}>
              <Navigation aria-hidden />
              Como chegar
            </a>
          </div>
        </div>
        <Reveal delay={120} className="lg:sticky lg:top-28">
          <MapEmbed />
        </Reveal>
      </div>
    </section>
  )
}
