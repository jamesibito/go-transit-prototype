import { useState, useEffect } from 'react'
import { useNav } from '../App'
import SearchForm from '../components/SearchForm'
import TripCard from '../components/TripCard'
import { ChevronLeft } from '../components/Icons'
import { ROUTES, generateDepartures } from '../data/trips'

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

export default function SearchResults() {
  const { goBack, navigate, selectedRoute, searchDateTime } = useNav()
  const route = ROUTES[selectedRoute] || ROUTES.stouffville
  const upcoming = generateDepartures(route, 5, searchDateTime ?? new Date())
  const [sheetVisible, setSheetVisible] = useState(true)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (sheetVisible) {
      setLoading(true)
      const id = setTimeout(() => setLoading(false), 900)
      return () => clearTimeout(id)
    }
  }, [sheetVisible])

  return (
    <div className="min-h-full relative" style={{ background: 'var(--surface-primary)', overflow: 'hidden' }}>
      {/* Dimmed background */}
      <div style={{
        position: 'absolute', inset: 0,
        background: sheetVisible ? 'rgba(0,0,0,0.18)' : 'transparent',
        transition: 'background 350ms ease',
        zIndex: 1, pointerEvents: sheetVisible ? 'auto' : 'none',
        bottom: '74%',
      }} onClick={() => setSheetVisible(false)} />

      {/* Search form (behind sheet) */}
      <div className="px-5 pt-2 pb-4">
        <div className="flex items-center gap-3 mb-4">
          <button className="pressable w-11 h-11 flex items-center justify-center -ml-2 rounded-full" onClick={goBack}>
            <ChevronLeft size={24} color="var(--text-primary)" strokeWidth={2.5} />
          </button>
          <span style={{ fontSize: 18, fontWeight: 800, color: 'var(--text-primary)', fontFamily: 'inherit', letterSpacing: '-0.3px' }}>Search Schedule</span>
        </div>
        <SearchForm fromValue={route.from} toValue={route.to} />
        <button
          className="pressable w-full mt-4 py-4 rounded-2xl text-white"
          style={{ background: '#357a1e', fontSize: 16, fontWeight: 800, fontFamily: 'inherit' }}
          onClick={() => setSheetVisible(true)}
        >
          See Schedule
        </button>
      </div>

      {/* Bottom sheet */}
      <div
        className="absolute left-0 right-0 bottom-0 z-10"
        style={{
          background: 'var(--surface-primary)',
          borderRadius: '20px 20px 0 0',
          boxShadow: '0 -8px 32px rgba(0,0,0,0.10)',
          transform: sheetVisible ? 'translateY(0)' : 'translateY(100%)',
          transition: 'transform 380ms cubic-bezier(0.32,0.72,0,1)',
          maxHeight: '74%',
          overflow: 'hidden',
          display: 'flex', flexDirection: 'column',
        }}
      >
        <div className="flex justify-center pt-3 pb-1 shrink-0">
          <div style={{ width: 36, height: 4, borderRadius: 2, background: 'var(--border-color)' }} />
        </div>

        <div className="px-5 pb-3 shrink-0 flex items-center justify-between">
          <span style={{ fontSize: 18, fontWeight: 800, color: 'var(--text-primary)', fontFamily: 'inherit', letterSpacing: '-0.3px' }}>Upcoming</span>
          <span style={{ fontSize: 13, color: 'var(--text-muted)', fontFamily: 'inherit' }}>Today, {new Date().toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}</span>
        </div>

        <div className="overflow-y-auto px-5 pb-6" style={{ flex: 1 }}>
          <div className="flex flex-col gap-2.5">
            {loading ? (
              <>
                <SkeletonCard />
                <SkeletonCard />
                <SkeletonCard />
                <SkeletonCard />
              </>
            ) : (
              upcoming.map((trip, i) => (
                <div key={i} className="relative">
                  {i === 0 && (
                    <div style={{
                      position: 'absolute', top: 8, right: 8, zIndex: 2,
                      background: '#357a1e', borderRadius: 8, padding: '2px 10px',
                    }}>
                      <span style={{ fontSize: 11, fontWeight: 800, color: 'white', fontFamily: 'inherit', textTransform: 'uppercase', letterSpacing: '0.3px' }}>Next</span>
                    </div>
                  )}
                  <TripCard {...trip} type={selectedRoute === 'highway-407' ? 'bus' : 'train'} onClick={() => navigate('tripDetails')} />
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
