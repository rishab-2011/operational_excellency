import { chromium } from 'playwright'
import { mkdirSync } from 'node:fs'

const URL = process.env.QA_URL ?? 'http://localhost:5179/operational_excellency/'
const OUT = 'qa/out'
mkdirSync(OUT, { recursive: true })

const SECTIONS = process.env.QA_SECTIONS?.split(',') ?? [
  'opening','question','problem','unit','contract','context','loop',
  'authority','axes','evidence','value','pillars','priorart','challenge',
  'diagnostic','path','status',
]
const WIDTH = Number(process.env.QA_W ?? 1440)
const HEIGHT = Number(process.env.QA_H ?? 900)
const TAG = process.env.QA_TAG ?? `${WIDTH}`

const browser = await chromium.launch()
const page = await browser.newPage({ viewport: { width: WIDTH, height: HEIGHT }, deviceScaleFactor: 1 })

await page.goto(URL, { waitUntil: 'networkidle' })
await page.addStyleTag({ content: `*,*::before,*::after{animation-duration:0s!important;transition-duration:0s!important}html{scroll-behavior:auto!important}` })
await page.waitForTimeout(600)

for (const id of SECTIONS) {
  const el = page.locator(`#${id}`)
  if (!(await el.count())) { console.log(`MISSING #${id}`); continue }
  await el.scrollIntoViewIfNeeded()
  await page.evaluate(() => window.scrollBy(0, -8))
  await page.waitForTimeout(350)
  await page.screenshot({ path: `${OUT}/${TAG}-${id}.png` })
}
await browser.close()
console.log('shots done', TAG)
