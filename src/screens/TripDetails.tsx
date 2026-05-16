import { useNav } from '../App'
import { ChevronLeft, StarIcon, AlertIcon } from '../components/Icons'
import { ROUTES, generateStopTimes, fmtTime } from '../data/trips'

function TransitMap({ label1, label2 }: { label1: string; label2: string }) {
  return (
    <div className="w-full overflow-hidden" style={{ height: 200, background: 'var(--surface-green-soft)', position: 'relative' }}>
      <svg width="100%" height="100%" viewBox="0 0 390 200" preserveAspectRatio="xMidYMid slice">
        <rect width="390" height="200" fill="var(--surface-green-soft)"/>
        {[40,80,120,160].map(y => <line key={y} x1="0" y1={y} x2="390" y2={y} stroke="var(--border-green)" strokeWidth="1"/>)}
        {[60,120,180,240,300,360].map(x => <line key={x} x1={x} y1="0" x2={x} y2="200" stroke="var(--border-green)" strokeWidth="1"/>)}
        <line x1="0" y1="110" x2="390" y2="110" stroke="var(--border-green)" strokeWidth="5"/>
        <line x1="195" y1="0" x2="195" y2="200" stroke="var(--border-green)" strokeWidth="5"/>
        <path d="M 300 15 Q 260 55 220 90 Q 180 125 120 165" stroke="#357a1e" strokeWidth="4.5" fill="none" strokeLinecap="round"/>
        <circle cx="120" cy="165" r="7" fill="#357a1e" stroke="var(--surface-primary)" strokeWidth="2"/>
        <circle cx="170" cy="125" r="4.5" fill="var(--surface-primary)" stroke="#357a1e" strokeWidth="2"/>
        <circle cx="220" cy="90" r="4.5" fill="var(--surface-primary)" stroke="#357a1e" strokeWidth="2"/>
        <circle cx="260" cy="55" r="4.5" fill="var(--surface-primary)" stroke="#357a1e" strokeWidth="2"/>
        <circle cx="300" cy="15" r="7" fill="#357a1e" stroke="var(--surface-primary)" strokeWidth="2"/>
        <text x="108" y="185" fontSize="10" fill="var(--text-primary)" fontFamily="sans-serif" fontWeight="bold">{label2}</text>
        <text x="293" y="12" fontSize="10" fill="var(--text-primary)" fontFamily="sans-serif" fontWeight="bold">{label1}</text>
        <rect x="8" y="8" width="90" height="22" rx="6" fill="#357a1e"/>
        <text x="53" y="22" fontSize="11" fill="white" fontFamily="sans-serif" fontWeight="bold" textAnchor="middle">{label1}</text>
      </svg>
      <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 40, background: 'linear-gradient(transparent, var(--surface-primary))' }} />
    </div>
  )
}

