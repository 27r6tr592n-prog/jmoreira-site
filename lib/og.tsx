import { readFileSync } from "node:fs"
import { join } from "node:path"
import { ImageResponse } from "next/og"

import { site } from "@/lib/site"

export const ogSize = { width: 1200, height: 630 }
export const ogContentType = "image/png"

// Arquivos locais embutidos como data URL (gerado no build, sem rede)
const dataUrl = (file: string, mime: string) =>
  `data:${mime};base64,${readFileSync(join(process.cwd(), "public", file)).toString("base64")}`

/** Arte das imagens de compartilhamento (WhatsApp, Facebook, Google Discover). */
export function ogImage({ eyebrow, title, footer }: { eyebrow: string; title: string; footer?: string }) {
  const logo = dataUrl("logo-jmoreira.png", "image/png")
  const fachada = dataUrl("fotos/fachada-sede.jpg", "image/jpeg")

  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", position: "relative", fontFamily: "sans-serif", color: "white" }}>
        {/* Foto real da sede ao fundo */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={fachada} alt="" width={1200} height={630} style={{ position: "absolute", inset: 0, objectFit: "cover", width: "100%", height: "100%" }} />
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "linear-gradient(100deg, rgba(7,16,31,0.96) 0%, rgba(11,27,51,0.9) 48%, rgba(11,99,214,0.45) 100%)",
          }}
        />
        <div style={{ position: "relative", display: "flex", flexDirection: "column", justifyContent: "space-between", padding: 72, width: "100%" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={logo} alt="" width={76} height={76} style={{ borderRadius: 18 }} />
            <div style={{ display: "flex", flexDirection: "column" }}>
              <span style={{ fontSize: 38, fontWeight: 800 }}>JMoreira</span>
              <span style={{ fontSize: 20, letterSpacing: 4, color: "rgba(255,255,255,0.75)" }}>SERVIÇOS</span>
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 18, maxWidth: 820 }}>
            <span style={{ fontSize: 26, fontWeight: 700, color: "#F59E0B", textTransform: "uppercase", letterSpacing: 3 }}>{eyebrow}</span>
            <span style={{ fontSize: title.length > 60 ? 52 : 64, fontWeight: 800, lineHeight: 1.08 }}>{title}</span>
          </div>

          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: 26, color: "rgba(255,255,255,0.9)" }}>
            <span>{footer ?? `Nota ${site.rating.value.toLocaleString("pt-BR")} no Google · ${site.rating.count} avaliações`}</span>
            <span style={{ background: "#F59E0B", color: "#0F172A", padding: "12px 24px", borderRadius: 14, fontWeight: 800 }}>
              WhatsApp {site.whatsapp.display}
            </span>
          </div>
        </div>
      </div>
    ),
    ogSize,
  )
}
