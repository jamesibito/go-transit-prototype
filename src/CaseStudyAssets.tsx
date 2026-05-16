import { useEffect, useState } from 'react'

/**
 * Case Study Visual Assets — GO Transit App Redesign
 * Access at: /?showcase=true
 *
 * Each section is broken into modular sub-components with unique IDs
 * so puppeteer can screenshot them individually for Framer assembly.
 *
 * Sections:
 *   01 Hero          — green gradient, GO logo, headline, real app screenshot
 *   02 Starting Point — original Figma screens + what was missing
 *   03 Before/After  — split panel, landing page comparison
 *   04 Three Decisions — dark bg, 3 key design choices
 *   05 Built For Every Rider — dark mode + accessibility phones
 *   06 Complete Journey — 5-step flow with real screenshots
 */

// ── Design tokens ─────────────────────────────────────────────────────────────
const G    = '#357a1e'          // GO green
const GS   = '#f0f7ec'          // green soft
const GM   = '#e6f2e0'          // green mid
const GB   = '#d5e6cc'          // green border
const DARK = '#1a1d21'          // dark panel bg
const DARK2= '#111315'          // deeper dark
const MID  = '#555b64'          // mid text
const MUT  = '#6b7280'          // muted text
const SURF = '#f4f7f3'          // surface
const BDR  = '#e2e4e7'          // border
const W    = '#ffffff'
const FONT = "'Avenir Next', 'Avenir', 'Urbanist', -apple-system, BlinkMacSystemFont, sans-serif"

// ── Font injection ────────────────────────────────────────────────────────────
function useInter() {
  useEffect(() => {
    if (document.getElementById('gotransit-font')) return
    const link = document.createElement('link')
    link.id   = 'gotransit-font'
    link.rel  = 'stylesheet'
    link.href = 'https://fonts.googleapis.com/css2?family=Urbanist:wght@400;500;600;700;800;900&display=swap'
    document.head.appendChild(link)
  }, [])
}

// ── Shared components ─────────────────────────────────────────────────────────

function GOLogo({ size = 40, color = G }: { size?: number; color?: string }) {
  return (
    <svg width={size * 1.9} height={size} viewBox="-23 -11 46 22" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <clipPath id={`go-clip-${size}`}>
          <path d="m-23-11h46v22h-46zM23 1v-2h-34v-10h-2v22h2V1z"/>
        </clipPath>
      </defs>
      <path clipPath={`url(#go-clip-${size})`} fill={color}
        d="m-1 0a11 11 0 1 0-11 11h11zm2 0a1 1 0 0 0 22 0A1 1 0 0 0 1 0z"/>
    </svg>
  )
}

/** Wraps a real app screenshot in a phone shell */
function PhoneFrame({
  src, alt = '', width = 260, dark = false, shadow = true,
}: {
  src: string; alt?: string; width?: number; dark?: boolean; shadow?: boolean
}) {
  const h = Math.round(width * (844 / 390))
  return (
    <div style={{
      width,
      height: h,
      borderRadius: Math.round(width * 0.092),
      background: dark ? '#1a1a2e' : '#2d2d2d',
      padding: Math.round(width * 0.022),
      boxShadow: shadow
        ? dark
          ? '0 32px 80px rgba(0,0,0,0.65), 0 0 0 1px rgba(255,255,255,0.06)'
          : '0 32px 80px rgba(0,0,0,0.20), 0 0 0 1px rgba(0,0,0,0.08)'
        : 'none',
      flexShrink: 0,
    }}>
      <div style={{
        width: '100%', height: '100%',
        borderRadius: Math.round(width * 0.073),
        overflow: 'hidden',
        background: dark ? '#0d1117' : '#f4f4f4',
      }}>
        <img
          src={src}
          alt={alt}
          style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'top', display: 'block' }}
        />
      </div>
    </div>
  )
}

