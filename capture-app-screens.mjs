/**
 * capture-app-screens.mjs
 * Navigates the live GO Transit app and screenshots key screens
 * for use as real app images in the case study assets.
 *
 * Run: node capture-app-screens.mjs
 * Requires: puppeteer (already installed), dev server on port 5173
 */
import puppeteer from 'puppeteer'
import path from 'path'
import fs from 'fs'

const sleep = (ms) => new Promise(r => setTimeout(r, ms))
// Vite's first preference is 5173, but other prototypes in this workspace
// frequently claim it first, so the GO Transit dev server lands on 5174.
// Override here if your local port is different.
const BASE = process.env.GO_PORT ? `http://localhost:${process.env.GO_PORT}` : 'http://localhost:5174'
const OUT = '/Users/Design/Downloads/Design Workspace/Projects/Portfolio/go-transit-prototype/public/case-study/after'
const PHONE_SELECTOR = '.phone-shell'

fs.mkdirSync(OUT, { recursive: true })

async function shot(page, filename, extra = '') {
  await sleep(800)
  const el = await page.$(PHONE_SELECTOR)
  if (!el) { console.warn(`⚠ No .phone-shell for ${filename}`); return }
  const out = path.join(OUT, filename)
  await el.screenshot({ path: out, type: 'png' })
  const box = await el.boundingBox()
  console.log(`  ✓ ${filename} (${Math.round(box?.width)}×${Math.round(box?.height)})${extra}`)
}

// Click a button by matching text
async function clickText(page, text) {
  await page.evaluate((t) => {
    const els = Array.from(document.querySelectorAll('button, [role="button"]'))
    const match = els.find(e => e.textContent?.trim().includes(t))
    match?.click()
  }, text)
  await sleep(600)
}

// Click a saved trip card to trigger navigation
async function clickSelector(page, sel) {
  await page.waitForSelector(sel, { timeout: 3000 }).catch(() => {})
  await page.click(sel).catch(() => {})
  await sleep(600)
}

