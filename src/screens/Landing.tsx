import { useState, useEffect, useRef } from 'react'
import { useNav } from '../App'
import { MenuHamburger, GOLogo, ArrowRight, TrainIcon, BusIcon, ClockIcon, MoreVerticalIcon, BellOffIcon, BellIcon, TrashIcon, FaresIcon, AlertIcon } from '../components/Icons'
import MarqueeText from '../components/MarqueeText'
import { getRouteKeyFromStations } from '../data/trips'

function getNextDepartures() {
  const now = new Date()
  const hour = now.getHours()
  const min = now.getMinutes()
  const departures = []
  let h = hour
  let m = min + (10 - (min % 10)) + 4
  if (m >= 60) { m -= 60; h += 1 }
  for (let i = 0; i < 3; i++) {
    const depH = h + Math.floor((m + i * 60) / 60)
    const depM = (m + i * 60) % 60
    if (depH >= 24) break
    // Arrival can spill past midnight — wrap through %24 so a 25h hour
    // doesn't render as "1:xx PM" via fmtTime's `>= 12 → PM` rule.
    const arrH = (depH + Math.floor((depM + 35) / 60)) % 24
    const arrM = (depM + 35) % 60
    const fmtTime = (hh: number, mm: number) => {
      const period = hh >= 12 ? 'PM' : 'AM'
      const h12 = hh % 12 || 12
      return `${h12}:${mm.toString().padStart(2, '0')} ${period}`
    }
    const depDate = new Date(now.getFullYear(), now.getMonth(), now.getDate(), depH, depM)
    const minsAway = Math.round((depDate.getTime() - now.getTime()) / 60000)
    departures.push({
      departure: fmtTime(depH, depM),
      arrival: fmtTime(arrH, arrM),
      minsAway: Math.max(1, minsAway),
      from: 'Milliken GO',
      to: 'Union Station GO',
      line: 'Stouffville',
    })
  }
  return departures
}

function NextDepartureCard({ onTap }: { onTap: () => void }) {
  const [departures, setDepartures] = useState(getNextDepartures)
  const next = departures[0]

  useEffect(() => {
    const id = setInterval(() => setDepartures(getNextDepartures()), 30000)
    return () => clearInterval(id)
  }, [])

  if (!next) return null

  return (
    <button onClick={onTap} className="pressable w-full text-left rounded-2xl overflow-hidden" style={{ background: 'var(--surface-primary)', border: '1.5px solid var(--border-green)', boxShadow: '0 2px 12px rgba(53,122,30,0.08)' }}>
      <div className="px-5 pt-4 pb-3 flex items-start gap-3.5">
        <div className="shrink-0 mt-0.5">
          <div className="w-11 h-11 rounded-xl flex items-center justify-center" style={{ background: '#357a1e' }}>
            <TrainIcon size={22} color="white" />
          </div>
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span style={{ fontSize: 11, fontWeight: 800, color: 'var(--accent-green)', fontFamily: 'inherit', textTransform: 'uppercase', letterSpacing: '0.6px' }}>Next Train</span>
            <span className="flex items-center gap-1" style={{ fontSize: 11, fontWeight: 800, color: 'var(--accent-green)', background: 'var(--surface-green-light)', borderRadius: 8, padding: '2px 8px', fontFamily: 'inherit' }}>
              <ClockIcon size={11} color="#357a1e" strokeWidth={2.5} />
              {next.minsAway} min
            </span>
          </div>
          <p style={{ fontSize: 20, fontWeight: 900, color: 'var(--text-primary)', fontFamily: 'inherit', letterSpacing: '-0.3px' }}>
            {next.departure} – {next.arrival}
          </p>
          <p style={{ fontSize: 14, color: 'var(--text-secondary)', fontFamily: 'inherit', marginTop: 2, fontWeight: 600 }}>
            {next.from} → {next.to}
          </p>
          <p style={{ fontSize: 13, color: 'var(--text-muted)', fontFamily: 'inherit', marginTop: 1 }}>Stouffville Line</p>
        </div>
      </div>
      {departures.length > 1 && (
        <div className="px-5 pb-3.5 pt-3 flex gap-4" style={{ borderTop: '1px solid var(--surface-green-light)' }}>
          {departures.slice(1).map((d, i) => (
            <span key={i} style={{ fontSize: 13, color: 'var(--text-secondary)', fontFamily: 'inherit', fontWeight: 600 }}>
              Also: {d.departure} ({d.minsAway} min)
            </span>
          ))}
        </div>
      )}
    </button>
  )
}

