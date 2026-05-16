/**
 * capture-bare-screens.mjs
 * Captures app screenshots WITHOUT the phone shell (no rounded corners, no bezel,
 * no shadow). The result is a flat 390×844 PNG of just the screen content —
 * meant to be wrapped in Framer phone mockup components.
 *
 * Run: node capture-bare-screens.mjs
 * Requires: puppeteer (already installed), dev server on port 5173 or 5174
 *
 * Output: public/case-study/after-bare/*.png
 */
import puppeteer from 'puppeteer'
import path from 'path'
import fs from 'fs'

const sleep = (ms) => new Promise(r => setTimeout(r, ms))
const BASE = 'http://localhost:5174'
const OUT = '/Users/Design/Downloads/Design Workspace/Projects/Portfolio/go-transit-prototype/public/case-study/after-bare'
const PHONE_SELECTOR = '.phone-shell'

fs.mkdirSync(OUT, { recursive: true })

// Inject CSS that strips the visual phone-shell treatment (radius, shadow, ring)
// without changing the layout or content — so the screenshot is bare.
async function stripPhoneShell(page) {
  await page.addStyleTag({
    content: `
      .phone-shell {
        border-radius: 0 !important;
        box-shadow: none !important;
        outline: none !important;
        background: var(--surface-primary) !important;
      }
      .phone-shell::before, .phone-shell::after { display: none !important; }
      body, html, #root { background: var(--surface-primary, #fff) !important; }
    `,
  })
}

async function shot(page, filename, extra = '') {
  await sleep(900)
  const el = await page.$(PHONE_SELECTOR)
  if (!el) { console.warn(`⚠ No .phone-shell for ${filename}`); return }
  const out = path.join(OUT, filename)
  await el.screenshot({ path: out, type: 'png', omitBackground: false })
  const box = await el.boundingBox()
  console.log(`  ✓ ${filename} (${Math.round(box?.width)}×${Math.round(box?.height)})${extra}`)
}

async function clickText(page, text) {
  await page.evaluate((t) => {
    const els = Array.from(document.querySelectorAll('button, [role="button"]'))
    const match = els.find(e => e.textContent?.trim().includes(t))
    match?.click()
  }, text)
  await sleep(700)
}

async function run() {
  console.log('Launching Chrome...')
  const browser = await puppeteer.launch({
    headless: true,
    executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
    args: ['--no-sandbox'],
  })

  const page = await browser.newPage()
  await page.setViewport({ width: 600, height: 960, deviceScaleFactor: 2 })

  // ── 1. LANDING (light) ───────────────────────────────────────
  console.log('\n[1/8] Landing — light mode')
  await page.goto(BASE, { waitUntil: 'networkidle0' })
  await sleep(1100)
  await stripPhoneShell(page)
  await shot(page, 'landing-light.png')

  // ── 2. SEARCH TRIP ───────────────────────────────────────────
  console.log('[2/8] Search Trip')
  await clickText(page, 'Plan a New Trip')
  await stripPhoneShell(page)
  await shot(page, 'search-trip.png')

  // ── 3. SEARCH RESULTS ────────────────────────────────────────
  console.log('[3/8] Search Results')
  await clickText(page, 'Search')
  await stripPhoneShell(page)
  await shot(page, 'search-results.png')

  // ── 4. TRIP DETAILS ──────────────────────────────────────────
  console.log('[4/8] Trip Details')
  await page.evaluate(() => {
    const cards = document.querySelectorAll('[class*="pressable"], button')
    for (const c of cards) {
      if (c.textContent?.includes('AM') || c.textContent?.includes('PM')) { c.click(); break }
    }
  })
  await sleep(800)
  await stripPhoneShell(page)
  await shot(page, 'trip-details.png')

  // ── 5. FARES ─────────────────────────────────────────────────
  console.log('[5/8] Fares')
  await page.goto(BASE, { waitUntil: 'networkidle0' })
  await sleep(800)
  await stripPhoneShell(page)
  await clickText(page, 'Fares')
  await stripPhoneShell(page)
  await shot(page, 'fares.png')

  // ── 6. PAYMENT ───────────────────────────────────────────────
  console.log('[6/8] Payment')
  await clickText(page, 'Buy E-Ticket')
  await sleep(600)
  await stripPhoneShell(page)
  await shot(page, 'payment.png')

  // ── 7. TICKET CONFIRMATION ───────────────────────────────────
  console.log('[7/8] Ticket Confirmation')
  await clickText(page, 'Pay $')
  await sleep(2200)
  await stripPhoneShell(page)
  await shot(page, 'ticket-confirmation.png')

  // ── 8. SERVICE UPDATES ───────────────────────────────────────
  console.log('[8/8] Service Updates')
  await page.goto(BASE, { waitUntil: 'networkidle0' })
  await sleep(600)
  await stripPhoneShell(page)
  await clickText(page, 'Alerts')
  await stripPhoneShell(page)
  await shot(page, 'service-updates.png')

  // ── 9. LANDING (dark mode) ───────────────────────────────────
  console.log('[+] Landing — dark mode')
  await page.goto(BASE, { waitUntil: 'networkidle0' })
  await sleep(600)
  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button'))
    const menu = btns.find(b => (b.getAttribute('aria-label') || '').toLowerCase().includes('menu'))
    menu?.click()
  })
  await sleep(500)
  await clickText(page, 'Settings')
  await sleep(500)
  await page.evaluate(() => {
    const toggles = Array.from(document.querySelectorAll('[role="switch"], button'))
    const darkToggle = toggles.find(t => {
      const label = t.closest('[class]')?.textContent || t.textContent || ''
      return label.toLowerCase().includes('dark')
    })
    darkToggle?.click()
  })
  await sleep(500)
  await page.goto(BASE, { waitUntil: 'networkidle0' })
  await sleep(1100)
  await stripPhoneShell(page)
  await shot(page, 'landing-dark.png', ' (dark mode)')

  await browser.close()

  console.log(`\n✅ All bare screenshots saved to:\n${OUT}`)
  fs.readdirSync(OUT).filter(f => f.endsWith('.png')).forEach(f => {
    const size = fs.statSync(path.join(OUT, f)).size
    console.log(`  ${f} (${Math.round(size/1024)}KB)`)
  })
}

run().catch(err => {
  console.error('\n❌ Error:', err.message)
  process.exit(1)
})
