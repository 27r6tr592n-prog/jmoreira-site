import createMDX from "@next/mdx"
import type { NextConfig } from "next"

const nextConfig: NextConfig = {
  pageExtensions: ["ts", "tsx", "md", "mdx"],
  images: {
    formats: ["image/avif", "image/webp"],
    // Menos larguras = srcset menor em cada <img> (o HTML da home tinha ~17 KB só disso)
    deviceSizes: [640, 828, 1080, 1280, 1920],
    imageSizes: [64, 96, 128, 256, 384],
    // TODO cliente: placeholders do picsum.photos. Ao trocar pelas fotos reais
    // (em /public ou no Storage do Supabase), ajuste ou remova este domínio.
    remotePatterns: [
      { protocol: "https", hostname: "picsum.photos" },
      { protocol: "https", hostname: "fastly.picsum.photos" },
      { protocol: "https", hostname: "*.supabase.co" },
    ],
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
        ],
      },
    ]
  },
  async redirects() {
    // Redirecionamentos 301 das URLs do site antigo (WordPress). Confirme as URLs
    // reais no Search Console antes do lançamento e complete a lista.
    return [
      // v3: energia solar virou só limpeza de placas (nova URL)
      { source: "/servicos/energia-solar", destination: "/servicos/limpeza-placas-solares", permanent: true },
      // v3: "Loja" passou a se chamar "E-commerce"; as URLs /loja continuam valendo
      { source: "/e-commerce", destination: "/loja", permanent: true },
      { source: "/e-commerce/:path*", destination: "/loja/:path*", permanent: true },
      { source: "/seja-nosso-prestador", destination: "/seja-prestador", permanent: true },
      { source: "/dicas-de-reparo", destination: "/dicas", permanent: true },
    ]
  },
}

const withMDX = createMDX({
  options: {
    // Plugins como string: compatível com Turbopack e Webpack
    remarkPlugins: [["remark-gfm", {}]],
  },
})

export default withMDX(nextConfig)
