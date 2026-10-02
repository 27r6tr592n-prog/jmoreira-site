// Teste de ponta a ponta das interações com movimento (Playwright, headless).
// Uso: node scripts/qa/e2e.mjs [baseUrl]   (padrão: http://localhost:3200)
// Cobre: header inteligente, contadores, seção fixada, partículas 3D (só desktop),
// voo até o carrinho + drawer, remoção/desfazer, os dois checkouts e reduced motion.
import { chromium } from "playwright"

const base = process.argv[2] ?? "http://localhost:3200"
const shots = process.env.QA_SHOTS ?? null
const results = []
const ok = (name, pass, info = "") => {
  results.push({ name, pass, info })
  console.log(`${pass ? "✔" : "✘"} ${name}${info ? ` — ${info}` : ""}`)
}
const sleep = (ms) => new Promise((r) => setTimeout(r, ms))

const browser = await chromium.launch()

async function newPage(opts = {}) {
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 800 }, ...opts })
  // Nada sai para a internet: WhatsApp e afins são abortados
  await ctx.route(/wa\.me|whatsapp\.com|instagram|facebook|google/, (r) => r.abort())
  const page = await ctx.newPage()
  const errors = []
  page.on("pageerror", (e) => errors.push(String(e)))
  page.on("console", (m) => m.type() === "error" && !/Failed to load resource|ERR_FAILED|net::/.test(m.text()) && errors.push(m.text()))
  return { ctx, page, errors }
}

async function wheelTo(page, y, step = 400) {
  // Rola como um usuário (o Lenis intercepta a roda do mouse)
  const cur = await page.evaluate(() => window.scrollY)
  const dir = y > cur ? 1 : -1
  for (let n = 0; n < Math.ceil(Math.abs(y - cur) / step); n++) {
    await page.mouse.wheel(0, dir * step)
    await sleep(60)
  }
  await sleep(700)
}

// ───────────── 1. Home no desktop ─────────────
{
  const { ctx, page, errors } = await newPage()
  await page.goto(base + "/", { waitUntil: "networkidle" })
  await page.mouse.move(640, 400)

  // Header transparente no topo
  const solidTop = await page.locator("header[data-solid]").count()
  ok("header transparente no topo", solidTop === 0)

  await wheelTo(page, 300)
  ok("header ganha fundo depois de 80 px", (await page.locator("header[data-solid]").count()) === 1)

  await wheelTo(page, 1400)
  const hiddenY = await page.evaluate(() => new DOMMatrixReadOnly(getComputedStyle(document.querySelector("header")).transform).m42)
  ok("header some ao rolar para baixo", hiddenY < -40, `translateY=${hiddenY.toFixed(0)}`)

  await page.mouse.wheel(0, -300)
  await sleep(800)
  const shownY = await page.evaluate(() => new DOMMatrixReadOnly(getComputedStyle(document.querySelector("header")).transform).m42)
  ok("header volta ao rolar para cima", Math.abs(shownY) < 2, `translateY=${shownY.toFixed(0)}`)

  // Contadores: depois de visíveis, chegam ao valor final
  const counters = await page.evaluate(() =>
    [...document.querySelectorAll("section[aria-label='A JMoreira em números'] dd span[aria-hidden='true']")].map((e) => e.textContent),
  )
  ok("contadores chegam ao valor final", counters.join("|") === "120 min|+2.500|4,8|86", counters.join(" | "))

  // Partículas: canvas montado depois do idle
  await sleep(1500)
  const canvas = await page.locator("canvas[data-ready]").count()
  ok("partículas 3D no desktop", canvas === 1)

  // Seção fixada: o passo ativo acompanha o scroll
  const top = await page.evaluate(() => {
    const h = document.getElementById("como-funciona")
    let el = h
    while (el && !(el.className && String(el.className).includes("h-[340vh]"))) el = el.parentElement
    return el ? el.getBoundingClientRect().top + window.scrollY : null
  })
  ok("seção fixada renderizada no desktop", top !== null)
  if (top !== null) {
    const vh = 800
    const span = 3.4 * vh - vh
    const seen = []
    for (const p of [0.05, 0.3, 0.55, 0.85]) {
      await page.evaluate((y) => window.scrollTo(0, y), top + span * p)
      await sleep(500)
      const step = await page.evaluate(() => {
        const li = document.querySelector("[aria-current='step']")
        return li ? [...li.parentElement.querySelectorAll("li")].indexOf(li) + 1 : 0
      })
      const pinned = await page.evaluate(() => {
        const h = document.getElementById("como-funciona")
        return Math.round(h.getBoundingClientRect().top)
      })
      seen.push(`${step}@${pinned}`)
      if (shots && p === 0.55) await page.screenshot({ path: `${shots}/pinned-step3.png` })
    }
    const steps = seen.map((s) => Number(s.split("@")[0]))
    ok("passos avançam 1→4 com o scroll", steps.join("") === "1234", seen.join(" "))
    const tops = seen.map((s) => Number(s.split("@")[1]))
    ok("título fica parado enquanto fixado", Math.max(...tops) - Math.min(...tops) < 4, tops.join(","))
  }
  if (shots) {
    await page.goto(base + "/", { waitUntil: "networkidle" })
    await sleep(2500)
    await page.screenshot({ path: `${shots}/home-desktop.png` })
  }
  ok("home desktop sem erros de console", errors.length === 0, errors.slice(0, 3).join(" / "))
  await ctx.close()
}

