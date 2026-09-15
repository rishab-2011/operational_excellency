/**
 * Does the product convey the framework?
 *
 * Walks the DEFAULT view of each area — no tab switching, no panel opening — and
 * requires the core concepts to be present. Also guards against invented figures,
 * fake integrations and research apparatus leaking into working surfaces.
 */
import { chromium } from 'playwright'
import { ALL_ROUTES, DEFAULT_ROUTES, sweep, visit } from './routes.mjs'

const URL = process.env.QA_URL ?? 'http://localhost:5179/operational_excellency/'

const CONCEPTS = [
  ['The proposition: a consistent operating standard', [/consistent operating standard/i, /spread across different tools, teams and processes/i]],
  ['Automation boundaries are part of it', [/without human approval/i, /evidence/i]],
  ['The operating hierarchy', [/operated service/i, /operate/i, /govern/i, /validate/i, /improve/i]],
  ['The unit of accountability', [/operated service/i]],
  ['Contract and context substrate', [/operational contract/i, /service context substrate/i]],
  ['The full loop with a gate', [/sense/i, /understand/i, /decide/i, /authority gate/i, /\bact\b/i, /validate/i]],
  ['Outer loop returns to the substrate', [/learn/i, /improve/i, /updates contract . context . authority/i]],
  ['Authority is granted and capped', [/ceiling/i, /granted/i]],
  ['Authority can exceed evidence', [/above ceiling|authority exceeds maturity|authority above evidence/i]],
  ['Context has provenance and a window', [/declared|discovered/i, /window/i]],
  ['Value is constrained by measurement', [/measurement|realised value|attribution/i]],
  ['Assessment can disqualify', [/applicability/i]],
  ['Objections are published', [/why an enterprise would say no/i, /unresolved/i]],
  ['Sample data is labelled', [/illustrative sample estate/i, /not connected to any system/i]],
]

const BANNED = [
  [/\b\d{1,3}\s?% (?:reduction|improvement|savings|faster|fewer)/i, 'invented percentage outcome'],
  [/\bROI of\b/i, 'ROI claim'],
  [/save[sd]? (?:millions|\$)/i, 'savings claim'],
  [/\bexcellency\b/i, 'repository misspelling'],
  [/lorem ipsum/i, 'placeholder text'],
  [/\bTODO\b/, 'TODO marker'],
  [/\b(connected|syncing|synced|live) (?:to|with) (?:your|the) (?:datadog|servicenow|splunk|cluster|estate)\b/i, 'implied live integration'],
  [/\blast (?:synced|updated) \d/i, 'implied live data feed'],
]

/**
 * Home acceptance test.
 *
 * A first-time operations or technology leader must be able to answer all six from
 * the Home screen alone, without opening another area.
 */
const HOME_QUESTIONS = [
  ['Q1 What operational problem is addressed?', [/spread across different tools, teams and processes/i, /preventable incidents/i, /operational toil/i]],
  ['Q2 What does it actually do to an organisation?', [/what the framework actually does/i, /assess/i, /find gaps/i, /define the operating standard/i, /prioritise/i, /improve/i, /measure/i, /learn/i]],
  ['Q3 How would it help during a real operational problem?', [/a production signal appears/i, /who owns it/i, /is automation authorised/i, /validate that the service and customer outcome actually recovered/i]],
  ['Q4 Is it limited to incident reduction?', [/this is one example/i, /not the boundary of it/i, /monitoring, logging, service ownership, change management/i]],
  ['Q5 Does it replace existing tools and teams?', [/does not replace your observability, itsm, sre, platform, ci\/cd/i, /no rip-and-replace premise/i, /no workforce-elimination premise/i, /no l1-elimination claim/i, /ai runs production/i]],
  ['Q6 Why do the framework concepts exist?', [/what exactly are we operating/i, /how should this service be operated/i, /is it still trustworthy/i, /which signals actually deserve action/i, /without human approval, under what conditions/i, /can we demonstrate that operations actually improved/i]],
]

const browser = await chromium.launch()
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } })
await page.goto(URL, { waitUntil: 'networkidle' })
await page.addStyleTag({ content: `*,*::before,*::after{animation-duration:0s!important;transition-duration:0s!important}html{scroll-behavior:auto!important}` })

// Home alone, for the acceptance questions.
await visit(page, 'overview')
await sweep(page)
const homeText = (await page.evaluate(() => document.getElementById('main').innerText)).replace(/\s+/g, ' ')

let defaultText = ''
for (const r of DEFAULT_ROUTES) {
  await visit(page, r)
  await sweep(page)
  defaultText += ' ' + (await page.evaluate(() => document.getElementById('main').innerText))
}
defaultText = defaultText.replace(/\s+/g, ' ')

let allText = ''
for (const r of ALL_ROUTES) {
  await visit(page, r)
  await sweep(page)
  allText += ' ' + (await page.evaluate(() => document.body.innerText))
}
allText = allText.replace(/\s+/g, ' ')

let fails = 0

console.log(`Home: ${homeText.split(' ').length} words\n`)
for (const [name, pats] of HOME_QUESTIONS) {
  const missing = pats.filter((re) => !re.test(homeText))
  if (missing.length) { fails++; console.log(`MISS  ${name} → ${missing.map(String).join(', ')}`) }
  else console.log(`OK    ${name}`)
}

console.log(`\nDefault journey: ${defaultText.split(' ').length} words across ${DEFAULT_ROUTES.length} areas\n`)
for (const [name, pats] of CONCEPTS) {
  const missing = pats.filter((re) => !re.test(defaultText))
  if (missing.length) { fails++; console.log(`MISS  ${name} → ${missing.map(String).join(', ')}`) }
  else console.log(`OK    ${name}`)
}

console.log('')
let banned = 0
for (const [re, label] of BANNED) {
  if (re.test(allText)) { banned++; fails++; console.log(`BANNED: ${label}`) }
}
if (!banned) console.log('OK    no invented figures, fake integrations, placeholders or misspelling')

// Research apparatus must not leak outside Evidence.
let leaks = 0
for (const r of ALL_ROUTES.filter((x) => !x.startsWith('evidence'))) {
  await visit(page, r)
  const t = await page.evaluate(() => document.getElementById('main').innerText)
  if (/§\d/.test(t)) { leaks++; console.log(`LEAK: section citation on ${r}`) }
}
if (!leaks) console.log('OK    citations confined to Evidence')
else fails += leaks

await browser.close()
console.log(fails ? `\n${fails} FAILURES` : '\nPRODUCT COMPREHENSION TEST PASSED')
process.exit(fails ? 1 : 0)