/** Figma screenshot — warm off-white background, subtle frame */
function FigmaFrame({ src, label, width = 160 }: { src: string; label: string; width?: number }) {
  const h = Math.round(width * (844 / 390))
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10, flexShrink: 0 }}>
      <div style={{
        width, height: h,
        borderRadius: 18,
        overflow: 'hidden',
        boxShadow: '0 8px 28px rgba(0,0,0,0.11), 0 0 0 1px rgba(0,0,0,0.06)',
        background: '#f0ede6',
      }}>
        <img src={src} alt={label} style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'top', display: 'block' }} />
      </div>
      <span style={{ fontSize: 11, fontWeight: 600, color: MUT, fontFamily: FONT, textAlign: 'center' }}>{label}</span>
    </div>
  )
}

/** Green pill label */
function Tag({ text, red = false }: { text: string; red?: boolean }) {
  const c  = red ? '#dc2626' : G
  const bg = red ? '#fef2f2' : GS
  const bd = red ? '#fecaca' : GB
  return (
    <div style={{
      display: 'inline-flex', alignItems: 'center', gap: 7,
      padding: '5px 14px', borderRadius: 100,
      background: bg, border: `1px solid ${bd}`,
    }}>
      <div style={{ width: 7, height: 7, borderRadius: '50%', background: c }} />
      <span style={{ fontSize: 12, fontWeight: 800, color: c, textTransform: 'uppercase', letterSpacing: '0.8px', fontFamily: FONT }}>{text}</span>
    </div>
  )
}

/** Small section eyebrow label (plain text, uppercase) */
function Eyebrow({ text, light = false }: { text: string; light?: boolean }) {
  return (
    <p style={{
      fontSize: 12, fontWeight: 800, letterSpacing: '1.4px',
      textTransform: 'uppercase', color: light ? 'rgba(255,255,255,0.5)' : G,
      fontFamily: FONT, margin: 0,
    }}>{text}</p>
  )
}


// ── SECTION 01: HERO ─────────────────────────────────────────────────────────
// Desktop (1440×540) + Mobile (390px wide) sub-components

