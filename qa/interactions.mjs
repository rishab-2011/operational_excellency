/**
 * Product interaction tests.
 *
 * Every behavioural assertion from the previous suite is preserved; the selectors move
 * to the screens that now own each behaviour. New tests cover product navigation,
 * the service register, the assessment workflow and the objections surface.
 */
import { chromium } from 'playwright'
import assert from 'node:assert/strict'

const URL = process.env.QA_URL ?? 'http://localhost:5179/operational_excellency/'
const results = []
const test = async (name, fn) => {
  try { await fn(); results.push(['PASS', name]) }
  catch (e) {
    const detail = [e.message.split('\n')[0], e.actual ? `ACTUAL: ${String(e.actual).replace(/\s+/g, ' ').slice(0, 180)}` : '']
      .filter(Boolean).join(' | ')
    results.push(['FAIL', `${name} → ${detail}`])
  }
}

const browser = await chromium.launch()
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } })
const consoleErrors = []
page.on('console', (m) => { if (m.type() === 'error') consoleErrors.push(m.text()) })
page.on('pageerror', (e) => consoleErrors.push(String(e)))
await page.goto(URL, { waitUntil: 'networkidle' })
await page.addStyleTag({ content: `*,*::before,*::after{animation-duration:0s!important;transition-duration:0s!important}html{scroll-behavior:auto!important}` })

const go = async (route) => {
  await page.evaluate((r) => { window.location.hash = `#/${r}` }, route)
  await page.waitForTimeout(350)
}
const main = () => page.locator('#main')

/* ------------------------------------------------------ product navigation */

await test('product exposes six working areas in primary navigation', async () => {
  const labels = await page.locator('nav[aria-label="Primary"] button').allInnerTexts()
  assert.deepEqual(labels, ['Overview', 'Operating Model', 'Authority', 'Value', 'Assess', 'Evidence'])
})

await test('navigating marks the current area and changes the screen', async () => {
  await page.locator('nav[aria-label="Primary"] button', { hasText: 'Authority' }).click()
  await page.waitForTimeout(350)
  assert.equal(await page.locator('nav[aria-label="Primary"] button[aria-current="page"]').innerText(), 'Authority')
  assert.equal(await page.locator('h1').first().innerText(), 'Authority')
})

await test('every area is reachable and renders content', async () => {
  for (const a of ['overview', 'operating-model', 'authority', 'value', 'assess', 'evidence']) {
    await go(a)
    const len = (await main().innerText()).length
    assert.ok(len > 400, `${a} rendered only ${len} chars`)
  }
})

await test('deep links address a specific view', async () => {
  await go('evidence/method')
  assert.match(await main().innerText(), /evidence grades/i)
  await go('authority/gate')
  assert.match(await main().innerText(), /gate evaluator/i)
})

await test('document title tracks the screen', async () => {
  await go('value/measurement')
  assert.match(await page.title(), /Value/)
})

/* ------------------------------------------- research apparatus containment */

await test('section citations do not appear in working areas', async () => {
  for (const a of ['overview', 'operating-model/register', 'authority/position', 'value/attribution', 'assess']) {
    await go(a)
    const t = await main().innerText()
    assert.doesNotMatch(t, /§\d/, `${a} leaks a section citation`)
  }
})

await test('citations and claim status are present in Evidence', async () => {
  await go('evidence/method')
  assert.match(await main().innerText(), /§\d/)
  await go('evidence/claims')
  assert.match(await main().innerText(), /hypothesis/i)
})

/* ------------------------------------------------------- service register */

await test('register lists the sample estate and labels it as illustrative', async () => {
  await go('operating-model/register')
  const t = await main().innerText()
  assert.match(t, /illustrative sample estate/i)
  assert.match(t, /not connected to any system/i)
  assert.match(t, /operated services . 10/i)
})

await test('selecting a service updates the detail view', async () => {
  await page.locator('#main [role="option"]', { hasText: 'Payments ledger' }).click()
  await page.waitForTimeout(300)
  const d = await page.getByTestId('service-detail').innerText()
  assert.match(d, /payments ledger/i)
  assert.match(d, /ledger engineering/i)
})

await test('register surfaces a grant held above the risk ceiling', async () => {
  const d = await page.getByTestId('service-detail').innerText()
  assert.match(d, /above ceiling/i)
  assert.match(d, /authority above evidence/i)
})

