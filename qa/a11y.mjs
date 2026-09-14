import { chromium } from 'playwright'

const URL = process.env.QA_URL ?? 'http://localhost:5179/operational_excellency/'
const browser = await chromium.launch()
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } })
await page.goto(URL, { waitUntil: 'networkidle' })

// ---- Contrast ----
const contrast = await page.evaluate(() => {
  const lum = (c) => {
    const [r, g, b] = c.map((v) => { v /= 255; return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4 })
    return 0.2126 * r + 0.7152 * g + 0.0722 * b
  }
  const parse = (s) => (s.match(/[\d.]+/g) || []).map(Number)
  const blend = (fg, bg) => {
    const a = fg.length > 3 ? fg[3] : 1
    return [0, 1, 2].map((i) => fg[i] * a + bg[i] * (1 - a))
  }
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
  for (const el of document.querySelectorAll('p, h1, h2, h3, h4, span, li, dt, dd, a, button, legend, label')) {
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
    const bold = parseInt(cs.fontWeight, 10) >= 700
    const large = px >= 24 || (px >= 18.66 && bold)
    const need = large ? 3 : 4.5
    if (ratio < need) out.push({ t: t.slice(0, 40), ratio: +ratio.toFixed(2), need, px: +px.toFixed(1), cls: String(el.className).slice(0, 44) })
  }
  const seen = new Set()
  return out.filter((o) => { const k = o.cls + o.ratio; if (seen.has(k)) return false; seen.add(k); return true }).sort((a, b) => a.ratio - b.ratio).slice(0, 18)
})

// ---- Keyboard: focus must always be visible ----
const kb = await page.evaluate(() => {
  const focusables = [...document.querySelectorAll('a[href], button, input, [tabindex]:not([tabindex="-1"])')]
    .filter((e) => e.getBoundingClientRect().width > 0)
  return { count: focusables.length }
})
let noFocusRing = 0
for (let i = 0; i < 40; i++) {
  await page.keyboard.press('Tab')
  const ok = await page.evaluate(() => {
    const el = document.activeElement
    if (!el || el === document.body) return true
    const cs = getComputedStyle(el)
    return cs.outlineStyle !== 'none' && parseFloat(cs.outlineWidth) > 0
  })
  if (!ok) noFocusRing++
}

// ---- Landmarks / headings / aria ----
const semantics = await page.evaluate(() => ({
  h1: document.querySelectorAll('h1').length,
  h2: document.querySelectorAll('h2').length,
  main: document.querySelectorAll('main').length,
  nav: document.querySelectorAll('nav').length,
  footer: document.querySelectorAll('footer').length,
  imgNoAlt: [...document.querySelectorAll('img')].filter((i) => !i.hasAttribute('alt')).length,
  btnNoName: [...document.querySelectorAll('button')].filter((b) => !(b.textContent || '').trim() && !b.getAttribute('aria-label')).length,
  tablistNoLabel: [...document.querySelectorAll('[role="tablist"]')].filter((t) => !t.getAttribute('aria-label')).length,
  radiogroupNoLabel: [...document.querySelectorAll('[role="radiogroup"]')].filter((t) => !t.getAttribute('aria-label')).length,
  inputsNoLabel: [...document.querySelectorAll('input')].filter((i) => !i.getAttribute('aria-label') && !document.querySelector(`label[for="${i.id}"]`)).length,
  lang: document.documentElement.lang,
  title: document.title,
}))

// ---- Reduced motion ----
await page.emulateMedia({ reducedMotion: 'reduce' })
await page.reload({ waitUntil: 'networkidle' })
const rm = await page.evaluate(() => {
  const el = document.querySelector('#question h2')
  return { headingVisible: el ? getComputedStyle(el).opacity : 'missing', scroll: getComputedStyle(document.documentElement).scrollBehavior }
})

await browser.close()
console.log('CONTRAST FAILURES:', contrast.length)
for (const c of contrast) console.log(`  ${c.ratio} (need ${c.need}) ${c.px}px "${c.t}" .${c.cls}`)
console.log('FOCUS: focusables', kb.count, '| tabs without visible ring:', noFocusRing)
console.log('SEMANTICS:', JSON.stringify(semantics))
console.log('REDUCED MOTION:', JSON.stringify(rm))