function HeroDesktop() {
  return (
    <div id="cs-01-hero-desktop" style={{
      width: 1440, height: 540,
      background: `linear-gradient(140deg, ${GS} 0%, ${W} 50%, ${GM} 100%)`,
      display: 'flex', alignItems: 'center',
      padding: '0 96px', gap: 72,
      position: 'relative', overflow: 'hidden',
      fontFamily: FONT,
    }}>
      {/* Soft radial glow */}
      <div style={{
        position: 'absolute', right: -100, top: '50%', transform: 'translateY(-50%)',
        width: 720, height: 720, borderRadius: '50%',
        background: `radial-gradient(circle, rgba(53,122,30,0.06) 0%, transparent 65%)`,
        pointerEvents: 'none',
      }} />

      {/* Left: copy */}
      <div style={{ flex: 1, zIndex: 1 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 32 }}>
          <GOLogo size={36} color={G} />
          <div style={{ width: 1, height: 24, background: GB }} />
          <span style={{ fontSize: 12, fontWeight: 700, color: G, textTransform: 'uppercase', letterSpacing: '1.4px', fontFamily: FONT }}>
            UX &amp; Product Design Case Study
          </span>
        </div>

        <h1 style={{
          fontSize: 52, fontWeight: 900, color: DARK,
          lineHeight: 1.06, letterSpacing: '-1.5px',
          margin: '0 0 20px', fontFamily: FONT,
        }}>
          Redesigning transit<br />for 70M+ annual riders
        </h1>

        <p style={{
          fontSize: 17, color: MID, lineHeight: 1.65,
          fontWeight: 500, maxWidth: 480, margin: '0 0 36px',
          fontFamily: FONT,
        }}>
          A school Figma prototype rebuilt into a 16-screen interactive app —
          complete payment flow, WCAG&nbsp;2.1&nbsp;AA accessibility, and full dark mode.
        </p>

        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
          {[
            ['7 → 16', 'Screens'],
            ['4 → 12+', 'Features'],
            ['WCAG 2.1 AA', 'Accessible'],
            ['5 Routes', 'Coverage'],
          ].map(([n, l]) => (
            <div key={n} style={{
              padding: '9px 18px', borderRadius: 100,
              background: W, border: `1.5px solid ${GB}`,
              boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
              display: 'flex', alignItems: 'center', gap: 6,
            }}>
              <span style={{ fontSize: 14, fontWeight: 900, color: G, fontFamily: FONT }}>{n}</span>
              <span style={{ fontSize: 13, fontWeight: 500, color: MID, fontFamily: FONT }}>{l}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Right: stacked phones */}
      <div style={{ display: 'flex', alignItems: 'flex-end', gap: 0, zIndex: 1, flexShrink: 0, paddingBottom: 20 }}>
        <div style={{ marginBottom: 40, opacity: 0.75, filter: 'saturate(0.85)' }}>
          <PhoneFrame src="/case-study/after/landing-light.png" alt="App landing screen" width={200} />
        </div>
        <div style={{ marginLeft: -28, zIndex: 2 }}>
          <PhoneFrame src="/case-study/after/landing-dark.png" alt="App landing dark mode" width={235} dark />
        </div>
      </div>
    </div>
  )
}

function HeroMobile() {
  return (
    <div id="cs-01-hero-mobile" style={{
      width: 390,
      background: `linear-gradient(165deg, ${GS} 0%, ${W} 60%, ${GM} 100%)`,
      padding: '48px 28px 40px',
      fontFamily: FONT,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 28 }}>
        <GOLogo size={28} color={G} />
        <span style={{ fontSize: 11, fontWeight: 700, color: G, textTransform: 'uppercase', letterSpacing: '1.2px' }}>
          Case Study
        </span>
      </div>

      <h1 style={{
        fontSize: 32, fontWeight: 900, color: DARK,
        lineHeight: 1.1, letterSpacing: '-1px',
        margin: '0 0 16px',
      }}>
        Redesigning transit for 70M+ riders
      </h1>

      <p style={{ fontSize: 15, color: MID, lineHeight: 1.6, margin: '0 0 28px' }}>
        A school Figma prototype rebuilt into a 16-screen interactive app.
      </p>

      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 28 }}>
        <PhoneFrame src="/case-study/after/landing-dark.png" alt="App dark mode" width={220} dark />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
        {[['7 → 16', 'Screens'], ['WCAG 2.1 AA', 'Accessible']].map(([n, l]) => (
          <div key={n} style={{
            padding: '10px 14px', borderRadius: 12,
            background: W, border: `1.5px solid ${GB}`,
            textAlign: 'center',
          }}>
            <p style={{ fontSize: 15, fontWeight: 900, color: G, margin: 0 }}>{n}</p>
            <p style={{ fontSize: 12, color: MID, margin: '2px 0 0' }}>{l}</p>
          </div>
        ))}
      </div>
    </div>
  )
}


// ── SECTION 02: THE STARTING POINT ───────────────────────────────────────────

function StartingPointHeader() {
  return (
    <div id="cs-02-header" style={{
      width: 1440, background: W,
      padding: '64px 96px 0',
      fontFamily: FONT,
    }}>
      <Eyebrow text="The Starting Point" />
      <h2 style={{
        fontSize: 38, fontWeight: 900, color: DARK,
        letterSpacing: '-1px', margin: '12px 0 14px',
      }}>
        7 static Figma screens — a concept, not a product
      </h2>
      <p style={{ fontSize: 16, color: MID, lineHeight: 1.65, maxWidth: 600, margin: 0 }}>
        A team of 3 surveyed 26 GO Transit commuters and built this for our Interactive Systems
        course. The research was solid. The prototype showed the idea — but couldn't do anything yet.
      </p>
    </div>
  )
}

