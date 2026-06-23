/**
 * capture-external-sites.mjs
 * Screenshots the "original rider reality" websites the prototype replaces —
 * GO Transit, PRESTO, Google Maps. Two viewports each (mobile + desktop).
 * These feed the Project Context section's visual examples and the Final
 * Outcome Before/After block.
 *
 *   node capture-external-sites.mjs
 *
 * Output: public/case-study/before-external/
 */
import puppeteer from 'puppeteer'
import path from 'path'
import fs from 'fs'

const sleep = (ms) => new Promise((r) => setTimeout(r, ms))

const OUT = '/Users/Design/Downloads/Design Workspace/Projects/Portfolio/go-transit-prototype/public/case-study/before-external'
fs.mkdirSync(OUT, { recursive: true })

const MOBILE_VP  = { width: 390, height: 844, deviceScaleFactor: 2 }
const DESKTOP_VP = { width: 1440, height: 900, deviceScaleFactor: 2 }

// Each target: url, mobile filename, desktop filename, optional pre-actions
// (dismissing cookie banners etc.). Some sites need a moment to settle.
const TARGETS = [
  {
    name: 'GO Transit homepage',
    url: 'https://www.gotransit.com/en',
    mobileFile:  'gotransit-mobile.png',
    desktopFile: 'gotransit-desktop.png',
    settle: 3000,
  },
  {
    name: 'GO Transit trip planner',
    url: 'https://www.gotransit.com/en/trip-planner',
    mobileFile:  'gotransit-trip-planner-mobile.png',
    desktopFile: 'gotransit-trip-planner-desktop.png',
    settle: 3500,
  },
  {
    name: 'PRESTO card homepage',
    url: 'https://www.prestocard.ca/en',
    mobileFile:  'prestocard-mobile.png',
    desktopFile: 'prestocard-desktop.png',
    settle: 3000,
  },
  {
    name: 'Google Maps — Union to Aurora GO transit',
    // Pre-loads a transit-mode route. The /dir/ URL is a stable directions
    // permalink; the /data= chunk asks Maps for transit mode (!3e3).
    url: 'https://www.google.com/maps/dir/Union+Station,+Toronto,+ON/Aurora+GO+Station,+Aurora,+ON/data=!4m2!4m1!3e3',
    mobileFile:  'gmaps-transit-mobile.png',
    desktopFile: 'gmaps-transit-desktop.png',
    settle: 4500,
  },
]

async function dismissBanners(page) {
  // Best-effort cookie/consent banner dismissal. Targets the most common
  // patterns; fails silently if a target site doesn't show one.
  await page.evaluate(() => {
    const phrases = ['accept', 'agree', 'i accept', 'got it', 'ok', 'allow all', 'continue', 'reject all']
    const buttons = Array.from(document.querySelectorAll('button, [role="button"], a'))
    for (const b of buttons) {
      const txt = (b.textContent || '').trim().toLowerCase()
      if (phrases.some((p) => txt === p || txt.startsWith(p))) { b.click(); return }
    }
  }).catch(() => {})
  await sleep(600)
}

async function shootOne(browser, target, viewport, file, isDesktop) {
  const page = await browser.newPage()
  try {
    await page.setViewport(viewport)
    await page.setUserAgent(
      isDesktop
        ? 'Mozilla/5.0 (Macintosh; Intel Mac OS X 13_3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36'
        : 'Mozilla/5.0 (iPhone; CPU iPhone OS 16_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.5 Mobile/15E148 Safari/604.1'
    )
    console.log(`  → loading ${target.url}`)
    await page.goto(target.url, { waitUntil: 'domcontentloaded', timeout: 45000 })
    await sleep(target.settle ?? 2500)
    await dismissBanners(page)
    await sleep(800)
    const out = path.join(OUT, file)
    await page.screenshot({ path: out, type: 'png', fullPage: false })
    const size = fs.statSync(out).size
    console.log(`  ✓ ${file} (${Math.round(size / 1024)} KB)`)
  } catch (err) {
    console.warn(`  ⚠ ${file} — ${err.message}`)
  } finally {
    await page.close().catch(() => {})
  }
}

async function run() {
  console.log('Launching Chrome…')
  const browser = await puppeteer.launch({
    headless: true,
    executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-blink-features=AutomationControlled'],
  })

  for (const t of TARGETS) {
    console.log(`\n[ ${t.name} ]`)
    await shootOne(browser, t, MOBILE_VP,  t.mobileFile,  false)
    await shootOne(browser, t, DESKTOP_VP, t.desktopFile, true)
  }

  await browser.close()
  console.log(`\n✅ Done. Output in ${OUT}\n`)
  fs.readdirSync(OUT).filter((f) => f.endsWith('.png')).forEach((f) => {
    const kb = Math.round(fs.statSync(path.join(OUT, f)).size / 1024)
    console.log(`  ${f}  ${kb} KB`)
  })
}

run().catch((err) => {
  console.error('❌', err.message)
  process.exit(1)
})
