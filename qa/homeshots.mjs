import { chromium } from 'playwright'
import { mkdirSync } from 'node:fs'
const URL = process.env.QA_URL ?? 'http://localhost:5179/operational_excellency/'
mkdirSync('qa/out', { recursive: true })
const W = Number(process.env.QA_W ?? 1440), H = Number(process.env.QA_H ?? 900)
const TAG = process.env.QA_TAG ?? `home${W}`
const b = await chromium.launch()
const p = await b.newPage({ viewport: { width: W, height: H } })
await p.goto(URL, { waitUntil: 'networkidle' })
await p.addStyleTag({ content: `*,*::before,*::after{animation-duration:0s!important;transition-duration:0s!important}html{scroll-behavior:auto!important}` })
await p.evaluate(async () => { const h = document.documentElement.scrollHeight; for (let y=0;y<h;y+=400){window.scrollTo(0,y);await new Promise(r=>setTimeout(r,12))} window.scrollTo(0,0) })
await p.waitForTimeout(400)
const total = await p.evaluate(() => document.documentElement.scrollHeight)
let i = 0
for (let y = 0; y < total; y += H) {
  await p.evaluate((yy) => window.scrollTo(0, yy), y)
  await p.waitForTimeout(250)
  await p.screenshot({ path: `qa/out/${TAG}-${String(++i).padStart(2,'0')}.png` })
}
console.log(`captured ${i} panes, page height ${total}px`)
await b.close()
