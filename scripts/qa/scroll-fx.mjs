// Efeitos ligados ao scroll (CSS scroll-driven animations):
// 1. toda animação com timeline de scroll/view precisa usar a PÁGINA como contêiner
//    (um ancestral com overflow: hidden "rouba" a timeline e o efeito fica parado);
// 2. o progresso muda quando a página rola;
// 3. com movimento reduzido e com "Pausar animações", nenhum efeito roda.
// Uso: node scripts/qa/scroll-fx.mjs [baseUrl]
import { chromium } from "playwright"

const base = process.argv[2] ?? "http://localhost:3200"
const pages = ["/", "/servicos", "/servicos/eletricista", "/quem-somos", "/leva-e-traz", "/loja", "/dicas"]
const b = await chromium.launch()
let fails = 0
const ok = (cond, msg) => {
  if (!cond) fails++
  console.log(`${cond ? "✔" : "✘"} ${msg}`)
}

const inspect = () => {
  const list = []
  for (const el of document.querySelectorAll("*"))
    for (const a of el.getAnimations()) {
      const t = a.timeline
      if (!t || !("source" in t)) continue
      list.push({
        name: a.animationName,
        el: el.className.toString().slice(0, 40),
        root: t.source === document.scrollingElement,
        source: t.source ? `${t.source.tagName}.${t.source.className.toString().slice(0, 40)}` : null,
      })
    }
  return list
}

for (const [w, h, label] of [[1280, 800, "desktop"], [375, 812, "celular"]]) {
  const ctx = await b.newContext({ viewport: { width: w, height: h } })
  const p = await ctx.newPage()
  for (const path of pages) {
    await p.goto(base + path, { waitUntil: "networkidle" })
    const list = await p.evaluate(inspect)
    const bad = list.filter((x) => !x.root)
    ok(bad.length === 0, `${label} ${path}: ${list.length} efeitos de scroll, ${bad.length} presos num contêiner${bad.length ? " → " + JSON.stringify(bad.slice(0, 3)) : ""}`)
  }

  // O progresso muda com a rolagem (faixas cruzadas da home)
  await p.goto(base + "/", { waitUntil: "networkidle" })
  const moved = await p.evaluate(async () => {
    const el = document.querySelector(".sd-drift-left")
    if (!el) return null
    const top = el.getBoundingClientRect().top + scrollY
    const read = async (y) => {
      document.documentElement.scrollTop = y
      await new Promise((r) => setTimeout(r, 250))
      return new DOMMatrix(getComputedStyle(el).transform).m41
    }
    const a = await read(top - innerHeight)
    const c = await read(top)
    return [a, c]
  })
  ok(moved && Math.abs(moved[0] - moved[1]) > 50, `${label}: faixa anda com a rolagem (${moved?.map((n) => Math.round(n)).join(" → ")} px)`)
  await ctx.close()
}

// Movimento reduzido e botão "Pausar animações": nada roda
for (const [label, setup] of [
  ["movimento reduzido", { reducedMotion: "reduce" }],
  ["Pausar animações", {}],
]) {
  const ctx = await b.newContext({ viewport: { width: 1280, height: 800 }, ...setup })
  if (label === "Pausar animações") await ctx.addInitScript(() => localStorage.setItem("jmoreira-animacoes", "off"))
  const p = await ctx.newPage()
  await p.goto(base + "/", { waitUntil: "networkidle" })
  const n = (await p.evaluate(inspect)).length
  ok(n === 0, `${label}: ${n} efeitos de scroll ativos`)
  await ctx.close()
}

await b.close()
console.log(fails ? `\n${fails} falha(s)` : "\n✔ efeitos de scroll ok")
process.exit(fails ? 1 : 0)