function SavedLineCard({ id, from, to, line, muted }: { id: string; from: string; to: string; line: string; muted: boolean }) {
  const { navigate, toggleMuteLine, removeSavedLine, setSelectedRoute, setShouldShowResults } = useNav()
  const [menuOpen, setMenuOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  // Jump straight into the schedule sheet on the Plan Your Trip page —
  // tapping the sheet's header or backdrop returns the user to the editable
  // form (no dead-end intermediate page).
  const openSchedule = () => {
    setSelectedRoute(getRouteKeyFromStations(from, to))
    setShouldShowResults(true)
    navigate('search')
  }

  useEffect(() => {
    if (!menuOpen) return
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [menuOpen])

  const isBus = line.toLowerCase().includes('bus') || /^route\s/i.test(line) || line.toLowerCase().startsWith('bus ')

  return (
    <div className="relative">
      <div
        className="w-full text-left rounded-2xl px-4 py-4 flex items-center gap-3"
        style={{ minHeight: 72, background: 'var(--surface-card)', border: '1px solid var(--border-color)', opacity: muted ? 0.6 : 1, transition: 'opacity 200ms ease' }}
      >
        <button className="pressable flex items-center gap-3 flex-1 min-w-0" onClick={openSchedule}>
          <div className="shrink-0 w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'var(--surface-green-light)' }}>
            {isBus ? <BusIcon size={20} color="#357a1e" /> : <TrainIcon size={20} color="#357a1e" />}
          </div>
          <div className="flex-1 min-w-0">
            <MarqueeText className="flex items-center gap-2" style={{ fontSize: 15, fontWeight: 800, color: 'var(--text-primary)', fontFamily: 'inherit' }}>
              {from} → {to}
              {muted && (
                <span className="shrink-0 flex items-center gap-1 px-1.5 py-0.5 rounded" style={{ background: 'var(--surface-secondary)', fontSize: 10, fontWeight: 700, color: 'var(--text-muted)' }}>
                  <BellOffIcon size={10} color="var(--text-muted)" strokeWidth={2.5} />
                  Muted
                </span>
              )}
            </MarqueeText>
            <div className="mt-0.5 truncate" style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-secondary)', fontFamily: 'inherit' }}>
              {line}
            </div>
          </div>
        </button>
        <button
          className="pressable shrink-0 w-11 h-11 flex items-center justify-center rounded-full"
          aria-label="Trip options"
          style={{ background: menuOpen ? 'var(--surface-green-light)' : 'transparent' }}
          onClick={(e) => { e.stopPropagation(); setMenuOpen(!menuOpen) }}
        >
          <MoreVerticalIcon size={18} color="var(--text-muted)" strokeWidth={2.5} />
        </button>
      </div>

      {/* Dropdown menu */}
      {menuOpen && (
        <div ref={menuRef} className="absolute right-4 z-20 rounded-xl overflow-hidden"
          style={{
            top: '100%', marginTop: -4,
            background: 'var(--surface-primary)',
            boxShadow: '0 8px 32px rgba(0,0,0,0.16), 0 2px 8px rgba(0,0,0,0.08)',
            border: '1px solid var(--border-color)',
            minWidth: 200,
          }}>
          <button
            className="pressable w-full flex items-center gap-3 px-4 py-3 text-left"
            style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)', fontFamily: 'inherit' }}
            onClick={() => { toggleMuteLine(id); setMenuOpen(false) }}
          >
            {muted ? <BellIcon size={18} color="#357a1e" strokeWidth={2} /> : <BellOffIcon size={18} color="var(--text-muted)" strokeWidth={2} />}
            {muted ? 'Unmute Notifications' : 'Mute Notifications'}
          </button>
          <div style={{ height: 1, background: 'var(--border-color)' }} />
          <button
            className="pressable w-full flex items-center gap-3 px-4 py-3 text-left"
            style={{ fontSize: 14, fontWeight: 600, color: '#dc2626', fontFamily: 'inherit' }}
            onClick={() => { removeSavedLine(id); setMenuOpen(false) }}
          >
            <TrashIcon size={18} color="#dc2626" strokeWidth={2} />
            Remove from Saved
          </button>
        </div>
      )}
    </div>
  )
}

