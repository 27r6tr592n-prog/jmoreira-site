// Gera ilustrações SVG provisórias dos produtos em public/produtos/<slug>-{1,2,3}.svg
// TODO cliente: substituir pelas fotos reais (mesmo nome de arquivo, ou cadastre
// as URLs no campo `images` da tabela products).
//
// Uso: node scripts/generate-product-art.mjs

import { mkdirSync, writeFileSync } from "node:fs"
import { dirname, join } from "node:path"
import { fileURLToPath } from "node:url"

import { products } from "../lib/mock-data.ts"

const root = join(dirname(fileURLToPath(import.meta.url)), "..")
const outDir = join(root, "public", "produtos")
mkdirSync(outDir, { recursive: true })

const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/"/g, "&quot;")
const FONT = "Plus Jakarta Sans, Inter, Arial, sans-serif"

const defs = `
<defs>
  <linearGradient id="bg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#EEF4FC"/><stop offset="1" stop-color="#F8FAFC"/></linearGradient>
  <linearGradient id="chrome" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#F1F5F9"/><stop offset=".45" stop-color="#94A3B8"/><stop offset=".55" stop-color="#CBD5E1"/><stop offset="1" stop-color="#64748B"/></linearGradient>
  <linearGradient id="brass" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#E9C176"/><stop offset=".5" stop-color="#C9973F"/><stop offset="1" stop-color="#9A6E24"/></linearGradient>
  <linearGradient id="pvc" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#A9784F"/><stop offset=".5" stop-color="#8B5E3C"/><stop offset="1" stop-color="#6B4529"/></linearGradient>
  <linearGradient id="white" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#FFFFFF"/><stop offset="1" stop-color="#D9E0E8"/></linearGradient>
  <linearGradient id="case" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#334155"/><stop offset="1" stop-color="#0F172A"/></linearGradient>
  <linearGradient id="gray" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#E5E7EB"/><stop offset="1" stop-color="#9CA3AF"/></linearGradient>
  <radialGradient id="ball" cx=".35" cy=".35" r=".7"><stop offset="0" stop-color="#FFFFFF"/><stop offset="1" stop-color="#93C5FD"/></radialGradient>
</defs>`

// ─── Desenhos (canvas 800×800, objeto centrado perto de 400,420) ───────────────

const battery = ({ label, sub, color = "#0B63D6", tall = false }) => {
  const [x, y, w, h] = tall ? [230, 280, 340, 360] : [160, 300, 480, 320]
  return `
  <rect x="${x - 10}" y="${y - 34}" width="${w + 20}" height="54" rx="12" fill="#0F172A"/>
  <rect x="${x + 50}" y="${y - 74}" width="56" height="44" rx="8" fill="#B91C1C"/>
  <rect x="${x + w - 106}" y="${y - 74}" width="56" height="44" rx="8" fill="#1E293B"/>
  <text x="${x + 78}" y="${y - 42}" font-family="${FONT}" font-size="30" font-weight="800" fill="#fff" text-anchor="middle">+</text>
  <text x="${x + w - 78}" y="${y - 42}" font-family="${FONT}" font-size="30" font-weight="800" fill="#fff" text-anchor="middle">−</text>
  <rect x="${x}" y="${y}" width="${w}" height="${h}" rx="18" fill="url(#case)"/>
  <circle cx="${x + w / 2}" cy="${y - 8}" r="12" fill="#22C55E" stroke="#0F172A" stroke-width="4"/>
  <rect x="${x + 30}" y="${y + 60}" width="${w - 60}" height="${h - 120}" rx="12" fill="${color}"/>
  <text x="${x + w / 2}" y="${y + h / 2 + 4}" font-family="${FONT}" font-size="${tall ? 64 : 80}" font-weight="800" fill="#fff" text-anchor="middle">${esc(label)}</text>
  <text x="${x + w / 2}" y="${y + h / 2 + 54}" font-family="${FONT}" font-size="26" font-weight="600" fill="#fff" fill-opacity=".85" text-anchor="middle" letter-spacing="3">${esc(sub)}</text>`
}

