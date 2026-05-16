import { useState, useEffect, useMemo } from 'react'
import { useNav } from '../App'
import { ChevronLeft, TrainIcon, BusIcon } from '../components/Icons'

function QRCode({ seed }: { seed: string }) {
  // Deterministic pattern keyed off the trip identifier — keeps the QR
  // visually stable across re-renders (Math.random() was re-rolling per render).
  const cells = useMemo(() => {
    const rows = 11
    const cols = 11
    let h = 2166136261
    for (let i = 0; i < seed.length; i++) {
      h ^= seed.charCodeAt(i)
      h = Math.imul(h, 16777619)
    }
    let s = h >>> 0
    const rand = () => {
      s += 0x6D2B79F5
      let t = s
      t = Math.imul(t ^ (t >>> 15), t | 1)
      t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296
    }
    const grid: boolean[][] = []
    for (let r = 0; r < rows; r++) {
      grid[r] = []
      for (let c = 0; c < cols; c++) {
        const isCornerBlock =
          (r < 3 && c < 3) || (r < 3 && c >= cols - 3) || (r >= rows - 3 && c < 3)
        grid[r][c] = isCornerBlock || rand() > 0.45
      }
    }
    return grid
  }, [seed])
  const rows = cells.length
  const cols = cells[0].length
  const size = 6
  return (
    <svg width={cols * size} height={rows * size} viewBox={`0 0 ${cols * size} ${rows * size}`}>
      {cells.map((row, r) =>
        row.map((filled, c) =>
          filled ? <rect key={`${r}-${c}`} x={c * size} y={r * size} width={size} height={size} fill="var(--text-primary)" rx={0.5} /> : null
        )
      )}
    </svg>
  )
}

