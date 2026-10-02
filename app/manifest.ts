import type { MetadataRoute } from "next"

import { site } from "@/lib/site"

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: site.name,
    short_name: "JMoreira",
    description: "Eletricista, encanador e loja de peças em São José do Rio Preto.",
    start_url: "/",
    display: "standalone",
    background_color: "#0a1120",
    theme_color: "#0B63D6",
    lang: "pt-BR",
    icons: [{ src: "/logo-jmoreira.png", sizes: "256x256", type: "image/png" }],
  }
}