await test('non-mutating actions are not bound by the tier ceiling', async () => {
  const d = await page.getByTestId('service-detail').innerText()
  assert.match(d, /not capped . no state change/i)
})

await test('a disputed owner blocks qualification rather than being hidden', async () => {
  await page.locator('#main [role="option"]', { hasText: 'Pricing engine' }).click()
  await page.waitForTimeout(300)
  const d = await page.getByTestId('service-detail').innerText()
  assert.match(d, /disputed/i)
  assert.match(d, /ownership unresolved/i)
})

await test('vendor boundary is shown as not grantable, distinct from manual', async () => {
  await page.locator('#main [role="option"]', { hasText: 'Identity verification' }).click()
  await page.waitForTimeout(300)
  const d = await page.getByTestId('service-detail').innerText()
  assert.match(d, /not grantable/i)
  assert.match(d, /out of boundary/i)
})

await test('context facts show age against their review window', async () => {
  const d = await page.getByTestId('service-detail').innerText()
  assert.match(d, /\d+d \/ \d+d/)
})

/* --------------------------------------------------- qualification (was §2) */

await test('a Kubernetes pod fails accountability and recovery, and is a Component', async () => {
  await go('operating-model/qualification')
  await main().getByRole('button', { name: /A single Kubernetes pod/i }).click()
  await page.waitForTimeout(300)
  const t = await main().innerText()
  assert.match(t, /component/i)
  assert.match(t, /stops at t1/i)
})

await test('a monolith is one Operated Service, not several', async () => {
  await main().getByRole('button', { name: /Monolith serving several business functions/i }).click()
  await page.waitForTimeout(300)
  assert.match(await main().innerText(), /operated service/i)
})

/* ------------------------------------------------------- contract & context */

await test('contract profile switch changes the profile-variant areas only', async () => {
  await go('operating-model/contract')
  await main().getByRole('tab', { name: /Overnight settlement chain/i }).click()
  await page.waitForTimeout(300)
  assert.match(await main().innerText(), /completion by 05:30/i)
  await main().getByRole('tab', { name: /Identity-verification SaaS/i }).click()
  await page.waitForTimeout(300)
  const t = await main().innerText()
  assert.match(t, /integration boundary only/i)
  assert.doesNotMatch(t, /completion by 05:30/i)
})

await test('context decay turns facts stale and withdraws A3+', async () => {
  await go('operating-model/context')
  const slider = page.locator('#decay-days')
  await slider.fill('0')
  await page.waitForTimeout(250)
  assert.match(await main().innerText(), /100%/)
  await slider.fill('200')
  await page.waitForTimeout(300)
  const t = await main().innerText()
  assert.match(t, /stale/i)
  assert.match(t, /A3\+ PERMITTED\s*\n?\s*No/i)
})

/* ---------------------------------------------------------- architecture */

await test('architecture shows the whole model including the authority gate', async () => {
  await go('operating-model/architecture')
  const t = await main().innerText()
  for (const part of ['operated service', 'operational contract', 'service context substrate', 'sense', 'understand', 'decide', 'authority gate', 'act', 'validate', 'learn', 'improve']) {
    assert.match(t, new RegExp(part, 'i'), `missing ${part}`)
  }
  assert.match(t, /updates contract . context . authority grants/i)
})

await test('Validate is marked as having no MAPE-K equivalent', async () => {
  await main().getByRole('tab', { name: /Validate/i }).click()
  await page.waitForTimeout(350)
  const t = await page.getByTestId('loop-panel').innerText()
  assert.match(t, /no mape-k equivalent/i)
  assert.match(t, /action completion/i)
  assert.match(t, /actual recovery/i)
})

await test('Improve can change the authority grants themselves', async () => {
  await main().getByRole('tab', { name: /Improve/i }).click()
  await page.waitForTimeout(350)
  assert.match(await page.getByTestId('loop-panel').innerText(), /automation authority grants/i)
})

/* -------------------------------------------------------------- authority */

await test('estate authority posture counts grants above the ceiling', async () => {
  await go('authority/position')
  const t = await main().innerText()
  assert.match(t, /authority posture across the sample estate/i)
  assert.match(t, /above ceiling/i)
  assert.match(t, /grants above the risk ceiling/i)
})