const batterySmall = ({ label }) => `
  <rect x="300" y="300" width="22" height="34" rx="3" fill="#B91C1C"/>
  <rect x="478" y="300" width="22" height="34" rx="3" fill="#1E293B"/>
  <rect x="200" y="330" width="400" height="270" rx="14" fill="url(#gray)"/>
  <rect x="200" y="330" width="400" height="36" rx="14" fill="#374151"/>
  <rect x="236" y="400" width="328" height="160" rx="10" fill="#1F2937"/>
  <text x="400" y="480" font-family="${FONT}" font-size="58" font-weight="800" fill="#fff" text-anchor="middle">${esc(label)}</text>
  <text x="400" y="526" font-family="${FONT}" font-size="22" font-weight="600" fill="#CBD5E1" text-anchor="middle" letter-spacing="3">VRLA · SELADA</text>`

const valveBase = ({ pressure }) => `
  <rect x="170" y="410" width="460" height="120" rx="24" fill="url(#brass)"/>
  ${[0, 1, 2, 3, 4].map((i) => `<rect x="${180 + i * 14}" y="414" width="6" height="112" fill="#8A6020" opacity=".55"/><rect x="${574 + i * 14}" y="414" width="6" height="112" fill="#8A6020" opacity=".55"/>`).join("")}
  ${pressure
    ? `<path d="M330 420 L360 300 L440 300 L470 420 Z" fill="url(#brass)"/>`
    : `<rect x="330" y="270" width="140" height="160" rx="10" fill="url(#brass)"/>`}
  <rect x="352" y="230" width="96" height="60" rx="8" fill="#B88A35"/>
  <rect x="384" y="150" width="32" height="90" rx="6" fill="url(#chrome)"/>
  ${[0, 1, 2, 3].map((i) => `<rect x="384" y="${160 + i * 18}" width="32" height="5" fill="#64748B"/>`).join("")}`

const trimKit = () => `
  <circle cx="400" cy="440" r="210" fill="url(#chrome)"/>
  <circle cx="400" cy="440" r="180" fill="#E2E8F0"/>
  <circle cx="400" cy="440" r="110" fill="url(#chrome)"/>
  <rect x="250" y="410" width="300" height="60" rx="30" fill="url(#chrome)" transform="rotate(-25 400 440)"/>
  <circle cx="400" cy="440" r="34" fill="#F8FAFC" stroke="#94A3B8" stroke-width="6"/>`

const kitchenFaucet = () => `
  <ellipse cx="400" cy="640" rx="130" ry="26" fill="#94A3B8"/>
  <rect x="350" y="430" width="100" height="210" rx="16" fill="url(#chrome)"/>
  <path d="M400 440 L400 260 Q400 160 500 160 Q590 160 590 260 L590 300" fill="none" stroke="url(#chrome)" stroke-width="42" stroke-linecap="round"/>
  <path d="M400 440 L400 260 Q400 160 500 160 Q590 160 590 260 L590 300" fill="none" stroke="#fff" stroke-opacity=".5" stroke-width="8" stroke-linecap="round" transform="translate(-10 0)"/>
  <rect x="440" y="470" width="150" height="34" rx="17" fill="url(#chrome)"/>`

const wallFaucet = () => `
  <rect x="120" y="360" width="40" height="160" rx="8" fill="#CBD5E1"/>
  <rect x="150" y="400" width="300" height="80" rx="36" fill="url(#chrome)"/>
  <path d="M430 440 Q560 440 560 560 L560 620" fill="none" stroke="url(#chrome)" stroke-width="64" stroke-linecap="round"/>
  ${[0, 1, 2].map((i) => `<rect x="526" y="${580 + i * 16}" width="68" height="6" fill="#64748B"/>`).join("")}
  <rect x="300" y="300" width="36" height="110" rx="8" fill="url(#chrome)"/>
  <rect x="230" y="270" width="176" height="44" rx="22" fill="url(#chrome)"/>`

