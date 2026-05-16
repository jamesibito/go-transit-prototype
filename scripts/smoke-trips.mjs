import { planTrip, planDepartures, ROUTES, STATIONS, LINES, getRouteKeyFromStations } from '../src/data/trips.ts'

const TRAIN_CASES = [
  ['Burlington GO', 'Union Station GO'],
  ['Oshawa GO',     'Union Station GO'],
  ['Aurora GO',     'Union Station GO'],
  ['Milton GO',     'Union Station GO'],
  ['Kitchener GO',  'Union Station GO'],
  ['Markham GO',    'Union Station GO'],
  ['Richmond Hill GO', 'Union Station GO'],
  ['Oakville GO', 'Mimico GO'],
  ['Pickering GO', 'Whitby GO'],
  ['Maple GO', 'Aurora GO'],
  ['Burlington GO',          'Oshawa GO'],
  ['Milton GO',              'Markham GO'],
  ['Aurora GO',              'Kitchener GO'],
  ['Richmond Hill GO',       'Pickering GO'],
  ['Allandale Waterfront GO','West Harbour GO'],
  ['Lincolnville GO',        'Milton GO'],
]

const BUS_CASES = [
  ['Niagara Falls Bus Terminal', 'Hamilton GO Centre'],
  ['McMaster University',        'Union Station GO'],
  ['University of Waterloo',     'Square One Bus Terminal'],
  ['Brampton GO',                'York University'],
  ['Newmarket GO',               'Pearson Airport Terminal 1'],
  ['Milton GO',                  'Square One Bus Terminal'],
]

const CROSS_MODAL_CASES = [
  ['McMaster University',        'Mimico GO'],
  ['Pearson Airport Terminal 1', 'Union Station GO'],
  ['Square One Bus Terminal',    'Oshawa GO'],
  ['Niagara Falls Bus Terminal', 'Aurora GO'],
  ['Vaughan Metropolitan Centre','Union Station GO'],
  ['York University',            'Markham GO'],
  ['University of Waterloo',     'Union Station GO'],
]

console.log(`Network: ${STATIONS.length} stations across ${Object.keys(LINES).length} lines (` +
  `${Object.values(LINES).filter(l => l.type === 'train').length} train, ` +
  `${Object.values(LINES).filter(l => l.type === 'bus').length} bus)`)

function show(cases, header) {
  console.log(`\n=== ${header} ===`)
  for (const [from, to] of cases) {
    const trip = planTrip(from, to)
    const deps = planDepartures(trip, new Date(), 1)
    const dep = deps[0]
    const xfer = trip.transfer ? ` * via ${trip.transfer.at}` : ''
    const depStr = dep ? `${dep.departure} -> ${dep.arrival}` : 'n/a'
    console.log(
      `${from.padEnd(32)} -> ${to.padEnd(32)} | ${String(trip.durationMin).padStart(3)}m | $${trip.fare.eTicket.toFixed(2).padStart(5)} | ${depStr.padEnd(20)} | ${trip.lineLabel}${xfer}`
    )
  }
}

show(TRAIN_CASES, 'Train trips')
show(BUS_CASES, 'Bus trips')
show(CROSS_MODAL_CASES, 'Cross-modal (bus + train)')

const trainStations = STATIONS.filter(s => s.type === 'train').length
const busStations   = STATIONS.filter(s => s.type === 'bus').length
const mixedStations = STATIONS.filter(s => s.type === 'mixed').length
console.log(`\nStation breakdown: ${trainStations} train, ${busStations} bus, ${mixedStations} mixed`)

console.log('\n=== Legacy keys ===')
for (const key of ['stouffville', 'lakeshore-east', 'route-12', 'route-34']) {
  const r = ROUTES[key]
  console.log(`  ${key.padEnd(20)} -> ${r.from} -> ${r.to} | ${r.duration} | ${r.eTicketPrice}`)
}

const aliasKey = getRouteKeyFromStations('Miliken GO', 'Union Station GO')
console.log(`\nTypo alias: ${ROUTES[aliasKey].from} -> ${ROUTES[aliasKey].to} | ${ROUTES[aliasKey].duration}`)
