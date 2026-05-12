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
  line: string
  from: string
  to: string
  color: string
  stops: TripStop[]
  eTicketPrice: string
  prestoPrice: string
  prestoSavings: string
  duration: string
  alert?: ServiceAlert
  mapLabel1: string
  mapLabel2: string
}

export const ROUTES: Record<string, RouteConfig> = {
  stouffville: {
    key: 'stouffville',
    line: 'Stouffville Line',
    from: 'Miliken GO',
    to: 'Union Station GO',
    color: '#357a1e',
    stops: [
      { name: 'Miliken GO', time: '10:54 AM', major: true },
      { name: 'Agincourt GO', time: '11:00 AM', major: false },
      { name: 'Kennedy GO', time: '11:07 AM', major: false },
      { name: 'Scarborough GO', time: '11:14 AM', major: false },
      { name: 'Union Station GO', time: '11:29 AM', major: true },
    ],
    eTicketPrice: '$9.05',
    prestoPrice: '$7.62',
    prestoSavings: '$1.43',
    duration: '35 min',
    mapLabel1: 'Milliken',
    mapLabel2: 'Union',
  },
  'lakeshore-east': {
    key: 'lakeshore-east',
    line: 'Lakeshore East',
    from: 'Union Station GO',
    to: 'Oshawa GO',
    color: '#357a1e',
    stops: [
      { name: 'Union Station GO', time: '9:15 AM', major: true },
      { name: 'Danforth GO', time: '9:24 AM', major: false },
      { name: 'Scarborough GO', time: '9:31 AM', major: false },
      { name: 'Eglinton GO', time: '9:38 AM', major: false },
      { name: 'Pickering GO', time: '9:48 AM', major: false },
      { name: 'Ajax GO', time: '9:54 AM', major: false },
      { name: 'Whitby GO', time: '10:01 AM', major: false },
      { name: 'Oshawa GO', time: '10:10 AM', major: true },
    ],
    eTicketPrice: '$12.35',
    prestoPrice: '$10.40',
    prestoSavings: '$1.95',
    duration: '55 min',
    alert: {
      severity: 'warning',
      title: 'Track maintenance near Pickering',
      message: 'Expect delays of 5–10 min between Scarborough GO and Pickering GO due to scheduled track work. May 7–14.',
    },
    mapLabel1: 'Union',
    mapLabel2: 'Oshawa',
  },
  barrie: {
    key: 'barrie',
    line: 'Barrie Line',
    from: 'Union Station GO',
    to: 'Aurora GO',
    color: '#357a1e',
    stops: [
      { name: 'Union Station GO', time: '8:30 AM', major: true },
      { name: 'Downsview Park GO', time: '8:47 AM', major: false },
      { name: 'Rutherford GO', time: '8:58 AM', major: false },
      { name: 'Maple GO', time: '9:04 AM', major: false },
      { name: 'King City GO', time: '9:12 AM', major: false },
      { name: 'Aurora GO', time: '9:20 AM', major: true },
    ],
    eTicketPrice: '$10.80',
    prestoPrice: '$9.10',
    prestoSavings: '$1.70',
    duration: '50 min',
    mapLabel1: 'Union',
    mapLabel2: 'Aurora',
  },
  'lakeshore-west': {
    key: 'lakeshore-west',
    line: 'Lakeshore West',
    from: 'Union Station GO',
    to: 'Burlington GO',
    color: '#357a1e',
    stops: [
      { name: 'Union Station GO', time: '10:00 AM', major: true },
      { name: 'Exhibition GO', time: '10:06 AM', major: false },
      { name: 'Mimico GO', time: '10:12 AM', major: false },
      { name: 'Long Branch GO', time: '10:18 AM', major: false },
      { name: 'Port Credit GO', time: '10:27 AM', major: false },
      { name: 'Clarkson GO', time: '10:33 AM', major: false },
      { name: 'Oakville GO', time: '10:41 AM', major: false },
      { name: 'Burlington GO', time: '10:52 AM', major: true },
    ],
    eTicketPrice: '$11.50',
    prestoPrice: '$9.68',
    prestoSavings: '$1.82',
    duration: '52 min',
    alert: {
      severity: 'info',
      title: 'Weekend schedule change',
      message: 'Reduced service on Sat & Sun. Trains run every 60 min instead of 30 min. Regular schedule resumes Mon.',
    },
    mapLabel1: 'Union',
    mapLabel2: 'Burlington',
  },
  'highway-407': {
    key: 'highway-407',
    line: 'Highway 407 Bus',
    from: 'Mississauga City Centre',
    to: 'Markham Stouffville Hospital',
    color: '#357a1e',
    stops: [
      { name: 'Mississauga City Centre', time: '7:30 AM', major: true },
      { name: 'Brampton Gateway', time: '7:48 AM', major: false },
      { name: 'Highway 407 & 400', time: '8:02 AM', major: false },
      { name: 'VMC Bus Terminal', time: '8:12 AM', major: false },
      { name: 'Highway 407 & 404', time: '8:28 AM', major: false },
      { name: 'Markham Stouffville Hospital', time: '8:40 AM', major: true },
    ],
    eTicketPrice: '$8.20',
    prestoPrice: '$6.90',
    prestoSavings: '$1.30',
    duration: '70 min',
    mapLabel1: 'Mississauga',
    mapLabel2: 'Markham',
  },
}

