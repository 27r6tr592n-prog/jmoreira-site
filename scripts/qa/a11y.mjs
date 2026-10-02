// Auditoria de acessibilidade (WCAG 2.1 AA) com axe-core + checagens de teclado.
// Uso: node scripts/qa/a11y.mjs [baseUrl]
import { readFileSync } from "node:fs"
import { chromium } from "playwright"

const base = process.argv[2] ?? "http://localhost:3200"
const axeSource = readFileSync(new URL("../../node_modules/axe-core/axe.min.js", import.meta.url), "utf8")
const sleep = (ms) => new Promise((r) => setTimeout(r, ms))
const browser = await chromium.launch()
let failures = 0

async function axe(page, label) {
  // Mostra tudo o que espera revelação (o axe não rola a página)
  await page.evaluate(() => document.querySelectorAll("[data-reveal]").forEach((e) => (e.dataset.shown = "", e.dataset.done = "")))
  await sleep(700)
  await page.addScriptTag({ content: axeSource })
  const res = await page.evaluate(() =>
    window.axe.run(document, { runOnly: { type: "tag", values: ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"] } }),
  )
  const v = res.violations
  failures += v.length
  console.log(`${v.length ? "✘" : "✔"} axe ${label}: ${v.length} violações`)
  for (const x of v) console.log(`   [${x.impact}] ${x.id}: ${x.help} → ${x.nodes.slice(0, 3).map((n) => n.target.join(" ")).join(" | ")}`)
}

const pages = ["/", "/servicos", "/servicos/eletricista", "/loja", "/loja/bateria-moura-60ah-m60gd", "/checkout", "/contato", "/seja-prestador", "/quem-somos", "/dicas", "/politicas"]
for (const [vw, vh, name] of [[1280, 800, "desktop"], [375, 812, "mobile"]]) {
  const ctx = await browser.newContext({ viewport: { width: vw, height: vh } })
  const page = await ctx.newPage()
  for (const p of pages) {
    await page.goto(base + p, { waitUntil: "networkidle" })
    await axe(page, `${name} ${p}`)
  }
  await ctx.close()
}

// Estados abertos: drawer, menu do celular, FAQ aberto, erros do formulário
{
  const ctx = await browser.newContext({ viewport: { width: 375, height: 812 } })
  const page = await ctx.newPage()
  await page.goto(base + "/loja", { waitUntil: "networkidle" })
  await page.locator("[data-product-card]").first().getByRole("button", { name: /adicionar/i }).click()
  await page.getByRole("dialog").waitFor()
  await sleep(800)
  await axe(page, "drawer aberto")
  await page.keyboard.press("Escape")
  await sleep(400)
  await page.getByRole("button", { name: "Abrir menu" }).click()
  await page.getByRole("dialog").waitFor()
  await sleep(700)
  await axe(page, "menu do celular aberto")
  await page.keyboard.press("Escape")
  await page.goto(base + "/contato", { waitUntil: "networkidle" })
  await page.getByRole("button", { name: /enviar/i }).click()
  await sleep(500)
  await axe(page, "formulário com erros")
  await ctx.close()
}

// Teclado: skip link, FAQ com Enter, drawer prende o foco e Esc devolve
{
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 800 } })
  const page = await ctx.newPage()
  await page.goto(base + "/", { waitUntil: "networkidle" })
  await page.keyboard.press("Tab")
  const first = await page.evaluate(() => document.activeElement?.textContent?.trim())
  console.log(`${first === "Pular para o conteúdo" ? "✔" : "✘"} 1º Tab = skip link (${first})`)
  await page.keyboard.press("Enter")
  await sleep(300)
  const mainFocused = await page.evaluate(() => document.activeElement?.id)
  console.log(`${mainFocused === "conteudo" ? "✔" : "✘"} skip link leva ao <main> (${mainFocused})`)

  const q = page.locator("#perguntas").locator("xpath=ancestor::section[1]").getByRole("button").first()
  await q.focus()
  await page.keyboard.press("Enter")
  await sleep(400)
  const expanded = await q.getAttribute("aria-expanded")
  const panelVisible = await page.evaluate((id) => getComputedStyle(document.getElementById(id)).gridTemplateRows !== "0px", await q.getAttribute("aria-controls"))
  console.log(`${expanded === "true" && panelVisible ? "✔" : "✘"} FAQ abre com Enter (aria-expanded=${expanded})`)

  // Foco visível: o botão do FAQ focado tem anel (box-shadow) ou outline
  const ring = await q.evaluate((el) => {
    const cs = getComputedStyle(el)
    return cs.boxShadow !== "none" || (cs.outlineStyle !== "none" && cs.outlineWidth !== "0px")
  })
  console.log(`${ring ? "✔" : "✘"} foco visível no FAQ`)

  // Header não cobre o elemento focado
  const covered = await q.evaluate((el) => {
    const h = document.querySelector("header").getBoundingClientRect()
    const r = el.getBoundingClientRect()
    const hidden = getComputedStyle(document.querySelector("header")).transform !== "none"
    return !hidden && r.top < h.bottom - 1 && r.bottom > h.top
  })
  console.log(`${covered ? "✘" : "✔"} header não cobre o foco`)

  await page.goto(base + "/loja", { waitUntil: "networkidle" })
  await page.locator("[data-product-card]").first().getByRole("button", { name: /adicionar/i }).click()
  await page.getByRole("dialog").waitFor()
  await sleep(600)
  let outside = 0
  for (let i = 0; i < 25; i++) {
    await page.keyboard.press("Tab")
    // ritmo de gente (o Base UI devolve o foco ao início no quadro seguinte)
    await sleep(120)
    if (!(await page.evaluate(() => !!document.activeElement?.closest("[role=dialog]")))) outside++
  }
  console.log(`${outside === 0 ? "✔" : "✘"} drawer prende o foco (${outside} saídas em 25 Tabs)`)
  await page.keyboard.press("Escape")
  await sleep(500)
  const back = await page.evaluate(() => document.activeElement?.closest("[data-product-card]") != null || document.activeElement?.hasAttribute("data-cart-target"))
  console.log(`${back ? "✔" : "✘"} Esc fecha e devolve o foco`)
  await ctx.close()
}

