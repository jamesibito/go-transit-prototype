/**
 * screenshot-assets.mjs
 * Exports case study assets from the showcase page as individual PNGs.
 *
 * Captures two sets:
 *   sections/  — full-width section PNGs for Framer (one per tab)
 *   pieces/    — modular sub-components with unique IDs for granular assembly
 *
 * Run: node screenshot-assets.mjs
 * Requires: puppeteer, dev server running on port 5174
 */
import puppeteer from 'puppeteer'
import path from 'path'
import fs from 'fs'

const sleep = (ms) => new Promise(r => setTimeout(r, ms))

const BASE = 'http://localhost:5173/?showcase=true'
const ROOT = '/Users/Design/Downloads/Design Workspace/Projects/Portfolio/go-transit-prototype/public/case-study/exports'
const SECTIONS_DIR = path.join(ROOT, 'sections')
const PIECES_DIR   = path.join(ROOT, 'pieces')

fs.mkdirSync(SECTIONS_DIR, { recursive: true })
fs.mkdirSync(PIECES_DIR,   { recursive: true })

// ── Full-section captures (one per showcase tab) ───────────────────────────
// Each entry: which tab button index to click, which element ID to screenshot, filename
const SECTIONS = [
  { tab: 0, id: 'cs-01-hero-desktop',  filename: '01-hero-desktop.png',    label: 'Hero (desktop)' },
  { tab: 0, id: 'cs-01-hero-mobile',   filename: '01-hero-mobile.png',     label: 'Hero (mobile)' },
  { tab: 1, id: 'cs-02-header',        filename: '02-header.png',          label: 'Starting Point — header' },
  { tab: 1, id: 'cs-02-figma-grid',    filename: '02-figma-grid.png',      label: 'Starting Point — Figma screens' },
  { tab: 1, id: 'cs-02-gap-cards',     filename: '02-gap-cards.png',       label: 'Starting Point — gap cards' },
  { tab: 2, id: 'cs-03-before-after',  filename: '03-before-after.png',    label: 'Before / After: Homepage' },
  { tab: 3, id: 'cs-04-decisions',     filename: '04-three-decisions.png', label: 'Three Decisions' },
  { tab: 4, id: 'cs-05-every-rider',   filename: '05-every-rider.png',     label: 'Built For Every Rider' },
  { tab: 5, id: 'cs-06-phones',        filename: '06-journey-phones.png',  label: 'Complete Journey — phones' },
]

// ── Modular piece captures (individual sub-components) ─────────────────────
const PIECES = [
  // Before/After sub-panels
  { tab: 2, id: 'cs-03-before-phone',  filename: 'before-phone.png',     label: 'Before phone panel' },
  { tab: 2, id: 'cs-03-after-phone',   filename: 'after-phone.png',      label: 'After phone panel' },
  { tab: 2, id: 'cs-03-insight',       filename: 'insight-bar.png',      label: 'Insight bar' },
  // Decision cards (individually)
  { tab: 3, id: 'cs-04-decision-1',    filename: 'decision-01.png',      label: 'Decision 01: Homepage' },
  { tab: 3, id: 'cs-04-decision-2',    filename: 'decision-02.png',      label: 'Decision 02: Payment' },
  { tab: 3, id: 'cs-04-decision-3',    filename: 'decision-03.png',      label: 'Decision 03: Alerts' },
  // Dark mode phones
  { tab: 4, id: 'cs-05-dark-phone',    filename: 'dark-mode-phone.png',  label: 'Dark mode phone' },
  { tab: 4, id: 'cs-05-access-phone',  filename: 'alerts-phone.png',     label: 'Alerts phone' },
  { tab: 4, id: 'cs-05-copy',          filename: 'every-rider-copy.png', label: 'Every rider copy block' },
  // Journey phones (individually)
  { tab: 5, id: 'cs-06-step-1',        filename: 'journey-1-home.png',   label: 'Journey step 1: Home' },
  { tab: 5, id: 'cs-06-step-2',        filename: 'journey-2-search.png', label: 'Journey step 2: Search' },
  { tab: 5, id: 'cs-06-step-3',        filename: 'journey-3-details.png',label: 'Journey step 3: Details' },
  { tab: 5, id: 'cs-06-step-4',        filename: 'journey-4-pay.png',    label: 'Journey step 4: Pay' },
  { tab: 5, id: 'cs-06-step-5',        filename: 'journey-5-ticket.png', label: 'Journey step 5: Ticket' },
]

async function clickTab(page, tabIndex) {
  // Click the nav button matching the zero-based tab index by its "0N" prefix text
  const label = String(tabIndex + 1).padStart(2, '0')
  const clicked = await page.evaluate((prefix) => {
    const btns = Array.from(document.querySelectorAll('button'))
    const btn = btns.find(b => b.textContent?.trim().startsWith(prefix))
    if (btn) { btn.click(); return true }
    return false
  }, label)
  if (!clicked) console.warn(`  ⚠ Could not find tab button "${label}"`)
  await sleep(1000)
}

async function captureElement(page, elementId, outPath, label) {
  const el = await page.$(`#${elementId}`)
  if (!el) {
    console.warn(`  ⚠ #${elementId} not found — skipping "${label}"`)
    return false
  }
  await el.screenshot({ path: outPath, type: 'png' })
  const box = await el.boundingBox()
  console.log(`  ✓ ${path.basename(outPath)} (${Math.round(box?.width ?? 0)}×${Math.round(box?.height ?? 0)})`)
  return true
}

async function run() {
  console.log('Launching Chrome...\n')
  const browser = await puppeteer.launch({
    headless: true,
    executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  })

  const page = await browser.newPage()
  await page.setViewport({ width: 1600, height: 900, deviceScaleFactor: 2 })

  console.log('Loading showcase...')
  await page.goto(BASE, { waitUntil: 'networkidle0' })
  await sleep(3000) // let Inter font load + React hydrate

  let currentTab = -1

  // ── Sections ──────────────────────────────────────────────────────────────
  console.log('\n── Sections ──────────────────────────────────────────────────')
  for (const s of SECTIONS) {
    if (s.tab !== currentTab) {
      await clickTab(page, s.tab)
      currentTab = s.tab
    }
    process.stdout.write(`[${s.label}] `)
    await captureElement(page, s.id, path.join(SECTIONS_DIR, s.filename), s.label)
  }

  // ── Pieces ────────────────────────────────────────────────────────────────
  console.log('\n── Pieces ───────────────────────────────────────────────────')
  for (const p of PIECES) {
    if (p.tab !== currentTab) {
      await clickTab(page, p.tab)
      currentTab = p.tab
    }
    process.stdout.write(`[${p.label}] `)
    await captureElement(page, p.id, path.join(PIECES_DIR, p.filename), p.label)
  }

  await browser.close()

  // ── Summary ───────────────────────────────────────────────────────────────
  console.log('\n✅ Done!\n')
  for (const [dir, label] of [[SECTIONS_DIR, 'sections'], [PIECES_DIR, 'pieces']]) {
    const files = fs.readdirSync(dir).filter(f => f.endsWith('.png'))
    console.log(`${label}/ (${files.length} files)`)
    files.forEach(f => {
      const kb = Math.round(fs.statSync(path.join(dir, f)).size / 1024)
      console.log(`  ${f} (${kb} KB)`)
    })
    console.log()
  }
  console.log(`Output: ${ROOT}`)
}

run().catch(err => {
  console.error('\n❌ Error:', err.message)
  process.exit(1)
})