const pipe = ({ fill, wide }) => {
  const t = wide ? 120 : 76
  return `
  <g transform="rotate(-30 400 420)">
    <rect x="40" y="${420 - t / 2}" width="720" height="${t}" rx="${t / 2.4}" fill="${fill}"/>
    <rect x="60" y="${420 - t / 2 + 10}" width="680" height="8" rx="4" fill="#fff" opacity=".35"/>
    <ellipse cx="740" cy="420" rx="${t / 4}" ry="${t / 2}" fill="${wide ? "#CBD5E1" : "#4A2E1A"}"/>
    <ellipse cx="740" cy="420" rx="${t / 6}" ry="${t / 2.8}" fill="${wide ? "#94A3B8" : "#2E1C10"}"/>
  </g>`
}

const elbow = () => `
  <path d="M240 640 L240 420 Q240 300 360 300 L580 300" fill="none" stroke="url(#pvc)" stroke-width="130"/>
  <rect x="160" y="560" width="160" height="110" rx="12" fill="#7A4F30"/>
  <rect x="520" y="220" width="110" height="160" rx="12" fill="#7A4F30"/>
  <ellipse cx="630" cy="300" rx="22" ry="62" fill="#4A2E1A"/>`

const coupling = () => `
  <rect x="180" y="330" width="440" height="180" rx="30" fill="url(#pvc)"/>
  <rect x="200" y="350" width="400" height="10" rx="5" fill="#fff" opacity=".3"/>
  <ellipse cx="620" cy="420" rx="34" ry="90" fill="#4A2E1A"/>
  <ellipse cx="620" cy="420" rx="22" ry="66" fill="#2E1C10"/>`

const adapter = () => `
  <rect x="160" y="340" width="260" height="160" rx="18" fill="url(#pvc)"/>
  <polygon points="420,330 470,330 490,350 490,490 470,510 420,510" fill="#7A4F30"/>
  <rect x="490" y="370" width="170" height="100" rx="10" fill="url(#pvc)"/>
  ${[0, 1, 2, 3, 4, 5, 6, 7].map((i) => `<rect x="${500 + i * 20}" y="370" width="8" height="100" fill="#4A2E1A" opacity=".55"/>`).join("")}`

const cisternMechanism = () => `
  <rect x="200" y="320" width="56" height="320" rx="12" fill="url(#white)" stroke="#94A3B8" stroke-width="4"/>
  <rect x="176" y="250" width="104" height="90" rx="18" fill="#60A5FA"/>
  <rect x="380" y="260" width="150" height="380" rx="20" fill="url(#white)" stroke="#94A3B8" stroke-width="4"/>
  <rect x="404" y="300" width="102" height="140" rx="12" fill="#DBEAFE"/>
  <rect x="360" y="610" width="190" height="40" rx="10" fill="#1E293B"/>
  <ellipse cx="455" cy="230" rx="78" ry="26" fill="#E2E8F0" stroke="#94A3B8" stroke-width="4"/>
  <ellipse cx="430" cy="226" rx="28" ry="12" fill="#0B63D6"/><ellipse cx="482" cy="226" rx="20" ry="10" fill="#0B63D6" opacity=".6"/>
  <path d="M256 600 L380 600" stroke="#94A3B8" stroke-width="12"/>`

const outletValve = () => `
  <rect x="320" y="240" width="160" height="400" rx="24" fill="url(#white)" stroke="#94A3B8" stroke-width="4"/>
  <rect x="290" y="610" width="220" height="44" rx="12" fill="#1E293B"/>
  <ellipse cx="400" cy="226" rx="96" ry="30" fill="#E2E8F0" stroke="#94A3B8" stroke-width="4"/>
  <ellipse cx="370" cy="222" rx="34" ry="14" fill="#0B63D6"/><ellipse cx="434" cy="222" rx="24" ry="11" fill="#0B63D6" opacity=".6"/>
  ${[0, 1, 2, 3].map((i) => `<rect x="340" y="${320 + i * 70}" width="120" height="10" rx="5" fill="#CBD5E1"/>`).join("")}`

const inletValve = () => `
  <rect x="360" y="200" width="80" height="440" rx="16" fill="url(#white)" stroke="#94A3B8" stroke-width="4"/>
  <rect x="300" y="380" width="200" height="140" rx="30" fill="#60A5FA"/>
  <rect x="340" y="620" width="120" height="40" rx="8" fill="#1E293B"/>
  <rect x="330" y="170" width="140" height="60" rx="14" fill="#E2E8F0" stroke="#94A3B8" stroke-width="4"/>`