function ActiveTripCard() {
  const { activeTrip, setActiveTrip, navigate } = useNav()
  const [elapsed, setElapsed] = useState(0)

  useEffect(() => {
    if (!activeTrip) return
    const id = setInterval(() => setElapsed(prev => prev + 1), 60000)
    return () => clearInterval(id)
  }, [activeTrip])

  if (!activeTrip) return null

  const isBus = activeTrip.line.toLowerCase().includes('bus') || /^route\s/i.test(activeTrip.line)

  return (
    <div className="px-5 pb-4">
      <div className="rounded-2xl overflow-hidden" style={{ border: '1.5px solid #357a1e', boxShadow: '0 2px 16px rgba(53,122,30,0.12)' }}>
        <div className="px-4 py-3 flex items-center gap-3" style={{ background: '#357a1e' }}>
          <div className="relative">
            {isBus ? <BusIcon size={18} color="white" /> : <TrainIcon size={18} color="white" />}
            {/* Pulsing dot */}
            <div style={{
              position: 'absolute', top: -2, right: -2, width: 8, height: 8,
              borderRadius: '50%', background: '#4ade80',
              boxShadow: '0 0 0 2px #357a1e',
              animation: 'pulse-dot 2s ease-in-out infinite',
            }} />
          </div>
          <div className="flex-1">
            <span style={{ fontSize: 11, fontWeight: 800, color: 'rgba(255,255,255,0.8)', fontFamily: 'inherit', textTransform: 'uppercase', letterSpacing: '0.6px' }}>Active Trip</span>
          </div>
          <button
            className="pressable px-2.5 py-1 rounded-lg"
            style={{ background: 'rgba(255,255,255,0.15)', fontSize: 11, fontWeight: 700, color: 'white', fontFamily: 'inherit' }}
            onClick={() => setActiveTrip(null)}
          >
            End Trip
          </button>
        </div>
        <button className="pressable w-full text-left px-4 py-3.5" style={{ background: 'var(--surface-card)' }} onClick={() => navigate('ticketView')}>
          <div className="flex items-center justify-between mb-2">
            <span style={{ fontSize: 15, fontWeight: 800, color: 'var(--text-primary)', fontFamily: 'inherit' }}>{activeTrip.line}</span>
            <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--accent-green)', fontFamily: 'inherit' }}>{activeTrip.departure} → {activeTrip.arrival}</span>
          </div>
          <div className="flex items-center justify-between">
            <span style={{ fontSize: 13, color: 'var(--text-secondary)', fontFamily: 'inherit', fontWeight: 600 }}>{activeTrip.from} → {activeTrip.to}</span>
            {activeTrip.platform && (
              <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-muted)', fontFamily: 'inherit', background: 'var(--surface-green-light)', borderRadius: 6, padding: '1px 6px' }}>
                {isBus ? `Bay ${activeTrip.platform.replace('Bay ', '')}` : `Plat. ${activeTrip.platform}`}
              </span>
            )}
          </div>
        </button>
        {/* Progress bar */}
        <div style={{ height: 3, background: 'var(--surface-green-light)' }}>
          <div style={{
            height: '100%', background: '#357a1e', borderRadius: 2,
            width: `${Math.min(85, 15 + elapsed * 5)}%`,
            transition: 'width 1s ease',
          }} />
        </div>
      </div>

      <style>{`
        @keyframes pulse-dot {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.6; transform: scale(1.3); }
        }
      `}</style>
    </div>
  )
}

