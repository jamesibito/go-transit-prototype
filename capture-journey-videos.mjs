/**
 * capture-journey-videos.mjs  (v2 — proper interaction recordings)
 *
 * Records 5 journey-step clips (~7–8s each) of the LIVE prototype, driving it
 * the way a user would. Fixes the old script's bug: it clicked text on
 * off-screen stacked screens, so clips froze. This taps by COORDINATES on the
 * visible screen only (elementFromPoint + mouse.click).
 *
 * Flow:  Landing → Plan a New Trip → recent trip → schedule sheet →
 *        trip time → Trip Details → Buy E-Ticket → Payment → Pay → Ticket
 *
 * Run:   GO_PORT=5176 node capture-journey-videos.mjs   (dev server must be up)
 * Out:   public/case-study/after-bare/videos/journey-{1..5}-*.mp4
 */
process.env.PATH = '/opt/homebrew/bin:' + process.env.PATH
import puppeteer from 'puppeteer'
import { PuppeteerScreenRecorder } from 'puppeteer-screen-recorder'
import path from 'path'
import fs from 'fs'

const sleep = (ms) => new Promise(r => setTimeout(r, ms))
const PORT = process.env.GO_PORT || '5176'
const BASE = `http://localhost:${PORT}`
const OUT = path.resolve('public/case-study/after-bare/videos')
fs.mkdirSync(OUT, { recursive: true })

const REC = {
  followNewTab: false, fps: 30,
  ffmpeg_Path: '/opt/homebrew/bin/ffmpeg',
  videoFrame: { width: 780, height: 1688 },
  videoCrf: 20, videoCodec: 'libx264', videoPreset: 'veryfast',
  aspectRatio: '390:844', autopad: { color: 'white' },
}

let page
async function strip() {
  await page.addStyleTag({ content: `
    .phone-shell { border-radius:0 !important; box-shadow:none !important; outline:none !important; }
    body, html, #root { background: var(--surface-primary, #fff) !important; }
  `})
}
async function tap(substr, re) {
  const xy = await page.evaluate((substr, reStr) => {
    const rx = reStr ? new RegExp(reStr) : null
    for (const e of document.querySelectorAll('button,[role="button"],a')) {
      const r = e.getBoundingClientRect(); const cx = r.left + r.width/2, cy = r.top + r.height/2
      if (r.width>20 && r.height>16 && cx>=0 && cx<=390 && cy>=0 && cy<=844) {
        const t = (e.textContent||'').replace(/\s+/g,' ')
        if ((substr && t.includes(substr)) || (rx && rx.test(t))) {
          const top = document.elementFromPoint(cx, cy)
          if (top && (e===top || e.contains(top))) return { x: cx, y: cy }
        }
      }
    }
    return null
  }, substr, re)
  if (xy) { await page.mouse.click(xy.x, xy.y); await sleep(1200); return true }
  console.log('   (tap miss:', substr || re, ')'); return false
}
const tapTrip = () => tap(null, '\\d{1,2}:\\d{2}\\s*(AM|PM)')
async function scrollTo(y, dur = 1700) {
  await page.evaluate(async (y, dur) => {
    let el = null, best = 0
    for (const n of document.querySelectorAll('.phone-shell *')) {
      if (n.scrollHeight - n.clientHeight > 40 && n.clientHeight > 280 && n.clientHeight > best) { best = n.clientHeight; el = n }
    }
    el = el || document.querySelector('.phone-shell') || document.scrollingElement
    const start = el.scrollTop, steps = Math.max(1, Math.round(dur/20))
    for (let i=0;i<=steps;i++){ el.scrollTop = start + (y-start)*(i/steps); await new Promise(r=>setTimeout(r,20)) }
  }, y, dur)
}
async function reset() { await page.goto(BASE, { waitUntil: 'networkidle0' }); await sleep(2200) }
async function record(name, fn) {
  const rec = new PuppeteerScreenRecorder(page, REC)
  await rec.start(path.join(OUT, name))
  await fn()
  await rec.stop()
  console.log('  ✓', name)
}

async function run() {
  const browser = await puppeteer.launch({
    headless: 'new',
    executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
    args: ['--no-sandbox', '--window-size=600,960'],
  })
  page = await browser.newPage()
  await page.setViewport({ width: 390, height: 844, deviceScaleFactor: 2 })

  // 1 — HOME: take in the live next-departure card, then the saved trips
  console.log('[1/5] journey-1-home')
  await reset(); await strip()
  await record('journey-1-home.mp4', async () => {
    await sleep(1300); await scrollTo(360, 1800); await sleep(1200)
    await scrollTo(720, 1400); await sleep(900); await scrollTo(0, 1500); await sleep(700)
  })

  // 2 — SEARCH: plan a trip, pick a route, schedule sheet slides up
  console.log('[2/5] journey-2-search')
  await reset(); await strip()
  await record('journey-2-search.mp4', async () => {
    await sleep(900); await tap('Plan a New Trip'); await strip(); await sleep(1100)
    await tap('Milliken GO → Union Station'); await sleep(1700)
    await scrollTo(220, 1200); await sleep(900)
  })

  // 3 — DETAILS: open a departure, scroll the map / stops / platform
  console.log('[3/5] journey-3-details')
  await reset(); await strip()
  await tap('Plan a New Trip'); await tap('Milliken GO → Union Station'); await sleep(700)
  await record('journey-3-details.mp4', async () => {
    await sleep(700); await tapTrip(); await strip(); await sleep(1400)
    await scrollTo(400, 1900); await sleep(1100); await scrollTo(0, 1500); await sleep(700)
  })

  // 4 — PAY: buy the e-ticket, review payment, open add-card
  console.log('[4/5] journey-4-pay')
  await reset(); await strip()
  await tap('Plan a New Trip'); await tap('Milliken GO → Union Station'); await tapTrip(); await sleep(700)
  await record('journey-4-pay.mp4', async () => {
    await sleep(800); await tap('Buy E-Ticket'); await strip(); await sleep(1600)
    await scrollTo(180, 1000); await sleep(700)
    await tap('Add New Card'); await sleep(1700); await sleep(600)
  })

  // 5 — TICKET: pay → processing → checkmark → QR boarding pass
  console.log('[5/5] journey-5-ticket')
  await reset(); await strip()
  await tap('Plan a New Trip'); await tap('Milliken GO → Union Station'); await tapTrip(); await tap('Buy E-Ticket'); await sleep(700)
  await record('journey-5-ticket.mp4', async () => {
    await sleep(800); await tap('Pay $'); await strip(); await sleep(4600)
    await scrollTo(220, 1200); await sleep(900)
  })

  await browser.close()
  console.log('\nDONE. Files:')
  fs.readdirSync(OUT).filter(f => f.startsWith('journey-')).forEach(f => {
    console.log(' ', f, Math.round(fs.statSync(path.join(OUT, f)).size/1024) + 'KB')
  })
}
run().catch(e => { console.error('ERR', e.message); process.exit(1) })
