import { chromium } from 'playwright'
import { mkdirSync } from 'node:fs'

const URL = process.env.QA_URL ?? 'http://localhost:5179/operational_excellency/'
const OUT = 'qa/out'
mkdirSync(OUT, { recursive: true })

const ROUTES = process.env.QA_ROUTES?.split(',') ?? [
  'overview',
  'operating-model/architecture', 'operating-model/register', 'operating-model/qualification',
  'operating-model/contract', 'operating-model/context',
  'authority/position', 'authority/model', 'authority/gate', 'authority/states',
  'value/attribution', 'value/measurement', 'value/causes', 'value/metrics',
  'assess',
  'evidence/objections', 'evidence/prior-art', 'evidence/claims', 'evidence/method',
]
const WIDTH = Number(process.env.QA_W ?? 1440)
const HEIGHT = Number(process.env.QA_H ?? 900)
const TAG = process.env.QA_TAG ?? `${WIDTH}`

const browser = await chromium.launch()
const page = await browser.newPage({ viewport: { width: WIDTH, height: HEIGHT }, deviceScaleFactor: 1 })
await page.goto(URL, { waitUntil: 'networkidle' })
await page.addStyleTag({ content: `*,*::before,*::after{animation-duration:0s!important;transition-duration:0s!important}html{scroll-behavior:auto!important}` })

for (const r of ROUTES) {
  await page.evaluate((route) => { window.location.hash = `#/${route}` }, r)
  await page.waitForTimeout(450)
  await page.screenshot({ path: `${OUT}/${TAG}-${r.replace(/\//g, '_')}.png` })
}
await browser.close()
console.log('shots done', TAG)
