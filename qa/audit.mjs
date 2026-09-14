import { chromium } from 'playwright'
import { ALL_ROUTES, sweep, visit } from './routes.mjs'

const URL = process.env.QA_URL ?? 'http://localhost:5179/operational_excellency/'
const WIDTHS = [1920, 1440, 1280, 1024, 768, 430, 390, 320]
const browser = await chromium.launch()
let problems = 0

for (const w of WIDTHS) {
  const page = await browser.newPage({ viewport: { width: w, height: 900 } })
  const errors = []
  page.on('console', (m) => { if (m.type() === 'error') errors.push(m.text()) })
  page.on('pageerror', (e) => errors.push(String(e)))
  await page.goto(URL, { waitUntil: 'networkidle' })
  await page.addStyleTag({ content: `*,*::before,*::after{animation-duration:0s!important;transition-duration:0s!important}html{scroll-behavior:auto!important}` })

  const bad = { overflow: [], invisible: [], small: [], empty: [] }

  for (const route of ALL_ROUTES) {
    await visit(page, route)
    await sweep(page)
    const res = await page.evaluate((vw) => {
      const out = { overflow: false, invisible: [], small: [], empty: false }
      out.overflow = document.documentElement.scrollWidth > vw + 1
      const main = document.getElementById('main')
      out.empty = !main || main.innerText.trim().length < 200
      for (const el of main ? main.querySelectorAll('*') : []) {
        const r = el.getBoundingClientRect()
        if (r.height < 2) continue
        if (parseFloat(getComputedStyle(el).opacity) < 0.06 && el.textContent.trim().length > 12) {
          out.invisible.push(String(el.className).slice(0, 40))
        }
      }
      for (const el of document.querySelectorAll('button, a[href], input, [role="tab"], [role="radio"], [role="switch"], [role="option"]')) {
        const r = el.getBoundingClientRect()
        if (r.width === 0 || r.height === 0) continue
        if (String(el.className).includes('sr-only')) continue
        if (r.height < 24 || r.width < 24) out.small.push(`${el.tagName}:${(el.textContent || '').trim().slice(0, 20)} ${Math.round(r.width)}x${Math.round(r.height)}`)
      }
      return out
    }, w)
    if (res.overflow) bad.overflow.push(route)
    if (res.empty) bad.empty.push(route)
    bad.invisible.push(...res.invisible)
    bad.small.push(...res.small)
  }

  const uniq = (a) => [...new Set(a)].slice(0, 5)
  const issues = bad.overflow.length + bad.empty.length + uniq(bad.invisible).length + uniq(bad.small).length + errors.length
  problems += issues
  console.log(`\n== ${w}px ==  ${issues ? `${issues} issue(s)` : 'clean'}`)
  if (bad.overflow.length) console.log('  overflow on:', bad.overflow)
  if (bad.empty.length) console.log('  empty screens:', bad.empty)
  if (uniq(bad.invisible).length) console.log('  invisible:', uniq(bad.invisible))
  if (uniq(bad.small).length) console.log('  small targets:', uniq(bad.small))
  if (errors.length) console.log('  console errors:', errors.slice(0, 3))
  await page.close()
}
await browser.close()
console.log(problems ? `\n${problems} TOTAL ISSUES` : '\nRESPONSIVE AUDIT CLEAN ACROSS ALL SCREENS')
process.exit(problems ? 1 : 0)
