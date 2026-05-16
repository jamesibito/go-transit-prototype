import { useMemo } from 'react'
import type { RouteConfig } from '../data/trips'
import { TrainIcon, BusIcon } from './Icons'

// ── Deterministic hash → seeded RNG ───────────────────────────────────────────
//
// We want each route to render a visually distinct but stable map (i.e. the
// same Stouffville trip always looks the same, but a 407 bus trip looks
// noticeably different). FNV-1a → an LCG gives us a tiny seeded PRNG with
// zero dependencies.

function hash32(s: string): number {
  let h = 2166136261 >>> 0
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i)
    h = Math.imul(h, 16777619)
  }
  return h >>> 0
}

function rng(seed: number) {
  let s = seed || 1
  return () => {
    s = Math.imul(s ^ (s >>> 15), 0x9e3779b1) >>> 0
    s = Math.imul(s ^ (s >>> 13), 0x85ebca77) >>> 0
    return ((s ^ (s >>> 16)) >>> 0) / 0xffffffff
  }
}

// Cubic bezier point — used to drop stop dots precisely on the route spine.
function cubic(t: number, p0: P, p1: P, p2: P, p3: P): P {
  const mt = 1 - t
  return {
    x: mt ** 3 * p0.x + 3 * mt ** 2 * t * p1.x + 3 * mt * t ** 2 * p2.x + t ** 3 * p3.x,
    y: mt ** 3 * p0.y + 3 * mt ** 2 * t * p1.y + 3 * mt * t ** 2 * p2.y + t ** 3 * p3.y,
  }
}

type P = { x: number; y: number }

const VB_W = 400
const VB_H = 200

// ── Procedural background pieces ──────────────────────────────────────────────

function streetGrid(rand: () => number): JSX.Element[] {
  // A hairline grid offset and rotated slightly — gives each route its own
  // "neighborhood" without the obvious crosshair look of the old map.
  const angle = (rand() - 0.5) * 14 // -7° to +7°
  const ox = rand() * 30
  const oy = rand() * 30
  const lines: JSX.Element[] = []
  for (let i = -2; i < 12; i++) {
    const x = ox + i * 38
    lines.push(<line key={`v${i}`} x1={x} y1={-40} x2={x} y2={VB_H + 40} stroke="var(--map-road)" strokeWidth="1" />)
  }
  for (let j = -2; j < 8; j++) {
    const y = oy + j * 34
    lines.push(<line key={`h${j}`} x1={-40} y1={y} x2={VB_W + 40} y2={y} stroke="var(--map-road)" strokeWidth="1" />)
  }
  return [<g key="grid" transform={`rotate(${angle.toFixed(2)} ${VB_W / 2} ${VB_H / 2})`}>{lines}</g>]
}

function arterials(rand: () => number): JSX.Element {
  // Two slightly thicker arterials — placed at hashed offsets so trips don't
  // all share the same road skeleton.
  const ay = 60 + Math.floor(rand() * 80)
  const ax = 120 + Math.floor(rand() * 160)
  return (
    <g>
      <line x1={-20} y1={ay} x2={VB_W + 20} y2={ay - 14} stroke="var(--map-road-major)" strokeWidth="3.5" strokeLinecap="round" />
      <line x1={ax} y1={-20} x2={ax + 18} y2={VB_H + 20} stroke="var(--map-road-major)" strokeWidth="3.5" strokeLinecap="round" />
    </g>
  )
}

function river(rand: () => number): JSX.Element {
  // A soft, wide stroke shaped like a stylized waterway. Control points are
  // hashed so the river never lands on top of the route spine the same way
  // twice.
  const y0 = 30 + rand() * 30
  const y1 = 60 + rand() * 80
  const y2 = 90 + rand() * 60
  const y3 = 20 + rand() * 120
  return (
    <path
      d={`M -20 ${y0} C 100 ${y1}, 200 ${y2}, ${VB_W + 20} ${y3}`}
      stroke="var(--map-water)"
      strokeWidth="16"
      fill="none"
      strokeLinecap="round"
      opacity="0.85"
    />
  )
}

