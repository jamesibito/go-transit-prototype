import { useState, useMemo } from 'react'
import { ChevronLeft, TrainIcon, BusIcon } from './Icons'

// All GO Transit stations grouped by line
const STATIONS = [
  // Stouffville
  { name: 'Miliken GO', line: 'Stouffville', type: 'train' as const },
  { name: 'Agincourt GO', line: 'Stouffville', type: 'train' as const },
  { name: 'Kennedy GO', line: 'Stouffville', type: 'train' as const },
  { name: 'Scarborough GO', line: 'Stouffville / Lakeshore East', type: 'train' as const },
  // Lakeshore East
  { name: 'Danforth GO', line: 'Lakeshore East', type: 'train' as const },
  { name: 'Eglinton GO', line: 'Lakeshore East', type: 'train' as const },
  { name: 'Pickering GO', line: 'Lakeshore East', type: 'train' as const },
  { name: 'Ajax GO', line: 'Lakeshore East', type: 'train' as const },
  { name: 'Whitby GO', line: 'Lakeshore East', type: 'train' as const },
  { name: 'Oshawa GO', line: 'Lakeshore East', type: 'train' as const },
  // Barrie
  { name: 'Downsview Park GO', line: 'Barrie', type: 'train' as const },
  { name: 'Rutherford GO', line: 'Barrie', type: 'train' as const },
  { name: 'Maple GO', line: 'Barrie', type: 'train' as const },
  { name: 'King City GO', line: 'Barrie', type: 'train' as const },
  { name: 'Aurora GO', line: 'Barrie', type: 'train' as const },
  // Lakeshore West
  { name: 'Exhibition GO', line: 'Lakeshore West', type: 'train' as const },
  { name: 'Mimico GO', line: 'Lakeshore West', type: 'train' as const },
  { name: 'Long Branch GO', line: 'Lakeshore West', type: 'train' as const },
  { name: 'Port Credit GO', line: 'Lakeshore West', type: 'train' as const },
  { name: 'Clarkson GO', line: 'Lakeshore West', type: 'train' as const },
  { name: 'Oakville GO', line: 'Lakeshore West', type: 'train' as const },
  { name: 'Burlington GO', line: 'Lakeshore West', type: 'train' as const },
  // Union (hub)
  { name: 'Union Station GO', line: 'All Lines', type: 'train' as const },
  // Bus
  { name: 'Mississauga City Centre', line: 'Highway 407 Bus', type: 'bus' as const },
  { name: 'Brampton Gateway', line: 'Highway 407 Bus', type: 'bus' as const },
  { name: 'VMC Bus Terminal', line: 'Highway 407 Bus', type: 'bus' as const },
  { name: 'Markham Stouffville Hospital', line: 'Highway 407 Bus', type: 'bus' as const },
]

interface StationPickerProps {
  label: string  // "From" or "To"
  onSelect: (station: string) => void
  onClose: () => void
}

export default function StationPicker({ label, onSelect, onClose }: StationPickerProps) {
  const [search, setSearch] = useState('')

  const filtered = useMemo(() => {
    if (!search.trim()) return STATIONS
    const q = search.toLowerCase()
    return STATIONS.filter(s =>
      s.name.toLowerCase().includes(q) || s.line.toLowerCase().includes(q)
    )
  }, [search])

  // Group by first letter
  const grouped = useMemo(() => {
    const map = new Map<string, typeof STATIONS>()
    for (const s of filtered) {
      const letter = s.name[0].toUpperCase()
      if (!map.has(letter)) map.set(letter, [])
      map.get(letter)!.push(s)
    }
    return Array.from(map.entries()).sort((a, b) => a[0].localeCompare(b[0]))
  }, [filtered])

  return (
    <div className="absolute inset-0 z-30 flex flex-col" style={{ background: 'var(--surface-primary)' }}>
      {/* Header */}
      <div className="flex items-center gap-3 px-5 pt-2 pb-3">
        <button className="pressable w-11 h-11 flex items-center justify-center -ml-2 rounded-full" onClick={onClose}>
          <ChevronLeft size={24} color="var(--text-primary)" strokeWidth={2.5} />
        </button>
        <span style={{ fontSize: 18, fontWeight: 800, color: 'var(--text-primary)', fontFamily: 'inherit', letterSpacing: '-0.3px' }}>
          Select {label} Station
        </span>
      </div>

      {/* Search */}
      <div className="px-5 pb-3">
        <div className="rounded-xl overflow-hidden flex items-center gap-2 px-3" style={{ background: 'var(--surface-secondary)', border: '1px solid var(--border-color)' }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8" /><path d="M21 21l-4.3-4.3" />
          </svg>
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search stations..."
            autoFocus
            className="flex-1 py-3 bg-transparent"
            style={{ fontSize: 15, fontFamily: 'inherit', fontWeight: 600, border: 'none', outline: 'none', color: 'var(--text-primary)' }}
          />
          {search && (
            <button className="pressable" onClick={() => setSearch('')}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          )}
        </div>
      </div>

      {/* Station list */}
      <div className="flex-1 overflow-y-auto px-5 pb-8" style={{ WebkitOverflowScrolling: 'touch' }}>
        {grouped.length === 0 && (
          <div className="pt-8 text-center">
            <p style={{ fontSize: 14, color: 'var(--text-muted)', fontFamily: 'inherit' }}>No stations found</p>
          </div>
        )}
        {grouped.map(([letter, stations]) => (
          <div key={letter}>
            <p style={{ fontSize: 12, fontWeight: 800, color: 'var(--text-muted)', fontFamily: 'inherit', textTransform: 'uppercase', letterSpacing: '0.5px', padding: '12px 0 6px' }}>
              {letter}
            </p>
            {stations.map(station => (
              <button
                key={station.name}
                className="pressable w-full flex items-center gap-3 py-3 text-left"
                style={{ borderBottom: '1px solid var(--border-color)' }}
                onClick={() => onSelect(station.name)}
              >
                <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0" style={{ background: 'var(--surface-green-light)' }}>
                  {station.type === 'bus' ? (
                    <BusIcon size={17} color="#357a1e" />
                  ) : (
                    <TrainIcon size={17} color="#357a1e" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="truncate" style={{ fontSize: 15, fontWeight: 700, color: 'var(--text-primary)', fontFamily: 'inherit' }}>{station.name}</p>
                  <p style={{ fontSize: 12, color: 'var(--text-muted)', fontFamily: 'inherit', marginTop: 1 }}>{station.line}</p>
                </div>
              </button>
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}
