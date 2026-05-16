// Smoke test the trip planner against a basket of real GTA journeys.
// Run: node scripts/smoke-trips.mjs

import { planTrip, planDepartures, ROUTES, STATIONS, LINES, getRouteKeyFromStations } from '../src/data/trips.ts'

const CASES = [
  // Same-line, suburb → Union
  ['Burlington GO',          'Union Station GO'],
  ['Oshawa GO',              'Union Station GO'],
  ['Aurora GO',              'Union Station GO'],
  ['Milton GO',              'Union Station GO'],
  ['Kitchener GO',           'Union Station GO'],
  ['Markham GO',             'Union Station GO'],
  ['Richmond Hill GO',       'Union Station GO'],

  // Same-line, reverse
  ['Union Station GO',       'Pickering GO'],
  ['Union Station GO',       'Mimico GO'],

  // Same-line, suburb to suburb (no transfer)
  ['Oakville GO',            'Mimico GO'],          // LW
  ['Pickering GO',           'Whitby GO'],          // LE
  ['Maple GO',               'Aurora GO'],          // Barrie

  // Cross-line via Union
  ['Burlington GO',          'Oshawa GO'],          // LW → LE
  ['Milton GO',              'Markham GO'],         // MI → ST
  ['Aurora GO',              'Kitchener GO'],       // BA → KI
  ['Richmond Hill GO',       'Pickering GO'],       // RH → LE
  ['Allandale Waterfront GO','West Harbour GO'],    // BA → LW, longest plausible
  ['Lincolnville GO',        'Milton GO'],          // ST → MI

  // Bramalea (Brampton resident) commute
  ['Bramalea GO',            'Union Station GO'],   // KI direct
  ['Brampton GO',            'Oakville GO'],        // KI → LW cross
]

console.log(`Stations: ${STATIONS.length} across ${Object.keys(LINES).length} lines\n`)

for (const [from, to] of CASES) {
  const trip = planTrip(from, to)
  const deps = planDepartures(trip, new Date(), 1)
  const dep = deps[0]
  const xfer = trip.transfer ? ` [transfer at ${trip.transfer.at}, ${trip.transfer.waitMin}m wait]` : ''
  console.log(`${from.padEnd(28)} → ${to.padEnd(28)} | ${String(trip.durationMin).padStart(3)}m | $${trip.fare.eTicket.toFixed(2)} (PRESTO $${trip.fare.presto.toFixed(2)}) | ${dep?.departure ?? 'n/a'} → ${dep?.arrival ?? 'n/a'} | ${trip.lineLabel}${xfer}`)
}

// Verify the legacy key path still works
console.log('\nLegacy key smoke:')
for (const key of ['stouffville', 'lakeshore-east', 'barrie', 'kitchener', 'milton', 'richmond-hill', 'lakeshore-west']) {
  const r = ROUTES[key]
  console.log(`  ${key.padEnd(16)} → ${r.from} → ${r.to} | ${r.duration} | ${r.eTicketPrice}`)
}

// Verify the dynamic-key path also works
const dyn = getRouteKeyFromStations('Mimico GO', 'Oshawa GO')
console.log(`\nDynamic key: "${dyn}" →`, ROUTES[dyn].duration, ROUTES[dyn].eTicketPrice, ROUTES[dyn].line)

// Edge cases
console.log('\nEdge cases:')
console.log('Same station:', JSON.stringify(planTrip('Aurora GO', 'Aurora GO'), null, 2).slice(0, 200))
const tinyKey = getRouteKeyFromStations('Mimico GO', 'Exhibition GO')  // adjacent
console.log(`Adjacent (Mimico → Exhibition): ${ROUTES[tinyKey].duration}, ${ROUTES[tinyKey].eTicketPrice}`)
const aliasKey = getRouteKeyFromStations('Miliken GO', 'Union Station GO')  // typo
console.log(`Typo alias (Miliken → Union): ${ROUTES[aliasKey].from} → ${ROUTES[aliasKey].to}, ${ROUTES[aliasKey].duration}`)

// Check intermediate stops produce reasonable sequential times
console.log('\nStop times for Bramalea → Union Station GO:')
const k = getRouteKeyFromStations('Bramalea GO', 'Union Station GO')
for (const s of ROUTES[k].stops) console.log(`  ${s.time}  ${s.major ? '●' : '○'}  ${s.name}`)

console.log('\nStop times for Burlington → Oshawa (cross-line):')
const k2 = getRouteKeyFromStations('Burlington GO', 'Oshawa GO')
for (const s of ROUTES[k2].stops) console.log(`  ${s.time}  ${s.major ? '●' : '○'}  ${s.name}`)