function park(rand: () => number, key: string): JSX.Element {
  const x = 40 + rand() * 220
  const y = 30 + rand() * 100
  const w = 60 + rand() * 60
  const h = 36 + rand() * 40
  return (
    <rect key={key} x={x} y={y} width={w} height={h} rx={Math.min(w, h) / 2.4} fill="var(--map-park)" opacity="0.7" />
  )
}

// ── Main component ───────────────────────────────────────────────────────────

export default function TransitMap({ route }: { route: RouteConfig }) {
  const isBus = useMemo(() => {
    const l = route.line.toLowerCase()
    return l.includes('bus') || /^route\s/i.test(route.line)
  }, [route.line])

  // Everything below is recomputed only when the route changes — cheap, but
  // useMemo also keeps things stable across re-renders so the map doesn't
  // shimmer when you toggle a star or scroll.
  const data = useMemo(() => {
    const seed = hash32(route.key + '|' + route.from + '|' + route.to)
    const rand = rng(seed)

    // Spine: a cubic bezier across the canvas. Origin always sits in the
    // upper-right, destination in the lower-left — gives the pair a stable
    // reading direction (top-right ↔ bottom-left) while the curve shape
    // itself varies per route to keep maps visually distinct.
    // Endpoints stay well inside the canvas so the pill labels can extend
    // toward the interior without clipping the container.
    const p0: P = { x: VB_W - 70 - rand() * 20, y: 45 + rand() * 20 }
    const p3: P = { x: 60 + rand() * 20, y: VB_H - 50 - rand() * 20 }
    const p1: P = { x: p0.x + (p3.x - p0.x) * (0.25 + rand() * 0.2), y: p0.y + (rand() - 0.5) * 70 }
    const p2: P = { x: p0.x + (p3.x - p0.x) * (0.6 + rand() * 0.2),  y: p3.y + (rand() - 0.5) * 70 }

    // Stops along the spine. Cap visible dots so a 14-stop train doesn't
    // look like beads on a string.
    const totalStops = Math.max(2, route.stops.length)
    const visibleCount = Math.min(totalStops, 9)
    const stopPts: { p: P; major: boolean }[] = []
    for (let i = 0; i < visibleCount; i++) {
      const t = visibleCount === 1 ? 0.5 : i / (visibleCount - 1)
      const major = i === 0 || i === visibleCount - 1
      stopPts.push({ p: cubic(t, p0, p1, p2, p3), major })
    }

    return {
      d: `M ${p0.x} ${p0.y} C ${p1.x} ${p1.y}, ${p2.x} ${p2.y}, ${p3.x} ${p3.y}`,
      stopPts,
      origin: p0,
      destination: p3,
    }
  }, [route.key, route.from, route.to, route.stops.length])

  // Background features — also seeded so they're stable per route.
  const bg = useMemo(() => {
    const seed = hash32(route.key + '|bg')
    const r = rng(seed)
    return {
      grid: streetGrid(r),
      arterials: arterials(r),
      river: river(r),
      parks: [park(r, 'p1'), park(r, 'p2')],
    }
  }, [route.key])

  // Pill label placement — extend the pill *into* the canvas (away from the
  // nearer edge) so it never clips off-screen.
  const originLabel = labelAnchor(data.origin)
  const destLabel   = labelAnchor(data.destination)

  return (
    <div className="w-full overflow-hidden" style={{ height: 200, background: 'var(--map-bg)', position: 'relative' }}>
      <svg
        width="100%"
        height="100%"
        viewBox={`0 0 ${VB_W} ${VB_H}`}
        preserveAspectRatio="xMidYMid slice"
        style={{ display: 'block' }}
      >
        {/* Background — solid fill + geography */}
        <rect width={VB_W} height={VB_H} fill="var(--map-bg)" />
        {bg.parks}
        {bg.river}
        {bg.grid}
        {bg.arterials}

        {/* Faint highlight behind route line for legibility on top of grid */}
        <path d={data.d} stroke="var(--map-bg)" strokeWidth="9" fill="none" strokeLinecap="round" opacity="0.85" />

        {/* The route spine */}
        <path
          d={data.d}
          stroke="var(--map-route)"
          strokeWidth="4.5"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeDasharray={isBus ? '8 5' : undefined}
        />

        {/* Stops along the spine */}
        {data.stopPts.map((s, i) => (
          <circle
            key={i}
            cx={s.p.x}
            cy={s.p.y}
            r={s.major ? 6 : 3.5}
            fill={s.major ? 'var(--map-route)' : 'var(--map-stop-fill)'}
            stroke="var(--map-route)"
            strokeWidth={s.major ? 2.5 : 2}
          />
        ))}

        {/* Compass */}
        <g transform={`translate(${VB_W - 24} ${VB_H - 24})`} opacity="0.55">
          <circle r="11" fill="var(--map-bg)" stroke="var(--map-compass)" strokeWidth="1" />
          <path d="M 0 -7 L 3 4 L 0 1 L -3 4 Z" fill="var(--map-compass)" />
          <text x="0" y="-9" fontSize="6" fill="var(--map-compass)" fontFamily="inherit" fontWeight="800" textAnchor="middle">N</text>
        </g>
      </svg>

      {/* Origin pill */}
      <MapPin
        x={originLabel.x}
        y={originLabel.y}
        anchor={originLabel.anchor}
        label={abbrev(route.mapLabel1 || route.from)}
        isBus={isBus}
        kind="origin"
      />
      {/* Destination pill */}
      <MapPin
        x={destLabel.x}
        y={destLabel.y}
        anchor={destLabel.anchor}
        label={abbrev(route.mapLabel2 || route.to)}
        isBus={isBus}
        kind="destination"
      />

      {/* Bottom vignette — fades the map into the trip card behind. */}
      <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 36, background: 'linear-gradient(transparent, var(--surface-primary))', pointerEvents: 'none' }} />
    </div>
  )
}

