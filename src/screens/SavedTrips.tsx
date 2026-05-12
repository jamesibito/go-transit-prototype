import { useState, useEffect, useRef } from 'react'
import { useNav } from '../App'
import { ChevronLeft, TrainIcon, BusIcon, MoreVerticalIcon, BellOffIcon, BellIcon, TrashIcon, PlusIcon2 } from '../components/Icons'

function SavedLineRow({ id, from, to, line, muted }: { id: string; from: string; to: string; line: string; muted: boolean }) {
  const { navigate, toggleMuteLine, removeSavedLine, setSelectedRoute } = useNav()
  const [menuOpen, setMenuOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)
  const isBus = line.toLowerCase().includes('bus')

  useEffect(() => {
    if (!menuOpen) return
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) setMenuOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [menuOpen])

  const handleTap = () => {
    // Map saved line to a route key for results
    const f = from.toLowerCase()
    const t = to.toLowerCase()
    if (f.includes('oshawa') || t.includes('oshawa')) setSelectedRoute('lakeshore-east')
    else if (f.includes('aurora') || t.includes('aurora') || f.includes('barrie') || t.includes('barrie')) setSelectedRoute('barrie')
    else if (f.includes('burlington') || t.includes('burlington') || f.includes('oakville') || t.includes('oakville')) setSelectedRoute('lakeshore-west')
    else if (f.includes('mississauga') || t.includes('mississauga') || f.includes('markham') || t.includes('markham') || f.includes('407') || t.includes('407')) setSelectedRoute('highway-407')
    else setSelectedRoute('stouffville')
    navigate('results')
  }

  return (
    <div className="relative">
      <div
        className="w-full text-left rounded-2xl px-4 py-4 flex items-center gap-3"
        style={{ minHeight: 72, background: 'var(--surface-card)', border: '1px solid var(--border-color)', opacity: muted ? 0.55 : 1, transition: 'opacity 200ms ease' }}
      >
        <button className="pressable flex items-center gap-3 flex-1 min-w-0" onClick={handleTap}>
          <div className="shrink-0 w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'var(--surface-green-light)' }}>
            {isBus ? <BusIcon size={20} color="#357a1e" /> : <TrainIcon size={20} color="#357a1e" />}
          </div>
          <div className="flex-1 min-w-0">
            <div className="truncate flex items-center gap-2" style={{ fontSize: 15, fontWeight: 800, color: 'var(--text-primary)', fontFamily: 'inherit' }}>
              {from} → {to}
              {muted && (
                <span className="shrink-0 flex items-center gap-1 px-1.5 py-0.5 rounded" style={{ background: 'var(--surface-secondary)', fontSize: 10, fontWeight: 700, color: 'var(--text-muted)' }}>
                  <BellOffIcon size={10} color="var(--text-muted)" strokeWidth={2.5} />
                  Muted
                </span>
              )}
            </div>
            <div className="mt-0.5 truncate" style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-secondary)', fontFamily: 'inherit' }}>
              {line}
            </div>
          </div>
        </button>
        <button
          className="pressable shrink-0 w-8 h-8 flex items-center justify-center rounded-full"
          style={{ background: menuOpen ? 'var(--surface-green-light)' : 'transparent' }}
          onClick={(e) => { e.stopPropagation(); setMenuOpen(!menuOpen) }}
        >
          <MoreVerticalIcon size={18} color="var(--text-muted)" strokeWidth={2.5} />
        </button>
      </div>

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

export default function SavedTrips() {
  const { goBack, navigate, savedLines } = useNav()
  const activeLines = savedLines.filter(l => !l.muted)
  const mutedLines = savedLines.filter(l => l.muted)

  return (
    <div className="min-h-full" style={{ background: 'var(--surface-primary)' }}>
      {/* Header */}
      <div className="flex items-center gap-3 px-5 pt-2 pb-3">
        <button className="pressable w-11 h-11 flex items-center justify-center -ml-2 rounded-full" onClick={goBack}>
          <ChevronLeft size={24} color="var(--text-primary)" strokeWidth={2.5} />
        </button>
        <span style={{ fontSize: 18, fontWeight: 800, color: 'var(--text-primary)', fontFamily: 'inherit', letterSpacing: '-0.3px' }}>Saved Trips</span>
      </div>

      {/* Summary */}
      <div className="px-5 pb-4">
        <div className="rounded-2xl px-4 py-3.5 flex items-center gap-3" style={{ background: 'var(--surface-green-soft)', border: '1px solid var(--border-green)' }}>
          <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ background: '#357a1e' }}>
            <TrainIcon size={20} color="white" />
          </div>
          <div>
            <p style={{ fontSize: 15, fontWeight: 800, color: 'var(--text-primary)', fontFamily: 'inherit' }}>
              {savedLines.length} saved {savedLines.length === 1 ? 'trip' : 'trips'}
            </p>
            <p style={{ fontSize: 13, color: 'var(--text-muted)', fontFamily: 'inherit' }}>
              {activeLines.length} active · {mutedLines.length} muted
            </p>
          </div>
        </div>
      </div>

      {/* Active trips */}
      {activeLines.length > 0 && (
        <div className="px-5 pb-2">
          <h3 style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-muted)', fontFamily: 'inherit', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 10 }}>
            Active
          </h3>
          <div className="flex flex-col gap-2.5">
            {activeLines.map(line => (
              <SavedLineRow key={line.id} {...line} />
            ))}
          </div>
        </div>
      )}

      {/* Muted trips */}
      {mutedLines.length > 0 && (
        <div className="px-5 pt-3 pb-2">
          <h3 style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-muted)', fontFamily: 'inherit', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 10 }}>
            Muted
          </h3>
          <div className="flex flex-col gap-2.5">
            {mutedLines.map(line => (
              <SavedLineRow key={line.id} {...line} />
            ))}
          </div>
        </div>
      )}

      {/* Empty state */}
      {savedLines.length === 0 && (
        <div className="px-5 pt-8">
          <div className="rounded-2xl px-5 py-8 text-center" style={{ background: 'var(--surface-secondary)', border: '1px dashed var(--border-color)' }}>
            <div className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-3" style={{ background: 'var(--surface-green-light)' }}>
              <TrainIcon size={28} color="#357a1e" />
            </div>
            <p style={{ fontSize: 16, fontWeight: 800, color: 'var(--text-primary)', fontFamily: 'inherit' }}>No saved trips</p>
            <p style={{ fontSize: 14, color: 'var(--text-muted)', fontFamily: 'inherit', marginTop: 6, lineHeight: 1.5 }}>
              Star a trip or search for a route to save it here for quick access.
            </p>
          </div>
        </div>
      )}

      {/* Add new trip button */}
      <div className="px-5 pt-5">
        <button
          className="pressable w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl"
          style={{ background: 'var(--surface-green-soft)', border: '1px solid var(--border-green)', fontSize: 15, fontWeight: 700, color: '#357a1e', fontFamily: 'inherit' }}
          onClick={() => navigate('search')}
        >
          <PlusIcon2 size={18} color="#357a1e" strokeWidth={2.5} />
          Add New Trip
        </button>
      </div>

      <div className="h-8" />
    </div>
  )
}