function FigmaScreensGrid() {
  const screens = [
    { src: '/case-study/before/01-landing.png',        label: 'Landing' },
    { src: '/case-study/before/07-search.png',         label: 'Search Schedule' },
    { src: '/case-study/before/03-upcoming.png',       label: 'Upcoming Trips' },
    { src: '/case-study/before/02-trip-details.png',   label: 'Trip Details' },
    { src: '/case-study/before/04-eticket.png',        label: 'E-Ticket / Fares' },
    { src: '/case-study/before/06-service-updates.png',label: 'Service Updates' },
    { src: '/case-study/before/08-menu.png',           label: 'Menu' },
  ]
  return (
    <div id="cs-02-figma-grid" style={{
      width: 1440, background: W,
      padding: '36px 96px 0',
      display: 'flex', gap: 20, justifyContent: 'center',
      fontFamily: FONT,
    }}>
      {screens.map(s => <FigmaFrame key={s.src} src={s.src} label={s.label} width={160} />)}
    </div>
  )
}

function GapCards() {
  const gaps = [
    {
      n: '01',
      title: 'No payment flow',
      body: '"Buy Ticket" led nowhere. Users could explore — but couldn\'t actually purchase. The app was a brochure.',
    },
    {
      n: '02',
      title: 'No dark mode',
      body: 'Most GO rides happen at 6 AM or 6 PM. An app meant for commuters had no low-light consideration.',
    },
    {
      n: '03',
      title: 'One route only',
      body: 'Only the Stouffville Line. Four other GO lines and the Highway 407 bus were completely absent.',
    },
  ]
  return (
    <div id="cs-02-gap-cards" style={{
      width: 1440, background: W,
      padding: '32px 96px 64px',
      display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16,
      fontFamily: FONT,
    }}>
      {gaps.map(g => (
        <div key={g.n} style={{
          padding: '24px 26px', borderRadius: 16,
          background: SURF, border: `1px solid ${BDR}`,
        }}>
          <span style={{
            fontSize: 11, fontWeight: 800, color: MUT,
            letterSpacing: '0.5px', fontFamily: FONT,
          }}>Gap {g.n}</span>
          <p style={{ fontSize: 16, fontWeight: 800, color: DARK, margin: '10px 0 8px', fontFamily: FONT }}>{g.title}</p>
          <p style={{ fontSize: 14, color: MID, lineHeight: 1.6, margin: 0, fontFamily: FONT }}>{g.body}</p>
        </div>
      ))}
    </div>
  )
}


// ── SECTION 03: BEFORE / AFTER — HOMEPAGE ────────────────────────────────────

function BeforePhone() {
  return (
    <div id="cs-03-before-phone" style={{
      background: '#fafbfa',
      padding: '48px 56px 40px',
      display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 24,
      fontFamily: FONT,
    }}>
      <Tag text="Before — Figma Prototype" red />
      <FigmaFrame src="/case-study/before/01-landing.png" alt="Original landing" width={240} label="" />
      <div style={{ textAlign: 'center', maxWidth: 260 }}>
        <p style={{ fontSize: 15, fontWeight: 700, color: DARK, margin: '0 0 8px', fontFamily: FONT }}>
          3 taps to see next departure
        </p>
        <p style={{ fontSize: 13, color: MUT, lineHeight: 1.55, margin: 0, fontFamily: FONT }}>
          "New Trip?" button buried under uniform flat cards. No greeting, no live data, no urgency.
        </p>
      </div>
    </div>
  )
}

function AfterPhone() {
  return (
    <div id="cs-03-after-phone" style={{
      background: GS,
      padding: '48px 56px 40px',
      display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 24,
      fontFamily: FONT,
    }}>
      <Tag text="After — React Prototype v4.4" />
      <PhoneFrame src="/case-study/after/landing-light.png" alt="Redesigned landing" width={240} />
      <div style={{ textAlign: 'center', maxWidth: 280 }}>
        <p style={{ fontSize: 15, fontWeight: 700, color: DARK, margin: '0 0 8px', fontFamily: FONT }}>
          0 taps — next train visible on load
        </p>
        <p style={{ fontSize: 13, color: MID, lineHeight: 1.55, margin: 0, fontFamily: FONT }}>
          Time-of-day greeting, live countdown, one-tap trip planning. The homepage now answers
          the commuter's #1 question before they have to ask.
        </p>
      </div>
    </div>
  )
}