await test('grid reports the danger zone and the waste zone', async () => {
  await main().getByRole('button', { name: /Over-permitted/i }).click()
  await page.waitForTimeout(300)
  assert.match(await main().innerText(), /authority exceeds maturity/i)
  await main().getByRole('button', { name: /Under-automated/i }).click()
  await page.waitForTimeout(300)
  assert.match(await main().innerText(), /capacity release/i)
})

await test('gate evaluator withholds the grant when context is stale', async () => {
  await go('authority/gate')
  assert.match(await main().innerText(), /permitted now/i)
  await main().locator('[role="switch"]').nth(2).click()
  await page.waitForTimeout(300)
  const t = await main().innerText()
  assert.match(t, /freshness sla/i)
  assert.match(t, /reduced from the recorded grant/i)
})

await test('gate evaluator applies the R1 ceiling', async () => {
  await main().locator('[role="switch"]').nth(2).click()
  await page.waitForTimeout(250)
  await main().locator('button', { hasText: /^R1/ }).first().click()
  await page.waitForTimeout(300)
  assert.match(await main().innerText(), /risk tier r1 caps grantable authority/i)
})

await test('state changes show authority withdrawn without anything breaking', async () => {
  await go('authority/states')
  await main().getByRole('button', { name: /Authority evidence expired/i }).click()
  await page.waitForTimeout(300)
  const t = await main().innerText()
  assert.match(t, /closed/i)
  assert.match(t, /A1 . Assisted/i)
})

/* ------------------------------------------------------------------ value */

await test('claim builder refuses realised value below T1', async () => {
  await go('value/attribution')
  await main().locator('button', { hasText: 'Change-failure cost' }).first().click()
  await page.waitForTimeout(250)
  await main().locator('button', { hasText: /→/ }).first().click()
  await page.waitForTimeout(250)
  await main().locator('button', { hasText: /^T3/ }).first().click()
  await page.waitForTimeout(300)
  assert.match(await page.getByTestId('claim-verdict').innerText(), /opportunity sizing only/i)
  await main().locator('button', { hasText: /^T1/ }).first().click()
  await page.waitForTimeout(300)
  assert.match(await page.getByTestId('claim-verdict').innerText(), /realised value may be claimed/i)
})

await test('causal model traces one attribution path', async () => {
  await go('value/causes')
  await main().locator('button', { hasText: 'Ownership ambiguity' }).first().click()
  await page.waitForTimeout(400)
  assert.match(await main().innerText(), /attribution paths/i)
  await main().locator('button', { hasText: 'Customer-impact minutes' }).first().click()
  await page.waitForTimeout(400)
  assert.match(await main().innerText(), /exactly one of these paths/i)
})

await test('mean MTTR is shown as removed from the metric set', async () => {
  await go('value/metrics')
  assert.match(await main().innerText(), /mean mttr is rejected/i)
})

/* ----------------------------------------------------------------- assess */

await test('assessment opens on applicability and can disqualify', async () => {
  await go('assess')
  const t = await page.getByTestId('assess-body').innerText()
  assert.match(t, /applicability/i)
  await main().getByRole('button', { name: 'Fewer than 15', exact: true }).click()
  await main().getByRole('button', { name: 'No', exact: true }).click()
  await main().getByRole('button', { name: 'Mid-replatform or active M&A', exact: true }).click()
  await page.waitForTimeout(350)
  const after = await page.getByTestId('assess-body').innerText()
  assert.match(after, /not recommended/i)
  assert.match(after, /disqualifying condition/i)
})

await test('assessment proceeds to position, result and pilot', async () => {
  await main().getByRole('button', { name: '15 to 100', exact: true }).click()
  await main().getByRole('button', { name: 'Yes, and they would', exact: true }).click()
  await main().getByRole('button', { name: 'Yes', exact: true }).click()
  await page.waitForTimeout(300)
  await main().locator('button', { hasText: 'Establish position' }).click()
  await page.waitForTimeout(350)
  const radios = main().locator('[role="radio"]')
  const n = await radios.count()
  for (let i = 3; i < n; i += 4) await radios.nth(i).click()
  await page.waitForTimeout(300)
  await main().locator('button', { hasText: 'See result' }).click()
  await page.waitForTimeout(350)
  const r = await page.getByTestId('assess-body').innerText()
  assert.match(r, /indicative position/i)
  assert.match(r, /advanced/i)
  assert.match(r, /45\/45/)
  await main().locator('button', { hasText: 'Plan a pilot' }).click()
  await page.waitForTimeout(350)
  const p = await page.getByTestId('assess-body').innerText()
  assert.match(p, /capability transfer/i)
  assert.match(p, /does not promise elimination of l1 support/i)
})

