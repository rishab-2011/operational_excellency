/**
 * The acceptance test: can a reader understand the framework from the Executive View
 * alone, WITHOUT opening any detail panel?
 *
 * Nothing is expanded. Only the entry plus the six executive sections are read.
 */
import { chromium } from 'playwright'

const URL = process.env.QA_URL ?? 'http://localhost:5179/operational_excellency/'
const EXEC = ['start', 'exec-why', 'exec-model', 'exec-authority', 'exec-value', 'exec-apply', 'exec-evidence']

const CONCEPTS = [
  ['The problem is causal, not a list', [/root cause/i, /mechanism/i, /business outcome/i]],
  ['Value is claimable at one layer only', [/value claimable here only/i, /one path per claimed benefit/i]],
  ['What an Operated Service is', [/operated service/i, /accountability/i, /independent recovery/i]],
  ['Qualification is a gate chain', [/observable boundary/i, /outcome traceability/i, /verdict/i]],
  ['Contract + context substrate', [/operational contract/i, /service context substrate/i, /provenance/i, /freshness/i]],
  ['The full loop, in order', [/sense/i, /understand/i, /decide/i, /authority gate/i, /\bact\b/i, /validate/i]],
  ['Outer loop feeds back', [/learn/i, /improve/i, /updates contract . context . authority/i]],
  ['Capability is not authority', [/what the machine can do/i, /what the machine may do/i]],
  ['Maturity and authority are separate axes', [/operational maturity/i, /automation authority/i, /earned/i, /granted/i]],
  ['Authority above evidence is the danger', [/authority exceeds maturity/i]],
  ['Context decay withdraws authority', [/stale/i, /authority gate/i]],
  ['Measurement tier gates the claim', [/t1/i, /realised value/i, /estimated value/i]],
  ['Prior art is conceded', [/mape-k/i, /observability/i, /aiops/i]],
  ['The gap nothing else owns', [/no existing discipline owns this row/i]],
  ['The pilot path', [/discover/i, /pilot/i, /prove/i, /capability transfer/i]],
  ['Claims are labelled, one withdrawn', [/hypothesis/i, /withdrawn/i]],
]

const browser = await chromium.launch()
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } })
await page.goto(URL, { waitUntil: 'networkidle' })
await page.addStyleTag({ content: `*,*::before,*::after{animation-duration:0s!important;transition-duration:0s!important}html{scroll-behavior:auto!important}` })

// Confirm nothing is pre-expanded, then read only the executive range.
const expanded = await page.evaluate(() =>
  [...document.querySelectorAll('[aria-expanded="true"]')].filter((e) => e.closest('#start, [id^="exec-"]')).length)

await page.evaluate(async (ids) => {
  for (const id of ids) {
    const el = document.getElementById(id)
    const h = el.scrollHeight
    for (let y = 0; y < h; y += 400) {
      window.scrollTo(0, el.getBoundingClientRect().top + window.scrollY + y)
      await new Promise((r) => setTimeout(r, 14))
    }
  }
}, EXEC)
await page.waitForTimeout(700)

const text = await page.evaluate((ids) =>
  ids.map((id) => document.getElementById(id).innerText).join(' ').replace(/\s+/g, ' '), EXEC)

const words = text.split(' ').filter(Boolean).length
let fails = 0
console.log(`Executive View: ${words} words across ${EXEC.length} sections · ${expanded} panels pre-expanded\n`)
for (const [name, pats] of CONCEPTS) {
  const missing = pats.filter((re) => !re.test(text))
  if (missing.length) { fails++; console.log(`MISS  ${name} → ${missing.map(String).join(', ')}`) }
  else console.log(`OK    ${name}`)
}

// A three-minute read is roughly 600 words of prose; the rest must be carried by visuals.
const visuals = await page.evaluate((ids) =>
  ids.reduce((a, id) => a + document.querySelectorAll(`#${id} svg, #${id} [role="img"], #${id} [role="group"], #${id} [role="tablist"]`).length, 0), EXEC)
console.log(`\nVisual elements in the executive range: ${visuals}`)

await browser.close()
console.log(fails ? `\n${fails} CONCEPTS NOT CONVEYED` : '\nEXECUTIVE COMPREHENSION TEST PASSED')
process.exit(fails ? 1 : 0)
