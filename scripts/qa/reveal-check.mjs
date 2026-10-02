// Validação de ponta a ponta do <Reveal> (regra 4 da skill de motion):
// amostra o estado de um bloco em fases (antes, durante, depois da entrada).
// Uso: node scripts/qa/reveal-check.mjs [url]
import { chromium } from "playwright"

const url = process.argv[2] ?? "http://localhost:3200/"
const browser = await chromium.launch()

for (const reducedMotion of ["no-preference", "reduce"]) {
  const page = await browser.newPage({ viewport: { width: 1280, height: 800 }, reducedMotion })
  await page.goto(url, { waitUntil: "networkidle" })
  const target = page.locator("#servicos").locator("xpath=ancestor::section[1]").locator("[data-reveal]").first()
  const read = () =>
    target.evaluate((el) => {
      const cs = getComputedStyle(el)
      return { opacity: Number(cs.opacity).toFixed(2), transform: cs.transform }
    })
  const before = await read()
  await target.scrollIntoViewIfNeeded()
  await page.waitForTimeout(150)
  const during = await read()
  await page.waitForTimeout(900)
  const after = await read()
  console.log(JSON.stringify({ reducedMotion, before, during, after }))
  await page.close()
}
await browser.close()
