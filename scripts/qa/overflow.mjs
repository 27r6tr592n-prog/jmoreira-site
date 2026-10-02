// Detecta conteúdo mais largo que a tela no celular. O <body> usa overflow-x: clip
// (esconde o excesso sem rolagem), então a checagem desliga o clip antes de medir
// e aponta o elemento mais largo. Uso: node scripts/qa/overflow.mjs [baseUrl]
import { chromium } from "playwright"

const base = process.argv[2] ?? "http://localhost:3200"
const pages = ["/", "/servicos", "/servicos/eletricista", "/servicos/limpeza-placas-solares", "/loja", "/loja/bateria-moura-60ah-m60gd", "/checkout", "/leva-e-traz", "/servico-particular", "/contato", "/quem-somos", "/seja-prestador", "/dicas"]
const b = await chromium.launch()
let fails = 0
for (const w of [360, 390, 412]) {
  const ctx = await b.newContext({ viewport: { width: w, height: 844 }, isMobile: true, hasTouch: true })
  const p = await ctx.newPage()
  for (const path of pages) {
    await p.goto(base + path, { waitUntil: "networkidle" })
    const r = await p.evaluate(() => {
      document.body.style.overflowX = "visible"
      const extra = document.documentElement.scrollWidth - innerWidth
      // Seções com overflow hidden também escondem excesso: mede cada elemento de
      // texto/controle visível (fora de camadas decorativas aria-hidden).
      let worst = null
      for (const el of document.querySelectorAll("main :is(h1,h2,h3,p,a,button,label,input,textarea,li,nav), header :is(a,button)")) {
        if (el.closest("[aria-hidden='true'], .sr-only")) continue
        const rect = el.getBoundingClientRect()
        if (rect.width === 0 || rect.height === 0) continue
        if (rect.right > innerWidth + 1 && (!worst || rect.right > worst.right))
          worst = { right: Math.round(rect.right), tag: el.tagName, text: (el.textContent || "").trim().slice(0, 40) }
      }
      return { extra: Math.max(extra, worst ? worst.right - innerWidth : 0), worst }
    })
    if (r.extra > 0) {
      fails++
      console.log(`✘ ${w}px ${path}: +${r.extra}px`, JSON.stringify(r.worst))
    }
  }
  await ctx.close()
}
await b.close()
console.log(fails ? `${fails} página(s) mais largas que a tela` : "✔ nenhuma página passa da largura da tela (360/390/412 px)")
