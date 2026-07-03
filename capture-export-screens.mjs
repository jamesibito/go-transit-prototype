/**
 * capture-export-screens.mjs
 *
 * Captures the 9 screenshots actually used by the live case study, by
 * screenshotting individual cells of the ExportAll grid (/?all) instead of
 * click-driving the live app. ExportAll sets context state directly (no
 * click simulation), so there's zero risk of a missed click silently
 * freezing on the wrong screen — the bug that caused payment.png and
 * ticket-confirmation.png to previously both capture the Fares screen.
 *
 * Run:  GO_PORT=5184 node capture-export-screens.mjs
 * Out:  public/case-study/after/*.png
 */
import puppeteer from 'puppeteer'
import path from 'path'
import fs from 'fs'

const sleep = (ms) => new Promise(r => setTimeout(r, ms))
const PORT = process.env.GO_PORT || '5173'
const BASE = `http://localhost:${PORT}`
const OUT = path.resolve('public/case-study/after')
fs.mkdirSync(OUT, { recursive: true })

async function stripChrome(page) {
  await page.addStyleTag({ content: `
    .phone-shell { border-radius: 0 !important; box-shadow: none !important; outline: none !important; }
  ` })
}

// A full-page screenshot forces Chromium to fully paint/composite every cell
// in the grid (including ones individual el.screenshot() calls would otherwise
// catch mid-paint). Call once per page load before the real per-cell shots.
async function warmUp(page) {
  await page.screenshot({ fullPage: true })
}

// Find the .phone-shell whose label sibling contains `labelSubstr`, screenshot it.
async function shotCell(page, labelSubstr, filename, { bare = false } = {}) {
  if (bare) await stripChrome(page)
  const handle = await page.evaluateHandle((label) => {
    const shells = Array.from(document.querySelectorAll('.phone-shell'))
    for (const shell of shells) {
      const wrap = shell.closest('div')?.parentElement
      const text = wrap?.textContent || ''
      if (text.includes(label)) return shell
    }
    return null
  }, labelSubstr)
  const el = handle.asElement()
  if (!el) { console.warn(`  ⚠ cell not found for "${labelSubstr}"`); return }
  await el.screenshot({ path: path.join(OUT, filename), type: 'png' })
  const box = await el.boundingBox()
  console.log(`  ✓ ${filename} (${Math.round(box.width)}×${Math.round(box.height)}) ← "${labelSubstr}"`)
}

async function run() {
  const browser = await puppeteer.launch({
    headless: true,
    executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
    args: ['--no-sandbox'],
  })
  const page = await browser.newPage()
  await page.setViewport({ width: 2200, height: 1200, deviceScaleFactor: 2 })

  console.log('[1/3] AllScreens — light')
  await page.goto(`${BASE}/?all`, { waitUntil: 'networkidle0' })
  await sleep(2000)
  await warmUp(page)
  await shotCell(page, '01 · Landing / Home', 'landing-light.png')
  await shotCell(page, '03 · Trip Details', 'trip-details.png')
  await shotCell(page, '04 · Fares', 'fares.png')
  await shotCell(page, '05 · Service Updates', 'service-updates.png')
  await shotCell(page, '06 · Payment', 'payment.png')
  await shotCell(page, '07 · Ticket Confirmation', 'ticket-confirmation.png')

  console.log('[2/3] AllScreens — dark')
  await page.goto(`${BASE}/?all&dark`, { waitUntil: 'networkidle0' })
  await sleep(2000)
  await warmUp(page)
  await shotCell(page, '01 · Landing / Home', 'landing-dark-bare.png', { bare: true })
  await shotCell(page, '03 · Trip Details', 'tripdetails_dark.png')
  await shotCell(page, '05 · Service Updates', 'servicedark.png')

  console.log('[3/3] Variants — results sheet (light)')
  await page.goto(`${BASE}/?all&set=variants`, { waitUntil: 'networkidle0' })
  await sleep(1500) // 900ms skeleton + buffer
  await warmUp(page)
  await shotCell(page, 'Trip Planning — Results sheet', 'search-results.png')

  await browser.close()
  console.log('\nDONE. Files in', OUT)
  fs.readdirSync(OUT).filter(f => f.endsWith('.png')).forEach(f => {
    console.log(' ', f, Math.round(fs.statSync(path.join(OUT, f)).size / 1024) + 'KB')
  })
}
run().catch(e => { console.error('ERR', e.message); process.exit(1) })
