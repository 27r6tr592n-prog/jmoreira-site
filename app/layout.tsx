import type { Metadata, Viewport } from "next"
import { Plus_Jakarta_Sans } from "next/font/google"

import { Footer } from "@/components/layout/footer"
import { Header } from "@/components/layout/header"
import { WhatsAppFloat } from "@/components/layout/whatsapp-float"
import { MotionProvider } from "@/components/motion/motion-provider"
import { RevealRoot } from "@/components/motion/reveal-root"
import { RippleRoot } from "@/components/motion/ripple-root"
import { ScrollProgress } from "@/components/motion/scroll-progress"
import { JsonLd } from "@/components/seo/json-ld"
import { CartDrawerLazy } from "@/components/shop/cart-drawer-lazy"
import { motionBootScript } from "@/lib/motion"
import { businessJsonLd } from "@/lib/seo"
import { site } from "@/lib/site"
import "./globals.css"

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-jakarta",
  display: "swap",
})

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: "Eletricista e Encanador em Rio Preto | JMoreira Serviços",
    template: "%s | JMoreira Serviços",
  },
  description:
    "Eletricista, encanador e manutenção em São José do Rio Preto, com chegada em até 2h. Loja de peças hidráulicas e baterias. Nota 4,8 no Google. Chame no WhatsApp.",
  applicationName: site.name,
  alternates: { canonical: "/" },
  openGraph: { type: "website", locale: "pt_BR", siteName: site.name, url: "/" },
  twitter: { card: "summary_large_image" },
  formatDetection: { telephone: false },
}

export const viewport: Viewport = {
  // Barra do navegador no celular com a cor do fundo escuro do site
  themeColor: "#0a1120",
  width: "device-width",
  initialScale: 1,
  // Necessário para env(safe-area-inset-*) funcionar em iPhone com notch
  viewportFit: "cover",
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    // suppressHydrationWarning: o script abaixo adiciona a classe "js" antes do React hidratar
    <html lang="pt-BR" className={`dark ${jakarta.variable}`} suppressHydrationWarning>
      <head>
        {/* Marca que há JavaScript: só então as animações de entrada escondem o conteúdo */}
        <script dangerouslySetInnerHTML={{ __html: `document.documentElement.classList.add('js');${motionBootScript};setTimeout(function(){if(!window.__revealReady)document.documentElement.classList.remove('js')},4000)` }} />
        {/* Sem JavaScript, nada fica escondido esperando animação */}
        <noscript>
          <style>{"[data-collapsible]{grid-template-rows:1fr!important;opacity:1!important}"}</style>
        </noscript>
      </head>
      <body className="flex min-h-dvh flex-col">
        <MotionProvider>
          <JsonLd data={businessJsonLd()} />
          <Header />
          <main id="conteudo" className="flex-1 outline-none" tabIndex={-1}>
            {children}
          </main>
          <Footer />
          <CartDrawerLazy />
          <WhatsAppFloat />
          <ScrollProgress />
          <RippleRoot />
          <RevealRoot />
        </MotionProvider>
      </body>
    </html>
  )
}
