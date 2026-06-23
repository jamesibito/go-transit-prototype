/**
 * capture-hover-videos.mjs
 * Records short MP4 clips of key interactions, starting from the same frame as
 * the matching static screenshot so the hover transition is seamless.
 *
 * Run:
 *   npm install puppeteer-screen-recorder ffmpeg-static
 *   node capture-hover-videos.mjs
 *
 * Requires: dev server on port 5174
 *
 * Output: public/case-study/after-bare/videos/*.mp4
 *
 * Videos generated (6):
 *   journey-1-home.mp4      — Landing: scroll the next-departure card / saved trips
 *   journey-2-search.mp4    — Search results: scroll the list
 *   journey-3-details.mp4   — Trip details: scroll through stops and map
 *   journey-4-pay.mp4       — Payment: switch payment method
 *   journey-5-ticket.mp4    — Ticket confirmation: checkmark + QR animation
 *   before-after-after.mp4  — Landing entrance animation (loop-style intro)
 */
import puppeteer from 'puppeteer'
import { PuppeteerScreenRecorder } from 'puppeteer-screen-recorder'
import path from 'path'
import fs from 'fs'

const sleep = (ms) => new Promise(r => setTimeout(r, ms))
const BASE = process.env.GO_PORT ? `http://localhost:${process.env.GO_PORT}` : 'http://localhost:5174'
const OUT = '/Users/Design/Downloads/Design Workspace/Projects/Portfolio/go-transit-prototype/public/case-study/after-bare/videos'
const PHONE_SELECTOR = '.phone-shell'

fs.mkdirSync(OUT, { recursive: true })

async function stripPhoneShell(page) {
  await page.addStyleTag({
    content: `
      .phone-shell {
        border-radius: 0 !important;
        box-shadow: none !important;
        outline: none !important;
        background: var(--surface-primary) !important;
      }
      body, html, #root { background: var(--surface-primary, #fff) !important; }
    `,
  })
}

async function clickText(page, text) {
  await page.evaluate((t) => {
    const els = Array.from(document.querySelectorAll('button, [role="button"]'))
    const match = els.find(e => e.textContent?.trim().includes(t))
    match?.click()
  }, text)
  await sleep(700)
}

// Configure the recorder to capture only the phone-shell area
function recorderConfig() {
  return {
    followNewTab: false,
    fps: 30,
    videoFrame: { width: 780, height: 1688 }, // 390×844 @ 2x
    videoCrf: 18,
    videoCodec: 'libx264',
    videoPreset: 'medium',
    aspectRatio: '390:844',
    autopad: { color: 'white' },
  }
}

async function record(page, name, fn) {
  const recorder = new PuppeteerScreenRecorder(page, recorderConfig())
  const out = path.join(OUT, name)
  await recorder.start(out)
  await fn()
  await recorder.stop()
  console.log(`  ✓ ${name}`)
}