const waxRing = () => `
  <ellipse cx="400" cy="470" rx="230" ry="110" fill="#C08A3E"/>
  <ellipse cx="400" cy="450" rx="230" ry="110" fill="#E0B05A"/>
  <ellipse cx="400" cy="450" rx="120" ry="56" fill="#F8FAFC"/>
  <path d="M290 450 L290 560 Q400 610 510 560 L510 450" fill="url(#white)" stroke="#94A3B8" stroke-width="4"/>
  <ellipse cx="400" cy="450" rx="110" ry="50" fill="#E2E8F0" stroke="#94A3B8" stroke-width="4"/>`

const flexTrap = () => {
  const rings = Array.from({ length: 18 }, (_, i) => {
    const t = i / 17
    const ang = Math.PI * t
    const cx = 400 - Math.cos(ang) * 170
    const cy = 340 + Math.sin(ang) * 220
    return `<ellipse cx="${cx.toFixed(1)}" cy="${cy.toFixed(1)}" rx="46" ry="46" fill="url(#white)" stroke="#94A3B8" stroke-width="5"/>`
  }).join("")
  return `<rect x="190" y="180" width="80" height="170" rx="12" fill="url(#white)" stroke="#94A3B8" stroke-width="5"/>${rings}<rect x="530" y="180" width="80" height="170" rx="12" fill="url(#white)" stroke="#94A3B8" stroke-width="5"/>`
}

const bottleTrap = () => `
  <rect x="370" y="140" width="60" height="230" fill="url(#chrome)"/>
  <rect x="320" y="350" width="160" height="260" rx="40" fill="url(#chrome)"/>
  <rect x="320" y="420" width="160" height="10" fill="#64748B" opacity=".5"/>
  <rect x="470" y="380" width="230" height="56" fill="url(#chrome)"/>
  <circle cx="700" cy="408" r="60" fill="url(#chrome)" stroke="#94A3B8" stroke-width="4"/>`

const linearDrain = () => `
  <g transform="rotate(-18 400 420)">
    <rect x="60" y="350" width="680" height="140" rx="14" fill="url(#chrome)"/>
    <rect x="84" y="372" width="632" height="96" rx="8" fill="#CBD5E1"/>
    ${Array.from({ length: 30 }, (_, i) => `<rect x="${100 + i * 20.5}" y="384" width="9" height="72" rx="4" fill="#64748B"/>`).join("")}
  </g>`

const squareDrain = () => `
  <rect x="190" y="210" width="420" height="420" rx="24" fill="url(#white)" stroke="#94A3B8" stroke-width="6"/>
  <rect x="230" y="250" width="340" height="340" rx="14" fill="#F1F5F9" stroke="#CBD5E1" stroke-width="4"/>
  ${Array.from({ length: 49 }, (_, i) => `<circle cx="${280 + (i % 7) * 40}" cy="${300 + Math.floor(i / 7) * 40}" r="11" fill="#94A3B8"/>`).join("")}`

const flushValve = () => `
  <rect x="290" y="300" width="220" height="250" rx="30" fill="url(#brass)"/>
  <circle cx="400" cy="300" r="120" fill="url(#brass)"/>
  <circle cx="400" cy="300" r="70" fill="#B88A35"/>
  <rect x="370" y="540" width="60" height="130" fill="url(#brass)"/>
  ${[0, 1, 2, 3, 4].map((i) => `<rect x="370" y="${580 + i * 16}" width="60" height="5" fill="#8A6020"/>`).join("")}
  <rect x="150" y="400" width="150" height="70" rx="12" fill="url(#brass)"/>`

const flushRepair = () => {
  const spring = Array.from({ length: 10 }, (_, i) => `${i % 2 ? 470 : 330},${380 + i * 24}`).join(" ")
  return `
  <rect x="330" y="160" width="140" height="210" rx="24" fill="#1E293B"/>
  <rect x="350" y="180" width="100" height="30" rx="8" fill="#64748B"/>
  <polyline points="${spring}" fill="none" stroke="url(#chrome)" stroke-width="14" stroke-linejoin="round"/>
  <rect x="300" y="610" width="200" height="40" rx="12" fill="#1E293B"/>
  <circle cx="220" cy="300" r="40" fill="none" stroke="#0F172A" stroke-width="14"/>
  <circle cx="580" cy="300" r="40" fill="none" stroke="#0F172A" stroke-width="14"/>`
}

