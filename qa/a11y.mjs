import { chromium } from 'playwright'
import { ALL_ROUTES, sweep, visit } from './routes.mjs'

const URL = process.env.QA_URL ?? 'http://localhost:5179/operational_excellency/'

/** Runs in the page. Blends alpha against the nearest opaque ancestor. */
const CONTRAST_FN = () => {
  const lum = (c) => {
    const [r, g, b] = c.map((v) => { v /= 255; return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4 })
    return 0.2126 * r + 0.7152 * g + 0.0722 * b
  }
  const parse = (s) => (s.match(/[\d.]+/g) || []).map(Number)
  const blend = (fg, bg) => { const a = fg.length > 3 ? fg[3] : 1; return [0, 1, 2].map((i) => fg[i] * a + bg[i] * (1 - a)) }
  const bgOf = (el) => {
    let e = el
    while (e) {
      const c = parse(getComputedStyle(e).backgroundColor)
      if (c.length >= 3 && (c.length === 3 || c[3] > 0.92)) return c.slice(0, 3)
      e = e.parentElement
    }
    return [12, 14, 17]
  }
  const out = []
  for (const el of document.querySelectorAll('p, h1, h2, h3, h4, span, li, dt, dd, a, button, legend, label, td, th')) {
    const t = (el.textContent || '').trim()
    if (!t || el.children.length > 0) continue
    const r = el.getBoundingClientRect()
    if (r.width < 4 || r.height < 4) continue
    const cs = getComputedStyle(el)
    if (cs.visibility === 'hidden' || parseFloat(cs.opacity) < 0.15) continue
    const bg = bgOf(el)
    const fg = blend(parse(cs.color), bg)
    const L1 = lum(fg), L2 = lum(bg)
    const ratio = (Math.max(L1, L2) + 0.05) / (Math.min(L1, L2) + 0.05)
    const px = parseFloat(cs.fontSize)
    const large = px >= 24 || (px >= 18.66 && parseInt(cs.fontWeight, 10) >= 700)
    const need = large ? 3 : 4.5
    if (ratio < need) out.push({ t: t.slice(0, 36), ratio: +ratio.toFixed(2), need, px: +px.toFixed(1), cls: String(el.className).slice(0, 44) })
  }
  return out
}

const browser = await chromium.launch()
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } })
await page.goto(URL, { waitUntil: 'networkidle' })

/* ---- Contrast, on every screen ---- */
const all = []
for (const route of ALL_ROUTES) {
  await visit(page, route)
  await sweep(page)
  all.push(...(await page.evaluate(CONTRAST_FN)).map((c) => ({ ...c, route })))
}
const seen = new Set()
const failures = all.filter((c) => { const k = c.cls + c.ratio; if (seen.has(k)) return false; seen.add(k); return true })
  .sort((a, b) => a.ratio - b.ratio)

/* ---- Keyboard: focus must always be visible ---- */
await visit(page, 'overview')
let focusables = 0
let noRing = 0
for (const route of ['overview', 'operating-model/register', 'authority/gate', 'assess', 'evidence/objections']) {
  await visit(page, route)
  for (let i = 0; i < 30; i++) {
    await page.keyboard.press('Tab')
    const r = await page.evaluate(() => {
      const el = document.activeElement
      if (!el || el === document.body) return null
      const cs = getComputedStyle(el)
      return cs.outlineStyle !== 'none' && parseFloat(cs.outlineWidth) > 0
    })
    if (r === null) continue
    focusables++
    if (!r) noRing++
  }
}

/* ---- Semantics ---- */
const semantics = await page.evaluate(() => ({
  h1: document.querySelectorAll('#main h1, h1').length,
  main: document.querySelectorAll('main').length,
  nav: document.querySelectorAll('nav').length,
  imgNoAlt: [...document.querySelectorAll('img')].filter((i) => !i.hasAttribute('alt')).length,
  btnNoName: [...document.querySelectorAll('button')].filter((b) => !(b.textContent || '').trim() && !b.getAttribute('aria-label')).length,
  listboxNoLabel: [...document.querySelectorAll('[role="listbox"]')].filter((t) => !t.getAttribute('aria-label')).length,
  tablistNoLabel: [...document.querySelectorAll('[role="tablist"]')].filter((t) => !t.getAttribute('aria-label')).length,
  radiogroupNoLabel: [...document.querySelectorAll('[role="radiogroup"]')].filter((t) => !t.getAttribute('aria-label')).length,
  inputsNoLabel: [...document.querySelectorAll('input')].filter((i) => !i.getAttribute('aria-label') && !document.querySelector(`label[for="${i.id}"]`)).length,
  tablesNoHeaders: [...document.querySelectorAll('table')].filter((t) => !t.querySelector('th')).length,
  lang: document.documentElement.lang,
}))

/* ---- Reduced motion ---- */
await page.emulateMedia({ reducedMotion: 'reduce' })
await page.reload({ waitUntil: 'networkidle' })
await page.waitForTimeout(400)
const rm = await page.evaluate(() => {
  const el = document.querySelector('#main h1, #main h2')
  return { headingOpacity: el ? getComputedStyle(el).opacity : 'missing', scroll: getComputedStyle(document.documentElement).scrollBehavior }
})

await browser.close()
console.log('CONTRAST FAILURES:', failures.length, `(across ${ALL_ROUTES.length} screens)`)
for (const c of failures.slice(0, 15)) console.log(`  ${c.ratio} (need ${c.need}) ${c.px}px "${c.t}" [${c.route}] .${c.cls}`)
console.log('FOCUS: stops', focusables, '| without visible ring:', noRing)
console.log('SEMANTICS:', JSON.stringify(semantics))
console.log('REDUCED MOTION:', JSON.stringify(rm))
process.exit(failures.length || noRing ? 1 : 0)