export default function Landing() {
  const { navigate, openMenu, savedLines, setSelectedRoute, setShouldShowResults } = useNav()

  // Next Departure card hard-codes the Milliken → Union (Stouffville) route
  // (see getNextDepartures); jump to that route and auto-open the schedule
  // sheet on the Plan Your Trip page.
  const openNextDepartureSchedule = () => {
    setSelectedRoute('stouffville')
    setShouldShowResults(true)
    navigate('search')
  }

  return (
    <div className="min-h-full" style={{ background: 'var(--surface-primary)' }}>
      {/* Header */}
      <div className="flex items-center justify-between px-5 pt-2 pb-2">
        <button className="pressable w-11 h-11 flex items-center justify-center -ml-2 rounded-full" onClick={openMenu} aria-label="Open menu">
          <MenuHamburger size={22} color="var(--text-primary)" strokeWidth={2.5} />
        </button>
        <GOLogo size={28} color="#357a1e" />
        <div className="w-11" />
      </div>

      {/* Greeting */}
      <div className="px-6 pt-3 pb-2">
        <p style={{ fontSize: 13, color: 'var(--text-muted)', fontFamily: 'inherit', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>{new Date().getHours() < 12 ? 'Good morning' : new Date().getHours() < 17 ? 'Good afternoon' : 'Good evening'}</p>
        <h1 style={{ fontSize: 26, fontWeight: 900, color: 'var(--text-primary)', fontFamily: 'inherit', letterSpacing: '-0.5px', marginTop: 2 }}>Where are you headed?</h1>
      </div>

      {/* Active Trip (shown after ticket purchase) */}
      <ActiveTripCard />

      {/* Next Departure */}
      <div className="px-5 pt-2 pb-4">
        <NextDepartureCard onTap={openNextDepartureSchedule} />
      </div>

      {/* New Trip CTA */}
      <div className="px-5 pb-4">
        <button
          className="pressable w-full flex items-center justify-between px-5 py-4 rounded-2xl"
          style={{ background: '#357a1e', boxShadow: '0 4px 20px rgba(53,122,30,0.3)' }}
          onClick={() => navigate('search')}
        >
          <span style={{ fontSize: 18, fontWeight: 800, color: 'white', fontFamily: 'inherit', letterSpacing: '-0.2px' }}>Plan a New Trip</span>
          <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ background: 'rgba(255,255,255,0.18)' }}>
            <ArrowRight size={20} color="white" strokeWidth={2.5} />
          </div>
        </button>
      </div>

      {/* Quick links */}
      <div className="px-5 pb-4 flex gap-2.5">
        <button
          className="pressable flex-1 py-3 px-4 rounded-xl text-center flex items-center justify-center gap-2"
          style={{ background: 'var(--surface-green-soft)', fontSize: 13, fontWeight: 700, color: 'var(--accent-green)', fontFamily: 'inherit', border: '1px solid var(--border-green)' }}
          onClick={() => navigate('fares')}
        >
          <FaresIcon size={15} color="#357a1e" strokeWidth={2} />
          Fares
        </button>
        <button
          className="pressable flex-1 py-3 px-4 rounded-xl text-center flex items-center justify-center gap-2"
          style={{ background: 'var(--surface-green-soft)', fontSize: 13, fontWeight: 700, color: 'var(--accent-green)', fontFamily: 'inherit', border: '1px solid var(--border-green)' }}
          onClick={() => navigate('serviceUpdates')}
        >
          <AlertIcon size={15} color="#357a1e" strokeWidth={2} />
          Alerts
        </button>
      </div>

      {/* Divider */}
      <div className="px-6">
        <div style={{ height: 1, background: 'var(--border-color)' }} />
      </div>

      {/* Saved Trips */}
      <div className="px-5 pt-5">
        <div className="flex items-center justify-between mb-3">
          <h2 style={{ fontSize: 18, fontWeight: 800, color: 'var(--text-primary)', fontFamily: 'inherit', letterSpacing: '-0.3px' }}>
            Saved Trips
          </h2>
          {savedLines.length > 2 && (
            <button className="pressable" onClick={() => navigate('savedTrips')}>
              <span style={{ fontSize: 14, fontWeight: 700, color: 'var(--accent-green)', fontFamily: 'inherit' }}>View All</span>
            </button>
          )}
        </div>
        <div className="flex flex-col gap-2.5">
          {savedLines.length > 0 ? (
            savedLines.map(line => (
              <SavedLineCard key={line.id} {...line} />
            ))
          ) : (
            <div className="rounded-2xl px-5 py-6 text-center" style={{ background: 'var(--surface-secondary)', border: '1px dashed var(--border-color)' }}>
              <p style={{ fontSize: 14, color: 'var(--text-muted)', fontFamily: 'inherit' }}>No saved trips yet</p>
              <p style={{ fontSize: 13, color: 'var(--text-muted)', fontFamily: 'inherit', marginTop: 4, opacity: 0.7 }}>Star a trip to save it here for quick access</p>
            </div>
          )}
        </div>
      </div>

      <div className="h-8" />
    </div>
  )
}