const floatValve = () => `
  <rect x="110" y="330" width="150" height="110" rx="16" fill="url(#white)" stroke="#94A3B8" stroke-width="4"/>
  <rect x="80" y="360" width="40" height="50" rx="6" fill="#94A3B8"/>
  <rect x="250" y="372" width="280" height="22" rx="11" fill="url(#chrome)" transform="rotate(14 250 383)"/>
  <circle cx="590" cy="470" r="120" fill="url(#ball)" stroke="#60A5FA" stroke-width="5"/>`

const floatSwitch = () => `
  <path d="M120 200 C 260 160, 330 260, 300 360" fill="none" stroke="#0F172A" stroke-width="18" stroke-linecap="round"/>
  <path d="M300 360 C 290 420, 340 460, 420 470" fill="none" stroke="#0F172A" stroke-width="18" stroke-linecap="round"/>
  <path d="M420 330 C 560 330, 650 420, 640 520 C 630 610, 520 660, 440 620 C 380 590, 360 500, 380 440 C 392 380, 400 330, 420 330 Z" fill="#2563EB"/>
  <path d="M450 370 C 540 380, 600 440, 600 500" fill="none" stroke="#fff" stroke-opacity=".4" stroke-width="16" stroke-linecap="round"/>`

const tape = () => `
  <circle cx="380" cy="420" r="210" fill="url(#white)" stroke="#CBD5E1" stroke-width="6"/>
  <circle cx="380" cy="420" r="150" fill="none" stroke="#E2E8F0" stroke-width="2"/>
  <circle cx="380" cy="420" r="90" fill="#0B63D6"/>
  <circle cx="380" cy="420" r="62" fill="#EEF4FC"/>
  <path d="M590 420 L700 640 L640 660 L560 470 Z" fill="#fff" stroke="#CBD5E1" stroke-width="4"/>`

const glue = () => `
  <rect x="300" y="300" width="200" height="340" rx="22" fill="#0B63D6"/>
  <rect x="300" y="390" width="200" height="150" fill="#F8FAFC"/>
  <rect x="330" y="420" width="140" height="18" rx="6" fill="#0B63D6"/>
  <rect x="330" y="452" width="100" height="12" rx="6" fill="#94A3B8"/>
  <rect x="330" y="476" width="120" height="12" rx="6" fill="#94A3B8"/>
  <rect x="340" y="220" width="120" height="90" rx="14" fill="#1E293B"/>`

function artFor(p) {
  const s = p.slug
  if (s.startsWith("bateria-moto")) return battery({ label: `${p.amperage_ah}Ah`, sub: `${p.voltage_v}V · MOTO`, color: "#B91C1C", tall: true })
  if (s.includes("unipower")) return batterySmall({ label: `${p.voltage_v}V ${p.amperage_ah}Ah` })
  if (s.includes("estacionaria")) return battery({ label: `${p.amperage_ah}Ah`, sub: "CICLO PROFUNDO", color: "#0F766E" })
  if (s.startsWith("bateria")) {
    const color = s.includes("heliar") ? "#15803D" : s.includes("zetta") ? "#C2410C" : "#1D4ED8"
    return battery({ label: `${p.amperage_ah}Ah`, sub: `${p.voltage_v}V · SELADA`, color })
  }
  if (s.startsWith("registro-gaveta")) return valveBase({ pressure: false })
  if (s.startsWith("registro-pressao")) return valveBase({ pressure: true })
  if (s.startsWith("acabamento")) return trimKit()
  if (s.startsWith("torneira-cozinha")) return kitchenFaucet()
  if (s.startsWith("torneira-tanque")) return wallFaucet()
  if (s.startsWith("tubo-pvc")) return pipe({ fill: "url(#pvc)", wide: false })
  if (s.startsWith("tubo-esgoto")) return pipe({ fill: "url(#white)", wide: true })
  if (s.startsWith("joelho")) return elbow()
  if (s.startsWith("luva")) return coupling()
  if (s.startsWith("adaptador")) return adapter()
  if (s.startsWith("mecanismo")) return cisternMechanism()
  if (s.startsWith("reparo-saida")) return outletValve()
  if (s.startsWith("valvula-entrada")) return inletValve()
  if (s.startsWith("anel")) return waxRing()
  if (s.startsWith("sifao-sanfonado")) return flexTrap()
  if (s.startsWith("sifao-copo")) return bottleTrap()
  if (s.startsWith("ralo-linear")) return linearDrain()
  if (s.startsWith("ralo-sifonado")) return squareDrain()
  if (s.startsWith("valvula-descarga")) return flushValve()
  if (s.startsWith("reparo-valvula")) return flushRepair()
  if (s.startsWith("torneira-boia")) return floatValve()
  if (s.startsWith("chave-boia")) return floatSwitch()
  if (s.startsWith("fita-veda")) return tape()
  if (s.startsWith("adesivo")) return glue()
  throw new Error(`Sem ilustração para ${s}`)
}

