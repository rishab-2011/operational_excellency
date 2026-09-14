import { chromium } from 'playwright'
const URL = process.env.QA_URL ?? 'https://rishab-2011.github.io/operational_excellency/'
const b = await chromium.launch()
const p = await b.newPage({ viewport: { width: 1440, height: 900 } })

const t0 = Date.now()
await p.goto(URL, { waitUntil: 'domcontentloaded' })
const domReady = Date.now() - t0
await p.waitForLoadState('networkidle')
const settled = Date.now() - t0

// Expand every disclosure so latent content counts.
await p.evaluate(async () => {
  for (const btn of document.querySelectorAll('button[aria-expanded="false"]')) btn.click()
  const h = document.documentElement.scrollHeight
  for (let y = 0; y < h; y += 400) { window.scrollTo(0, y); await new Promise(r => setTimeout(r, 8)) }
})
await p.waitForTimeout(600)
const text = (await p.evaluate(() => document.body.innerText)).replace(/\s+/g, ' ')

const CRITERIA = [
  ['1. structural production-operations problem', /root causes/i, /business outcomes/i],
  ['2. what an Operated Service is', /operated service/i, /exactly one team that can authorise/i],
  ['3. what an Operational Contract adds', /per action class/i, /blast radius/i],
  ['4. why context needs provenance and freshness', /provenance/i, /freshness/i],
  ['5. SENSE → UNDERSTAND → DECIDE → ACT → VALIDATE', /sense/i, /understand/i, /decide/i, /\bact\b/i, /validate/i],
  ['6. LEARN → IMPROVE is a separate outer loop', /outer loop/i, /review cadence/i],
  ['7. capability is not authority', /permitted/i, /technically capable/i],
  ['8. maturity and authority are separate axes', /operational maturity/i, /automation authority/i, /granted/i],
  ['9. authority may rise or fall with evidence', /revocable grant/i, /demot/i],
  ['10. measurement readiness constrains claims', /realised value may be claimed only from t1/i],
  ['11. value attributed without double counting', /no-double-counting/i, /exactly one attribution path/i],
  ['12. relation to existing disciplines and prior art', /mape-k/i, /openslo/i, /itil/i, /well-architected/i],
  ['13. what a limited validation engagement looks like', /thin vertical slice/i, /capability transfer point/i],
]

console.log(`Load: DOM ${domReady}ms · settled ${settled}ms · page text ${text.length} chars\n`)
let fails = 0
for (const [name, ...pats] of CRITERIA) {
  const missing = pats.filter((re) => !re.test(text))
  if (missing.length) { fails++; console.log(`MISS  ${name}  → ${missing.map(String).join(', ')}`) }
  else console.log(`OK    ${name}`)
}

// Guard against invented numbers.
const banned = [
  [/\b\d{1,3}\s?% (?:reduction|improvement|savings|faster|fewer)/i, 'invented percentage outcome'],
  [/\bROI of\b/i, 'ROI claim'],
  [/save[sd]? (?:millions|\$)/i, 'savings claim'],
  // The requirement quotes this phrase in order to ban it; only flag it when it is
  // asserted rather than prohibited.
  [/(?<!prohibition on claims such as ")enterprises only use \d+% (?!of Datadog")/i, 'utilisation claim'],
  [/\bexcellency\b/i, 'repository misspelling'],
  [/lorem ipsum/i, 'placeholder text'],
  [/\bTODO\b/, 'TODO marker'],
]
console.log('')
for (const [re, label] of banned) {
  if (re.test(text)) { fails++; console.log(`BANNED PHRASE PRESENT: ${label}`) }
}
if (!banned.some(([re]) => re.test(text))) console.log('OK    no invented figures, placeholders or misspelling')

const perf = await p.evaluate(() => {
  const n = performance.getEntriesByType('navigation')[0]
  const res = performance.getEntriesByType('resource')
  return {
    transferKB: Math.round(res.reduce((a, r) => a + (r.transferSize || 0), 0) / 1024),
    requests: res.length,
    domContentLoaded: Math.round(n.domContentLoadedEventEnd),
  }
})
console.log(`\nTransfer ${perf.transferKB} KB over ${perf.requests} requests · DCL ${perf.domContentLoaded}ms`)
await b.close()
console.log(fails ? `\n${fails} FAILURES` : '\nALL SUCCESS CRITERIA VERIFIED')
process.exit(fails ? 1 : 0)