async function run() {
  console.log('Launching Chrome...')
  const browser = await puppeteer.launch({
    headless: true,
    executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
    args: ['--no-sandbox'],
  })

  const page = await browser.newPage()
  // 2× device pixel ratio for sharp images
  await page.setViewport({ width: 600, height: 960, deviceScaleFactor: 2 })

  // ── 1. LANDING (light) ───────────────────────────────────────
  console.log('\n[1/8] Landing — light mode')
  await page.goto(BASE, { waitUntil: 'networkidle0' })
  await sleep(1200)
  await shot(page, 'landing-light.png')

  // ── 2. SEARCH TRIP ───────────────────────────────────────────
  console.log('[2/8] Search Trip')
  await clickText(page, 'Plan a New Trip')
  await shot(page, 'search-trip.png')

  // ── 3. SEARCH RESULTS (schedule bottom sheet) ────────────────
  // v4.7+ removed the standalone results page. Tapping a Recent trips
  // card from SearchTrip fires handleHistoryClick, which seeds From/To
  // and auto-opens the bottom sheet. Wait past the 900 ms loading
  // skeleton before we shoot.
  console.log('[3/8] Search Results (schedule sheet)')
  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button'))
    const card = btns.find(b => /GO\s*→/.test(b.textContent || '') && b.offsetWidth > 200 && b.offsetHeight > 60)
    card?.click()
  })
  await sleep(1500)
  await shot(page, 'search-results.png')

  // ── 4. TRIP DETAILS ──────────────────────────────────────────
  // Click a departure card inside the now-visible sheet (the sheet uses
  // a translateY(0) transform). Match both departure AND arrival times
  // so we don't accidentally click a recent-trip row in the form behind.
  console.log('[4/8] Trip Details')
  await page.evaluate(() => {
    const sheet = document.querySelector('[style*="translateY(0"][style*="height"]')
    const scope = sheet || document
    const trip = Array.from(scope.querySelectorAll('button')).find(b => {
      const t = b.textContent || ''
      return /\d{1,2}:\d{2}\s*(AM|PM).*\d{1,2}:\d{2}\s*(AM|PM)/.test(t) && b.offsetWidth > 200 && b.offsetHeight > 60
    })
    trip?.click()
  })
  await sleep(900)
  await shot(page, 'trip-details.png')

  // ── 5. FARES ─────────────────────────────────────────────────
  console.log('[5/8] Fares')
  await page.goto(BASE, { waitUntil: 'networkidle0' })
  await sleep(800)
  await clickText(page, 'Fares')
  await shot(page, 'fares.png')

  // ── 6. PAYMENT ───────────────────────────────────────────────
  console.log('[6/8] Payment')
  await clickText(page, 'Buy E-Ticket')
  await sleep(600)
  await shot(page, 'payment.png')

  // ── 7. TICKET CONFIRMATION ───────────────────────────────────
  console.log('[7/8] Ticket Confirmation')
  await clickText(page, 'Pay $')
  await sleep(2000) // wait for processing animation
  await shot(page, 'ticket-confirmation.png')

  // ── 8. SERVICE UPDATES ───────────────────────────────────────
  console.log('[8/8] Service Updates')
  await page.goto(BASE, { waitUntil: 'networkidle0' })
  await sleep(600)
  await clickText(page, 'Alerts')
  await shot(page, 'service-updates.png')

  // ── 9. LANDING (dark mode) ───────────────────────────────────
  console.log('[+] Landing — dark mode')
  await page.goto(BASE, { waitUntil: 'networkidle0' })
  await sleep(600)
  // Open menu → Settings → enable dark mode
  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button'))
    const menu = btns.find(b => b.querySelector('svg') && b.getAttribute('aria-label')?.includes('menu') || b.className?.includes('menu'))
    menu?.click()
  })
  await sleep(500)
  await clickText(page, 'Settings')
  await sleep(500)
  // Toggle dark mode
  await page.evaluate(() => {
    const toggles = Array.from(document.querySelectorAll('[role="switch"], button'))
    const darkToggle = toggles.find(t => {
      const label = t.closest('[class]')?.textContent || t.textContent || ''
      return label.toLowerCase().includes('dark')
    })
    darkToggle?.click()
  })
  await sleep(400)
  // Go back home
  await page.goto(BASE, { waitUntil: 'networkidle0' })
  await sleep(1000)
  await shot(page, 'landing-dark.png', ' (dark mode)')

  // ── 10. TICKET VIEW (dark) ───────────────────────────────────
  console.log('[+] Ticket View — dark mode')
  // If there's an active trip on the landing, tap it
  await page.evaluate(() => {
    const cards = Array.from(document.querySelectorAll('button'))
    const active = cards.find(c => c.textContent?.toLowerCase().includes('active') || c.textContent?.includes('Your Ticket'))
    active?.click()
  })
  await sleep(600)
  // Check if we navigated somewhere; if not, go buy a ticket first
  const url = page.url()
  if (url === BASE || url === BASE + '/') {
    // Reset and go through flow in dark mode to get a ticket. Same
    // post-v4.7 pattern: recent-trip tap to open sheet, then click a
    // departure inside the sheet.
    await clickText(page, 'Plan a New Trip')
    await page.evaluate(() => {
      const btns = Array.from(document.querySelectorAll('button'))
      const card = btns.find(b => /GO\s*→/.test(b.textContent || '') && b.offsetWidth > 200 && b.offsetHeight > 60)
      card?.click()
    })
    await sleep(1500)
    await page.evaluate(() => {
      const sheet = document.querySelector('[style*="translateY(0"][style*="height"]')
      const scope = sheet || document
      const trip = Array.from(scope.querySelectorAll('button')).find(b => {
        const t = b.textContent || ''
        return /\d{1,2}:\d{2}\s*(AM|PM).*\d{1,2}:\d{2}\s*(AM|PM)/.test(t) && b.offsetWidth > 200 && b.offsetHeight > 60
      })
      trip?.click()
    })
    await sleep(800)
    await clickText(page, 'Buy E-Ticket')
    await sleep(400)
    await clickText(page, 'Pay $')
    await sleep(2000)
    await clickText(page, 'Done')
    await sleep(600)
    await page.evaluate(() => {
      const cards = Array.from(document.querySelectorAll('button'))
      const active = cards.find(c => c.textContent?.toLowerCase().includes('active') || c.textContent?.includes('trip'))
      active?.click()
    })
    await sleep(600)
  }
  await shot(page, 'ticket-view-dark.png', ' (dark mode)')

  await browser.close()

  console.log(`\n✅ All screenshots saved to:\n${OUT}`)
  console.log('\nFiles:')
  fs.readdirSync(OUT).filter(f => f.endsWith('.png')).forEach(f => {
    const size = fs.statSync(path.join(OUT, f)).size
    console.log(`  ${f} (${Math.round(size/1024)}KB)`)
  })
}

run().catch(err => {
  console.error('\n❌ Error:', err.message)
  process.exit(1)
})