const specValue = (p, ...labels) => {
  for (const label of labels) {
    const found = p.specs.find((s) => s.label.startsWith(label))
    if (found) return found.value
  }
  return p.specs[0]?.value ?? ""
}

const chip = (text, y = 690) => {
  const w = Math.min(700, 60 + text.length * 19)
  return `<rect x="${400 - w / 2}" y="${y}" width="${w}" height="64" rx="32" fill="#0F172A"/>
  <text x="400" y="${y + 42}" font-family="${FONT}" font-size="30" font-weight="700" fill="#fff" text-anchor="middle">${esc(text)}</text>`
}

const frame = (inner) =>
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 800" width="800" height="800">${defs}<rect width="800" height="800" fill="url(#bg)"/>${inner}</svg>\n`

const floor = `<ellipse cx="400" cy="690" rx="280" ry="26" fill="#0F172A" opacity=".08"/>`

let count = 0
for (const p of products) {
  const art = artFor(p)
  const keySpec = p.amperage_ah ? `${p.amperage_ah} Ah · ${p.voltage_v} V` : specValue(p, "Bitola", "Diâmetro", "Medida", "Compatibilidade", "Largura", "Conteúdo")
  const dims = specValue(p, "Dimensões", "Comprimento", "Medida", "Diâmetro", "Bitola", "Conteúdo")

  const views = [
    // 1 — vista principal
    frame(`${floor}<g>${art}</g>`),
    // 2 — detalhe ampliado com a especificação principal
    frame(`<g transform="translate(400 380) scale(1.45) translate(-400 -400)">${art}</g>${chip(keySpec)}`),
    // 3 — escala e medidas
    frame(`<g transform="translate(400 360) scale(.72) translate(-400 -420)">${art}</g>
      <line x1="150" y1="640" x2="650" y2="640" stroke="#0B63D6" stroke-width="4"/>
      <line x1="150" y1="624" x2="150" y2="656" stroke="#0B63D6" stroke-width="4"/>
      <line x1="650" y1="624" x2="650" y2="656" stroke="#0B63D6" stroke-width="4"/>
      <text x="400" y="700" font-family="${FONT}" font-size="30" font-weight="700" fill="#0F172A" text-anchor="middle">${esc(dims)}</text>
      <text x="400" y="742" font-family="${FONT}" font-size="22" font-weight="500" fill="#475569" text-anchor="middle">Imagem ilustrativa · medidas de referência</text>`),
  ]
  views.forEach((svg, i) => {
    writeFileSync(join(outDir, `${p.slug}-${i + 1}.svg`), svg)
    count++
  })
}

// Imagem genérica para quando o produto não tiver foto cadastrada
writeFileSync(
  join(outDir, "sem-foto.svg"),
  frame(`<rect x="250" y="250" width="300" height="300" rx="36" fill="none" stroke="#94A3B8" stroke-width="10" stroke-dasharray="24 16"/>
  <text x="400" y="420" font-family="${FONT}" font-size="34" font-weight="700" fill="#64748B" text-anchor="middle">Foto em breve</text>`),
)

console.log(`${count} ilustrações geradas em public/produtos/`)
