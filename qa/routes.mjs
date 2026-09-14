/** Every addressable screen in the product. */
export const ALL_ROUTES = [
  'overview',
  'operating-model/architecture', 'operating-model/register', 'operating-model/qualification',
  'operating-model/contract', 'operating-model/context',
  'authority/position', 'authority/model', 'authority/gate', 'authority/states',
  'value/attribution', 'value/measurement', 'value/causes', 'value/metrics',
  'assess',
  'evidence/objections', 'evidence/prior-art', 'evidence/claims', 'evidence/method',
]

/** The default landing view of each area — what a reader sees without exploring. */
export const DEFAULT_ROUTES = [
  'overview', 'operating-model', 'authority', 'value', 'assess', 'evidence',
]

export async function visit(page, route, settle = 380) {
  await page.evaluate((r) => { window.location.hash = `#/${r}` }, route)
  await page.waitForTimeout(settle)
}

/** Scroll a screen top to bottom so lazy reveals fire. */
export async function sweep(page) {
  await page.evaluate(async () => {
    const h = document.documentElement.scrollHeight
    for (let y = 0; y < h; y += 400) { window.scrollTo(0, y); await new Promise((r) => setTimeout(r, 12)) }
    window.scrollTo(0, 0)
  })
  await page.waitForTimeout(200)
}