await test('diagnostic is labelled exploratory, not an assessment', async () => {
  assert.match(await main().innerText(), /exploratory diagnostic, not an enterprise assessment/i)
})

/* --------------------------------------------------------------- evidence */

await test('objections are published with honest dispositions', async () => {
  await go('evidence/objections')
  const t = await main().innerText()
  assert.match(t, /why an enterprise would say no/i)
  assert.match(t, /1 unresolved/i)
  assert.match(t, /another source of truth/i)
  assert.match(t, /duplicates sre, itil, catalogs and policy/i)
  assert.match(t, /metadata maintenance never ends/i)
  assert.match(t, /nobody is incentivised/i)
  assert.match(t, /may not justify a new operating model/i)
})

await test('an objection opens to show the case against and what remains open', async () => {
  await main().locator('button', { hasText: /may not justify a new operating model/i }).click()
  await page.waitForTimeout(300)
  const t = await main().innerText()
  assert.match(t, /the case against/i)
  assert.match(t, /what remains open/i)
  assert.match(t, /what would close it/i)
})

await test('MAPE-K is conceded in prior art', async () => {
  await go('evidence/prior-art')
  const t = await main().innerText()
  assert.match(t, /the loop is mape-k/i)
  assert.match(t, /solves well/i)
  assert.match(t, /binds or extends/i)
})

await test('the withdrawn claim is shown as withdrawn', async () => {
  await go('evidence/claims')
  const t = await main().innerText()
  assert.match(t, /withdrawn/i)
  assert.match(t, /unified closed operational loop/i)
})

/* ------------------------------------------------------------- guardrails */

await test('no repository misspelling appears in the product', async () => {
  for (const a of ['overview', 'operating-model', 'authority', 'value', 'assess', 'evidence']) {
    await go(a)
    assert.doesNotMatch(await page.evaluate(() => document.body.innerText), /Excellency/i)
  }
})

await test('internal preview label is present', async () => {
  assert.match(await page.evaluate(() => document.body.innerText), /internal (preview|working preview)/i)
})

await test('no console errors during the whole run', async () => {
  assert.deepEqual(consoleErrors, [])
})

/* ---------------------------------------------------------------- mobile */

const m = await browser.newPage({ viewport: { width: 390, height: 844 } })
await m.goto(URL, { waitUntil: 'networkidle' })
await m.addStyleTag({ content: `*,*::before,*::after{animation-duration:0s!important;transition-duration:0s!important}` })

await test('mobile: primary navigation collapses to a menu and works', async () => {
  await m.getByRole('button', { name: /open menu/i }).click()
  await m.waitForTimeout(250)
  await m.locator('nav[aria-label="Primary mobile"] button', { hasText: 'Evidence' }).click()
  await m.waitForTimeout(350)
  assert.equal(await m.locator('h1').first().innerText(), 'Evidence')
})

await test('mobile: architecture becomes a vertical spine, not a shrunken diagram', async () => {
  await m.evaluate(() => { window.location.hash = '#/operating-model/architecture' })
  await m.waitForTimeout(500)
  assert.equal(await m.locator('svg[aria-label="Master architecture of the framework"]').count(), 0)
  assert.match(await m.locator('#main').innerText(), /authority gate/i)
})

await test('mobile: no horizontal overflow on any area', async () => {
  for (const a of ['overview', 'operating-model/register', 'authority/position', 'value/attribution', 'assess', 'evidence/objections']) {
    await m.evaluate((r) => { window.location.hash = `#/${r}` }, a)
    await m.waitForTimeout(400)
    const over = await m.evaluate(async () => {
      const h = document.documentElement.scrollHeight
      for (let y = 0; y < h; y += 500) { window.scrollTo(0, y); await new Promise((r) => setTimeout(r, 10)) }
      return document.documentElement.scrollWidth > window.innerWidth + 1
    })
    assert.equal(over, false, `${a} overflows`)
  }
})

await browser.close()
let failed = 0
for (const [s, n] of results) { if (s === 'FAIL') failed++; console.log(`${s}  ${n}`) }
console.log(`\n${results.length - failed}/${results.length} interaction tests passed`)
process.exit(failed ? 1 : 0)
