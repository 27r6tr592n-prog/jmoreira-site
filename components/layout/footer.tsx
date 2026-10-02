import Link from "next/link"
import { Clock, Mail, MapPin, Phone, Star } from "lucide-react"

import { FacebookIcon, InstagramIcon, WhatsAppIcon } from "@/components/brand/icons"
import { Logo } from "@/components/brand/logo"
import { MotionToggle } from "@/components/motion/motion-toggle"
import { services } from "@/lib/services"
import { fullAddress, mapsUrl, site, telHref } from "@/lib/site"
import { whatsappUrl } from "@/lib/whatsapp"

const shopLinks = [
  { href: "/loja", label: "Todos os produtos" },
  { href: "/loja/categoria/baterias-automotivas", label: "Baterias automotivas" },
  { href: "/loja/categoria/baterias-estacionarias", label: "Baterias estacionárias" },
  { href: "/loja/categoria/baterias-moto", label: "Baterias de moto" },
  { href: "/loja/categoria/hidraulica", label: "Peças hidráulicas" },
]

const companyLinks = [
  { href: "/quem-somos", label: "Quem somos" },
  { href: "/seja-prestador", label: "Seja prestador" },
  { href: "/dicas", label: "Dicas de reparo" },
  { href: "/contato", label: "Contato" },
  { href: "/politicas", label: "Privacidade, trocas e entregas" },
]

function Column({ title, links }: { title: string; links: { href: string; label: string }[] }) {
  return (
    <div>
      <h2 className="text-sm font-bold tracking-wide text-white">{title}</h2>
      <ul className="mt-4 space-y-1">
        {links.map((l) => (
          <li key={l.href}>
            <Link href={l.href} className="inline-flex min-h-11 items-center text-sm text-white/75 hover:text-white hover:underline sm:min-h-9">
              {l.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}

export function Footer() {
  return (
    <footer className="bg-navy text-navy-foreground">
      <div className="container-page grid gap-10 py-14 md:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1fr]">
        <div className="space-y-5">
          <Logo inverse />
          <p className="max-w-xs text-sm text-white/75">
            Eletricista, encanador e manutenção em São José do Rio Preto e região. Loja de peças hidráulicas e baterias.
          </p>
          <p className="flex items-center gap-2 text-sm">
            <Star className="size-4 fill-cta text-cta" aria-hidden />
            <span>
              <strong>{site.rating.value.toLocaleString("pt-BR")}</strong> no Google, {site.rating.count} avaliações
            </span>
          </p>
          <div className="flex gap-2">
            <a
              href={site.social.instagram.url}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Instagram ${site.social.instagram.handle}`}
              className="grid size-11 place-items-center rounded-xl bg-white/10 hover:bg-white/20"
            >
              <InstagramIcon className="size-5" />
            </a>
            <a
              href={site.social.facebook.url}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Facebook da JMoreira"
              className="grid size-11 place-items-center rounded-xl bg-white/10 hover:bg-white/20"
            >
              <FacebookIcon className="size-5" />
            </a>
            <a
              href={whatsappUrl("Olá, JMoreira! Vim pelo site.")}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="WhatsApp da JMoreira"
              className="grid size-11 place-items-center rounded-xl bg-white/10 hover:bg-white/20"
            >
              <WhatsAppIcon className="size-5" />
            </a>
          </div>
        </div>

        <Column title="Serviços" links={services.map((s) => ({ href: `/servicos/${s.slug}`, label: s.name }))} />
        <Column title="Loja" links={shopLinks} />

        <div>
          <h2 className="text-sm font-bold tracking-wide text-white">Atendimento</h2>
          <address className="mt-3 space-y-0.5 text-sm text-white/75 not-italic">
            <a href={mapsUrl} target="_blank" rel="noopener noreferrer" className="flex min-h-11 items-center gap-2.5 hover:text-white">
              <MapPin className="mt-0.5 size-4 shrink-0" aria-hidden />
              <span>{fullAddress}</span>
            </a>
            <a href={telHref} className="flex min-h-11 items-center gap-2.5 hover:text-white">
              <Phone className="size-4 shrink-0" aria-hidden />
              {site.phone.display}
            </a>
            <a
              href={whatsappUrl("Olá, JMoreira! Vim pelo site.")}
              target="_blank"
              rel="noopener noreferrer"
              className="flex min-h-11 items-center gap-2.5 hover:text-white"
            >
              <WhatsAppIcon className="size-4 shrink-0" />
              {site.whatsapp.display}
            </a>
            <a href={`mailto:${site.email}`} className="flex min-h-11 items-center gap-2.5 break-all hover:text-white">
              <Mail className="size-4 shrink-0" aria-hidden />
              {site.email}
            </a>
            <p className="flex items-center gap-2.5">
              <Clock className="size-4 shrink-0" aria-hidden />
              {site.hours.label}
            </p>
          </address>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="container-page grid gap-6 py-6 md:grid-cols-[1fr_auto] md:items-start">
          <Column title="Empresa" links={companyLinks} />
          <div className="space-y-1 text-xs text-white/60 md:text-right">
            <p>
              © {new Date().getFullYear()} {site.legalName} · CNPJ {site.cnpj}
            </p>
            <p>{site.slogan}</p>
            <MotionToggle className="text-white/70" />
          </div>
        </div>
      </div>
    </footer>
  )
}
