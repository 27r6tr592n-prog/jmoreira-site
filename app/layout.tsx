import type { Metadata, Viewport } from "next"
import { IBM_Plex_Sans, Source_Serif_4 } from "next/font/google"

import { Footer } from "@/components/layout/footer"
import { Header } from "@/components/layout/header"
import { WhatsAppFloat } from "@/components/layout/whatsapp-float"
import { MotionProvider } from "@/components/motion/motion-provider"
import { RevealRoot } from "@/components/motion/reveal-root"
import { RippleRoot } from "@/components/motion/ripple-root"
import { RouteProgress } from "@/components/motion/route-progress"
import { ScrollProgress } from "@/components/motion/scroll-progress"
import { JsonLd } from "@/components/seo/json-ld"
import { CartDrawerLazy } from "@/components/shop/cart-drawer-lazy"
import { motionBootScript } from "@/lib/motion"
import { businessJsonLd } from "@/lib/seo"
import { site } from "@/lib/site"
import "./globals.css"

// Par tipográfico: serifada nos títulos (elegância, autoridade) e sans de
// desenho técnico no texto e na interface. Só os pesos usados são baixados.
const serif = Source_Serif_4({
  subsets: ["latin"],
  weight: ["600"],
  variable: "--font-serif",
  display: "swap",
})
const plex = IBM_Plex_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-plex",
  display: "swap",
  // Só a serifada (título do herói, o LCP) é pré-carregada; o texto troca do
  // fallback ajustado (sem pulo de layout) assim que a Plex chega.
  preload: false,
})

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: "Eletricista e Encanador em Rio Preto | JMoreira Serviços",
    template: "%s | JMoreira Serviços",
  },
  description:
    "Eletricista, encanador, limpeza de placas solares e manutenção em São José do Rio Preto. Leva e Traz e E-commerce de peças hidráulicas e baterias. Nota 4,8 no Google.",
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
    <html lang="pt-BR" className={`dark ${serif.variable} ${plex.variable}`} suppressHydrationWarning>
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
          <RouteProgress />
          <RippleRoot />
          <RevealRoot />
        </MotionProvider>
      </body>
    </html>
  )
}
