import { useState } from 'react'
import NavHeader from '../components/NavHeader'
import { TrainIcon, BusIcon, PersonIcon, ChevronDown, ChevronUp } from '../components/Icons'

interface Alert {
  id: number
  name: string
  type: 'train' | 'bus' | 'ped'
  alertCount: number
  saved: boolean
  updates: string[]
}

const alertsData: Alert[] = [
  {
    id: 1, name: 'Stouffville', type: 'train', alertCount: 1, saved: true,
    updates: [
      'Stouffville Line Service Adjustment',
      'This weekend, Stouffville GO train service will be adjusted for construction. GO buses will replace trains between Old Elm GO and Union Station.\n\nNote: Milliken, Agincourt, and Kennedy GO will not be served by bus replacements. Customers will be directed to TTC. Transfer free with one fare between GO Transit and the TTC.',
    ],
  },
  { id: 2, name: 'Barrie', type: 'train', alertCount: 1, saved: false, updates: ['Minor delays due to signal maintenance near Barrie South GO.'] },
  { id: 3, name: '18 – Lakeshore West', type: 'bus', alertCount: 1, saved: false, updates: ['Bus stop relocation at Port Credit GO, effective Mon May 11.'] },
  { id: 4, name: 'West Harbour GO', type: 'ped', alertCount: 2, saved: false, updates: ['Platform B closure for resurfacing', 'Elevator out of service at West Harbour GO through June 1.'] },
  { id: 5, name: 'Pickering GO', type: 'ped', alertCount: 1, saved: false, updates: ['Parking lot C temporarily closed.'] },
  { id: 6, name: 'Lakeshore East', type: 'train', alertCount: 1, saved: false, updates: ['On-time service. No disruptions.'] },
  { id: 7, name: 'Richmond Hill', type: 'train', alertCount: 1, saved: false, updates: ['Minor schedule adjustments this week. Check GO website for details.'] },
]

function TransitTypeIcon({ type, size = 22 }: { type: 'train' | 'bus' | 'ped'; size?: number }) {
  const color = '#357a1e'
  if (type === 'bus') return <BusIcon size={size} color={color} />
  if (type === 'ped') return <PersonIcon size={size} color={color} />
  return <TrainIcon size={size} color={color} />
}

function AlertRow({ alert, expanded, onToggle, isRead }: { alert: Alert; expanded: boolean; onToggle: () => void; isRead: boolean }) {
  return (
    <div className="overflow-hidden rounded-2xl" style={{ border: expanded ? '1.5px solid var(--border-green)' : '1.5px solid var(--border-color)', boxShadow: expanded ? '0 4px 16px rgba(0,0,0,0.06)' : 'none' }}>
      <button
        className="pressable w-full flex items-center justify-between px-4 py-3.5"
        style={{ background: expanded ? 'var(--surface-green-soft)' : 'var(--surface-secondary)', textAlign: 'left' }}
        onClick={onToggle}
      >
        <div className="flex items-center gap-3">
          <div className="relative shrink-0">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'var(--surface-green-light)' }}>
              <TransitTypeIcon type={alert.type} size={20} />
            </div>
            {!isRead && (
              <div style={{
                position: 'absolute', top: -4, right: -4,
                width: 18, height: 18, borderRadius: 9,
                background: '#d97706', display: 'flex', alignItems: 'center', justifyContent: 'center',
                border: '2px solid var(--surface-primary)',
              }}>
                <span style={{ fontSize: 10, fontWeight: 900, color: 'white', fontFamily: 'inherit' }}>{alert.alertCount}</span>
              </div>
            )}
          </div>
          <span style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-primary)', fontFamily: 'inherit' }}>{alert.name}</span>
        </div>
        <div className="shrink-0">
          {expanded ? <ChevronUp size={20} color="var(--text-muted)" strokeWidth={2.5} /> : <ChevronDown size={20} color="var(--text-muted)" strokeWidth={2.5} />}
        </div>
      </button>

      <div style={{
        maxHeight: expanded ? 600 : 0,
        overflow: 'hidden',
        transition: 'max-height 280ms ease',
        background: 'var(--surface-primary)',
      }}>
        <div className="px-5 py-4" style={{ borderTop: '1px solid var(--border-green)' }}>
          {alert.updates.map((text, i) => (
            <div key={i}>
              {i === 0 ? (
                <p style={{ fontSize: 14, fontWeight: 800, color: 'var(--text-primary)', fontFamily: 'inherit', marginBottom: 8 }}>{text}</p>
              ) : (
                <p style={{ fontSize: 13.5, color: 'var(--text-secondary)', fontFamily: 'inherit', lineHeight: 1.55 }}>{text}</p>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default function ServiceUpdates() {
  const [expanded, setExpanded] = useState<number | null>(1)
  const [readAlerts, setReadAlerts] = useState<Set<number>>(new Set([1]))

  const saved = alertsData.filter(a => a.saved)
  const others = alertsData.filter(a => !a.saved)

  const toggle = (id: number) => {
    setExpanded(prev => prev === id ? null : id)
    setReadAlerts(prev => new Set(prev).add(id))
  }

  return (
    <div className="min-h-full" style={{ background: 'var(--surface-primary)' }}>
      <NavHeader title="Service Updates" showMenu />

      <div className="px-5">
        {saved.length > 0 && (
          <>
            <h2 style={{ fontSize: 16, fontWeight: 800, color: 'var(--text-primary)', fontFamily: 'inherit', marginBottom: 12, letterSpacing: '-0.2px' }}>
              Saved Trips &amp; Stops
            </h2>
            <div className="flex flex-col gap-2.5 mb-6">
              {saved.map(alert => (
                <AlertRow key={alert.id} alert={alert} expanded={expanded === alert.id} onToggle={() => toggle(alert.id)} isRead={readAlerts.has(alert.id)} />
              ))}
            </div>
          </>
        )}

        <h2 style={{ fontSize: 16, fontWeight: 800, color: 'var(--text-primary)', fontFamily: 'inherit', marginBottom: 12, letterSpacing: '-0.2px' }}>
          Others
        </h2>
        <div className="flex flex-col gap-2.5">
          {others.map(alert => (
            <AlertRow key={alert.id} alert={alert} expanded={expanded === alert.id} onToggle={() => toggle(alert.id)} isRead={readAlerts.has(alert.id)} />
          ))}
        </div>
      </div>

      <div className="h-8" />
    </div>
  )
}
