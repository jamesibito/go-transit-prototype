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
}

// Map search history entries to route keys
export function getRouteKeyFromStations(from: string, to: string): string {
  const f = from.toLowerCase()
  const t = to.toLowerCase()
  if (f.includes('oshawa') || t.includes('oshawa')) return 'lakeshore-east'
  if (f.includes('king city') || t.includes('king city') || f.includes('aurora') || t.includes('aurora') || f.includes('barrie') || t.includes('barrie')) return 'barrie'
  if (f.includes('burlington') || t.includes('burlington') || f.includes('oakville') || t.includes('oakville')) return 'lakeshore-west'
  return 'stouffville'
}

// Generate departure times for search results
export function generateDepartures(route: RouteConfig, count = 5) {
  const firstStop = route.stops[0]
  // lastStop available via route.stops[route.stops.length - 1]
  // Parse the base time from first stop
  const match = firstStop.time.match(/(\d+):(\d+)\s*(AM|PM)/i)
  if (!match) return []

  let baseHour = parseInt(match[1])
  const baseMin = parseInt(match[2])
  const period = match[3].toUpperCase()
  if (period === 'PM' && baseHour !== 12) baseHour += 12
  if (period === 'AM' && baseHour === 12) baseHour = 0

  // Duration in minutes
  const durMin = parseInt(route.duration)

  const fmtTime = (h: number, m: number) => {
    const p = h >= 12 ? 'PM' : 'AM'
    const h12 = h % 12 || 12
    return `${h12}:${m.toString().padStart(2, '0')} ${p}`
  }

  const results = []
  // Start 3 hours before the stop time to get a good spread
  const startHour = Math.max(6, baseHour - 3)
  for (let i = 0; i < count; i++) {
    const depH = startHour + i
    const depM = baseMin
    if (depH >= 24) break
    const arrH = depH + Math.floor((depM + durMin) / 60)
    const arrM = (depM + durMin) % 60
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

export const DEFAULT_ROUTE = 'stouffville'