// Map search history entries to route keys
export function getRouteKeyFromStations(from: string, to: string): string {
  const f = from.toLowerCase()
  const t = to.toLowerCase()
  if (f.includes('oshawa') || t.includes('oshawa')) return 'lakeshore-east'
  if (f.includes('king city') || t.includes('king city') || f.includes('aurora') || t.includes('aurora') || f.includes('barrie') || t.includes('barrie')) return 'barrie'
  if (f.includes('burlington') || t.includes('burlington') || f.includes('oakville') || t.includes('oakville')) return 'lakeshore-west'
  if (f.includes('mississauga') || t.includes('mississauga') || f.includes('markham') || t.includes('markham') || f.includes('407')) return 'highway-407'
  return 'stouffville'
}

// Format hour+minute to "H:MM AM/PM"
export function fmtTime(h: number, m: number) {
  const p = h >= 12 ? 'PM' : 'AM'
  const h12 = h % 12 || 12
  return `${h12}:${m.toString().padStart(2, '0')} ${p}`
}

// Generate realistic departure times starting from now
export function generateDepartures(route: RouteConfig, count = 5) {
  const now = new Date()
  const currentH = now.getHours()
  const currentM = now.getMinutes()

  // Duration in minutes
  const durMin = parseInt(route.duration)

  // GO trains typically run every 30-60 min, buses every 30-45 min
  const isBus = route.key === 'highway-407'
  const interval = isBus ? 40 : 30  // minutes between departures

  // Next departure: round up to next interval + 5-15 min buffer
  const totalMinNow = currentH * 60 + currentM
  const buffer = 8 + Math.floor(Math.random() * 7) // 8-14 min from now
  const firstDepMin = totalMinNow + buffer
  // Round to nice minute (next :04, :24, :44 pattern for trains)
  const roundedFirst = isBus
    ? Math.ceil(firstDepMin / 15) * 15
    : firstDepMin - (firstDepMin % interval) + interval + 4

  const results = []
  for (let i = 0; i < count; i++) {
    const depTotalMin = roundedFirst + (i * interval)
    if (depTotalMin >= 24 * 60) break // past midnight
    const depH = Math.floor(depTotalMin / 60)
    const depM = depTotalMin % 60
    const arrTotalMin = depTotalMin + durMin
    const arrH = Math.floor(arrTotalMin / 60)
    const arrM = arrTotalMin % 60
    results.push({
      departure: fmtTime(depH, depM),
      arrival: fmtTime(arrH, arrM),
      from: route.from,
      to: route.to,
      line: route.line,
    })
  }
  return results
}

// Generate realistic stop times based on a given departure time
export function generateStopTimes(route: RouteConfig, departureTime: string): TripStop[] {
  const match = departureTime.match(/(\d+):(\d+)\s*(AM|PM)/i)
  if (!match) return route.stops

  let depH = parseInt(match[1])
  const depM = parseInt(match[2])
  const period = match[3].toUpperCase()
  if (period === 'PM' && depH !== 12) depH += 12
  if (period === 'AM' && depH === 12) depH = 0

  const totalStops = route.stops.length
  const durMin = parseInt(route.duration)
  const avgInterval = durMin / (totalStops - 1)

  return route.stops.map((stop, i) => {
    const elapsed = Math.round(i * avgInterval)
    const stopTotalMin = depH * 60 + depM + elapsed
    const stopH = Math.floor(stopTotalMin / 60)
    const stopM = stopTotalMin % 60
    return { ...stop, time: fmtTime(stopH, stopM) }
  })
}

export const DEFAULT_ROUTE = 'stouffville'
