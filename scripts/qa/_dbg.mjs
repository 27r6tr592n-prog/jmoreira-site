import { chromium } from "playwright"
const b = await chromium.launch()
for (const rm of ["no-preference", "reduce"]) {
  const p = await b.newPage({ viewport: { width: 1280, height: 800 }, reducedMotion: rm })
  await p.goto("http://localhost:3200/", { waitUntil: "networkidle" })
  await new Promise((r) => setTimeout(r, 2500))
  console.log(rm, await p.evaluate(() => [...document.querySelectorAll("img[src*='fachada'], img[srcset*='fachada']")].slice(0, 1).map((img) => {
    let el = img, chain = []
    while (el && el !== document.body) { const cs = getComputedStyle(el); if (cs.opacity !== "1" || cs.display === "none" || cs.visibility !== "visible" || cs.transform !== "none") chain.push(`${el.tagName}.${String(el.className).slice(0, 40)} op=${cs.opacity} disp=${cs.display} tf=${cs.transform.slice(0, 30)} anim=${cs.animationName}`); el = el.parentElement }
    return { complete: img.complete, w: img.naturalWidth, rect: JSON.stringify(img.getBoundingClientRect()).slice(0, 80), chain }
  })))
  await p.close()
}
await b.close()
