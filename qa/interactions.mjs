/**
 * Interaction tests against the running app.
 * Asserts the behaviour a reader depends on, not implementation details.
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

await test('all 17 chapters render', async () => {
  const ids = ['opening','question','problem','unit','contract','context','loop','authority','axes','evidence','value','pillars','priorart','challenge','diagnostic','path','status']
  for (const id of ids) assert.equal(await page.locator(`#${id}`).count(), 1, `missing #${id}`)
})

await test('contents overlay opens, navigates, closes', async () => {
  await page.getByRole('button', { name: /contents/i }).first().click()
  const dialog = page.getByRole('dialog', { name: 'Contents' })
  await dialog.waitFor({ state: 'visible' })
  await dialog.getByRole('link', { name: /Capability is not authority/i }).click()
  await page.waitForTimeout(700)
  assert.equal(await dialog.count(), 0, 'overlay did not close on navigate')
  const y = await page.evaluate(() => document.getElementById('authority').getBoundingClientRect().top)
  assert.ok(Math.abs(y) < 220, `did not land on #authority (top=${y})`)
})

await test('Escape closes the contents overlay', async () => {
  await page.getByRole('button', { name: /contents/i }).first().click()
  await page.getByRole('dialog').waitFor({ state: 'visible' })
  await page.keyboard.press('Escape')
  await page.waitForTimeout(700)
  assert.equal(await page.getByRole('dialog').count(), 0)
})

await test('Operated Service: pod fails T1/T4 and is a Component', async () => {
  await page.locator('#unit').scrollIntoViewIfNeeded()
  await page.locator('#unit').getByRole('tab', { name: /A single Kubernetes pod/ }).click()
  await page.waitForTimeout(220)
  const v = await page.getByTestId('os-verdict').innerText()
  assert.match(v, /component/i)
  assert.doesNotMatch(v, /operated service/i)
  assert.match(await page.locator('#unit').innerText(), /1\/5 tests passed/i)
})

await test('Operated Service: vendor internals are out-of-boundary, not A0', async () => {
  await page.locator('#unit').getByRole('tab', { name: /Internals of that vendor SaaS/ }).click()
  await page.waitForTimeout(220)
  const v = await page.getByTestId('os-verdict').innerText()
  assert.match(v, /out of boundary/i)
  assert.match(v, /not grantable/i)
})

await test('Operated Service: same DB qualifies or not by ownership', async () => {
  await page.locator('#unit').getByRole('tab', { name: /Database behind one service/ }).click()
  await page.waitForTimeout(220)
  assert.match(await page.getByTestId('os-verdict').innerText(), /component/i)
  await page.locator('#unit').getByRole('tab', { name: /Managed data platform/ }).click()
  await page.waitForTimeout(220)
  assert.match(await page.getByTestId('os-verdict').innerText(), /operated service/i)
})

await test('Contract: profile switch changes Outcomes but not Accountability label', async () => {
  await page.locator('#contract').scrollIntoViewIfNeeded()
  await page.locator('#contract').getByRole('tab', { name: /Overnight settlement chain/ }).click()
  await page.waitForTimeout(200)
  const batch = await page.locator('#contract').innerText()
  assert.match(batch, /Completion by 05:30/i)
  await page.locator('#contract').getByRole('tab', { name: /Identity-verification SaaS/ }).click()
  await page.waitForTimeout(200)
  const saas = await page.locator('#contract').innerText()
  assert.match(saas, /integration boundary only/i)
  assert.doesNotMatch(saas, /Completion by 05:30/i)
})

await test('Context decay: advancing time turns facts stale and blocks A3+', async () => {
  await page.locator('#context').scrollIntoViewIfNeeded()
  const slider = page.locator('#decay-days')
  await slider.fill('0')
  await page.waitForTimeout(150)
  assert.match(await page.locator('#context').innerText(), /100%/i)
  await slider.fill('200')
  await page.waitForTimeout(200)
  const t = await page.locator('#context').innerText()
  assert.match(t, /Stale/i)
  assert.match(t, /A3\+ PERMITTED\s*\n?\s*No/i)
})

await test('Loop: Validate is marked as having no MAPE-K equivalent', async () => {
  await page.locator('#loop').scrollIntoViewIfNeeded()
  await page.locator('#loop').getByRole('tab', { name: /Validate/ }).click()
  await page.waitForTimeout(220)
  const t = await page.getByTestId('loop-panel').innerText()
  assert.match(t, /no mape-k equivalent/i)
  assert.match(t, /action completion/i)
  assert.match(t, /actual recovery/i)
})

await test('Loop: Improve can change authority grants', async () => {
  await page.locator('#loop').getByRole('tab', { name: /Improve/ }).click()
  await page.waitForTimeout(220)
  assert.match(await page.getByTestId('loop-panel').innerText(), /automation authority grants/i)
})

await test('Authority: stale context caps the grant below what is recorded', async () => {
  await page.locator('#authority').scrollIntoViewIfNeeded()
  const before = await page.locator('#authority').innerText()
  assert.match(before, /PERMITTED NOW/i)
  await page.getByRole('switch', { name: /Context freshness/i }).click().catch(async () => {
    await page.locator('#authority [role="switch"]').nth(2).click()
  })
  await page.waitForTimeout(200)
  const after = await page.locator('#authority').innerText()
  assert.match(after, /freshness SLA/i)
  assert.match(after, /Reduced from the recorded grant/i)
})

await test('Authority: R1 risk tier caps at A3', async () => {
  await page.locator('#authority [role="switch"]').nth(2).click() // restore fresh context
  await page.waitForTimeout(150)
  await page.locator('#authority button', { hasText: /^R1/ }).first().click()
  await page.waitForTimeout(200)
  const t = await page.locator('#authority').innerText()
  assert.match(t, /Risk tier R1 caps grantable authority/i)
})

await test('Matrix: above-diagonal position reports the safety finding', async () => {
  await page.locator('#axes').scrollIntoViewIfNeeded()
  await page.getByRole('button', { name: /M0 Reactive by A5 Conditional Autonomy/ }).click()
  await page.waitForTimeout(200)
  const t = await page.locator('#axes').innerText()
  assert.match(t, /Authority exceeds maturity/i)
  assert.match(t, /Operational danger/i)
})

await test('Matrix: below-diagonal reports capacity release', async () => {
  await page.getByRole('button', { name: /M4 Risk-Adaptive by A0 Manual/ }).click()
  await page.waitForTimeout(200)
  assert.match(await page.locator('#axes').innerText(), /capacity release/i)
})

await test('Causal graph: selecting a root narrows attribution paths', async () => {
  await page.locator('#problem').scrollIntoViewIfNeeded()
  await page.locator('#problem button', { hasText: 'Ownership ambiguity' }).first().click()
  await page.waitForTimeout(220)
  assert.match(await page.locator('#problem').innerText(), /Attribution paths/i)
  await page.locator('#problem button', { hasText: 'Customer-impact minutes' }).first().click()
  await page.waitForTimeout(220)
  assert.match(await page.locator('#problem').innerText(), /exactly one of these paths/i)
})

await test('Claim builder: T3 refuses a benefit claim, T1 permits realised value', async () => {
  await page.locator('#value').scrollIntoViewIfNeeded()
  await page.locator('#value button', { hasText: 'Change-failure cost' }).first().click()
  await page.waitForTimeout(150)
  await page.locator('#value button', { hasText: /→/ }).first().click()
  await page.waitForTimeout(250)
  await page.locator('#value button', { hasText: /^T3/ }).first().click()
  await page.waitForTimeout(220)
  assert.match(await page.getByTestId('claim-verdict').innerText(), /opportunity sizing only/i)
  await page.locator('#value button', { hasText: /^T1/ }).first().click()
  await page.waitForTimeout(220)
  assert.match(await page.getByTestId('claim-verdict').innerText(), /realised value may be claimed/i)
})

await test('Diagnostic: scores transparently and bands without fake precision', async () => {
  await page.locator('#diagnostic').scrollIntoViewIfNeeded()
  const radios = page.locator('#diagnostic [role="radio"]')
  const n = await radios.count()
  for (let i = 0; i < n; i += 4) await radios.nth(i).click() // pick score 0 everywhere
  await page.waitForTimeout(250)
  const t = await page.locator('#diagnostic').innerText()
  assert.match(t, /Emerging/i)
  assert.match(t, /0\/45/i)
  assert.match(t, /exploratory diagnostic, not an enterprise assessment/i)
})

await test('Diagnostic: all-strong answers reach Advanced', async () => {
  const radios = page.locator('#diagnostic [role="radio"]')
  const n = await radios.count()
  for (let i = 3; i < n; i += 4) await radios.nth(i).click()
  await page.waitForTimeout(250)
  const t = await page.locator('#diagnostic').innerText()
  assert.match(t, /Advanced/i)
  assert.match(t, /45\/45/i)
})

await test('Challenge: MAPE-K objection concedes prior art', async () => {
  await page.locator('#challenge').scrollIntoViewIfNeeded()
  await page.locator('#challenge').getByRole('tab', { name: /MAPE-K/ }).click()
  await page.waitForTimeout(220)
  const t = await page.getByTestId('challenge-panel').innerText()
  assert.match(t, /the loop largely is, and the requirement says so/i)
  assert.match(t, /ibm autonomic computing/i)
})

await test('Prior art: MAPE-K panel states both what it solves and what is added', async () => {
  await page.locator('#priorart').scrollIntoViewIfNeeded()
  await page.waitForTimeout(250)
  const t = await page.locator('#priorart').innerText()
  assert.match(t, /What it already solves well/i)
  assert.match(t, /What this framework binds or extends/i)
})

await test('Status: the withdrawn claim is shown as withdrawn', async () => {
  await page.locator('#status').scrollIntoViewIfNeeded()
  const t = await page.locator('#status').innerText()
  assert.match(t, /Withdrawn/i)
  assert.match(t, /unified closed operational loop/i)
})

await test('no repository misspelling appears in the UI', async () => {
  const body = await page.evaluate(() => document.body.innerText)
  assert.doesNotMatch(body, /Excellency/i)
})

await test('internal label is present', async () => {
  const body = await page.evaluate(() => document.body.innerText)
  assert.match(body, /Internal working experience/i)
})

await test('no console errors during the whole run', async () => {
  assert.deepEqual(consoleErrors, [])
})

// ---- Mobile composition ----
const m = await browser.newPage({ viewport: { width: 390, height: 844 } })
await m.goto(URL, { waitUntil: 'networkidle' })
await m.addStyleTag({ content: `*,*::before,*::after{animation-duration:0s!important;transition-duration:0s!important}` })

await test('mobile: matrix becomes two ladders, not a shrunken grid', async () => {
  await m.locator('#axes').scrollIntoViewIfNeeded()
  await m.waitForTimeout(220)
  const t = await m.locator('#axes').innerText()
  assert.match(t, /Operational Maturity — earned/i)
  assert.match(t, /Automation Authority — granted/i)
  assert.equal(await m.getByRole('group', { name: 'Maturity by authority grid' }).count(), 0)
})

await test('mobile: no horizontal page overflow anywhere', async () => {
  const over = await m.evaluate(async () => {
    const h = document.documentElement.scrollHeight
    for (let y = 0; y < h; y += 500) { window.scrollTo(0, y); await new Promise((r) => setTimeout(r, 10)) }
    return document.documentElement.scrollWidth > window.innerWidth + 1
  })
  assert.equal(over, false)
})

await browser.close()
let failed = 0
for (const [s, n] of results) { if (s === 'FAIL') failed++; console.log(`${s}  ${n}`) }
console.log(`\n${results.length - failed}/${results.length} interaction tests passed`)
process.exit(failed ? 1 : 0)
