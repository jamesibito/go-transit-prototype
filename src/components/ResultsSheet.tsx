import { useEffect, useState } from 'react'
import TripCard from './TripCard'
import { ROUTES, generateDepartures } from '../data/trips'

// ── Helpers ───────────────────────────────────────────────────────────────────

function SkeletonCard() {
  return (
    <div className="rounded-2xl px-4 py-4 flex items-center gap-3" style={{ background: 'var(--surface-green-soft)', border: '1px solid var(--border-green)', minHeight: 80 }}>
      <div className="shimmer shrink-0" style={{ width: 40, height: 40, borderRadius: 12, background: 'var(--surface-green-light)' }} />
      <div className="flex-1">
        <div className="shimmer" style={{ width: '65%', height: 14, borderRadius: 6, background: 'var(--surface-green-light)', marginBottom: 8 }} />
        <div className="shimmer" style={{ width: '45%', height: 12, borderRadius: 6, background: 'var(--surface-green-light)', marginBottom: 6 }} />
        <div className="shimmer" style={{ width: '25%', height: 10, borderRadius: 6, background: 'var(--surface-green-light)' }} />
      </div>
    </div>
  )
}

// Format a date for the sheet header — "Today, Fri, May 15" / "Tomorrow, Sat, May 16" / "Mon, May 19"
function formatHeaderDate(d: Date): string {
  const now = new Date()
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  const target = new Date(d.getFullYear(), d.getMonth(), d.getDate())
  const diffDays = Math.round((target.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
  const long = d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })
  if (diffDays === 0) return `Today, ${long}`
  if (diffDays === 1) return `Tomorrow, ${long}`
  return long
}

function isBusRoute(line: string): boolean {
  const l = line.toLowerCase()
  return l.includes('bus') || /^route\s/i.test(line)
}

// ── Empty state ───────────────────────────────────────────────────────────────

function EmptyState({ onEditTrip }: { onEditTrip: () => void }) {
  return (
    <div className="flex flex-col items-center text-center py-10 px-4">
      <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4" style={{ background: 'var(--surface-green-light)' }}>
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#357a1e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" />
          <line x1="12" y1="8" x2="12" y2="12" />
          <line x1="12" y1="16" x2="12.01" y2="16" />
        </svg>
      </div>
      <p style={{ fontSize: 16, fontWeight: 800, color: 'var(--text-primary)', fontFamily: 'inherit', letterSpacing: '-0.2px' }}>
        No trips available
      </p>
      <p style={{ fontSize: 13, color: 'var(--text-muted)', fontFamily: 'inherit', marginTop: 6, maxWidth: 260, lineHeight: 1.5 }}>
        Nothing matches this route and time. Try a different departure or pair of stations.
      </p>
      <button
        className="pressable mt-5 px-5 py-3 rounded-2xl"
        style={{ background: '#357a1e', color: 'white', fontSize: 14, fontWeight: 800, fontFamily: 'inherit', boxShadow: '0 4px 16px rgba(53,122,30,0.3)' }}
        onClick={onEditTrip}
      >
        Change search
      </button>
    </div>
  )
}

// ── Main component ────────────────────────────────────────────────────────────

interface Props {
  visible: boolean
  routeKey: string
  atDate: Date
  onClose: () => void
  onPickTrip: (trip: { departure: string; arrival: string }) => void
}

export default function ResultsSheet({ visible, routeKey, atDate, onClose, onPickTrip }: Props) {
  const route = ROUTES[routeKey] || ROUTES.stouffville
  const upcoming = generateDepartures(route, 5, atDate)
  const [loading, setLoading] = useState(true)
  const cardType: 'bus' | 'train' = isBusRoute(route.line) ? 'bus' : 'train'
  const headerDate = formatHeaderDate(atDate)

  // Re-trigger the loading shimmer whenever the sheet is opened or the trip
  // params change — gives the user feedback that the schedule is "refreshing."
  useEffect(() => {
    if (!visible) return
    setLoading(true)
    const id = setTimeout(() => setLoading(false), 900)
    return () => clearTimeout(id)
  }, [visible, routeKey, atDate])

  return (
    <>
      {/* Backdrop — tap to dismiss and return to the editable trip form */}
      <div
        style={{
          position: 'absolute', inset: 0,
          background: visible ? 'rgba(0,0,0,0.4)' : 'transparent',
          transition: 'background 300ms ease',
          zIndex: 40,
          pointerEvents: visible ? 'auto' : 'none',
        }}
        onClick={onClose}
      />

      {/* Sheet */}
      <div
        className="absolute left-0 right-0 bottom-0"
        style={{
          background: 'var(--surface-primary)',
          borderRadius: '20px 20px 0 0',
          boxShadow: '0 -8px 32px rgba(0,0,0,0.12)',
          transform: visible ? 'translateY(0)' : 'translateY(100%)',
          transition: 'transform 380ms cubic-bezier(0.32,0.72,0,1)',
          maxHeight: '78%',
          zIndex: 41,
          display: 'flex', flexDirection: 'column',
        }}
      >
        {/* Grabber */}
        <div className="flex justify-center pt-3 pb-1 shrink-0">
          <div style={{ width: 36, height: 4, borderRadius: 2, background: 'var(--border-color)' }} />
        </div>

        {/* Header — route summary + chosen date.
            Tappable: dismisses the sheet so the user can edit the trip
            on the form behind. Edit-pencil hint signals interactivity. */}
        <button
          className="pressable px-5 pt-2 pb-3 shrink-0 text-left flex items-start gap-3 w-full"
          style={{ borderBottom: '1px solid var(--border-color)' }}
          onClick={onClose}
          aria-label="Change search"
        >
          <div className="flex-1 min-w-0">
            <p style={{ fontSize: 11, fontWeight: 800, color: 'var(--accent-green)', textTransform: 'uppercase', letterSpacing: '0.7px', fontFamily: 'inherit' }}>
              Upcoming · tap to edit
            </p>
            <p style={{ fontSize: 16, fontWeight: 800, color: 'var(--text-primary)', fontFamily: 'inherit', letterSpacing: '-0.2px', marginTop: 3, lineHeight: 1.3 }}>
              {route.from} → {route.to}
            </p>
            <p style={{ fontSize: 12, color: 'var(--text-muted)', fontFamily: 'inherit', marginTop: 2 }}>{headerDate}</p>
          </div>
          <div className="shrink-0 mt-1" style={{ color: 'var(--text-muted)' }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
            </svg>
          </div>
        </button>

        {/* Body */}
        <div className="overflow-y-auto px-5 pt-4 pb-6" style={{ flex: 1 }}>
          {loading ? (
            <div className="flex flex-col gap-2.5">
              <SkeletonCard />
              <SkeletonCard />
              <SkeletonCard />
              <SkeletonCard />
            </div>
          ) : upcoming.length === 0 ? (
            <EmptyState onEditTrip={onClose} />
          ) : (
            <div className="flex flex-col gap-2.5">
              {upcoming.map((trip, i) => (
                <div key={i} className="relative">
                  {i === 0 && (
                    <div style={{
                      position: 'absolute', top: 8, right: 8, zIndex: 2,
                      background: '#357a1e', borderRadius: 8, padding: '2px 10px',
                    }}>
                      <span style={{ fontSize: 11, fontWeight: 800, color: 'white', fontFamily: 'inherit', textTransform: 'uppercase', letterSpacing: '0.3px' }}>Next</span>
                    </div>
                  )}
                  <TripCard
                    {...trip}
                    type={cardType}
                    onClick={() => onPickTrip({ departure: trip.departure, arrival: trip.arrival })}
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  )
}