// Zoom de 200% (equivale a 640 px de largura): sem rolagem horizontal
{
  const ctx = await browser.newContext({ viewport: { width: 640, height: 800 } })
  const page = await ctx.newPage()
  for (const p of ["/", "/loja", "/checkout", "/servicos/eletricista"]) {
    await page.goto(base + p, { waitUntil: "networkidle" })
    const over = await page.evaluate(() => document.documentElement.scrollWidth - innerWidth)
    console.log(`${over <= 0 ? "✔" : "✘"} 200% ${p}: excesso horizontal ${over}px`)
  }
  await ctx.close()
}

// Alvos de toque ≥ 44 px no celular (botões e links fora de texto corrido)
{
  const ctx = await browser.newContext({ viewport: { width: 375, height: 812 }, isMobile: true, hasTouch: true })
  const page = await ctx.newPage()
  await page.goto(base + "/", { waitUntil: "networkidle" })
  const small = await page.evaluate(() =>
    [...document.querySelectorAll("button, a[class*='button'], [role=button], a.group\\/button")]
      .filter((e) => e.offsetParent && !e.closest("p, li p"))
      .map((e) => [e.getBoundingClientRect(), (e.getAttribute("aria-label") || e.textContent || "").trim().slice(0, 40)])
      .filter(([r]) => r.width > 0 && (r.width < 44 || r.height < 44))
      .map(([r, t]) => `${t} (${Math.round(r.width)}×${Math.round(r.height)})`),
  )
  console.log(`${small.length ? "✘" : "✔"} alvos < 44 px: ${small.length} ${small.slice(0, 6).join(", ")}`)
  await ctx.close()
}

await browser.close()
console.log(`\nViolações do axe: ${failures}`)
