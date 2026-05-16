// ─────────────────────────────────────────────────────────────────────────────
// GO Transit network model
//
// Encodes the real 7-line GO Transit rail network as of 2025, with realistic
// station orders, inter-station travel times, and a generative trip planner
// that handles ANY station pair — same-line direct trips and cross-line trips
// via Union (with transfer time).
//
// Public API (kept backwards-compatible with the previous 5-route prototype):
//   • ROUTES[key]                                    → RouteConfig (auto-generated)
//   • getRouteKeyFromStations(from, to)              → key string
//   • generateDepartures(route, count)               → live next departures
//   • generateStopTimes(route, departureTime)        → stop times relative to a departure
//   • fmtTime(h, m)                                  → "H:MM AM/PM"
//   • DEFAULT_ROUTE                                  → key used on first load
//
// Plus new exports for screens that want the richer model:
//   • LINES, STATIONS, LINE_OF, planTrip, fareFor
// ─────────────────────────────────────────────────────────────────────────────

export interface TripStop {
  name: string
  time: string
  major: boolean
}

export interface ServiceAlert {
  severity: 'warning' | 'info'
  title: string
  message: string
}

export interface RouteConfig {
  key: string
  line: string                 // human-readable, may say "Lakeshore West → Stouffville (via Union)"
  from: string
  to: string
  color: string
  stops: TripStop[]
  eTicketPrice: string         // "$X.XX"
  prestoPrice: string
  prestoSavings: string
  duration: string             // "X min"
  alert?: ServiceAlert
  mapLabel1: string            // shortened from
  mapLabel2: string            // shortened to
  // New: transfer info (undefined for direct trips)
  transfer?: {
    at: string                 // station name (always "Union Station GO" today)
    waitMin: number
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// LINE DEFINITIONS — real GO Transit network
//
// Each line lists its stations in geographic order (one end to the other).
// `segmentMin` lists travel time between consecutive station pairs.
// segmentMin[i] = travel time from stations[i] to stations[i+1].
// ─────────────────────────────────────────────────────────────────────────────

export interface LineDef {
  key: string
  name: string                 // "Lakeshore West" or "Route 12 — Niagara / Toronto"
  short: string                // "LW" or "12"
  color: string
  type: 'train' | 'bus'        // mode of transit
  stations: string[]           // ordered, both directions valid
  segmentMin: number[]         // length = stations.length - 1
  // Peak intervals (in minutes) — used for departure simulation
  peakIntervalMin: number
  offPeakIntervalMin: number
}

const GO_GREEN = '#357a1e'

export const LINES: Record<string, LineDef> = {
  'lakeshore-west': {
    key: 'lakeshore-west',
    name: 'Lakeshore West',
    short: 'LW',
    color: GO_GREEN,
    type: 'train',
    stations: [
      'Union Station GO',
      'Exhibition GO',
      'Mimico GO',
      'Long Branch GO',
      'Port Credit GO',
      'Clarkson GO',
      'Oakville GO',
      'Bronte GO',
      'Burlington GO',
      'Aldershot GO',
      'Hamilton GO Centre',
      'West Harbour GO',
    ],
    // Real schedule gaps, smoothed:
    segmentMin: [7, 6, 4, 6, 6, 8, 5, 6, 4, 9, 8],
    peakIntervalMin: 15,
    offPeakIntervalMin: 30,
  },
  'lakeshore-east': {
    key: 'lakeshore-east',
    name: 'Lakeshore East',
    short: 'LE',
    color: GO_GREEN,
    type: 'train',
    stations: [
      'Union Station GO',
      'Danforth GO',
      'Scarborough GO',
      'Eglinton GO',
      'Guildwood GO',
      'Rouge Hill GO',
      'Pickering GO',
      'Ajax GO',
      'Whitby GO',
      'Oshawa GO',
    ],
    segmentMin: [9, 6, 4, 5, 5, 4, 6, 7, 8],
    peakIntervalMin: 15,
    offPeakIntervalMin: 30,
  },
  milton: {
    key: 'milton',
    name: 'Milton',
    short: 'MI',
    color: GO_GREEN,
    type: 'train',
    stations: [
      'Union Station GO',
      'Kipling GO',
      'Dixie GO',
      'Cooksville GO',
      'Erindale GO',
      'Streetsville GO',
      'Meadowvale GO',
      'Lisgar GO',
      'Milton GO',
    ],
    segmentMin: [17, 6, 6, 4, 4, 7, 5, 7],
    peakIntervalMin: 20,
    offPeakIntervalMin: 60,
  },
  kitchener: {
    key: 'kitchener',
    name: 'Kitchener',
    short: 'KI',
    color: GO_GREEN,
    type: 'train',
    stations: [
      'Union Station GO',
      'Bloor GO',
      'Weston GO',
      'Etobicoke North GO',
      'Malton GO',
      'Bramalea GO',
      'Brampton GO',
      'Mount Pleasant GO',
      'Georgetown GO',
      'Acton GO',
      'Guelph Central GO',
      'Kitchener GO',
    ],
    segmentMin: [10, 6, 5, 7, 6, 7, 6, 8, 12, 13, 14],
    peakIntervalMin: 20,
    offPeakIntervalMin: 60,
  },
  barrie: {
    key: 'barrie',
    name: 'Barrie',
    short: 'BA',
    color: GO_GREEN,
    type: 'train',
    stations: [
      'Union Station GO',
      'Downsview Park GO',
      'Rutherford GO',
      'Maple GO',
      'King City GO',
      'Aurora GO',
      'Newmarket GO',
      'East Gwillimbury GO',
      'Bradford GO',
      'Barrie South GO',
      'Allandale Waterfront GO',
    ],
    segmentMin: [17, 11, 6, 8, 8, 7, 5, 10, 16, 6],
    peakIntervalMin: 20,
    offPeakIntervalMin: 60,
  },
  stouffville: {
    key: 'stouffville',
    name: 'Stouffville',
    short: 'ST',
    color: GO_GREEN,
    type: 'train',
    stations: [
      'Union Station GO',
      'Kennedy GO',
      'Agincourt GO',
      'Milliken GO',
      'Unionville GO',
      'Centennial GO',
      'Markham GO',
      'Mount Joy GO',
      'Stouffville GO',
      'Lincolnville GO',
    ],
    segmentMin: [14, 6, 5, 6, 4, 3, 5, 9, 5],
    peakIntervalMin: 20,
    offPeakIntervalMin: 60,
  },
  'richmond-hill': {
    key: 'richmond-hill',
    name: 'Richmond Hill',
    short: 'RH',
    color: GO_GREEN,
    type: 'train',
    stations: [
      'Union Station GO',
      'Oriole GO',
      'Old Cummer GO',
      'Langstaff GO',
      'Richmond Hill GO',
      'Gormley GO',
      'Bloomington GO',
    ],
    segmentMin: [22, 7, 5, 6, 11, 8],
    peakIntervalMin: 30,
    offPeakIntervalMin: 90,
  },

  // ── GO Bus routes ─────────────────────────────────────────────────────────
  // Real-world GO Transit bus routes that shadow train corridors and connect
  // points the rail network can't reach (Niagara, McMaster, York University,
  // Pearson Airport, Mississauga local). Station names that match train
  // stations resolve to the same node, enabling natural bus↔train transfers.

  'route-12': {
    key: 'route-12',
    name: 'Route 12 — Niagara / Toronto',
    short: '12',
    color: GO_GREEN,
    type: 'bus',
    stations: [
      'Niagara Falls Bus Terminal',
      'St. Catharines Bus Terminal',
      'Burlington GO',
      'Aldershot GO',
      'Hamilton GO Centre',
      'Union Station GO',
    ],
    segmentMin: [26, 30, 12, 10, 58],
    peakIntervalMin: 60,
    offPeakIntervalMin: 120,
  },

  'route-16': {
    key: 'route-16',
    name: 'Route 16 — Hamilton / Toronto (QEW)',
    short: '16',
    color: GO_GREEN,
    type: 'bus',
    stations: [
      'McMaster University',
      'Hamilton GO Centre',
      'Aldershot GO',
      'Burlington GO',
      'Bronte GO',
      'Oakville GO',
      'Union Station GO',
    ],
    segmentMin: [14, 8, 10, 8, 6, 45],
    peakIntervalMin: 30,
    offPeakIntervalMin: 60,
  },

  'route-21': {
    key: 'route-21',
    name: 'Route 21 — Milton / Square One',
    short: '21',
    color: GO_GREEN,
    type: 'bus',
    stations: [
      'Milton GO',
      'Lisgar GO',
      'Meadowvale GO',
      'Streetsville GO',
      'Cooksville GO',
      'Square One Bus Terminal',
    ],
    segmentMin: [9, 7, 6, 7, 11],
    peakIntervalMin: 30,
    offPeakIntervalMin: 60,
  },

  'route-25': {
    key: 'route-25',
    name: 'Route 25 — Waterloo / Square One (407)',
    short: '25',
    color: GO_GREEN,
    type: 'bus',
    stations: [
      'University of Waterloo',
      'Guelph Central GO',
      '407 / Mississauga Park & Ride',
      'Square One Bus Terminal',
    ],
    segmentMin: [22, 28, 14],
    peakIntervalMin: 60,
    offPeakIntervalMin: 120,
  },

  'route-27': {
    key: 'route-27',
    name: 'Route 27 — Brampton / York U / Vaughan',
    short: '27',
    color: GO_GREEN,
    type: 'bus',
    stations: [
      'Brampton GO',
      '407 / Bramalea Park & Ride',
      'York University',
      'Vaughan Metropolitan Centre',
    ],
    segmentMin: [13, 17, 9],
    peakIntervalMin: 30,
    offPeakIntervalMin: 60,
  },

  'route-34': {
    key: 'route-34',
    name: 'Route 34 — Newmarket / Pearson Airport',
    short: '34',
    color: GO_GREEN,
    type: 'bus',
    stations: [
      'Newmarket GO',
      'Aurora GO',
      '407 / Yonge Park & Ride',
      'Pearson Airport Terminal 1',
    ],
    segmentMin: [9, 22, 32],
    peakIntervalMin: 30,
    offPeakIntervalMin: 60,
  },

  'route-40': {
    key: 'route-40',
    name: 'Route 40 — Hamilton / Richmond Hill (407)',
    short: '40',
    color: GO_GREEN,
    type: 'bus',
    stations: [
      'Hamilton GO Centre',
      'Aldershot GO',
      'Burlington GO',
      'Oakville GO',
      'Square One Bus Terminal',
      'York University',
      'Richmond Hill GO',
    ],
    segmentMin: [11, 9, 13, 25, 22, 24],
    peakIntervalMin: 30,
    offPeakIntervalMin: 60,
  },

  'route-88': {
    key: 'route-88',
    name: 'Route 88 — Burlington / Square One',
    short: '88',
    color: GO_GREEN,
    type: 'bus',
    stations: [
      'Burlington GO',
      'Oakville GO',
      'Clarkson GO',
      'Square One Bus Terminal',
    ],
    segmentMin: [13, 11, 22],
    peakIntervalMin: 60,
    offPeakIntervalMin: 90,
  },
}

// ─────────────────────────────────────────────────────────────────────────────
// STATION INDEX — flat list with line memberships
// Union is shared across all 7 lines.
// ─────────────────────────────────────────────────────────────────────────────

export interface StationInfo {
  name: string
  lines: string[]              // line keys
  lineLabel: string            // human-readable line summary
  type: 'train' | 'bus' | 'mixed'   // mode(s) of transit serving this stop
}

function buildStationIndex(): { stations: StationInfo[]; lineOf: Map<string, string[]> } {
  const lineOf = new Map<string, string[]>()
  for (const lineKey of Object.keys(LINES)) {
    for (const s of LINES[lineKey].stations) {
      if (!lineOf.has(s)) lineOf.set(s, [])
      lineOf.get(s)!.push(lineKey)
    }
  }
  const stations: StationInfo[] = Array.from(lineOf.entries())
    .map(([name, lineKeys]) => {
      const hasTrain = lineKeys.some(k => LINES[k].type === 'train')
      const hasBus = lineKeys.some(k => LINES[k].type === 'bus')
      const type: 'train' | 'bus' | 'mixed' =
        hasTrain && hasBus ? 'mixed' : hasTrain ? 'train' : 'bus'
      // Shorten labels: prefer line short-names for bus, full names for train
      const labelParts = lineKeys.map(k => {
        const L = LINES[k]
        return L.type === 'bus' ? `Bus ${L.short}` : L.name
      })
      const uniqueLabels = Array.from(new Set(labelParts))
      const lineLabel =
        name === 'Union Station GO'
          ? 'All Lines'
          : uniqueLabels.length > 3
            ? `${uniqueLabels.slice(0, 2).join(' / ')} +${uniqueLabels.length - 2} more`
            : uniqueLabels.join(' / ')
      return { name, lines: lineKeys, lineLabel, type }
    })
    .sort((a, b) => a.name.localeCompare(b.name))
  return { stations, lineOf }
}

const { stations: _STATIONS, lineOf: _LINE_OF } = buildStationIndex()
export const STATIONS = _STATIONS
export const LINE_OF = _LINE_OF
export const HUB = 'Union Station GO'

// Aliases for stations that were misspelled in earlier versions of this
// prototype, so any saved trips from before this rewrite still resolve.
const STATION_ALIASES: Record<string, string> = {
  'miliken go': 'Milliken GO',
  'union': 'Union Station GO',
  'union go': 'Union Station GO',
}

// Lookup helpers
function findStation(name: string): StationInfo | undefined {
  if (!name) return undefined
  const target = name.trim().toLowerCase()
  // Alias check
  if (STATION_ALIASES[target]) {
    return STATIONS.find(s => s.name === STATION_ALIASES[target])
  }
  // Exact match
  const exact = STATIONS.find(s => s.name.toLowerCase() === target)
  if (exact) return exact
  // Loose match: target substring of station name, or station core in target
  return STATIONS.find(
    s =>
      s.name.toLowerCase().includes(target) ||
      target.includes(s.name.toLowerCase().replace(/ go.*$/, ''))
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// SEGMENT TIMING — minutes between any two stations on the SAME line
// Returns null if they are not on the same line.
// ─────────────────────────────────────────────────────────────────────────────

function segmentMinutes(
  lineKey: string,
  from: string,
  to: string
): { minutes: number; stops: string[]; segMinutes: number[] } | null {
  const line = LINES[lineKey]
  const fromIdx = line.stations.indexOf(from)
  const toIdx = line.stations.indexOf(to)
  if (fromIdx === -1 || toIdx === -1) return null
  if (fromIdx === toIdx) return { minutes: 0, stops: [from], segMinutes: [] }
  const step = fromIdx < toIdx ? 1 : -1
  let minutes = 0
  const stops: string[] = []
  const segMinutes: number[] = []
  for (let i = fromIdx; i !== toIdx; i += step) {
    stops.push(line.stations[i])
    const segIdx = step > 0 ? i : i - 1
    const seg = line.segmentMin[segIdx]
    segMinutes.push(seg)
    minutes += seg
  }
  stops.push(to)
  return { minutes, stops, segMinutes }
}

// Pick the best shared line for two stations (if any). Prefers the line whose
// total segment distance between them is shortest.
function bestSharedLine(from: string, to: string): string | null {
  const fromInfo = findStation(from)
  const toInfo = findStation(to)
  if (!fromInfo || !toInfo) return null
  const shared = fromInfo.lines.filter(l => toInfo.lines.includes(l))
  if (shared.length === 0) return null
  let bestKey = shared[0]
  let bestMin = Infinity
  for (const lk of shared) {
    const seg = segmentMinutes(lk, fromInfo.name, toInfo.name)
    if (seg && seg.minutes < bestMin) {
      bestMin = seg.minutes
      bestKey = lk
    }
  }
  return bestKey
}

// ─────────────────────────────────────────────────────────────────────────────
// FARE LOOKUP — distance-bucketed, modeled on real 2025 GO Transit fares
//
// GO uses zone-based fares; we approximate by inter-station "hops" along a
// line (each hop ≈ a fare zone). For cross-line trips, total hops = legs sum.
// Returns adult e-ticket price; PRESTO is set ~15% lower as the prototype's
// PRESTO-savings narrative.
// ─────────────────────────────────────────────────────────────────────────────

function fareForHops(hops: number): number {
  // Bucketed: real GO fares range $3.30 (1 zone) → ~$13.40 (longest trips)
  if (hops <= 1) return 3.30
  if (hops <= 2) return 4.80
  if (hops <= 3) return 6.25
  if (hops <= 4) return 7.55
  if (hops <= 5) return 8.65
  if (hops <= 6) return 9.55
  if (hops <= 7) return 10.35
  if (hops <= 8) return 11.10
  if (hops <= 9) return 11.85
  if (hops <= 10) return 12.55
  if (hops <= 12) return 13.10
  return 13.40
}

export function fareFor(fromName: string, toName: string): {
  eTicket: number
  presto: number
  savings: number
} {
  const a = findStation(fromName)
  const b = findStation(toName)
  if (!a || !b || a.name === b.name) {
    return { eTicket: 3.30, presto: 2.80, savings: 0.50 }
  }
  // Count hops on the shortest route
  let hops = 0
  const shared = bestSharedLine(a.name, b.name)
  if (shared) {
    const seg = segmentMinutes(shared, a.name, b.name)!
    hops = seg.stops.length - 1
  } else {
    // Via Union
    const aToUnion = bestSharedLine(a.name, HUB)
    const unionToB = bestSharedLine(HUB, b.name)
    if (aToUnion && unionToB) {
      const seg1 = segmentMinutes(aToUnion, a.name, HUB)!
      const seg2 = segmentMinutes(unionToB, HUB, b.name)!
      hops = (seg1.stops.length - 1) + (seg2.stops.length - 1)
    } else {
      hops = 4
    }
  }
  const eTicket = fareForHops(hops)
  // PRESTO ~15% off
  const presto = Math.round((eTicket * 0.85) * 100) / 100
  const savings = Math.round((eTicket - presto) * 100) / 100
  return { eTicket, presto, savings }
}

const $ = (n: number) => `$${n.toFixed(2)}`

// ─────────────────────────────────────────────────────────────────────────────
// TRIP PLANNER — generate a RouteConfig for ANY (from, to) pair
//
// Same line  → direct trip with intermediate stops
// Cross line → leg 1 to Union, ~10 min transfer, leg 2 to destination
// Departure  → deterministic per (route, current-half-hour) so the trip
//              detail screen and search results agree.
// ─────────────────────────────────────────────────────────────────────────────

const DEFAULT_TRANSFER_MIN = 10

// Find the optimal single-transfer trip between two stations on different
// lines. Tries every (lineA, transferStation, lineB) combination where
// transferStation is on both lines, and returns the one with the shortest
// total travel time. Returns null if no single-transfer path exists.
function findBestTransfer(
  from: string,
  to: string
): { lineA: string; lineB: string; transferAt: string; total: number } | null {
  const fromInfo = findStation(from)
  const toInfo = findStation(to)
  if (!fromInfo || !toInfo) return null

  let best: { lineA: string; lineB: string; transferAt: string; total: number } | null = null

  for (const la of fromInfo.lines) {
    const stationsA = new Set(LINES[la].stations)
    for (const lb of toInfo.lines) {
      if (la === lb) continue
      for (const candidate of LINES[lb].stations) {
        if (!stationsA.has(candidate)) continue
        if (candidate === from || candidate === to) continue
        const seg1 = segmentMinutes(la, from, candidate)
        const seg2 = segmentMinutes(lb, candidate, to)
        if (!seg1 || !seg2) continue
        const total = seg1.minutes + DEFAULT_TRANSFER_MIN + seg2.minutes
        if (!best || total < best.total) {
          best = { lineA: la, lineB: lb, transferAt: candidate, total }
        }
      }
    }
  }
  return best
}

// Find the optimal TWO-transfer trip when no 1-transfer path exists.
// Tries every (lineA, transferStation1, lineB, transferStation2, lineC) combo.
// O(L³·S²) worst-case; in practice small enough for the GO network.
function findBestTwoTransfer(
  from: string,
  to: string
): { lineA: string; lineB: string; lineC: string; t1: string; t2: string; total: number } | null {
  const fromInfo = findStation(from)
  const toInfo = findStation(to)
  if (!fromInfo || !toInfo) return null

  let best: { lineA: string; lineB: string; lineC: string; t1: string; t2: string; total: number } | null = null

  for (const la of fromInfo.lines) {
    const sA = new Set(LINES[la].stations)
    for (const lc of toInfo.lines) {
      if (la === lc) continue
      const sC = new Set(LINES[lc].stations)
      for (const lb of Object.keys(LINES)) {
        if (lb === la || lb === lc) continue
        const sB = LINES[lb].stations
        const t1s = sB.filter(s => sA.has(s) && s !== from)
        const t2s = sB.filter(s => sC.has(s) && s !== to)
        for (const t1 of t1s) {
          for (const t2 of t2s) {
            if (t1 === t2) continue   // would be a 1-transfer (already tried)
            const seg1 = segmentMinutes(la, from, t1)
            const seg2 = segmentMinutes(lb, t1, t2)
            const seg3 = segmentMinutes(lc, t2, to)
            if (!seg1 || !seg2 || !seg3) continue
            const total =
              seg1.minutes + DEFAULT_TRANSFER_MIN + seg2.minutes +
              DEFAULT_TRANSFER_MIN + seg3.minutes
            if (!best || total < best.total) {
              best = { lineA: la, lineB: lb, lineC: lc, t1, t2, total }
            }
          }
        }
      }
    }
  }
  return best
}

function shortLabel(name: string): string {
  return name
    .replace(/ GO Centre$/i, '')
    .replace(/ GO$/i, '')
    .replace(/ Station$/i, '')
}

// Build stops list for a direct trip with relative offsets in minutes from
// the trip's start.
function directLeg(
  lineKey: string,
  from: string,
  to: string,
  startOffsetMin: number
): { stops: { name: string; offset: number; major: boolean }[]; duration: number } {
  const seg = segmentMinutes(lineKey, from, to)
  if (!seg) return { stops: [], duration: 0 }
  const stops: { name: string; offset: number; major: boolean }[] = []
  let offset = startOffsetMin
  for (let i = 0; i < seg.stops.length; i++) {
    const major = i === 0 || i === seg.stops.length - 1
    stops.push({ name: seg.stops[i], offset, major })
    if (i < seg.segMinutes.length) offset += seg.segMinutes[i]
  }
  return { stops, duration: seg.minutes }
}

export interface PlannedTrip {
  routeKey: string
  fromName: string
  toName: string
  lineLabel: string            // "Stouffville Line" or "Lakeshore West → Stouffville (via Union)"
  durationMin: number
  fare: { eTicket: number; presto: number; savings: number }
  transfer?: { at: string; waitMin: number }
  // Stops with offsets in minutes from trip departure
  stopOffsets: { name: string; offset: number; major: boolean }[]
}

export function planTrip(fromName: string, toName: string): PlannedTrip {
  const a = findStation(fromName) || findStation(HUB)!
  const b = findStation(toName) || findStation(HUB)!
  const from = a.name
  const to = b.name

  // Same-station edge case — present a no-op trip
  if (from === to) {
    return {
      routeKey: `${from}|${to}`,
      fromName: from,
      toName: to,
      lineLabel: a.lineLabel,
      durationMin: 0,
      fare: fareFor(from, to),
      stopOffsets: [{ name: from, offset: 0, major: true }],
    }
  }

  const sharedLine = bestSharedLine(from, to)
  if (sharedLine) {
    const leg = directLeg(sharedLine, from, to, 0)
    return {
      routeKey: `${from}|${to}`,
      fromName: from,
      toName: to,
      lineLabel: `${LINES[sharedLine].name} Line`,
      durationMin: leg.duration,
      fare: fareFor(from, to),
      stopOffsets: leg.stops,
    }
  }

  // Cross-line — find the best single-transfer path through any shared station.
  // (Generalized from "Union only": now any station on both lines can act as
  // the transfer point, enabling bus↔train and bus↔bus transfers at terminals
  // like Square One, Pearson, or anywhere a route meets a train line.)
  const best = findBestTransfer(from, to)
  if (best) {
    const { lineA, lineB, transferAt } = best
    const leg1 = directLeg(lineA, from, transferAt, 0)
    const transferOffset = leg1.duration
    const leg2Start = transferOffset + DEFAULT_TRANSFER_MIN
    const leg2 = directLeg(lineB, transferAt, to, leg2Start)

    const combined: { name: string; offset: number; major: boolean }[] = []
    for (const s of leg1.stops) {
      if (s.name === transferAt) continue
      combined.push(s)
    }
    combined.push({ name: transferAt, offset: transferOffset, major: true })
    for (let i = 1; i < leg2.stops.length; i++) combined.push(leg2.stops[i])

    const shortFor = (k: string) =>
      LINES[k].type === 'bus' ? `Bus ${LINES[k].short}` : `${LINES[k].name} Line`
    return {
      routeKey: `${from}|${to}`,
      fromName: from,
      toName: to,
      lineLabel: `${shortFor(lineA)} → ${shortFor(lineB)} (via ${shortLabel(transferAt)})`,
      durationMin: leg1.duration + DEFAULT_TRANSFER_MIN + leg2.duration,
      fare: fareFor(from, to),
      transfer: { at: transferAt, waitMin: DEFAULT_TRANSFER_MIN },
      stopOffsets: combined,
    }
  }

  // No single-transfer path — try a 2-transfer trip (e.g. Square One →
  // Cooksville → Union → Oshawa, or York U → Brampton → Union → Markham).
  const best2 = findBestTwoTransfer(from, to)
  if (best2) {
    const { lineA, lineB, lineC, t1, t2 } = best2
    const leg1 = directLeg(lineA, from, t1, 0)
    const t1Offset = leg1.duration
    const leg2Start = t1Offset + DEFAULT_TRANSFER_MIN
    const leg2 = directLeg(lineB, t1, t2, leg2Start)
    const t2Offset = leg2Start + leg2.duration
    const leg3Start = t2Offset + DEFAULT_TRANSFER_MIN
    const leg3 = directLeg(lineC, t2, to, leg3Start)

    const combined: { name: string; offset: number; major: boolean }[] = []
    for (const s of leg1.stops) {
      if (s.name === t1) continue
      combined.push(s)
    }
    combined.push({ name: t1, offset: t1Offset, major: true })
    for (let i = 1; i < leg2.stops.length; i++) {
      if (leg2.stops[i].name === t2) continue
      combined.push(leg2.stops[i])
    }
    combined.push({ name: t2, offset: t2Offset, major: true })
    for (let i = 1; i < leg3.stops.length; i++) combined.push(leg3.stops[i])

    const shortFor = (k: string) =>
      LINES[k].type === 'bus' ? `Bus ${LINES[k].short}` : `${LINES[k].name}`
    return {
      routeKey: `${from}|${to}`,
      fromName: from,
      toName: to,
      lineLabel: `${shortFor(lineA)} → ${shortFor(lineB)} → ${shortFor(lineC)}`,
      durationMin: leg1.duration + DEFAULT_TRANSFER_MIN + leg2.duration + DEFAULT_TRANSFER_MIN + leg3.duration,
      fare: fareFor(from, to),
      transfer: { at: `${shortLabel(t1)} → ${shortLabel(t2)}`, waitMin: DEFAULT_TRANSFER_MIN * 2 },
      stopOffsets: combined,
    }
  }

  // Final fallback: Union-via if both touch Union; otherwise return a stub.
  const lineA = a.lines.find(l => LINES[l].stations.includes(HUB)) || a.lines[0]
  const lineB = b.lines.find(l => LINES[l].stations.includes(HUB)) || b.lines[0]
  if (!lineA || !lineB || !LINES[lineA].stations.includes(HUB) || !LINES[lineB].stations.includes(HUB)) {
    return {
      routeKey: `${from}|${to}`,
      fromName: from,
      toName: to,
      lineLabel: 'No direct service',
      durationMin: 0,
      fare: fareFor(from, to),
      stopOffsets: [
        { name: from, offset: 0, major: true },
        { name: to, offset: 0, major: true },
      ],
    }
  }
  const leg1 = directLeg(lineA, from, HUB, 0)
  const transferOffset = leg1.duration
  const leg2Start = transferOffset + DEFAULT_TRANSFER_MIN
  const leg2 = directLeg(lineB, HUB, to, leg2Start)
  const combined: { name: string; offset: number; major: boolean }[] = []
  for (const s of leg1.stops) {
    if (s.name === HUB) continue
    combined.push(s)
  }
  combined.push({ name: HUB, offset: transferOffset, major: true })
  for (let i = 1; i < leg2.stops.length; i++) combined.push(leg2.stops[i])
  return {
    routeKey: `${from}|${to}`,
    fromName: from,
    toName: to,
    lineLabel: `${LINES[lineA].name} → ${LINES[lineB].name} (via Union)`,
    durationMin: leg1.duration + DEFAULT_TRANSFER_MIN + leg2.duration,
    fare: fareFor(from, to),
    transfer: { at: HUB, waitMin: DEFAULT_TRANSFER_MIN },
    stopOffsets: combined,
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// LIVE TIME SIMULATION — next departures
//
// Trains: snap to a line's running interval (peak: 15-20 min, off-peak: 30-60).
// Returns deterministic departures based on the current half-hour, so all
// screens computing the same trip see the same "next train" until the clock
// moves on.
// ─────────────────────────────────────────────────────────────────────────────

function isPeakHour(d: Date): boolean {
  const day = d.getDay()  // 0 = Sun
  if (day === 0 || day === 6) return false
  const h = d.getHours()
  return (h >= 6 && h <= 9) || (h >= 16 && h <= 19)
}

function dominantLineKey(trip: PlannedTrip): string {
  // Use the line of the first leg (it controls the first departure)
  const aInfo = findStation(trip.fromName)
  if (!aInfo) return 'lakeshore-west'
  if (trip.transfer && aInfo.lines.length > 0) return aInfo.lines[0]
  return aInfo.lines[0]
}

function intervalForTrip(trip: PlannedTrip, at: Date): number {
  const lk = dominantLineKey(trip)
  const line = LINES[lk]
  return isPeakHour(at) ? line.peakIntervalMin : line.offPeakIntervalMin
}

interface Departure {
  departure: string
  arrival: string
  durationMin: number
  from: string
  to: string
  line: string
}

export function planDepartures(
  trip: PlannedTrip,
  at: Date = new Date(),
  count = 5
): Departure[] {
  const interval = intervalForTrip(trip, at)
  const totalMinNow = at.getHours() * 60 + at.getMinutes()
  // Next departure ≥ now + 6 min buffer
  const buffer = 6
  const minDepart = totalMinNow + buffer
  // Snap to next multiple of `interval`, offset by line-specific minute marker
  // for variety (so different lines feel slightly desynced like real life).
  const lkOffset = (dominantLineKey(trip).length * 3) % interval  // pseudo-stable per line
  const next = Math.ceil((minDepart - lkOffset) / interval) * interval + lkOffset

  const out: Departure[] = []
  for (let i = 0; i < count; i++) {
    const depMin = next + i * interval
    if (depMin >= 24 * 60) break
    const arrMin = depMin + trip.durationMin
    if (arrMin >= 24 * 60 + 60) break  // skip rides that bleed past 1 AM
    out.push({
      departure: fmtTime(Math.floor(depMin / 60) % 24, depMin % 60),
      arrival: fmtTime(Math.floor(arrMin / 60) % 24, arrMin % 60),
      durationMin: trip.durationMin,
      from: trip.fromName,
      to: trip.toName,
      line: trip.lineLabel,
    })
  }
  return out
}

// ─────────────────────────────────────────────────────────────────────────────
// BACKWARDS-COMPATIBLE API — what the existing screens already import
// ─────────────────────────────────────────────────────────────────────────────

export function fmtTime(h: number, m: number) {
  const p = h >= 12 ? 'PM' : 'AM'
  const h12 = h % 12 || 12
  return `${h12}:${m.toString().padStart(2, '0')} ${p}`
}

// Build a RouteConfig (the legacy shape) from a PlannedTrip + a chosen departure.
function plannedToRouteConfig(trip: PlannedTrip, dep: Departure): RouteConfig {
  // Convert stopOffsets to TripStops with absolute times anchored at dep.departure
  const m = dep.departure.match(/(\d+):(\d+)\s*(AM|PM)/i)!
  let h = parseInt(m[1])
  const min = parseInt(m[2])
  if (m[3].toUpperCase() === 'PM' && h !== 12) h += 12
  if (m[3].toUpperCase() === 'AM' && h === 12) h = 0
  const startMin = h * 60 + min
  const stops: TripStop[] = trip.stopOffsets.map(s => {
    const t = startMin + s.offset
    return {
      name: s.name,
      time: fmtTime(Math.floor(t / 60) % 24, t % 60),
      major: s.major || s.name === trip.fromName || s.name === trip.toName,
    }
  })
  return {
    key: trip.routeKey,
    line: trip.lineLabel,
    from: trip.fromName,
    to: trip.toName,
    color: GO_GREEN,
    stops,
    eTicketPrice: $(trip.fare.eTicket),
    prestoPrice:  $(trip.fare.presto),
    prestoSavings: $(trip.fare.savings),
    duration: `${trip.durationMin} min`,
    mapLabel1: shortLabel(trip.fromName),
    mapLabel2: shortLabel(trip.toName),
    transfer: trip.transfer,
  }
}

// Decode a route key back into a planned trip + first departure.
// Key format: "From Name|To Name". Falls back to a sensible default.
function decodeRouteKey(key: string): RouteConfig {
  // Defaults if key is malformed
  let from = 'Milliken GO'
  let to = HUB
  if (key && key.includes('|')) {
    const [f, t] = key.split('|')
    from = f
    to = t
  } else if (key === 'stouffville') { from = 'Milliken GO'; to = HUB }
  else if (key === 'lakeshore-east') { from = HUB; to = 'Oshawa GO' }
  else if (key === 'lakeshore-west') { from = HUB; to = 'Burlington GO' }
  else if (key === 'barrie') { from = HUB; to = 'Aurora GO' }
  else if (key === 'milton') { from = HUB; to = 'Milton GO' }
  else if (key === 'kitchener') { from = HUB; to = 'Kitchener GO' }
  else if (key === 'richmond-hill') { from = HUB; to = 'Richmond Hill GO' }
  else if (LINES[key]) {
    // Bus or train line key: use the line's first and last stations
    const stations = LINES[key].stations
    from = stations[0]
    to = stations[stations.length - 1]
  }
  const trip = planTrip(from, to)
  const deps = planDepartures(trip, new Date(), 1)
  const dep: Departure = deps[0] || {
    departure: '9:00 AM',
    arrival: fmtTime(9, trip.durationMin),
    durationMin: trip.durationMin,
    from: trip.fromName,
    to: trip.toName,
    line: trip.lineLabel,
  }
  const cfg = plannedToRouteConfig(trip, dep)
  // Attach a couple of canned alerts for demo realism (only on certain routes)
  if (from.includes('Pickering') || to.includes('Pickering') || from.includes('Oshawa') || to.includes('Oshawa')) {
    cfg.alert = {
      severity: 'warning',
      title: 'Track maintenance near Pickering',
      message: 'Expect delays of 5–10 min between Scarborough GO and Pickering GO due to scheduled track work.',
    }
  } else if ((from.includes('Burlington') || to.includes('Burlington')) && (new Date().getDay() === 0 || new Date().getDay() === 6)) {
    cfg.alert = {
      severity: 'info',
      title: 'Weekend schedule change',
      message: 'Reduced service on Sat & Sun. Trains run every 60 min instead of 30 min.',
    }
  }
  return cfg
}

// ROUTES — a Proxy so any key (including dynamic "From|To" keys) resolves
// to a freshly computed RouteConfig. Cached per key per page-load so
// screens that read the same key get consistent objects.
const _routeCache = new Map<string, RouteConfig>()

export const ROUTES: Record<string, RouteConfig> = new Proxy({} as Record<string, RouteConfig>, {
  get(_t, prop) {
    // Guard against symbol keys (e.g. Symbol.toStringTag) and a few well-known
    // string keys that frameworks probe (Promise interop, JSON serialization).
    if (typeof prop !== 'string') return undefined
    if (prop === 'then' || prop === 'toJSON') return undefined
    if (!_routeCache.has(prop)) {
      _routeCache.set(prop, decodeRouteKey(prop))
    }
    return _routeCache.get(prop)
  },
  has(_t, prop) {
    return typeof prop === 'string'
  },
})

export function getRouteKeyFromStations(from: string, to: string): string {
  const a = findStation(from)
  const b = findStation(to)
  const f = a?.name || from || 'Milliken GO'
  const t = b?.name || to || HUB
  return `${f}|${t}`
}

export function generateDepartures(route: RouteConfig, count = 5, at: Date = new Date()) {
  // Reconstruct a PlannedTrip from the RouteConfig to compute fresh times.
  const trip = planTrip(route.from, route.to)
  return planDepartures(trip, at, count)
}

export function generateStopTimes(route: RouteConfig, departureTime: string): TripStop[] {
  const trip = planTrip(route.from, route.to)
  const m = departureTime.match(/(\d+):(\d+)\s*(AM|PM)/i)
  if (!m) return route.stops
  let h = parseInt(m[1])
  const min = parseInt(m[2])
  if (m[3].toUpperCase() === 'PM' && h !== 12) h += 12
  if (m[3].toUpperCase() === 'AM' && h === 12) h = 0
  const startMin = h * 60 + min
  return trip.stopOffsets.map(s => {
    const t = startMin + s.offset
    return {
      name: s.name,
      time: fmtTime(Math.floor(t / 60) % 24, t % 60),
      major: s.major || s.name === trip.fromName || s.name === trip.toName,
    }
  })
}

export const DEFAULT_ROUTE = 'Milliken GO|Union Station GO'