// ───────────── 2. Mobile: sem 3D, sem seção fixada ─────────────
{
  const { ctx, page, errors } = await newPage({ viewport: { width: 375, height: 812 }, isMobile: true, hasTouch: true })
  await page.goto(base + "/", { waitUntil: "networkidle" })
  await sleep(2500)
  ok("mobile: sem partículas", (await page.locator("canvas").count()) === 0)
  ok("mobile: lista simples no lugar da seção fixada", (await page.locator(".h-\\[340vh\\]").count()) === 0)
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth)
  ok("mobile: sem rolagem horizontal", overflow <= 0, `excesso=${overflow}px`)
  if (shots) await page.screenshot({ path: `${shots}/home-mobile.png` })
  ok("mobile sem erros de console", errors.length === 0, errors.slice(0, 3).join(" / "))
  await ctx.close()
}

// ───────────── 3. Carrinho: voo, drawer, remover/desfazer ─────────────
{
  const { ctx, page, errors } = await newPage()
  await page.goto(base + "/loja", { waitUntil: "networkidle" })
  const card = page.locator("[data-product-card]").first()
  const name = (await card.locator("h3, h2").first().textContent())?.trim()
  await card.getByRole("button", { name: /adicionar/i }).click()
  await sleep(250)
  const flying = await page.evaluate(() => [...document.querySelectorAll("body > div")].some((d) => d.style.position === "fixed" && d.querySelector("img")))
  ok("miniatura voa até o carrinho", flying)
  await page.getByRole("dialog").waitFor({ timeout: 4000 })
  ok("drawer abre depois do voo", await page.getByRole("dialog").isVisible())
  const badge = await page.locator("[data-cart-target]").getAttribute("aria-label")
  ok("badge do carrinho atualizado", /1 item/.test(badge ?? ""), badge ?? "")
  if (shots) {
    await sleep(700)
    await page.screenshot({ path: `${shots}/drawer.png` })
  }

  await page.getByRole("button", { name: /remover .* do carrinho/i }).first().click()
  await sleep(700)
  ok("item removido (com animação de saída)", (await page.getByRole("dialog").locator("li").count()) === 0)
  await page.getByRole("button", { name: /desfazer/i }).click()
  await sleep(700)
  ok("desfazer devolve o item", (await page.getByRole("dialog").locator("li").count()) === 1, name)
  await page.keyboard.press("Escape")
  // espera a animação de saída (painel + fundo) terminar antes de conferir
  const closed = await page.getByRole("dialog").waitFor({ state: "detached", timeout: 2500 }).then(() => true, () => false)
  ok("Esc fecha o drawer", closed)
  ok("loja sem erros de console", errors.length === 0, errors.slice(0, 3).join(" / "))

  // ───────────── 4. Checkout pelo WhatsApp ─────────────
  await page.goto(base + "/checkout", { waitUntil: "networkidle" })
  await page.getByRole("button", { name: /finalizar pelo whatsapp|whatsapp/i }).last().click()
  await sleep(500)
  const invalid = await page.locator("[aria-invalid='true']").count()
  ok("checkout valida campos obrigatórios", invalid > 0, `${invalid} campos marcados`)
  const shake = await page.locator("#nome-erro").count()
  ok("mensagem de erro aparece com animação", shake === 1)
  await page.getByLabel("Nome completo").fill("Cliente Teste")
  await page.getByLabel("WhatsApp ou telefone").fill("17999990000")
  await page.getByLabel("E-mail").fill("teste@example.com")
  await page.getByText("Retirar na loja").click()
  const popup = page.waitForEvent("popup", { timeout: 4000 }).catch(() => null)
  await page.getByRole("button", { name: /whatsapp/i }).last().click()
  await page.getByText(/pedido/i).first().waitFor({ timeout: 8000 })
  const doneWa = await page.locator("main").innerText()
  ok("checkout WhatsApp conclui o pedido", /JM-|pedido/i.test(doneWa), doneWa.match(/JM-[A-Z0-9-]+/)?.[0] ?? "")
  await popup
  await ctx.close()
}