// ── Label helpers ─────────────────────────────────────────────────────────────

function labelAnchor(p: P): { x: number; y: number; anchor: 'left' | 'right' } {
  // Pill extends toward the *interior* of the canvas, never off-screen.
  // In MapPin, anchor='left' makes the pill extend leftward from the point
  // (right edge anchored at point) — what we want when the stop is on the
  // right half. anchor='right' does the opposite.
  return {
    x: (p.x / VB_W) * 100,
    y: (p.y / VB_H) * 100,
    anchor: p.x > VB_W / 2 ? 'left' : 'right',
  }
}

// Shorten "Union Station GO" → "Union Stn" if no mapLabel is provided.
function abbrev(name: string): string {
  return name
    .replace(/\bStation\b/i, 'Stn')
    .replace(/\s+GO\b/i, '')
    .replace(/\s*\/\s*Mississauga Park & Ride/i, ' P&R')
    .replace(/Pearson Airport Terminal \d/i, 'Pearson T1')
    .trim()
}

// ── Pin component ─────────────────────────────────────────────────────────────

function MapPin({
  x, y, anchor, label, isBus, kind,
}: {
  x: number
  y: number
  anchor: 'left' | 'right'
  label: string
  isBus: boolean
  kind: 'origin' | 'destination'
}) {
  // x/y are in percent; nudge horizontally so the pill sits beside the stop
  // dot rather than directly on top of it.
  const offsetX = anchor === 'left' ? -8 : 8
  // Origin sits above its dot, destination below — keeps the pair visually
  // balanced top-right ↔ bottom-left.
  const offsetY = kind === 'origin' ? -22 : 14
  return (
    <div
      style={{
        position: 'absolute',
        left: `${x}%`,
        top: `${y}%`,
        transform: `translate(calc(${anchor === 'left' ? '-100%' : '0%'} + ${offsetX}px), calc(-50% + ${offsetY}px))`,
        pointerEvents: 'none',
      }}
    >
      <div
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 6,
          background: 'var(--map-pin-bg)',
          color: 'var(--map-pin-text)',
          padding: '5px 10px',
          borderRadius: 999,
          fontSize: 11,
          fontWeight: 800,
          fontFamily: 'inherit',
          letterSpacing: '-0.1px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.18)',
          whiteSpace: 'nowrap',
          maxWidth: 170,
        }}
      >
        {isBus
          ? <BusIcon size={12} color="var(--map-pin-text)" />
          : <TrainIcon size={12} color="var(--map-pin-text)" />}
        <span style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>{label}</span>
      </div>
    </div>
  )
}
