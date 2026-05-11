import { useState } from 'react'

/**
 * Case Study Visual Assets Page
 * Access at: /?showcase=true
 *
 * Contains screenshot-ready visual compositions for the portfolio case study.
 * Each section is a self-contained visual that can be screenshotted individually.
 */

// Mini phone frame for showcasing screens
// PhoneFrame components available for future use if needed

// ─── ASSET 1: Hero Composition ───
function HeroAsset() {
  return (
    <div
      id="asset-hero"
      style={{
        width: 1200,
        height: 800,
        background: 'linear-gradient(135deg, #f0f7ec 0%, #ffffff 50%, #e6f2e0 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        overflow: 'hidden',
        padding: 60,
      }}
    >
      {/* Background pattern */}
      <div style={{ position: 'absolute', inset: 0, opacity: 0.04 }}>
        {Array.from({ length: 20 }).map((_, i) => (
          <div key={i} style={{
            position: 'absolute',
            left: `${(i * 7) % 100}%`,
            top: `${(i * 13) % 100}%`,
            width: 200,
            height: 200,
            borderRadius: '50%',
            background: '#357a1e',
          }} />
        ))}
      </div>

      {/* Left content */}
      <div style={{ flex: 1, maxWidth: 400, zIndex: 1 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
          <svg width="88" height="42" viewBox="-23 -11 46 22" xmlns="http://www.w3.org/2000/svg">
            <defs><clipPath id="go-hero"><path d="m-23-11h46v22h-46zM23 1v-2h-34v-10h-2v22h2V1z"/></clipPath></defs>
            <path clipPath="url(#go-hero)" fill="#357a1e" d="m-1 0a11 11 0 1 0-11 11h11zm2 0a1 1 0 0 0 22 0A1 1 0 0 0 1 0z"/>
          </svg>
          <span style={{ fontSize: 14, fontWeight: 700, color: '#357a1e', textTransform: 'uppercase', letterSpacing: '1.5px' }}>Mobile App Design</span>
        </div>
        <h1 style={{ fontSize: 42, fontWeight: 900, color: '#1a1d21', lineHeight: 1.1, letterSpacing: '-1px', marginBottom: 20 }}>
          Simplifying daily transit for 70M+ riders
        </h1>
        <p style={{ fontSize: 17, color: '#555b64', lineHeight: 1.6, fontWeight: 500, marginBottom: 32 }}>
          A mobile-first GO Transit experience with saved trips, proactive alerts, and streamlined fare payment.
        </p>
        <div style={{ display: 'flex', gap: 24 }}>
          <div>
            <div style={{ fontSize: 32, fontWeight: 900, color: '#357a1e' }}>100%</div>
            <div style={{ fontSize: 12, fontWeight: 600, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Task Completion</div>
          </div>
          <div>
            <div style={{ fontSize: 32, fontWeight: 900, color: '#357a1e' }}>67%</div>
            <div style={{ fontSize: 12, fontWeight: 600, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Faster</div>
          </div>
          <div>
            <div style={{ fontSize: 32, fontWeight: 900, color: '#357a1e' }}>89%</div>
            <div style={{ fontSize: 12, fontWeight: 600, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Fewer Misclicks</div>
          </div>
        </div>
      </div>

      {/* Right: Phone mockups */}
      <div style={{ display: 'flex', gap: -20, alignItems: 'center', zIndex: 2 }}>
        {/* Main phone - Landing */}
        <div style={{
          width: 280,
          height: 580,
          borderRadius: 36,
          background: '#fff',
          boxShadow: '0 40px 80px rgba(0,0,0,0.2), 0 0 0 1px rgba(0,0,0,0.08)',
          overflow: 'hidden',
          position: 'relative',
          zIndex: 3,
        }}>
          {/* Simulated landing screen */}
          <div style={{ padding: '48px 20px 20px', height: '100%' }}>
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 20 }}>
              <svg width="60" height="28" viewBox="-23 -11 46 22"><defs><clipPath id="go-ph1"><path d="m-23-11h46v22h-46zM23 1v-2h-34v-10h-2v22h2V1z"/></clipPath></defs><path clipPath="url(#go-ph1)" fill="#357a1e" d="m-1 0a11 11 0 1 0-11 11h11zm2 0a1 1 0 0 0 22 0A1 1 0 0 0 1 0z"/></svg>
            </div>
            <p style={{ fontSize: 11, color: '#6b7280', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Good morning</p>
            <h2 style={{ fontSize: 20, fontWeight: 900, color: '#1a1d21', marginTop: 2 }}>Where are you headed?</h2>
            {/* Next train card */}
            <div style={{ marginTop: 16, borderRadius: 16, border: '1.5px solid #d5e6cc', padding: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                <div style={{ width: 32, height: 32, borderRadius: 8, background: '#357a1e', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <span style={{ color: 'white', fontSize: 14 }}>🚆</span>
                </div>
                <div>
                  <span style={{ fontSize: 9, fontWeight: 800, color: '#357a1e', textTransform: 'uppercase' }}>Next Train</span>
                  <span style={{ fontSize: 9, fontWeight: 700, color: '#357a1e', background: '#e6f2e0', borderRadius: 6, padding: '1px 6px', marginLeft: 6 }}>12 min</span>
                </div>
              </div>
              <p style={{ fontSize: 16, fontWeight: 900, color: '#1a1d21' }}>10:54 AM – 11:29 AM</p>
              <p style={{ fontSize: 11, color: '#555b64', marginTop: 2 }}>Miliken GO → Union Station GO</p>
              <p style={{ fontSize: 10, color: '#6b7280' }}>Stouffville Line</p>
            </div>
            {/* Plan trip button */}
            <div style={{ marginTop: 14, borderRadius: 16, background: '#357a1e', padding: '14px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: 14, fontWeight: 800, color: 'white' }}>Plan a New Trip</span>
              <div style={{ width: 28, height: 28, borderRadius: '50%', background: 'rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <span style={{ color: 'white', fontSize: 14 }}>→</span>
              </div>
            </div>
            {/* Quick links */}
            <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
              <div style={{ flex: 1, padding: '10px', borderRadius: 10, background: '#f0f7ec', border: '1px solid #d5e6cc', textAlign: 'center' }}>
                <span style={{ fontSize: 11, fontWeight: 700, color: '#357a1e' }}>Fares</span>
              </div>
              <div style={{ flex: 1, padding: '10px', borderRadius: 10, background: '#f0f7ec', border: '1px solid #d5e6cc', textAlign: 'center' }}>
                <span style={{ fontSize: 11, fontWeight: 700, color: '#357a1e' }}>Alerts</span>
              </div>
            </div>
            {/* Saved trips */}
            <div style={{ marginTop: 16 }}>
              <p style={{ fontSize: 14, fontWeight: 800, color: '#1a1d21', marginBottom: 8 }}>Saved Trips</p>
              <div style={{ borderRadius: 12, padding: '12px', background: '#f4f7f3', border: '1px solid #e2e4e7', marginBottom: 8 }}>
                <p style={{ fontSize: 12, fontWeight: 800, color: '#1a1d21' }}>Miliken GO → Union Station GO</p>
                <p style={{ fontSize: 10, color: '#555b64' }}>Stouffville</p>
              </div>
              <div style={{ borderRadius: 12, padding: '12px', background: '#f4f7f3', border: '1px solid #e2e4e7' }}>
                <p style={{ fontSize: 12, fontWeight: 800, color: '#1a1d21' }}>Union Station GO → Miliken GO</p>
                <p style={{ fontSize: 10, color: '#555b64' }}>Stouffville</p>
              </div>
            </div>
          </div>
        </div>

        {/* Secondary phone - Trip Details (offset behind) */}
        <div style={{
          width: 240,
          height: 500,
          borderRadius: 32,
          background: '#fff',
          boxShadow: '0 30px 60px rgba(0,0,0,0.15)',
          overflow: 'hidden',
          position: 'relative',
          zIndex: 2,
          marginLeft: -40,
          marginTop: 60,
        }}>
          <div style={{ padding: '40px 16px 16px', height: '100%' }}>
            {/* Map area */}
            <div style={{ height: 100, background: '#f0f7ec', borderRadius: 12, marginBottom: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
              <svg width="100%" height="100%" viewBox="0 0 200 100">
                <line x1="30" y1="80" x2="170" y2="20" stroke="#357a1e" strokeWidth="3" strokeLinecap="round"/>
                <circle cx="30" cy="80" r="5" fill="#357a1e"/>
                <circle cx="100" cy="50" r="3" fill="white" stroke="#357a1e" strokeWidth="1.5"/>
                <circle cx="170" cy="20" r="5" fill="#357a1e"/>
              </svg>
            </div>
            <p style={{ fontSize: 15, fontWeight: 900, color: '#1a1d21' }}>10:54 AM – 11:29 AM</p>
            <p style={{ fontSize: 13, fontWeight: 800, color: '#1a1d21', marginTop: 2 }}>Stouffville Line</p>
            <p style={{ fontSize: 10, color: '#6b7280', marginTop: 2 }}>Trip time: 35 min · 5 stops</p>
            {/* Service Alert */}
            <div style={{ marginTop: 12, borderRadius: 10, overflow: 'hidden' }}>
              <div style={{ background: '#c2410c', padding: '6px 12px', display: 'flex', alignItems: 'center', gap: 6 }}>
                <span style={{ fontSize: 10, fontWeight: 800, color: 'white' }}>Service Alert</span>
              </div>
              <div style={{ padding: '8px 12px', background: '#fff7ed', border: '1px solid #fed7aa', borderTop: 'none', borderRadius: '0 0 10px 10px' }}>
                <p style={{ fontSize: 9, fontWeight: 700, color: '#1a1d21' }}>Track maintenance</p>
                <p style={{ fontSize: 8, color: '#555', lineHeight: 1.3 }}>Expect delays of 5-10 min</p>
              </div>
            </div>
            {/* Fare */}
            <div style={{ marginTop: 12, borderRadius: 10, overflow: 'hidden' }}>
              <div style={{ background: '#357a1e', padding: '6px 12px' }}>
                <span style={{ fontSize: 10, fontWeight: 800, color: 'white' }}>Fare Details</span>
              </div>
              <div style={{ padding: '10px 12px', background: '#f4f7f3', border: '1px solid #d5e6cc', borderTop: 'none', borderRadius: '0 0 10px 10px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: 10, color: '#555' }}>E-Ticket</span>
                  <span style={{ fontSize: 14, fontWeight: 900, color: '#1a1d21' }}>$9.05</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── ASSET 2: Metrics / Impact Visual ───
function MetricsAsset() {
  return (
    <div
      id="asset-metrics"
      style={{
        width: 1200,
        height: 500,
        background: '#1a1d21',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 80,
        gap: 60,
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Subtle background glow */}
      <div style={{ position: 'absolute', width: 600, height: 600, borderRadius: '50%', background: 'radial-gradient(circle, rgba(53,122,30,0.12) 0%, transparent 70%)', top: '50%', left: '50%', transform: 'translate(-50%,-50%)' }} />

      <div style={{ textAlign: 'center', zIndex: 1 }}>
        <p style={{ fontSize: 14, fontWeight: 700, color: '#357a1e', textTransform: 'uppercase', letterSpacing: '2px', marginBottom: 12 }}>Usability Testing Results</p>
        <h2 style={{ fontSize: 36, fontWeight: 900, color: '#f0f1f3', letterSpacing: '-0.5px', marginBottom: 60 }}>Measurable Impact on Commuter Experience</h2>

        <div style={{ display: 'flex', gap: 80, justifyContent: 'center' }}>
          {/* Metric 1 */}
          <div style={{ textAlign: 'center' }}>
            <div style={{ width: 160, height: 160, borderRadius: '50%', border: '4px solid #357a1e', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: 'rgba(53,122,30,0.08)' }}>
              <span style={{ fontSize: 48, fontWeight: 900, color: '#357a1e' }}>100%</span>
            </div>
            <p style={{ fontSize: 15, fontWeight: 700, color: '#f0f1f3', marginTop: 16 }}>Task Completion</p>
            <p style={{ fontSize: 13, color: '#6b7280', marginTop: 4 }}>vs ~75% on current website</p>
          </div>

          {/* Metric 2 */}
          <div style={{ textAlign: 'center' }}>
            <div style={{ width: 160, height: 160, borderRadius: '50%', border: '4px solid #357a1e', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: 'rgba(53,122,30,0.08)' }}>
              <span style={{ fontSize: 48, fontWeight: 900, color: '#357a1e' }}>67%</span>
            </div>
            <p style={{ fontSize: 15, fontWeight: 700, color: '#f0f1f3', marginTop: 16 }}>Faster Completion</p>
            <p style={{ fontSize: 13, color: '#6b7280', marginTop: 4 }}>18s vs 54s on website</p>
          </div>

          {/* Metric 3 */}
          <div style={{ textAlign: 'center' }}>
            <div style={{ width: 160, height: 160, borderRadius: '50%', border: '4px solid #357a1e', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: 'rgba(53,122,30,0.08)' }}>
              <span style={{ fontSize: 48, fontWeight: 900, color: '#357a1e' }}>89%</span>
            </div>
            <p style={{ fontSize: 15, fontWeight: 700, color: '#f0f1f3', marginTop: 16 }}>Fewer Misclicks</p>
            <p style={{ fontSize: 13, color: '#6b7280', marginTop: 4 }}>2% vs 18% error rate</p>
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── ASSET 3: Feature Highlights (3 columns) ───
function FeatureHighlightsAsset() {
  return (
    <div
      id="asset-features"
      style={{
        width: 1200,
        height: 700,
        background: '#ffffff',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: '60px 60px 40px',
        gap: 40,
      }}
    >
      <div style={{ textAlign: 'center' }}>
        <p style={{ fontSize: 13, fontWeight: 700, color: '#357a1e', textTransform: 'uppercase', letterSpacing: '1.5px', marginBottom: 8 }}>Core Features</p>
        <h2 style={{ fontSize: 32, fontWeight: 900, color: '#1a1d21', letterSpacing: '-0.5px' }}>Three Problems, Three Solutions</h2>
      </div>

      <div style={{ display: 'flex', gap: 40, flex: 1, width: '100%' }}>
        {/* Feature 1: Saved Trips */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: 16 }}>
          <div style={{ width: 280, flex: 1, borderRadius: 32, background: '#f0f7ec', border: '1px solid #d5e6cc', padding: 20, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
            {/* Mini card preview */}
            <div style={{ width: '100%', borderRadius: 16, background: 'white', padding: 16, border: '1.5px solid #d5e6cc', boxShadow: '0 4px 16px rgba(0,0,0,0.06)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
                <div style={{ width: 36, height: 36, borderRadius: 10, background: '#357a1e', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <span style={{ color: 'white', fontSize: 16 }}>🚆</span>
                </div>
                <div>
                  <span style={{ fontSize: 10, fontWeight: 800, color: '#357a1e', textTransform: 'uppercase' }}>Next Train</span>
                  <span style={{ fontSize: 10, fontWeight: 700, color: '#357a1e', background: '#e6f2e0', borderRadius: 6, padding: '1px 6px', marginLeft: 4 }}>12 min</span>
                </div>
              </div>
              <p style={{ fontSize: 18, fontWeight: 900, color: '#1a1d21' }}>10:54 AM</p>
              <p style={{ fontSize: 12, color: '#555b64', marginTop: 2 }}>Miliken → Union Station</p>
              <p style={{ fontSize: 11, color: '#6b7280' }}>Stouffville Line</p>
            </div>
          </div>
          <div>
            <h3 style={{ fontSize: 18, fontWeight: 800, color: '#1a1d21', marginBottom: 6 }}>Saved Trips Dashboard</h3>
            <p style={{ fontSize: 14, color: '#555b64', lineHeight: 1.5 }}>One-tap access to regular routes with real-time departure times</p>
          </div>
        </div>

        {/* Feature 2: Service Alerts */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: 16 }}>
          <div style={{ width: 280, flex: 1, borderRadius: 32, background: '#f0f7ec', border: '1px solid #d5e6cc', padding: 20, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ width: '100%', borderRadius: 16, background: 'white', overflow: 'hidden', boxShadow: '0 4px 16px rgba(0,0,0,0.06)' }}>
              <div style={{ background: '#c2410c', padding: '10px 16px', display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ fontSize: 14 }}>⚠️</span>
                <span style={{ fontSize: 13, fontWeight: 800, color: 'white' }}>Service Alert</span>
              </div>
              <div style={{ padding: 16 }}>
                <p style={{ fontSize: 14, fontWeight: 700, color: '#1a1d21', marginBottom: 4 }}>Track maintenance near Pickering</p>
                <p style={{ fontSize: 12, color: '#555b64', lineHeight: 1.4 }}>Expect delays of 5-10 min between Scarborough GO and Pickering GO</p>
                <div style={{ marginTop: 12, padding: '6px 12px', borderRadius: 8, background: '#fff7ed', border: '1px solid #fed7aa', display: 'inline-block' }}>
                  <span style={{ fontSize: 11, fontWeight: 700, color: '#c2410c' }}>May 7–14</span>
                </div>
              </div>
            </div>
          </div>
          <div>
            <h3 style={{ fontSize: 18, fontWeight: 800, color: '#1a1d21', marginBottom: 6 }}>Proactive Service Alerts</h3>
            <p style={{ fontSize: 14, color: '#555b64', lineHeight: 1.5 }}>Push notifications for delays on saved lines — no manual checking</p>
          </div>
        </div>

        {/* Feature 3: Fare Payment */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: 16 }}>
          <div style={{ width: 280, flex: 1, borderRadius: 32, background: '#f0f7ec', border: '1px solid #d5e6cc', padding: 20, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ width: '100%', borderRadius: 16, background: 'white', padding: 16, boxShadow: '0 4px 16px rgba(0,0,0,0.06)', border: '1px solid #e2e4e7' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 12 }}>
                <div>
                  <p style={{ fontSize: 13, fontWeight: 700, color: '#1a1d21' }}>E-Ticket Price</p>
                  <p style={{ fontSize: 11, color: '#6b7280' }}>1 Adult</p>
                </div>
                <span style={{ fontSize: 24, fontWeight: 900, color: '#1a1d21' }}>$9.05</span>
              </div>
              <div style={{ borderRadius: 12, background: '#357a1e', padding: '12px', textAlign: 'center' }}>
                <span style={{ fontSize: 14, fontWeight: 800, color: 'white' }}>🔒 Buy E-Ticket</span>
              </div>
              <div style={{ marginTop: 12, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                <div>
                  <p style={{ fontSize: 13, fontWeight: 700, color: '#1a1d21' }}>PRESTO Fare</p>
                  <p style={{ fontSize: 11, color: '#6b7280' }}>1 Adult</p>
                </div>
                <span style={{ fontSize: 20, fontWeight: 900, color: '#1a1d21' }}>$7.62</span>
              </div>
            </div>
          </div>
          <div>
            <h3 style={{ fontSize: 18, fontWeight: 800, color: '#1a1d21', marginBottom: 6 }}>Streamlined Fare Payment</h3>
            <p style={{ fontSize: 14, color: '#555b64', lineHeight: 1.5 }}>See costs upfront, compare options, and buy tickets in-app</p>
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── ASSET 4: Before/After Comparison ───
function BeforeAfterAsset() {
  return (
    <div
      id="asset-before-after"
      style={{
        width: 1200,
        height: 700,
        background: '#f8f9fa',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 60,
        gap: 80,
        position: 'relative',
      }}
    >
      {/* Before */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 24 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#dc2626' }} />
          <span style={{ fontSize: 14, fontWeight: 800, color: '#dc2626', textTransform: 'uppercase', letterSpacing: '1px' }}>Before — Mobile Website</span>
        </div>
        <div style={{
          width: 300,
          height: 520,
          borderRadius: 32,
          background: '#fff',
          boxShadow: '0 20px 60px rgba(0,0,0,0.12)',
          overflow: 'hidden',
          border: '1px solid #e2e4e7',
          padding: '40px 16px 16px',
        }}>
          {/* Simulated messy mobile website */}
          <div style={{ marginBottom: 12 }}>
            <div style={{ height: 40, background: '#4a7729', borderRadius: 0, display: 'flex', alignItems: 'center', paddingLeft: 12 }}>
              <span style={{ color: 'white', fontSize: 13, fontWeight: 700 }}>GO Transit</span>
            </div>
          </div>
          <div style={{ fontSize: 10, color: '#666', marginBottom: 4 }}>Home &gt; Plan a Trip &gt; Schedules</div>
          <div style={{ background: '#f5f5f5', padding: 12, borderRadius: 4, marginBottom: 12 }}>
            <label style={{ fontSize: 9, color: '#333', fontWeight: 600 }}>From Station</label>
            <div style={{ height: 28, background: 'white', border: '1px solid #ccc', borderRadius: 3, marginTop: 4, marginBottom: 8 }} />
            <label style={{ fontSize: 9, color: '#333', fontWeight: 600 }}>To Station</label>
            <div style={{ height: 28, background: 'white', border: '1px solid #ccc', borderRadius: 3, marginTop: 4, marginBottom: 8 }} />
            <label style={{ fontSize: 9, color: '#333', fontWeight: 600 }}>Date & Time</label>
            <div style={{ height: 28, background: 'white', border: '1px solid #ccc', borderRadius: 3, marginTop: 4, marginBottom: 12 }} />
            <div style={{ height: 32, background: '#4a7729', borderRadius: 3, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span style={{ color: 'white', fontSize: 11, fontWeight: 600 }}>Plan My Trip</span>
            </div>
          </div>
          <div style={{ fontSize: 9, color: '#666', marginBottom: 8 }}>Popular Routes:</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            {['Union → Oakville', 'Union → Hamilton', 'Union → Barrie'].map(r => (
              <div key={r} style={{ padding: '6px 8px', background: '#f5f5f5', borderRadius: 3, fontSize: 9, color: '#333' }}>{r}</div>
            ))}
          </div>
          <div style={{ marginTop: 16, padding: '8px', background: '#fffbeb', border: '1px solid #fde68a', borderRadius: 4 }}>
            <span style={{ fontSize: 9, color: '#92400e' }}>⚠ Check service alerts for delays</span>
          </div>
        </div>
        <div style={{ textAlign: 'center', maxWidth: 280 }}>
          <p style={{ fontSize: 14, fontWeight: 700, color: '#1a1d21', marginBottom: 4 }}>5+ taps to find schedules</p>
          <p style={{ fontSize: 12, color: '#6b7280' }}>Desktop layout on mobile, no saved routes, no push notifications</p>
        </div>
      </div>

      {/* VS Divider */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
        <div style={{ width: 2, height: 80, background: '#e2e4e7' }} />
        <div style={{ width: 48, height: 48, borderRadius: '50%', background: '#1a1d21', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <span style={{ fontSize: 14, fontWeight: 900, color: 'white' }}>VS</span>
        </div>
        <div style={{ width: 2, height: 80, background: '#e2e4e7' }} />
      </div>

      {/* After */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 24 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#357a1e' }} />
          <span style={{ fontSize: 14, fontWeight: 800, color: '#357a1e', textTransform: 'uppercase', letterSpacing: '1px' }}>After — Native App</span>
        </div>
        <div style={{
          width: 300,
          height: 520,
          borderRadius: 32,
          background: '#fff',
          boxShadow: '0 20px 60px rgba(53,122,30,0.15), 0 0 0 1.5px rgba(53,122,30,0.1)',
          overflow: 'hidden',
          padding: '40px 16px 16px',
        }}>
          {/* Simulated clean native app */}
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 16 }}>
            <svg width="50" height="24" viewBox="-23 -11 46 22"><defs><clipPath id="go-af"><path d="m-23-11h46v22h-46zM23 1v-2h-34v-10h-2v22h2V1z"/></clipPath></defs><path clipPath="url(#go-af)" fill="#357a1e" d="m-1 0a11 11 0 1 0-11 11h11zm2 0a1 1 0 0 0 22 0A1 1 0 0 0 1 0z"/></svg>
          </div>
          <p style={{ fontSize: 10, color: '#6b7280', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Good morning</p>
          <h2 style={{ fontSize: 18, fontWeight: 900, color: '#1a1d21', marginTop: 2, marginBottom: 12 }}>Where are you headed?</h2>
          {/* Next train */}
          <div style={{ borderRadius: 14, border: '1.5px solid #d5e6cc', padding: 12, marginBottom: 10 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 6 }}>
              <div style={{ width: 28, height: 28, borderRadius: 8, background: '#357a1e', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <span style={{ color: 'white', fontSize: 12 }}>🚆</span>
              </div>
              <span style={{ fontSize: 9, fontWeight: 800, color: '#357a1e', textTransform: 'uppercase' }}>Next Train</span>
              <span style={{ fontSize: 9, fontWeight: 700, color: '#357a1e', background: '#e6f2e0', borderRadius: 5, padding: '1px 5px' }}>12 min</span>
            </div>
            <p style={{ fontSize: 15, fontWeight: 900, color: '#1a1d21' }}>10:54 AM – 11:29 AM</p>
            <p style={{ fontSize: 10, color: '#555b64', marginTop: 2 }}>Miliken GO → Union Station GO</p>
          </div>
          {/* CTA */}
          <div style={{ borderRadius: 12, background: '#357a1e', padding: '11px 14px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
            <span style={{ fontSize: 13, fontWeight: 800, color: 'white' }}>Plan a New Trip</span>
            <span style={{ color: 'white', fontSize: 12 }}>→</span>
          </div>
          {/* Quick links */}
          <div style={{ display: 'flex', gap: 6, marginBottom: 12 }}>
            <div style={{ flex: 1, padding: '8px', borderRadius: 8, background: '#f0f7ec', border: '1px solid #d5e6cc', textAlign: 'center' }}>
              <span style={{ fontSize: 10, fontWeight: 700, color: '#357a1e' }}>Fares</span>
            </div>
            <div style={{ flex: 1, padding: '8px', borderRadius: 8, background: '#f0f7ec', border: '1px solid #d5e6cc', textAlign: 'center' }}>
              <span style={{ fontSize: 10, fontWeight: 700, color: '#357a1e' }}>Alerts</span>
            </div>
          </div>
          {/* Saved */}
          <p style={{ fontSize: 13, fontWeight: 800, color: '#1a1d21', marginBottom: 6 }}>Saved Trips</p>
          <div style={{ borderRadius: 10, padding: '10px', background: '#f4f7f3', border: '1px solid #e2e4e7', marginBottom: 6 }}>
            <p style={{ fontSize: 11, fontWeight: 800, color: '#1a1d21' }}>Miliken GO → Union Station GO</p>
            <p style={{ fontSize: 9, color: '#555' }}>Stouffville</p>
          </div>
          <div style={{ borderRadius: 10, padding: '10px', background: '#f4f7f3', border: '1px solid #e2e4e7' }}>
            <p style={{ fontSize: 11, fontWeight: 800, color: '#1a1d21' }}>Union Station GO → Miliken GO</p>
            <p style={{ fontSize: 9, color: '#555' }}>Stouffville</p>
          </div>
        </div>
        <div style={{ textAlign: 'center', maxWidth: 280 }}>
          <p style={{ fontSize: 14, fontWeight: 700, color: '#1a1d21', marginBottom: 4 }}>1 tap to see your train</p>
          <p style={{ fontSize: 12, color: '#6b7280' }}>Saved routes, real-time alerts, fare payment — all in one place</p>
        </div>
      </div>
    </div>
  )
}

// ─── ASSET 5: Design System Overview ───
function DesignSystemAsset() {
  return (
    <div
      id="asset-design-system"
      style={{
        width: 1200,
        height: 600,
        background: '#ffffff',
        padding: 60,
        display: 'flex',
        flexDirection: 'column',
        gap: 40,
      }}
    >
      <div>
        <p style={{ fontSize: 13, fontWeight: 700, color: '#357a1e', textTransform: 'uppercase', letterSpacing: '1.5px', marginBottom: 8 }}>Visual Design System</p>
        <h2 style={{ fontSize: 32, fontWeight: 900, color: '#1a1d21', letterSpacing: '-0.5px' }}>Built on GO Transit's Brand Identity</h2>
      </div>

      <div style={{ display: 'flex', gap: 60, flex: 1 }}>
        {/* Colors */}
        <div style={{ flex: 1 }}>
          <h3 style={{ fontSize: 14, fontWeight: 800, color: '#1a1d21', marginBottom: 16, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Color Palette</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ width: 48, height: 48, borderRadius: 12, background: '#357a1e', boxShadow: '0 2px 8px rgba(53,122,30,0.3)' }} />
              <div>
                <p style={{ fontSize: 13, fontWeight: 700, color: '#1a1d21' }}>GO Green (Primary)</p>
                <p style={{ fontSize: 11, color: '#6b7280' }}>#357A1E</p>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ width: 48, height: 48, borderRadius: 12, background: '#1a1d21' }} />
              <div>
                <p style={{ fontSize: 13, fontWeight: 700, color: '#1a1d21' }}>Dark (Text)</p>
                <p style={{ fontSize: 11, color: '#6b7280' }}>#1A1D21</p>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ width: 48, height: 48, borderRadius: 12, background: '#f0f7ec', border: '1px solid #d5e6cc' }} />
              <div>
                <p style={{ fontSize: 13, fontWeight: 700, color: '#1a1d21' }}>Green Soft (Surface)</p>
                <p style={{ fontSize: 11, color: '#6b7280' }}>#F0F7EC</p>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ width: 48, height: 48, borderRadius: 12, background: '#c2410c' }} />
              <div>
                <p style={{ fontSize: 13, fontWeight: 700, color: '#1a1d21' }}>Alert Warning</p>
                <p style={{ fontSize: 11, color: '#6b7280' }}>#C2410C</p>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ width: 48, height: 48, borderRadius: 12, background: '#1d4ed8' }} />
              <div>
                <p style={{ fontSize: 13, fontWeight: 700, color: '#1a1d21' }}>Alert Info</p>
                <p style={{ fontSize: 11, color: '#6b7280' }}>#1D4ED8</p>
              </div>
            </div>
          </div>
        </div>

        {/* Typography */}
        <div style={{ flex: 1 }}>
          <h3 style={{ fontSize: 14, fontWeight: 800, color: '#1a1d21', marginBottom: 16, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Typography</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div>
              <p style={{ fontSize: 26, fontWeight: 900, color: '#1a1d21', letterSpacing: '-0.5px' }}>Avenir</p>
              <p style={{ fontSize: 12, color: '#6b7280', marginTop: 4 }}>Primary typeface — clean, modern, accessible</p>
            </div>
            <div style={{ borderTop: '1px solid #e2e4e7', paddingTop: 12 }}>
              <p style={{ fontSize: 22, fontWeight: 900, color: '#1a1d21', letterSpacing: '-0.4px' }}>H1 — 26px / Black</p>
              <p style={{ fontSize: 18, fontWeight: 800, color: '#1a1d21', marginTop: 8 }}>H2 — 18px / ExtraBold</p>
              <p style={{ fontSize: 15, fontWeight: 700, color: '#1a1d21', marginTop: 8 }}>Body — 15px / Bold</p>
              <p style={{ fontSize: 13, fontWeight: 600, color: '#555b64', marginTop: 8 }}>Secondary — 13px / SemiBold</p>
              <p style={{ fontSize: 11, fontWeight: 700, color: '#6b7280', marginTop: 8, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Label — 11px / Bold / Uppercase</p>
            </div>
          </div>
        </div>

        {/* Components */}
        <div style={{ flex: 1.2 }}>
          <h3 style={{ fontSize: 14, fontWeight: 800, color: '#1a1d21', marginBottom: 16, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Key Components</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {/* Button */}
            <div style={{ borderRadius: 14, background: '#357a1e', padding: '14px 20px', textAlign: 'center' }}>
              <span style={{ fontSize: 15, fontWeight: 800, color: 'white' }}>Primary Button</span>
            </div>
            {/* Card */}
            <div style={{ borderRadius: 14, padding: '14px 16px', background: '#f4f7f3', border: '1px solid #e2e4e7', display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{ width: 36, height: 36, borderRadius: 10, background: '#e6f2e0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <span style={{ fontSize: 16 }}>🚆</span>
              </div>
              <div>
                <p style={{ fontSize: 13, fontWeight: 800, color: '#1a1d21' }}>Trip Card Component</p>
                <p style={{ fontSize: 11, color: '#555' }}>Stouffville Line</p>
              </div>
            </div>
            {/* Alert badge */}
            <div style={{ borderRadius: 14, overflow: 'hidden' }}>
              <div style={{ background: '#c2410c', padding: '8px 16px', display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ fontSize: 12 }}>⚠️</span>
                <span style={{ fontSize: 12, fontWeight: 800, color: 'white' }}>Alert Banner</span>
              </div>
              <div style={{ padding: '10px 16px', background: '#fff7ed', border: '1px solid #fed7aa', borderTop: 'none' }}>
                <p style={{ fontSize: 11, color: '#1a1d21' }}>Content area with details</p>
              </div>
            </div>
            {/* Chip */}
            <div style={{ display: 'flex', gap: 8 }}>
              <div style={{ padding: '8px 14px', borderRadius: 10, background: '#f0f7ec', border: '1px solid #d5e6cc' }}>
                <span style={{ fontSize: 12, fontWeight: 700, color: '#357a1e' }}>Quick Action Chip</span>
              </div>
              <div style={{ padding: '8px 14px', borderRadius: 10, background: '#357a1e' }}>
                <span style={{ fontSize: 12, fontWeight: 700, color: 'white' }}>Active State</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── ASSET 6: User Flow Diagram ───
function UserFlowAsset() {
  return (
    <div
      id="asset-user-flow"
      style={{
        width: 1200,
        height: 500,
        background: '#f8f9fa',
        padding: 60,
        display: 'flex',
        flexDirection: 'column',
        gap: 40,
      }}
    >
      <div style={{ textAlign: 'center' }}>
        <p style={{ fontSize: 13, fontWeight: 700, color: '#357a1e', textTransform: 'uppercase', letterSpacing: '1.5px', marginBottom: 8 }}>Core User Journey</p>
        <h2 style={{ fontSize: 28, fontWeight: 900, color: '#1a1d21', letterSpacing: '-0.5px' }}>Trip Planning → Schedule → Fare → Purchase</h2>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 16, flex: 1 }}>
        {/* Step 1 */}
        <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
          <div style={{ width: 140, height: 240, borderRadius: 20, background: 'white', boxShadow: '0 4px 20px rgba(0,0,0,0.08)', border: '1px solid #e2e4e7', padding: '28px 10px 10px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div style={{ width: 36, height: 36, borderRadius: 10, background: '#357a1e', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 8 }}>
              <span style={{ color: 'white', fontSize: 16 }}>🏠</span>
            </div>
            <p style={{ fontSize: 9, fontWeight: 800, color: '#1a1d21', marginBottom: 4 }}>Saved Trips</p>
            <div style={{ width: '90%', padding: '6px', borderRadius: 6, background: '#f0f7ec', border: '1px solid #d5e6cc', marginBottom: 4 }}>
              <p style={{ fontSize: 7, fontWeight: 700, color: '#357a1e' }}>Next: 12 min</p>
            </div>
            <div style={{ width: '90%', padding: '6px', borderRadius: 6, background: '#f4f7f3', border: '1px solid #e2e4e7' }}>
              <p style={{ fontSize: 7, color: '#555' }}>Miliken → Union</p>
            </div>
          </div>
          <div style={{ padding: '4px 12px', borderRadius: 8, background: '#357a1e' }}>
            <span style={{ fontSize: 11, fontWeight: 700, color: 'white' }}>1. Home</span>
          </div>
        </div>

        {/* Arrow */}
        <div style={{ fontSize: 24, color: '#357a1e', fontWeight: 900 }}>→</div>

        {/* Step 2 */}
        <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
          <div style={{ width: 140, height: 240, borderRadius: 20, background: 'white', boxShadow: '0 4px 20px rgba(0,0,0,0.08)', border: '1px solid #e2e4e7', padding: '28px 10px 10px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div style={{ width: 36, height: 36, borderRadius: 10, background: '#e6f2e0', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 8 }}>
              <span style={{ fontSize: 16 }}>🔍</span>
            </div>
            <p style={{ fontSize: 9, fontWeight: 800, color: '#1a1d21', marginBottom: 4 }}>Schedule</p>
            {['10:54 AM', '11:54 AM', '12:54 PM'].map(t => (
              <div key={t} style={{ width: '90%', padding: '5px', borderRadius: 6, background: '#f0f7ec', border: '1px solid #d5e6cc', marginBottom: 3 }}>
                <p style={{ fontSize: 7, fontWeight: 700, color: '#1a1d21' }}>{t}</p>
              </div>
            ))}
          </div>
          <div style={{ padding: '4px 12px', borderRadius: 8, background: '#357a1e' }}>
            <span style={{ fontSize: 11, fontWeight: 700, color: 'white' }}>2. Results</span>
          </div>
        </div>

        {/* Arrow */}
        <div style={{ fontSize: 24, color: '#357a1e', fontWeight: 900 }}>→</div>

        {/* Step 3 */}
        <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
          <div style={{ width: 140, height: 240, borderRadius: 20, background: 'white', boxShadow: '0 4px 20px rgba(0,0,0,0.08)', border: '1px solid #e2e4e7', padding: '28px 10px 10px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div style={{ width: 36, height: 36, borderRadius: 10, background: '#f0f7ec', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 8 }}>
              <span style={{ fontSize: 16 }}>📍</span>
            </div>
            <p style={{ fontSize: 9, fontWeight: 800, color: '#1a1d21', marginBottom: 4 }}>Trip Details</p>
            <div style={{ width: '90%', height: 40, borderRadius: 6, background: '#f0f7ec', marginBottom: 6 }} />
            <div style={{ width: '90%' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginBottom: 3 }}>
                <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#357a1e' }} />
                <span style={{ fontSize: 7, color: '#1a1d21' }}>Miliken</span>
              </div>
              <div style={{ width: 1.5, height: 12, background: '#357a1e', marginLeft: 2.5 }} />
              <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#357a1e' }} />
                <span style={{ fontSize: 7, color: '#1a1d21' }}>Union</span>
              </div>
            </div>
          </div>
          <div style={{ padding: '4px 12px', borderRadius: 8, background: '#357a1e' }}>
            <span style={{ fontSize: 11, fontWeight: 700, color: 'white' }}>3. Details</span>
          </div>
        </div>

        {/* Arrow */}
        <div style={{ fontSize: 24, color: '#357a1e', fontWeight: 900 }}>→</div>

        {/* Step 4 */}
        <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
          <div style={{ width: 140, height: 240, borderRadius: 20, background: 'white', boxShadow: '0 4px 20px rgba(0,0,0,0.08)', border: '1px solid #e2e4e7', padding: '28px 10px 10px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div style={{ width: 36, height: 36, borderRadius: 10, background: '#e6f2e0', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 8 }}>
              <span style={{ fontSize: 16 }}>💳</span>
            </div>
            <p style={{ fontSize: 9, fontWeight: 800, color: '#1a1d21', marginBottom: 4 }}>Payment</p>
            <div style={{ width: '90%', padding: '6px', borderRadius: 6, border: '1px solid #d5e6cc', marginBottom: 4 }}>
              <p style={{ fontSize: 7, fontWeight: 700, color: '#1a1d21' }}>Visa •••• 4242</p>
            </div>
            <div style={{ width: '90%', padding: '8px', borderRadius: 8, background: '#357a1e', textAlign: 'center', marginTop: 'auto' }}>
              <span style={{ fontSize: 8, fontWeight: 800, color: 'white' }}>Pay $9.05</span>
            </div>
          </div>
          <div style={{ padding: '4px 12px', borderRadius: 8, background: '#357a1e' }}>
            <span style={{ fontSize: 11, fontWeight: 700, color: 'white' }}>4. Payment</span>
          </div>
        </div>

        {/* Arrow */}
        <div style={{ fontSize: 24, color: '#357a1e', fontWeight: 900 }}>→</div>

        {/* Step 5 */}
        <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
          <div style={{ width: 140, height: 240, borderRadius: 20, background: 'white', boxShadow: '0 4px 20px rgba(0,0,0,0.08)', border: '1px solid #e2e4e7', padding: '28px 10px 10px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ width: 56, height: 56, borderRadius: '50%', background: '#e6f2e0', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 12 }}>
              <span style={{ fontSize: 28 }}>✓</span>
            </div>
            <p style={{ fontSize: 11, fontWeight: 900, color: '#357a1e' }}>Confirmed!</p>
            <p style={{ fontSize: 8, color: '#555', marginTop: 4 }}>E-Ticket ready</p>
            <div style={{ width: 50, height: 50, marginTop: 8, borderRadius: 6, border: '2px solid #e2e4e7', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span style={{ fontSize: 8, color: '#6b7280' }}>QR</span>
            </div>
          </div>
          <div style={{ padding: '4px 12px', borderRadius: 8, background: '#357a1e' }}>
            <span style={{ fontSize: 11, fontWeight: 700, color: 'white' }}>5. Done</span>
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── ASSET 7: Dark Mode Showcase ───
function DarkModeAsset() {
  return (
    <div
      id="asset-dark-mode"
      style={{
        width: 1200,
        height: 600,
        background: 'linear-gradient(135deg, #1a1d21 0%, #111315 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 60,
        gap: 60,
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Subtle gradient orbs */}
      <div style={{ position: 'absolute', width: 400, height: 400, borderRadius: '50%', background: 'radial-gradient(circle, rgba(53,122,30,0.1) 0%, transparent 70%)', top: -100, right: -100 }} />
      <div style={{ position: 'absolute', width: 300, height: 300, borderRadius: '50%', background: 'radial-gradient(circle, rgba(53,122,30,0.08) 0%, transparent 70%)', bottom: -50, left: 100 }} />

      {/* Text */}
      <div style={{ maxWidth: 320, zIndex: 1 }}>
        <p style={{ fontSize: 13, fontWeight: 700, color: '#357a1e', textTransform: 'uppercase', letterSpacing: '1.5px', marginBottom: 12 }}>Accessibility</p>
        <h2 style={{ fontSize: 32, fontWeight: 900, color: '#f0f1f3', lineHeight: 1.2, letterSpacing: '-0.5px', marginBottom: 16 }}>Dark Mode for Low-Light Commuting</h2>
        <p style={{ fontSize: 15, color: '#9ca3af', lineHeight: 1.6 }}>
          Designed for early morning and late evening commutes. Reduces eye strain while maintaining full readability and accessibility contrast ratios.
        </p>
      </div>

      {/* Dark mode phones */}
      <div style={{ display: 'flex', gap: 20, zIndex: 1 }}>
        {/* Phone 1 - Dark Landing */}
        <div style={{
          width: 220,
          height: 440,
          borderRadius: 28,
          background: '#1a1d21',
          boxShadow: '0 30px 80px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.06)',
          overflow: 'hidden',
          padding: '32px 14px 14px',
        }}>
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 12 }}>
            <svg width="40" height="20" viewBox="-23 -11 46 22"><defs><clipPath id="go-dk1"><path d="m-23-11h46v22h-46zM23 1v-2h-34v-10h-2v22h2V1z"/></clipPath></defs><path clipPath="url(#go-dk1)" fill="#357a1e" d="m-1 0a11 11 0 1 0-11 11h11zm2 0a1 1 0 0 0 22 0A1 1 0 0 0 1 0z"/></svg>
          </div>
          <p style={{ fontSize: 8, color: '#6b7280', fontWeight: 600, textTransform: 'uppercase' }}>Good morning</p>
          <h2 style={{ fontSize: 14, fontWeight: 900, color: '#f0f1f3', marginTop: 2, marginBottom: 10 }}>Where are you headed?</h2>
          <div style={{ borderRadius: 10, border: '1.5px solid #2a4020', padding: 10, marginBottom: 8 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
              <div style={{ width: 22, height: 22, borderRadius: 6, background: '#357a1e' }} />
              <span style={{ fontSize: 7, fontWeight: 800, color: '#357a1e', textTransform: 'uppercase' }}>Next Train · 12 min</span>
            </div>
            <p style={{ fontSize: 12, fontWeight: 900, color: '#f0f1f3' }}>10:54 AM</p>
            <p style={{ fontSize: 8, color: '#9ca3af' }}>Miliken → Union Station</p>
          </div>
          <div style={{ borderRadius: 10, background: '#357a1e', padding: '10px', textAlign: 'center', marginBottom: 8 }}>
            <span style={{ fontSize: 10, fontWeight: 800, color: 'white' }}>Plan a New Trip</span>
          </div>
          <div style={{ display: 'flex', gap: 4, marginBottom: 10 }}>
            <div style={{ flex: 1, padding: 6, borderRadius: 6, background: '#1a2e14', border: '1px solid #2a4020', textAlign: 'center' }}>
              <span style={{ fontSize: 8, fontWeight: 700, color: '#357a1e' }}>Fares</span>
            </div>
            <div style={{ flex: 1, padding: 6, borderRadius: 6, background: '#1a2e14', border: '1px solid #2a4020', textAlign: 'center' }}>
              <span style={{ fontSize: 8, fontWeight: 700, color: '#357a1e' }}>Alerts</span>
            </div>
          </div>
          <p style={{ fontSize: 10, fontWeight: 800, color: '#f0f1f3', marginBottom: 6 }}>Saved Trips</p>
          <div style={{ borderRadius: 8, padding: 8, background: '#242830', border: '1px solid #2d3239' }}>
            <p style={{ fontSize: 9, fontWeight: 700, color: '#f0f1f3' }}>Miliken → Union</p>
            <p style={{ fontSize: 7, color: '#6b7280' }}>Stouffville</p>
          </div>
        </div>

        {/* Phone 2 - Dark Trip Details */}
        <div style={{
          width: 220,
          height: 440,
          borderRadius: 28,
          background: '#1a1d21',
          boxShadow: '0 30px 80px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.06)',
          overflow: 'hidden',
          padding: '32px 14px 14px',
          marginTop: 40,
        }}>
          {/* Map */}
          <div style={{ height: 80, background: '#1a2e14', borderRadius: 10, marginBottom: 10, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width="100%" height="60" viewBox="0 0 180 60">
              <line x1="20" y1="50" x2="160" y2="10" stroke="#357a1e" strokeWidth="2.5" strokeLinecap="round"/>
              <circle cx="20" cy="50" r="4" fill="#357a1e"/>
              <circle cx="90" cy="30" r="2.5" fill="#1a1d21" stroke="#357a1e" strokeWidth="1.5"/>
              <circle cx="160" cy="10" r="4" fill="#357a1e"/>
            </svg>
          </div>
          <p style={{ fontSize: 13, fontWeight: 900, color: '#f0f1f3' }}>10:54 – 11:29 AM</p>
          <p style={{ fontSize: 11, fontWeight: 800, color: '#f0f1f3', marginTop: 2 }}>Stouffville Line</p>
          <p style={{ fontSize: 8, color: '#6b7280', marginTop: 2 }}>35 min · 5 stops</p>
          {/* Green header + stops */}
          <div style={{ marginTop: 10, borderRadius: 8, overflow: 'hidden' }}>
            <div style={{ background: '#357a1e', padding: '6px 10px' }}>
              <span style={{ fontSize: 9, fontWeight: 800, color: 'white' }}>Your Trip</span>
            </div>
            <div style={{ padding: '8px 10px', background: '#242830', border: '1px solid #2d3239', borderTop: 'none', borderRadius: '0 0 8px 8px' }}>
              {['Miliken GO', 'Agincourt', 'Kennedy', 'Union Station'].map((s, i) => (
                <div key={s} style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: i < 3 ? 6 : 0 }}>
                  <div style={{ width: i === 0 || i === 3 ? 8 : 5, height: i === 0 || i === 3 ? 8 : 5, borderRadius: '50%', background: i === 0 || i === 3 ? '#357a1e' : 'transparent', border: '1.5px solid #357a1e' }} />
                  <span style={{ fontSize: 8, color: i === 0 || i === 3 ? '#f0f1f3' : '#6b7280', fontWeight: i === 0 || i === 3 ? 700 : 400 }}>{s}</span>
                </div>
              ))}
            </div>
          </div>
          {/* Fare */}
          <div style={{ marginTop: 10, borderRadius: 8, overflow: 'hidden' }}>
            <div style={{ background: '#357a1e', padding: '6px 10px' }}>
              <span style={{ fontSize: 9, fontWeight: 800, color: 'white' }}>Fare Details</span>
            </div>
            <div style={{ padding: '8px 10px', background: '#242830', border: '1px solid #2d3239', borderTop: 'none', borderRadius: '0 0 8px 8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: 8, color: '#9ca3af' }}>E-Ticket</span>
              <span style={{ fontSize: 14, fontWeight: 900, color: '#f0f1f3' }}>$9.05</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── MAIN SHOWCASE PAGE ───
export default function CaseStudyAssets() {
  const [currentAsset, setCurrentAsset] = useState(0)

  const assets = [
    { name: 'Hero Composition', component: <HeroAsset /> },
    { name: 'Impact Metrics', component: <MetricsAsset /> },
    { name: 'Feature Highlights', component: <FeatureHighlightsAsset /> },
    { name: 'Before / After', component: <BeforeAfterAsset /> },
    { name: 'Design System', component: <DesignSystemAsset /> },
    { name: 'User Flow', component: <UserFlowAsset /> },
    { name: 'Dark Mode', component: <DarkModeAsset /> },
  ]

  return (
    <div style={{ minHeight: '100vh', background: '#0a0a0a', padding: 40, fontFamily: '"Avenir", "Avenir Next", -apple-system, sans-serif' }}>
      {/* Navigation */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 32, maxWidth: 1200, margin: '0 auto 32px' }}>
        <div>
          <h1 style={{ fontSize: 20, fontWeight: 900, color: '#fff', marginBottom: 4 }}>GO Transit — Case Study Assets</h1>
          <p style={{ fontSize: 13, color: '#6b7280' }}>Screenshot-ready visual compositions for your portfolio</p>
        </div>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', maxWidth: 600 }}>
          {assets.map((a, i) => (
            <button
              key={i}
              onClick={() => setCurrentAsset(i)}
              style={{
                padding: '6px 14px',
                borderRadius: 8,
                background: currentAsset === i ? '#357a1e' : '#2d3239',
                color: currentAsset === i ? 'white' : '#9ca3af',
                border: 'none',
                fontSize: 12,
                fontWeight: 700,
                cursor: 'pointer',
                fontFamily: 'inherit',
              }}
            >
              {a.name}
            </button>
          ))}
        </div>
      </div>

      {/* Asset Display */}
      <div style={{ display: 'flex', justifyContent: 'center', overflow: 'auto' }}>
        <div style={{ borderRadius: 12, overflow: 'hidden', boxShadow: '0 20px 60px rgba(0,0,0,0.5)' }}>
          {assets[currentAsset].component}
        </div>
      </div>

      {/* Instructions */}
      <div style={{ textAlign: 'center', marginTop: 32 }}>
        <p style={{ fontSize: 13, color: '#6b7280' }}>
          Right-click → "Save image as..." or use browser screenshot tools to capture each asset at full resolution.
        </p>
        <p style={{ fontSize: 12, color: '#555', marginTop: 8 }}>
          Each asset is 1200px wide — optimized for Framer portfolio pages.
        </p>
      </div>
    </div>
  )
}
