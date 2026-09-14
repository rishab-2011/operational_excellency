import { chromium } from 'playwright'

const URL = process.env.QA_URL ?? 'http://localhost:5179/operational_excellency/'
const WIDTHS = [1920, 1440, 1280, 1024, 768, 430, 390, 320]
const browser = await chromium.launch()
const problems = []

for (const w of WIDTHS) {
  const page = await browser.newPage({ viewport: { width: w, height: 900 } })
  const errors = []
  page.on('console', (m) => { if (m.type() === 'error') errors.push(m.text()) })
  page.on('pageerror', (e) => errors.push(String(e)))
  await page.goto(URL, { waitUntil: 'networkidle' })
  await page.addStyleTag({ content: `*,*::before,*::after{animation-duration:0s!important;transition-duration:0s!important}html{scroll-behavior:auto!important}` })

  // Walk the whole page so every lazy reveal fires.
  await page.evaluate(async () => {
    const h = document.documentElement.scrollHeight
    for (let y = 0; y < h; y += 400) { window.scrollTo(0, y); await new Promise((r) => setTimeout(r, 12)) }
    window.scrollTo(0, 0)
  })
  await page.waitForTimeout(400)

  const res = await page.evaluate((vw) => {
    const out = { overflowX: false, offenders: [], invisible: [], smallTargets: [], emptyIds: [] }
    out.overflowX = document.documentElement.scrollWidth > vw + 1
    for (const el of document.querySelectorAll("body *")) {
      if (el.closest(".sr-only")) continue
      const r = el.getBoundingClientRect()
      if (r.width === 0 && r.height === 0) continue
      if (r.right > vw + 1.5 && getComputedStyle(el).position !== 'fixed') {
        const cs = getComputedStyle(el)
        if (cs.overflowX === 'visible' && !el.closest('.no-scrollbar') && !el.closest('[data-allow-overflow]')) {
          out.offenders.push(`${el.tagName}.${String(el.className).slice(0, 50)} right=${Math.round(r.right)}`)
        }
      }
    }
    // Content that stayed at opacity 0 after a full scroll pass is a reveal bug.
    for (const el of document.querySelectorAll('section *')) {
      const cs = getComputedStyle(el)
      const rr = el.getBoundingClientRect()
      if (rr.height < 2) continue // collapsed disclosures are intentional
      if (parseFloat(cs.opacity) < 0.06 && el.textContent.trim().length > 12) {
        out.invisible.push(`${el.tagName}.${String(el.className).slice(0, 40)}`)
      }
    }
    for (const el of document.querySelectorAll('button, a, input, [role="tab"], [role="radio"], [role="switch"]')) {
      const r = el.getBoundingClientRect()
      if (r.width === 0 || r.height === 0) continue
      if (el.className && String(el.className).includes('sr-only')) continue
      if (r.height < 24 || r.width < 24) out.smallTargets.push(`${el.tagName}:${(el.textContent || '').trim().slice(0, 24)} ${Math.round(r.width)}x${Math.round(r.height)}`)
    }
    for (const s of document.querySelectorAll('section[id]')) {
      if (s.textContent.trim().length < 40) out.emptyIds.push(s.id)
    }
    return out
  }, w)

  problems.push({ width: w, errors, ...res, offenders: [...new Set(res.offenders)].slice(0, 6), invisible: [...new Set(res.invisible)].slice(0, 6), smallTargets: [...new Set(res.smallTargets)].slice(0, 6) })
  await page.close()
}
await browser.close()
for (const p of problems) {
  console.log(`\n== ${p.width}px ==`)
  console.log(' overflowX:', p.overflowX)
  if (p.offenders.length) console.log(' offenders:', p.offenders)
  if (p.invisible.length) console.log(' invisible:', p.invisible)
  if (p.smallTargets.length) console.log(' smallTargets:', p.smallTargets)
  if (p.emptyIds.length) console.log(' emptySections:', p.emptyIds)
  if (p.errors.length) console.log(' consoleErrors:', p.errors.slice(0, 4))
}
