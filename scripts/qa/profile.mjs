// Perfil de CPU da carga da página (CPU 4x mais lenta, viewport de celular).
// Agrupa o tempo próprio por arquivo e por função. Uso: node scripts/qa/profile.mjs [url]
import { chromium } from "playwright"

const url = process.argv[2] ?? "http://localhost:3200/"
const browser = await chromium.launch()
const ctx = await browser.newContext({ viewport: { width: 412, height: 823 }, isMobile: true, hasTouch: true })
const page = await ctx.newPage()
const cdp = await ctx.newCDPSession(page)
await cdp.send("Emulation.setCPUThrottlingRate", { rate: 4 })
await cdp.send("Profiler.enable")
await cdp.send("Profiler.setSamplingInterval", { interval: 200 })
await cdp.send("Profiler.start")
await page.goto(url, { waitUntil: "load" })
await page.waitForTimeout(4000)
const { profile } = await cdp.send("Profiler.stop")

const byId = new Map(profile.nodes.map((n) => [n.id, n]))
const self = new Map()
const dt = profile.timeDeltas
for (let i = 0; i < profile.samples.length; i++) self.set(profile.samples[i], (self.get(profile.samples[i]) ?? 0) + (dt[i] ?? 0))
const byFile = new Map()
const byFn = new Map()
for (const [id, us] of self) {
  const n = byId.get(id)
  const f = (n.callFrame.url || n.callFrame.functionName || "(native)").replace(/.*\/_next\/static\//, "").replace(/^http:\/\/localhost:\d+/, "doc")
  byFile.set(f, (byFile.get(f) ?? 0) + us)
  const key = `${n.callFrame.functionName || "(anon)"} @ ${f}:${n.callFrame.lineNumber}:${n.callFrame.columnNumber}`
  byFn.set(key, (byFn.get(key) ?? 0) + us)
}
const top = (map, k) => [...map].filter(([n]) => !/\(idle\)|\(program\)/.test(n)).sort((a, b) => b[1] - a[1]).slice(0, k).map(([n, us]) => `${(us / 1000).toFixed(0).padStart(5)} ms  ${n}`)
console.log("— por arquivo —\n" + top(byFile, 14).join("\n"))
console.log("— por função —\n" + top(byFn, 25).join("\n"))
console.log("program/idle:", ((self.get([...byId.values()].find((n) => n.callFrame.functionName === "(program)")?.id) ?? 0) / 1000).toFixed(0), "ms")
await browser.close()