// ───────────── 5. Checkout com pagamento online (stub sem credenciais) ─────────────
{
  const { ctx, page, errors } = await newPage()
  await page.goto(base + "/loja", { waitUntil: "networkidle" })
  await page.locator("[data-product-card]").nth(1).getByRole("button", { name: /adicionar/i }).click()
  await page.getByRole("dialog").waitFor({ timeout: 4000 })
  await page.getByRole("dialog").getByRole("link", { name: /finalizar|checkout|continuar/i }).first().click()
  await page.waitForURL(/checkout/)
  await page.getByLabel("Nome completo").fill("Cliente Teste")
  await page.getByLabel("WhatsApp ou telefone").fill("17999990000")
  await page.getByLabel("E-mail").fill("teste@example.com")
  await page.getByText("Retirar na loja").click()
  const popup = page.waitForEvent("popup", { timeout: 4000 }).catch(() => null)
  await page.getByRole("button", { name: /pagar/i }).click()
  await page.waitForFunction(() => /JM-/.test(document.querySelector("main")?.innerText ?? "") || location.pathname.includes("confirmacao"), null, { timeout: 10000 })
  const text = await page.locator("main").innerText()
  ok("checkout online responde (stub: cai no WhatsApp com aviso)", /JM-/.test(text), text.match(/JM-[A-Z0-9-]+/)?.[0] ?? page.url())
  await popup
  ok("checkout sem erros de console", errors.length === 0, errors.slice(0, 3).join(" / "))
  await ctx.close()
}

// ───────────── 6. prefers-reduced-motion ─────────────
{
  const { ctx, page, errors } = await newPage({ reducedMotion: "reduce" })
  await page.goto(base + "/", { waitUntil: "networkidle" })
  await sleep(2500)
  ok("reduced: sem partículas", (await page.locator("canvas").count()) === 0)
  ok("reduced: sem seção fixada", (await page.locator(".h-\\[340vh\\]").count()) === 0)
  const lenis = await page.evaluate(() => document.documentElement.classList.contains("lenis"))
  ok("reduced: Lenis desligado", !lenis)
  // Navega por várias páginas e confere que tudo fica visível e parado
  for (const path of ["/servicos", "/loja", "/quem-somos", "/contato"]) {
    await page.goto(base + path, { waitUntil: "networkidle" })
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight / 2))
    // 2,5 s: inclui a entrada do botão do WhatsApp (aos 2 s, só fade no modo reduzido)
    await sleep(2500)
    const hidden = await page.evaluate(() =>
      [...document.querySelectorAll("[data-reveal]")]
        // dentro da área de disparo (viewport com margem de -100 px)
        .filter((e) => {
          const r = e.getBoundingClientRect()
          return r.top < innerHeight - 100 && r.bottom > 100
        })
        .filter((e) => {
          const cs = getComputedStyle(e)
          return Number(cs.opacity) < 0.99 || (cs.transform !== "none" && !/matrix\(1, 0, 0, 1, 0, 0\)/.test(cs.transform))
        }).length,
    )
    ok(`reduced: ${path} sem deslocamento nem conteúdo escondido`, hidden === 0, `${hidden} elementos`)
  }
  ok("reduced sem erros de console", errors.length === 0, errors.slice(0, 3).join(" / "))
  await ctx.close()
}

// ───────────── 7. Botão "Pausar animações" ─────────────
{
  const { ctx, page } = await newPage()
  await page.goto(base + "/", { waitUntil: "networkidle" })
  await page.getByRole("button", { name: "Pausar animações" }).click()
  await sleep(400)
  ok("pausar: Lenis desliga", !(await page.evaluate(() => document.documentElement.classList.contains("lenis"))))
  ok("pausar: partículas saem", (await page.locator("canvas").count()) === 0)
  await page.reload({ waitUntil: "networkidle" })
  ok("pausar: preferência lembrada", (await page.evaluate(() => document.documentElement.dataset.motion)) === "off")
  await ctx.close()
}

await browser.close()
const failed = results.filter((r) => !r.pass)
console.log(`\n${results.length - failed.length}/${results.length} verificações passaram`)
process.exit(failed.length ? 1 : 0)