export default function TicketView() {
  const { goBack, activeTrip, showToast } = useNav()
  const [walletAdded, setWalletAdded] = useState(false)
  const [elapsed, setElapsed] = useState(0)

  useEffect(() => {
    const id = setInterval(() => setElapsed(prev => prev + 1), 60000)
    return () => clearInterval(id)
  }, [])

  if (!activeTrip) return null

  const isBus = activeTrip.line.toLowerCase().includes('bus')
  const VehicleIcon = isBus ? BusIcon : TrainIcon

  // Format today's date
  const today = new Date()
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
  const dateStr = `${days[today.getDay()]}, ${months[today.getMonth()]} ${today.getDate()}`

  const handleAddWallet = () => {
    if (walletAdded) return
    setWalletAdded(true)
    showToast('Added to Apple Wallet', 'Your ticket is ready to use')
  }

  return (
    <div className="min-h-full" style={{ background: 'var(--surface-primary)' }}>
      {/* Header */}
      <div className="flex items-center gap-3 px-5 pt-2 pb-3">
        <button className="pressable w-11 h-11 flex items-center justify-center -ml-2 rounded-full" onClick={goBack}>
          <ChevronLeft size={24} color="var(--text-primary)" strokeWidth={2.5} />
        </button>
        <span style={{ fontSize: 18, fontWeight: 800, color: 'var(--text-primary)', fontFamily: 'inherit', letterSpacing: '-0.3px' }}>Your Ticket</span>
      </div>

      {/* Active trip status */}
      <div className="px-5 pb-4">
        <div className="rounded-2xl overflow-hidden" style={{ border: '1.5px solid #357a1e', boxShadow: '0 2px 16px rgba(53,122,30,0.12)' }}>
          <div className="px-4 py-3 flex items-center gap-3" style={{ background: '#357a1e' }}>
            <div className="relative">
              <VehicleIcon size={18} color="white" />
              <div style={{
                position: 'absolute', top: -2, right: -2, width: 8, height: 8,
                borderRadius: '50%', background: '#4ade80',
                boxShadow: '0 0 0 2px #357a1e',
                animation: 'pulse-dot 2s ease-in-out infinite',
              }} />
            </div>
            <div className="flex-1">
              <span style={{ fontSize: 13, fontWeight: 800, color: 'white', fontFamily: 'inherit' }}>Trip in Progress</span>
            </div>
            <span style={{ fontSize: 12, fontWeight: 700, color: 'rgba(255,255,255,0.75)', fontFamily: 'inherit' }}>{dateStr}</span>
          </div>
          <div className="px-4 py-3.5" style={{ background: 'var(--surface-card)' }}>
            <div className="flex items-center justify-between mb-1.5">
              <span style={{ fontSize: 16, fontWeight: 800, color: 'var(--text-primary)', fontFamily: 'inherit' }}>{activeTrip.line}</span>
              <span style={{ fontSize: 14, fontWeight: 700, color: 'var(--accent-green)', fontFamily: 'inherit' }}>{activeTrip.departure} → {activeTrip.arrival}</span>
            </div>
            <div className="flex items-center justify-between">
              <span style={{ fontSize: 13, color: 'var(--text-secondary)', fontFamily: 'inherit', fontWeight: 600 }}>{activeTrip.from} → {activeTrip.to}</span>
              {activeTrip.platform && (
                <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-muted)', fontFamily: 'inherit', background: 'var(--surface-green-light)', borderRadius: 6, padding: '1px 6px' }}>
                  {isBus ? `Bay ${activeTrip.platform.replace('Bay ', '')}` : `Plat. ${activeTrip.platform}`}
                </span>
              )}
            </div>
          </div>
          {/* Progress bar */}
          <div style={{ height: 3, background: 'var(--surface-green-light)' }}>
            <div style={{
              height: '100%', background: '#357a1e', borderRadius: 2,
              width: `${Math.min(85, 15 + elapsed * 5)}%`,
              transition: 'width 1s ease',
            }} />
          </div>
        </div>
      </div>

      {/* Ticket Card */}
      <div className="px-5 pb-4">
        <div className="rounded-2xl overflow-hidden" style={{ background: 'var(--surface-card)', border: '1.5px solid var(--border-green)', boxShadow: '0 2px 12px rgba(53,122,30,0.08)' }}>
          <div className="px-5 py-3.5 flex items-center gap-3" style={{ background: '#357a1e' }}>
            <VehicleIcon size={18} color="white" />
            <div>
              <p style={{ fontSize: 14, fontWeight: 800, color: 'white', fontFamily: 'inherit' }}>E-Ticket</p>
              <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.7)', fontFamily: 'inherit' }}>Show QR code when boarding</p>
            </div>
          </div>

          <div className="px-5 py-4">
            <div className="flex justify-between mb-4">
              <div>
                <p style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-muted)', fontFamily: 'inherit', textTransform: 'uppercase', letterSpacing: '0.5px' }}>From</p>
                <p style={{ fontSize: 15, fontWeight: 800, color: 'var(--text-primary)', fontFamily: 'inherit', marginTop: 2 }}>{activeTrip.from}</p>
              </div>
              <div style={{ textAlign: 'right' }}>
                <p style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-muted)', fontFamily: 'inherit', textTransform: 'uppercase', letterSpacing: '0.5px' }}>To</p>
                <p style={{ fontSize: 15, fontWeight: 800, color: 'var(--text-primary)', fontFamily: 'inherit', marginTop: 2 }}>{activeTrip.to}</p>
              </div>
            </div>

            <div className="flex justify-between mb-3">
              <div>
                <p style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-muted)', fontFamily: 'inherit', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Departs</p>
                <p style={{ fontSize: 15, fontWeight: 800, color: 'var(--text-primary)', fontFamily: 'inherit', marginTop: 2 }}>{activeTrip.departure}</p>
              </div>
              <div style={{ textAlign: 'center' }}>
                <p style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-muted)', fontFamily: 'inherit', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Arrives</p>
                <p style={{ fontSize: 15, fontWeight: 800, color: 'var(--text-primary)', fontFamily: 'inherit', marginTop: 2 }}>{activeTrip.arrival}</p>
              </div>
              <div style={{ textAlign: 'right' }}>
                <p style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-muted)', fontFamily: 'inherit', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Date</p>
                <p style={{ fontSize: 15, fontWeight: 800, color: 'var(--text-primary)', fontFamily: 'inherit', marginTop: 2 }}>{dateStr}</p>
              </div>
            </div>

            {/* Platform info */}
            {activeTrip.platform && (
              <div className="flex items-center gap-2 mb-4 px-3 py-2 rounded-xl" style={{ background: 'var(--surface-green-soft)', border: '1px solid var(--border-green)' }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#357a1e" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10" />
                  <path d="M12 16v-4" /><path d="M12 8h.01" />
                </svg>
                <p style={{ fontSize: 13, fontWeight: 700, color: 'var(--accent-green)', fontFamily: 'inherit' }}>
                  {isBus ? `Departing from Bay ${activeTrip.platform.replace('Bay ', '')}` : `Board at Platform ${activeTrip.platform}`}
                </p>
              </div>
            )}

            <div style={{ borderTop: '2px dashed var(--border-green)', marginBottom: 20 }} />

            {/* QR Code */}
            <div className="flex flex-col items-center">
              <div style={{ padding: 12, background: 'var(--surface-primary)', borderRadius: 12, border: '1px solid var(--border-green)' }}>
                <QRCode seed={activeTrip?.ticketId ?? 'default-ticket'} />
              </div>
              <p style={{ fontSize: 11, color: 'var(--text-muted)', fontFamily: 'inherit', marginTop: 8, letterSpacing: '2px', fontWeight: 700 }}>
                {activeTrip.ticketId}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Apple Wallet button */}
      <div className="px-5 pb-4">
        <button
          className="pressable w-full py-4 rounded-2xl flex items-center justify-center gap-2"
          style={{
            background: walletAdded ? 'var(--surface-green-soft)' : '#000000',
            fontSize: 16, fontWeight: 800,
            color: walletAdded ? 'var(--accent-green)' : 'white',
            fontFamily: 'inherit',
            border: walletAdded ? '1px solid var(--border-green)' : 'none',
            boxShadow: walletAdded ? 'none' : '0 4px 16px rgba(0,0,0,0.2)',
            transition: 'all 300ms ease',
          }}
          onClick={handleAddWallet}
        >
          {!walletAdded && (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
              <path d="M19.5 6h-15A1.5 1.5 0 0 0 3 7.5v9A1.5 1.5 0 0 0 4.5 18h15a1.5 1.5 0 0 0 1.5-1.5v-9A1.5 1.5 0 0 0 19.5 6ZM4.5 7h15a.5.5 0 0 1 .5.5V9H4V7.5a.5.5 0 0 1 .5-.5ZM20 10v1.5H4V10h16Zm-.5 7h-15a.5.5 0 0 1-.5-.5V13h16v3.5a.5.5 0 0 1-.5.5Z"/>
            </svg>
          )}
          {walletAdded ? '✓ Added to Apple Wallet' : 'Add to Apple Wallet'}
        </button>
      </div>

      {/* Ride tips */}
      <div className="px-5 pb-4">
        <div className="rounded-2xl px-4 py-3.5" style={{ background: 'var(--surface-card)', border: '1px solid var(--border-color)' }}>
          <p style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-secondary)', fontFamily: 'inherit', marginBottom: 6 }}>Ride Tips</p>
          <div className="flex flex-col gap-2">
            <div className="flex items-start gap-2">
              <span style={{ fontSize: 12, color: 'var(--text-muted)', fontFamily: 'inherit', lineHeight: 1.5 }}>📱</span>
              <span style={{ fontSize: 12, color: 'var(--text-muted)', fontFamily: 'inherit', lineHeight: 1.5 }}>Have your QR code ready before boarding</span>
            </div>
            <div className="flex items-start gap-2">
              <span style={{ fontSize: 12, color: 'var(--text-muted)', fontFamily: 'inherit', lineHeight: 1.5 }}>🔔</span>
              <span style={{ fontSize: 12, color: 'var(--text-muted)', fontFamily: 'inherit', lineHeight: 1.5 }}>Listen for stop announcements during your trip</span>
            </div>
            <div className="flex items-start gap-2">
              <span style={{ fontSize: 12, color: 'var(--text-muted)', fontFamily: 'inherit', lineHeight: 1.5 }}>🎒</span>
              <span style={{ fontSize: 12, color: 'var(--text-muted)', fontFamily: 'inherit', lineHeight: 1.5 }}>Remember to take all personal belongings</span>
            </div>
          </div>
        </div>
      </div>

      <div className="h-8" />

      <style>{`
        @keyframes pulse-dot {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.6; transform: scale(1.3); }
        }
      `}</style>
    </div>
  )
}