async function run() {
  console.log('Launching Chrome...')
  const browser = await puppeteer.launch({
    headless: 'new',
    executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
    args: ['--no-sandbox', '--window-size=600,960'],
  })

  const page = await browser.newPage()
  await page.setViewport({ width: 600, height: 960, deviceScaleFactor: 2 })

  // ── 1. JOURNEY 1 — Landing scroll ────────────────────────────
  console.log('\n[1/6] journey-1-home.mp4 (Landing scroll)')
  await page.goto(BASE, { waitUntil: 'networkidle0' })
  await sleep(1200)
  await stripPhoneShell(page)
  await record(page, 'journey-1-home.mp4', async () => {
    await sleep(800) // hold on first frame
    // Smooth scroll down
    await page.evaluate(async () => {
      const el = document.querySelector('.phone-shell .scroll-container, .phone-shell')
      if (!el) return
      const target = 280
      const steps = 30
      for (let i = 0; i <= steps; i++) {
        el.scrollTop = (target * i) / steps
        await new Promise(r => setTimeout(r, 22))
      }
    })
    await sleep(900)
  })

  // ── 2. JOURNEY 2 — Schedule sheet slide-up ───────────────────
  // Show the new bottom-sheet interaction: the rider taps a Recent
  // trips row, the sheet slides up over Plan Your Trip, the loading
  // skeleton resolves into the trip list. Captures the actual new
  // pattern instead of the removed "Search Results" page.
  console.log('[2/6] journey-2-search.mp4 (Schedule sheet)')
  await page.goto(BASE, { waitUntil: 'networkidle0' })
  await sleep(800)
  await clickText(page, 'Plan a New Trip')
  await stripPhoneShell(page)
  await record(page, 'journey-2-search.mp4', async () => {
    await sleep(600) // hold on the form before tapping
    await page.evaluate(() => {
      const btns = Array.from(document.querySelectorAll('button'))
      const card = btns.find(b => /GO\s*→/.test(b.textContent || '') && b.offsetWidth > 200 && b.offsetHeight > 60)
      card?.click()
    })
    // Sheet animates up (~380 ms) → skeleton holds (~900 ms) → trips
    // render. Total visible: ~2.6 s of meaningful motion.
    await sleep(2600)
  })

  // ── 3. JOURNEY 3 — Trip details scroll ───────────────────────
  // The sheet is open from step 2. Tap a trip card inside it to push
  // through to Trip Details, then scroll to reveal the new map and
  // stop list.
  console.log('[3/6] journey-3-details.mp4 (Trip details scroll)')
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
  await stripPhoneShell(page)
  await record(page, 'journey-3-details.mp4', async () => {
    await sleep(800)
    await page.evaluate(async () => {
      const el = document.querySelector('.phone-shell .scroll-container, .phone-shell')
      if (!el) return
      for (let i = 0; i <= 35; i++) {
        el.scrollTop = (420 * i) / 35
        await new Promise(r => setTimeout(r, 22))
      }
    })
    await sleep(900)
  })

  // ── 4. JOURNEY 4 — Payment method switch ─────────────────────
  console.log('[4/6] journey-4-pay.mp4 (Payment)')
  await page.goto(BASE, { waitUntil: 'networkidle0' })
  await sleep(800)
  await clickText(page, 'Fares')
  await clickText(page, 'Buy E-Ticket')
  await sleep(700)
  await stripPhoneShell(page)
  await record(page, 'journey-4-pay.mp4', async () => {
    await sleep(900)
    // Click on PRESTO option then Visa option to show selection
    await page.evaluate(() => {
      const opts = Array.from(document.querySelectorAll('button, [role="radio"]'))
      const visa = opts.find(o => o.textContent?.toLowerCase().includes('visa') || o.textContent?.toLowerCase().includes('•••'))
      visa?.click()
    })
    await sleep(800)
    await page.evaluate(() => {
      const opts = Array.from(document.querySelectorAll('button, [role="radio"]'))
      const presto = opts.find(o => o.textContent?.toLowerCase().includes('presto'))
      presto?.click()
    })
    await sleep(900)
  })

  // ── 5. JOURNEY 5 — Ticket confirmation ───────────────────────
  console.log('[5/6] journey-5-ticket.mp4 (Ticket reveal)')
  await clickText(page, 'Pay $')
  // Recording starts immediately so we capture the processing→ticket animation
  await stripPhoneShell(page)
  await record(page, 'journey-5-ticket.mp4', async () => {
    await sleep(3000) // capture processing + checkmark + ticket reveal
  })

  // ── 6. BEFORE/AFTER "AFTER" — Landing entrance ───────────────
  console.log('[6/6] before-after-after.mp4 (Landing intro)')
  await page.goto(BASE, { waitUntil: 'networkidle0' })
  await sleep(400) // catch the page early so the intro animation plays in-frame
  await stripPhoneShell(page)
  await record(page, 'before-after-after.mp4', async () => {
    await sleep(2400) // capture entrance / countdown updating
  })

  await browser.close()

  console.log(`\n✅ All hover videos saved to:\n${OUT}`)
  fs.readdirSync(OUT).filter(f => f.endsWith('.mp4')).forEach(f => {
    const size = fs.statSync(path.join(OUT, f)).size
    console.log(`  ${f} (${Math.round(size/1024)}KB)`)
  })
}

run().catch(err => {
  console.error('\n❌ Error:', err.message)
  process.exit(1)
})
