import type { Metadata } from "next"
import { Clock, Mail, MapPin, Phone } from "lucide-react"

import { FacebookIcon, InstagramIcon, WhatsAppIcon } from "@/components/brand/icons"
import { ContactForm } from "@/components/forms/contact-form"
import { PageHero } from "@/components/sections/page-hero"
import { MapEmbed } from "@/components/sections/service-area"
import { pageMetadata } from "@/lib/seo"
import { fullAddress, mapsUrl, site, telHref } from "@/lib/site"
import { whatsappUrl } from "@/lib/whatsapp"

export const metadata: Metadata = pageMetadata({
  title: "Contato",
  description: `Fale com a JMoreira: WhatsApp ${site.whatsapp.display}, telefone ${site.phone.display}, e-mail e endereço no Jardim Alvorada, São José do Rio Preto. Atendimento das 7h às 21h.`,
  path: "/contato",
})

const channels = [
  {
    icon: WhatsAppIcon,
    label: "WhatsApp",
    value: site.whatsapp.display,
    href: whatsappUrl("Olá, JMoreira! Vim pela página de contato."),
    note: "O jeito mais rápido: mande foto do problema",
    external: true,
  },
  { icon: Phone, label: "Telefone fixo (sede)", value: site.phone.display, href: telHref, note: "Ligação", external: false },
  { icon: Mail, label: "E-mail", value: site.email, href: `mailto:${site.email}`, note: "Para orçamentos de empresas", external: false },
  { icon: MapPin, label: "Endereço", value: fullAddress, href: mapsUrl, note: "Abrir no Google Maps", external: true },
]

export default function ContatoPage() {
  return (
    <>
      <PageHero
        crumbs={[{ name: "Contato", path: "/contato" }]}
        eyebrow="Contato"
        title="Fale com a JMoreira"
        description="Para atendimento urgente, chame no WhatsApp. Para orçamentos e dúvidas, use o formulário: respondemos no horário de atendimento."
      />

      <section className="py-12 sm:py-16">
        <div className="container-page grid grid-cols-1 gap-10 lg:grid-cols-[1fr_1.2fr]">
          <div className="space-y-6">
            <h2 className="text-2xl font-extrabold">Canais de atendimento</h2>
            <ul className="space-y-3">
              {channels.map(({ icon: Icon, label, value, href, note, external }) => (
                <li key={label}>
                  <a
                    href={href}
                    {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                    className="flex gap-4 rounded-2xl border bg-card p-4 transition-colors hover:border-brand-ink/40"
                  >
                    <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-brand-soft text-brand-soft-ink">
                      <Icon className="size-5" aria-hidden />
                    </span>
                    <span className="min-w-0">
                      <span className="block text-sm text-muted-foreground">{label}</span>
                      <span className="block font-bold [overflow-wrap:anywhere]">{value}</span>
                      <span className="block text-xs text-muted-foreground">{note}</span>
                    </span>
                  </a>
                </li>
              ))}
            </ul>

            <div className="rounded-2xl bg-navy p-5 text-navy-foreground">
              <p className="flex items-center gap-2 font-bold text-white">
                <Clock className="size-5 text-cta" aria-hidden />
                Horário de atendimento
              </p>
              <p className="mt-1">{site.hours.label}</p>
              <p className="mt-2 text-sm text-white/70">Mensagens fora do horário são respondidas a partir das 7h.</p>
            </div>

            <div className="flex flex-wrap gap-2">
              <a
                href={site.social.instagram.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex min-h-11 items-center gap-2 rounded-xl border px-4 text-sm font-semibold hover:bg-muted"
              >
                <InstagramIcon className="size-5" />
                {site.social.instagram.handle}
              </a>
              <a
                href={site.social.facebook.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex min-h-11 items-center gap-2 rounded-xl border px-4 text-sm font-semibold hover:bg-muted"
              >
                <FacebookIcon className="size-5" />
                Facebook
              </a>
            </div>
          </div>

          <div className="rounded-3xl border bg-card p-6 shadow-soft sm:p-8">
            <h2 className="text-2xl font-extrabold">Envie uma mensagem</h2>
            <p className="mt-1 mb-6 text-sm text-muted-foreground">Respondemos pelo telefone ou WhatsApp que você informar.</p>
            <ContactForm />
          </div>
        </div>
      </section>

      <section aria-label="Mapa" className="container-page pb-16">
        <MapEmbed />
      </section>
    </>
  )
}