export default function TripDetails() {
  const { goBack, navigate, favorites, toggleFavorite, selectedRoute, setPurchaseType, setFareDetails, selectedDeparture } = useNav()
  const route = ROUTES[selectedRoute] || ROUTES.stouffville
  // Use the departure the user actually tapped from the results list.
  // Fall back to a synthesized "next ~10 min" departure only when the
  // screen is reached without a chosen trip (e.g. deep-linked).
  let departureStr: string
  if (selectedDeparture) {
    departureStr = selectedDeparture.departure
  } else {
    const now = new Date()
    const depMin = now.getMinutes() + 10 + Math.floor(Math.random() * 5)
    const depH = now.getHours() + Math.floor(depMin / 60)
    const depM = depMin % 60
    departureStr = fmtTime(depH, depM)
  }
  const stops = generateStopTimes(route, departureStr)
  const firstTime = stops[0].time
  const lastTime = stops[stops.length - 1].time
  const tripId = `${route.key}-${firstTime.replace(/[\s:]/g, '').toLowerCase()}`
  const isFavorited = favorites.has(tripId)

  return (
    <div className="min-h-full" style={{ background: 'var(--surface-primary)', marginTop: -48 }}>
      {/* Map area — extends behind status bar */}
      <div style={{ position: 'relative', paddingTop: 48 }}>
        <TransitMap label1={route.mapLabel1} label2={route.mapLabel2} />
        <button
          className="pressable absolute left-4 w-10 h-10 rounded-full flex items-center justify-center"
          style={{ top: 60, background: 'var(--surface-card)', boxShadow: '0 2px 8px rgba(0,0,0,0.15)' }}
          onClick={goBack}
        >
          <ChevronLeft size={22} color="var(--text-primary)" strokeWidth={2.5} />
        </button>
      </div>

      {/* Trip summary */}
      <div className="px-5 pt-4 pb-3 flex items-start justify-between">
        <div>
          <h2 style={{ fontSize: 22, fontWeight: 900, color: 'var(--text-primary)', fontFamily: 'inherit', letterSpacing: '-0.4px' }}>
            {firstTime} – {lastTime}
          </h2>
          <p style={{ fontSize: 20, fontWeight: 800, color: 'var(--text-primary)', fontFamily: 'inherit', marginTop: 2 }}>{route.line}</p>
          <p style={{ fontSize: 14, color: 'var(--text-muted)', fontFamily: 'inherit', marginTop: 4 }}>Trip time: {route.duration} · {stops.length} stops</p>
        </div>
        <button className="pressable mt-1 p-2 -mr-2 rounded-full" onClick={() => toggleFavorite(tripId)}
          style={{ background: isFavorited ? 'var(--surface-green-soft)' : 'transparent', transition: 'background 200ms ease' }}>
          <StarIcon
            size={24}
            color="#357a1e"
            strokeWidth={1.8}
            fill={isFavorited ? '#357a1e' : 'none'}
            style={{ transition: 'fill 200ms ease' }}
          />
        </button>
      </div>

      {/* Your Trip section */}
      <div className="mx-5 rounded-t-xl" style={{ background: '#357a1e', height: 36, display: 'flex', alignItems: 'center', paddingLeft: 16 }}>
        <span style={{ fontSize: 14, fontWeight: 800, color: 'white', fontFamily: 'inherit' }}>Your Trip</span>
      </div>

      <div className="mx-5 px-4 py-4 rounded-b-xl" style={{ background: 'var(--surface-card)', border: '1px solid var(--border-green)', borderTop: 'none' }}>
        {stops.map((stop, i) => (
          <div key={i} className="flex items-start gap-4">
            <div className="flex flex-col items-center" style={{ width: 20, minHeight: i < stops.length - 1 ? 52 : 20 }}>
              <div style={{
                width: stop.major ? 14 : 9,
                height: stop.major ? 14 : 9,
                borderRadius: '50%',
                background: stop.major ? '#357a1e' : 'var(--surface-primary)',
                border: `2.5px solid #357a1e`,
                marginTop: stop.major ? 3 : 6,
                flexShrink: 0,
              }} />
              {i < stops.length - 1 && (
                <div style={{ width: 2.5, flex: 1, background: '#357a1e', minHeight: 28, marginTop: 4 }} />
              )}
            </div>
            <div className="flex-1 pb-1" style={{ paddingBottom: i < stops.length - 1 ? 10 : 0 }}>
              <div className="flex items-center justify-between">
                <span style={{
                  fontSize: stop.major ? 16 : 14,
                  fontWeight: stop.major ? 800 : 500,
                  color: stop.major ? 'var(--text-primary)' : 'var(--text-muted)',
                  fontFamily: 'inherit',
                }}>{stop.name}</span>
                <span style={{ fontSize: 13, color: stop.major ? 'var(--text-primary)' : 'var(--text-muted)', fontFamily: 'inherit', fontWeight: stop.major ? 700 : 400 }}>
                  {stop.time}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Service Alert (if exists) */}
      {route.alert && (
        <>
          <div className="mx-5 mt-4 rounded-t-xl" style={{
            background: route.alert.severity === 'warning' ? '#c2410c' : '#1d4ed8',
            height: 36, display: 'flex', alignItems: 'center', paddingLeft: 16, gap: 8
          }}>
            <AlertIcon size={14} color="white" strokeWidth={2.5} />
            <span style={{ fontSize: 14, fontWeight: 800, color: 'white', fontFamily: 'inherit' }}>Service Alert</span>
          </div>
          <div className="mx-5 px-4 py-3.5 rounded-b-xl" style={{
            background: 'var(--surface-card)',
            border: `1px solid ${route.alert.severity === 'warning' ? '#fed7aa' : '#bfdbfe'}`,
            borderTop: 'none',
          }}>
            <p style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-primary)', fontFamily: 'inherit', marginBottom: 4 }}>
              {route.alert.title}
            </p>
            <p style={{ fontSize: 13, color: 'var(--text-secondary)', fontFamily: 'inherit', lineHeight: 1.5 }}>
              {route.alert.message}
            </p>
          </div>
        </>
      )}

      {/* Fare Details */}
      <div className="mx-5 mt-4 rounded-t-xl" style={{ background: '#357a1e', height: 36, display: 'flex', alignItems: 'center', paddingLeft: 16 }}>
        <span style={{ fontSize: 14, fontWeight: 800, color: 'white', fontFamily: 'inherit' }}>Fare Details</span>
      </div>

      <div className="mx-5 px-4 py-4 rounded-b-xl" style={{ background: 'var(--surface-card)', border: '1px solid var(--border-green)', borderTop: 'none' }}>
        <div className="flex items-end justify-between mb-2">
          <div>
            <p style={{ fontSize: 15, fontWeight: 700, color: 'var(--text-primary)', fontFamily: 'inherit' }}>E-Ticket Price</p>
            <p style={{ fontSize: 13, color: 'var(--text-muted)', fontFamily: 'inherit' }}>1 Adult</p>
          </div>
          <span style={{ fontSize: 22, fontWeight: 900, color: 'var(--text-primary)', fontFamily: 'inherit' }}>{route.eTicketPrice}</span>
        </div>

        <button
          className="pressable w-full py-4 rounded-2xl mt-3 mb-4"
          style={{ background: '#357a1e', fontSize: 16, fontWeight: 800, color: 'white', fontFamily: 'inherit', boxShadow: '0 4px 16px rgba(53,122,30,0.3)' }}
          onClick={() => { setFareDetails({ adults: 1, seniors: 0, youth: 0, children: 0, returnTrip: false, totalPrice: 0, passengerLabel: '1 Adult' }); setPurchaseType('eticket'); navigate('payment') }}
        >
          Buy E-Ticket
        </button>

        <div className="flex items-end justify-between">
          <div>
            <p style={{ fontSize: 15, fontWeight: 700, color: 'var(--text-primary)', fontFamily: 'inherit' }}>PRESTO Fare</p>
            <p style={{ fontSize: 13, color: 'var(--text-muted)', fontFamily: 'inherit' }}>1 Adult</p>
          </div>
          <span style={{ fontSize: 22, fontWeight: 900, color: 'var(--text-primary)', fontFamily: 'inherit' }}>{route.prestoPrice}</span>
        </div>
      </div>

      <div className="h-8" />
    </div>
  )
}