function InsightBar() {
  return (
    <div id="cs-03-insight" style={{
      width: '100%', background: DARK,
      padding: '18px 48px',
      display: 'flex', alignItems: 'center', gap: 16,
      fontFamily: FONT,
    }}>
      <div style={{ width: 32, height: 32, borderRadius: 10, background: G, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
        <span style={{ fontSize: 15, color: W }}>✦</span>
      </div>
      <p style={{ fontSize: 14, fontWeight: 600, color: W, margin: 0, fontFamily: FONT }}>
        Design decision: Answer "when's my next train?" before the user has to search for it.
        Reduced taps to departure info from 3 to 0.
      </p>
    </div>
  )
}

function BeforeAfterHomepage() {
  return (
    <div id="cs-03-before-after" style={{ width: 1440, fontFamily: FONT, overflow: 'hidden' }}>
      {/* Split panels */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1px 1fr' }}>
        <BeforePhone />
        <div style={{ background: BDR, position: 'relative' }}>
          <div style={{
            position: 'absolute', top: '50%', left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 44, height: 44, borderRadius: '50%',
            background: DARK, color: W,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 12, fontWeight: 900, fontFamily: FONT,
            boxShadow: '0 4px 16px rgba(0,0,0,0.25)',
            zIndex: 2,
          }}>VS</div>
        </div>
        <AfterPhone />
      </div>
      <InsightBar />
    </div>
  )
}


// ── SECTION 04: THREE DECISIONS THAT MATTERED ────────────────────────────────

function DecisionCard({
  id, num, title, problem, decision, outcome,
}: {
  id: string; num: string; title: string; problem: string; decision: string; outcome: string
}) {
  return (
    <div id={id} style={{
      flex: 1,
      padding: '32px 28px', borderRadius: 20,
      background: '#1e2227', border: '1px solid #2a2f37',
      display: 'flex', flexDirection: 'column', gap: 20,
      fontFamily: FONT,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <div style={{
          width: 36, height: 36, borderRadius: 10,
          background: G, display: 'flex', alignItems: 'center', justifyContent: 'center',
          flexShrink: 0,
        }}>
          <span style={{ fontSize: 14, fontWeight: 900, color: W, fontFamily: FONT }}>{num}</span>
        </div>
        <h3 style={{ fontSize: 18, fontWeight: 800, color: W, margin: 0, lineHeight: 1.2, fontFamily: FONT }}>{title}</h3>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        {[
          { label: 'Problem', text: problem, c: '#f87171' },
          { label: 'Decision', text: decision, c: '#86efac' },
          { label: 'Outcome', text: outcome, c: '#93c5fd' },
        ].map(r => (
          <div key={r.label}>
            <p style={{
              fontSize: 10, fontWeight: 800, color: r.c,
              textTransform: 'uppercase', letterSpacing: '0.8px',
              margin: '0 0 5px', fontFamily: FONT,
            }}>{r.label}</p>
            <p style={{ fontSize: 14, color: '#d1d5db', lineHeight: 1.55, margin: 0, fontFamily: FONT }}>{r.text}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

function ThreeDecisions() {
  return (
    <div id="cs-04-decisions" style={{
      width: 1440, background: DARK,
      padding: '72px 96px 80px',
      fontFamily: FONT,
    }}>
      <div style={{ marginBottom: 52 }}>
        <Eyebrow text="Design Decisions" light />
        <h2 style={{
          fontSize: 38, fontWeight: 900, color: W,
          letterSpacing: '-1px', margin: '12px 0 0',
        }}>
          Three decisions that made the difference
        </h2>
      </div>

      <div id="cs-04-decisions-row" style={{ display: 'flex', gap: 20 }}>
        <DecisionCard
          id="cs-04-decision-1"
          num="01"
          title="Homepage as command centre"
          problem="The original landing page made users hunt for their next departure — 3 taps minimum."
          decision="Redesigned the homepage to answer 'when's my next train?' instantly. Live countdown visible on load, with a clear CTA for planning a new trip."
          outcome="0 taps to departure info (was 3). The homepage now does the work the commuter used to do."
        />
        <DecisionCard
          id="cs-04-decision-2"
          num="02"
          title="Brochure → transactional product"
          problem="'Calculate Fare' led nowhere. Users couldn't buy a ticket. The prototype had no purchase flow."
          decision="Built the complete end-to-end flow: Fares → Payment (PRESTO/Visa) → Processing → QR Ticket → Apple Wallet → Active Trip on home screen."
          outcome="The app became a product, not a prototype. A ticket can be purchased in under 60 seconds."
        />
        <DecisionCard
          id="cs-04-decision-3"
          num="03"
          title="Severity legible before you read"
          problem="All service alerts looked identical — same card style, same colour. A 5-minute delay looked the same as a full cancellation."
          decision="Coded alerts by urgency: orange for disruptions, blue for info. The colour communicates severity before a word is read."
          outcome="Users can triage alerts in under 2 seconds. Critical disruptions can't be missed."
        />
      </div>
    </div>
  )
}


// ── SECTION 05: BUILT FOR EVERY RIDER ────────────────────────────────────────

function BuiltForEveryRider() {
  return (
    <div id="cs-05-every-rider" style={{
      width: 1440, height: 580, background: DARK2,
      display: 'flex', alignItems: 'center',
      padding: '0 96px', gap: 80,
      position: 'relative', overflow: 'hidden',
      fontFamily: FONT,
    }}>
      {/* Glow */}
      <div style={{
        position: 'absolute', left: '50%', top: '50%',
        transform: 'translate(-50%,-50%)',
        width: 700, height: 700, borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(53,122,30,0.07) 0%, transparent 60%)',
        pointerEvents: 'none',
      }} />

      {/* Phones */}
      <div id="cs-05-phones" style={{ display: 'flex', gap: 20, zIndex: 1, alignItems: 'center', flexShrink: 0 }}>
        <div id="cs-05-dark-phone" style={{ marginTop: 32 }}>
          <PhoneFrame src="/case-study/after/landing-dark.png" alt="Dark mode landing" width={210} dark />
        </div>
        <div id="cs-05-access-phone">
          <PhoneFrame src="/case-study/after/service-updates.png" alt="Service updates" width={210} dark />
        </div>
      </div>

      {/* Copy */}
      <div id="cs-05-copy" style={{ flex: 1, zIndex: 1 }}>
        <Eyebrow text="Dark Mode &amp; Accessibility" light />
        <h2 style={{
          fontSize: 38, fontWeight: 900, color: W,
          letterSpacing: '-0.8px', lineHeight: 1.15,
          margin: '12px 0 18px',
        }}>
          Built for the 6 AM commuter<br />and every rider after them
        </h2>
        <p style={{
          fontSize: 16, color: 'rgba(255,255,255,0.55)',
          lineHeight: 1.7, maxWidth: 440, margin: '0 0 36px',
        }}>
          Peak GO hours are 6–9 AM and 4–7 PM — low light at both ends. Dark mode isn't a cosmetic
          feature. Every screen, every component, every state is fully themed. And GO Transit serves
          all of Ontario — WCAG 2.1 AA compliance isn't optional.
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {[
            'Full dark mode — toggled in Settings, persists across sessions',
            'All 16 screens tested and verified in both themes',
            'WCAG 2.1 AA contrast ratios maintained in light and dark',
            'Minimum 44×44px touch targets throughout',
            'Screen reader support with ARIA labels and roles',
          ].map(item => (
            <div key={item} style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
              <div style={{
                width: 18, height: 18, borderRadius: '50%',
                background: 'rgba(53,122,30,0.2)', border: `1px solid ${G}`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                flexShrink: 0, marginTop: 2,
              }}>
                <span style={{ fontSize: 10, color: G, fontWeight: 800 }}>✓</span>
              </div>
              <span style={{ fontSize: 14, color: 'rgba(255,255,255,0.65)', lineHeight: 1.5, fontFamily: FONT }}>{item}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}


// ── SECTION 06: THE COMPLETE JOURNEY ─────────────────────────────────────────

function JourneyHeader() {
  return (
    <div id="cs-06-header" style={{
      width: 1440, background: W,
      padding: '64px 96px 40px',
      fontFamily: FONT,
    }}>
      <Eyebrow text="The Complete Journey" />
      <h2 style={{
        fontSize: 38, fontWeight: 900, color: DARK,
        letterSpacing: '-1px', margin: '12px 0 14px',
      }}>
        Home → Search → Details → Pay → Ticket
      </h2>
      <p style={{ fontSize: 16, color: MID, lineHeight: 1.6, maxWidth: 600, margin: 0 }}>
        Every step a GO Transit rider takes — from opening the app to holding their boarding
        pass — is complete and interactive.
      </p>
    </div>
  )
}

function JourneyPhones() {
  const steps: { id: string; src: string; label: string; sub: string }[] = [
    { id: 'cs-06-step-1', src: '/case-study/after/landing-light.png',       label: 'Home',    sub: 'Next train visible instantly' },
    { id: 'cs-06-step-2', src: '/case-study/after/search-results.png',      label: 'Search',  sub: 'Results with live times' },
    { id: 'cs-06-step-3', src: '/case-study/after/trip-details.png',        label: 'Details', sub: 'Custom map, stops, platform' },
    { id: 'cs-06-step-4', src: '/case-study/after/payment.png',             label: 'Pay',     sub: 'PRESTO, Visa, or new card' },
    { id: 'cs-06-step-5', src: '/case-study/after/ticket-confirmation.png', label: 'Ticket',  sub: 'QR code + Apple Wallet' },
  ]

  return (
    <div id="cs-06-phones" style={{
      width: 1440, background: W,
      padding: '0 96px 72px',
      display: 'flex', gap: 24, alignItems: 'flex-start',
      fontFamily: FONT,
    }}>
      {steps.map((step, i) => (
        <div key={step.id} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 0 }}>
          {/* Step number + connector */}
          <div style={{ display: 'flex', alignItems: 'center', width: '100%', marginBottom: 16 }}>
            <div style={{
              width: 32, height: 32, borderRadius: '50%',
              background: G, color: W, flexShrink: 0,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 13, fontWeight: 800, fontFamily: FONT,
            }}>{i + 1}</div>
            {i < steps.length - 1 && (
              <div style={{ flex: 1, height: 2, background: `linear-gradient(90deg, ${G} 0%, ${GB} 100%)`, marginLeft: 8 }} />
            )}
          </div>

          {/* Phone */}
          <div id={step.id} style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
            <PhoneFrame src={step.src} alt={step.label} width={218} />
          </div>

          {/* Labels */}
          <div style={{ textAlign: 'center', marginTop: 16 }}>
            <p style={{ fontSize: 14, fontWeight: 800, color: DARK, margin: '0 0 4px', fontFamily: FONT }}>{step.label}</p>
            <p style={{ fontSize: 12, color: MUT, margin: 0, fontFamily: FONT }}>{step.sub}</p>
          </div>
        </div>
      ))}
    </div>
  )
}

function CompleteJourney() {
  return (
    <div style={{ width: 1440, background: W, fontFamily: FONT }}>
      {/* Green accent strip */}
      <div style={{ height: 4, background: `linear-gradient(90deg, ${G} 0%, ${GM} 100%)` }} />
      <JourneyHeader />
      <JourneyPhones />
    </div>
  )
}


// ── NAV + MAIN SHOWCASE ───────────────────────────────────────────────────────

type AssetDef = { id: string; name: string; wide?: boolean }

const ASSETS: AssetDef[] = [
  { id: '01', name: 'Hero' },
  { id: '02', name: 'Starting Point' },
  { id: '03', name: 'Before / After: Homepage' },
  { id: '04', name: 'Three Decisions' },
  { id: '05', name: 'Built For Every Rider' },
  { id: '06', name: 'Complete Journey' },
]

function ShowcaseNav({ current, setCurrent }: { current: number; setCurrent: (n: number) => void }) {
  return (
    <div style={{
      position: 'sticky', top: 0, zIndex: 100,
      background: 'rgba(10,10,10,0.96)', backdropFilter: 'blur(14px)',
      borderBottom: '1px solid #1a1a1a',
      padding: '12px 28px',
    }}>
      <div style={{
        display: 'flex', alignItems: 'center',
        justifyContent: 'space-between', maxWidth: 1500, margin: '0 auto',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <GOLogo size={18} color={G} />
          <span style={{ fontSize: 12, fontWeight: 700, color: '#9ca3af', fontFamily: FONT }}>
            Case Study Assets
          </span>
          <span style={{ fontSize: 12, color: '#4b5563' }}>·</span>
          <span style={{ fontSize: 12, color: '#6b7280', fontFamily: FONT }}>
            {current + 1} / {ASSETS.length}
          </span>
        </div>

        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', justifyContent: 'flex-end' }}>
          {ASSETS.map((a, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              style={{
                padding: '5px 13px', borderRadius: 8, border: 'none', cursor: 'pointer',
                background: current === i ? G : '#1e2227',
                color: current === i ? W : '#9ca3af',
                fontSize: 11, fontWeight: 700, fontFamily: FONT,
                transition: 'background 0.15s',
              }}
            >
              {a.id} {a.name}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

function AssetView({ index }: { index: number }) {
  switch (index) {
    case 0: return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 32, alignItems: 'center' }}>
        <div style={{ borderRadius: 12, overflow: 'hidden', boxShadow: '0 24px 80px rgba(0,0,0,0.5)' }}>
          <HeroDesktop />
        </div>
        <div style={{ borderRadius: 12, overflow: 'hidden', boxShadow: '0 16px 48px rgba(0,0,0,0.4)' }}>
          <HeroMobile />
        </div>
      </div>
    )
    case 1: return (
      <div style={{ borderRadius: 12, overflow: 'hidden', boxShadow: '0 24px 80px rgba(0,0,0,0.5)', background: W }}>
        <StartingPointHeader />
        <FigmaScreensGrid />
        <GapCards />
      </div>
    )
    case 2: return (
      <div style={{ borderRadius: 12, overflow: 'hidden', boxShadow: '0 24px 80px rgba(0,0,0,0.5)' }}>
        <BeforeAfterHomepage />
      </div>
    )
    case 3: return (
      <div style={{ borderRadius: 12, overflow: 'hidden', boxShadow: '0 24px 80px rgba(0,0,0,0.5)' }}>
        <ThreeDecisions />
      </div>
    )
    case 4: return (
      <div style={{ borderRadius: 12, overflow: 'hidden', boxShadow: '0 24px 80px rgba(0,0,0,0.5)' }}>
        <BuiltForEveryRider />
      </div>
    )
    case 5: return (
      <div style={{ borderRadius: 12, overflow: 'hidden', boxShadow: '0 24px 80px rgba(0,0,0,0.5)' }}>
        <CompleteJourney />
      </div>
    )
    default: return null
  }
}

export default function CaseStudyAssets() {
  useInter()
  const [current, setCurrent] = useState(0)

  return (
    <div style={{ minHeight: '100vh', background: '#0a0a0a', fontFamily: FONT }}>
      <ShowcaseNav current={current} setCurrent={setCurrent} />

      <div style={{
        padding: '48px 24px 80px',
        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16,
      }}>
        <AssetView index={current} />

        {/* Screenshot hint */}
        <div style={{
          display: 'flex', gap: 20, alignItems: 'center',
          padding: '10px 20px', borderRadius: 10,
          background: '#111', border: '1px solid #1e1e1e',
          marginTop: 8,
        }}>
          <span style={{ fontSize: 12, color: '#6b7280', fontFamily: FONT }}>
            Puppeteer screenshots each sub-component by ID → saved to{' '}
            <code style={{ color: G }}>Documents/GO Transit Case Study/assets/</code>
          </span>
        </div>
      </div>
    </div>
  )
}
