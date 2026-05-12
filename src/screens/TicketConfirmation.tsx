import { useState, useEffect } from 'react'
import { useNav } from '../App'
import { TrainIcon, BusIcon } from '../components/Icons'
import { ROUTES, fmtTime } from '../data/trips'

function QRCode() {
  const rows = 11
  const cols = 11
  const cells: boolean[][] = []
  for (let r = 0; r < rows; r++) {
    cells[r] = []
    for (let c = 0; c < cols; c++) {
      const isCornerBlock =
        (r < 3 && c < 3) || (r < 3 && c >= cols - 3) || (r >= rows - 3 && c < 3)
      cells[r][c] = isCornerBlock || Math.random() > 0.45
    }
  }
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

function CheckAnimation() {
  const [visible, setVisible] = useState(false)
  useEffect(() => { const id = setTimeout(() => setVisible(true), 200); return () => clearTimeout(id) }, [])

  return (
    <div className="flex items-center justify-center" style={{ width: 72, height: 72, margin: '0 auto' }}>
      <div style={{
        width: 72, height: 72, borderRadius: '50%', background: '#357a1e',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        transform: visible ? 'scale(1)' : 'scale(0)',
        opacity: visible ? 1 : 0,
        transition: 'transform 400ms cubic-bezier(0.34,1.56,0.64,1), opacity 300ms ease',
      }}>
        <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
          <path
            d="M10 18 L16 24 L26 12"
            stroke="white" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"
            style={{
              strokeDasharray: 30,
              strokeDashoffset: visible ? 0 : 30,
              transition: 'stroke-dashoffset 400ms ease 300ms',
            }}
          />
        </svg>
      </div>
    </div>
  )
}

// Generate a pseudo-random platform based on route
function getPlatform(routeKey: string): string {
  const platforms: Record<string, string> = {
    stouffville: '3A',
    'lakeshore-east': '11',
    barrie: '5B',
    'lakeshore-west': '8',
    'highway-407': 'Bay 12',
  }
  return platforms[routeKey] || '1'
}

// Generate a ticket ID based on route
function getTicketId(routeKey: string): string {
  const now = new Date()
  const month = (now.getMonth() + 1).toString().padStart(2, '0')
  const day = now.getDate().toString().padStart(2, '0')
  const suffix = routeKey.slice(0, 4).toUpperCase().replace('-', '')
  return `GTX-2026-${month}${day}-${suffix}`
}

export default function TicketConfirmation() {
  const { navigate, showToast, selectedRoute, purchaseType, setActiveTrip, fareDetails } = useNav()
  const route = ROUTES[selectedRoute] || ROUTES.stouffville
  const isPass = purchaseType === 'pass'
  const isBus = selectedRoute === 'highway-407'
  const hasFareDetails = fareDetails.totalPrice > 0
  const [walletAdded, setWalletAdded] = useState(false)

  const displayPrice = hasFareDetails ? `$${fareDetails.totalPrice.toFixed(2)}` : (isPass ? '$10.00' : route.eTicketPrice)
  const displayLabel = isPass ? 'One-Day Pass' : 'E-Ticket'
  const passengerLabel = hasFareDetails ? fareDetails.passengerLabel : '1 Adult'
  const platform = getPlatform(selectedRoute)
  const ticketId = getTicketId(selectedRoute)

  // Format today's date
  const today = new Date()
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
  const dateStr = `${days[today.getDay()]}, ${months[today.getMonth()]} ${today.getDate()}`

  // Generate realistic departure/arrival times relative to now
  const depMin = today.getMinutes() + 10 + Math.floor(Math.random() * 5)
  const depH = today.getHours() + Math.floor(depMin / 60)
  const depM = depMin % 60
  const durMin = parseInt(route.duration)
  const arrTotalMin = depH * 60 + depM + durMin
  const departureTime = fmtTime(depH, depM)
  const arrivalTime = fmtTime(Math.floor(arrTotalMin / 60), arrTotalMin % 60)

  const handleAddWallet = () => {
    if (walletAdded) return
    setWalletAdded(true)
    showToast('Added to Apple Wallet', 'Your ticket is ready to use')
  }

  const handleDone = () => {
    // Set active trip so the landing screen can show it
    setActiveTrip({
      line: route.line,
      from: route.from,
      to: route.to,
      departure: departureTime,
      arrival: arrivalTime,
      platform,
      ticketId,
    })
    navigate('landing')
  }

  const VehicleIcon = isBus ? BusIcon : TrainIcon

  return (
    <div className="min-h-full flex flex-col pt-4" style={{ background: 'var(--surface-primary)' }}>

      <div className="flex-1 flex flex-col items-center px-5">
        <CheckAnimation />

        <h1 style={{ fontSize: 22, fontWeight: 900, color: 'var(--text-primary)', fontFamily: 'inherit', letterSpacing: '-0.4px', marginTop: 16, textAlign: 'center' }}>
          Ticket Purchased!
        </h1>
        <p style={{ fontSize: 14, color: 'var(--text-muted)', fontFamily: 'inherit', marginTop: 6, textAlign: 'center' }}>
          Your {displayLabel.toLowerCase()} is ready. Show the QR code when boarding.
        </p>

        {/* Ticket card */}
        <div className="w-full mt-5 rounded-2xl overflow-hidden" style={{ background: 'var(--surface-card)', border: '1.5px solid var(--border-green)', boxShadow: '0 2px 12px rgba(53,122,30,0.08)' }}>
          <div className="px-5 py-4 flex items-center gap-3" style={{ background: '#357a1e' }}>
            <VehicleIcon size={20} color="white" />
            <div>
              <p style={{ fontSize: 15, fontWeight: 800, color: 'white', fontFamily: 'inherit' }}>{route.line}</p>
              <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.75)', fontFamily: 'inherit' }}>{displayLabel} · {passengerLabel}</p>
            </div>
          </div>

          <div className="px-5 py-4">
            {!isPass && (
              <div className="flex justify-between mb-4">
                <div>
                  <p style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-muted)', fontFamily: 'inherit', textTransform: 'uppercase', letterSpacing: '0.5px' }}>From</p>
                  <p style={{ fontSize: 15, fontWeight: 800, color: 'var(--text-primary)', fontFamily: 'inherit', marginTop: 2 }}>{route.from}</p>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <p style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-muted)', fontFamily: 'inherit', textTransform: 'uppercase', letterSpacing: '0.5px' }}>To</p>
                  <p style={{ fontSize: 15, fontWeight: 800, color: 'var(--text-primary)', fontFamily: 'inherit', marginTop: 2 }}>{route.to}</p>
                </div>
              </div>
            )}

            <div className="flex justify-between mb-3">
              <div>
                <p style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-muted)', fontFamily: 'inherit', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Departs</p>
                <p style={{ fontSize: 15, fontWeight: 800, color: 'var(--text-primary)', fontFamily: 'inherit', marginTop: 2 }}>{departureTime}</p>
              </div>
              <div style={{ textAlign: 'right' }}>
                <p style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-muted)', fontFamily: 'inherit', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Date</p>
                <p style={{ fontSize: 15, fontWeight: 800, color: 'var(--text-primary)', fontFamily: 'inherit', marginTop: 2 }}>{dateStr}</p>
              </div>
            </div>

            {/* Platform / Bay info */}
            <div className="flex items-center gap-2 mb-4 px-3 py-2 rounded-xl" style={{ background: 'var(--surface-green-soft)', border: '1px solid var(--border-green)' }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#357a1e" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <path d="M12 16v-4" /><path d="M12 8h.01" />
              </svg>
              <p style={{ fontSize: 13, fontWeight: 700, color: '#357a1e', fontFamily: 'inherit' }}>
                {isBus ? `Departing from Bay ${platform.replace('Bay ', '')}` : `Board at Platform ${platform}`}
              </p>
            </div>

            <div style={{ borderTop: '2px dashed var(--border-green)', marginBottom: 20 }} />

            <div className="flex flex-col items-center">
              <div style={{ padding: 12, background: 'var(--surface-primary)', borderRadius: 12, border: '1px solid var(--border-green)' }}>
                <QRCode />
              </div>
              <p style={{ fontSize: 11, color: 'var(--text-muted)', fontFamily: 'inherit', marginTop: 8, letterSpacing: '2px', fontWeight: 700 }}>
                {ticketId}
              </p>
            </div>
          </div>

          <div className="px-5 py-3 flex items-center justify-between" style={{ background: 'var(--surface-green-soft)' }}>
            <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-secondary)', fontFamily: 'inherit' }}>Total Paid</span>
            <span style={{ fontSize: 18, fontWeight: 900, color: 'var(--text-primary)', fontFamily: 'inherit' }}>{displayPrice}</span>
          </div>
        </div>

        <button
          className="pressable w-full mt-5 py-4 rounded-2xl"
          style={{
            background: walletAdded ? 'var(--surface-green-soft)' : '#357a1e',
            fontSize: 16, fontWeight: 800,
            color: walletAdded ? '#357a1e' : 'white',
            fontFamily: 'inherit',
            boxShadow: walletAdded ? 'none' : '0 4px 16px rgba(53,122,30,0.3)',
            transition: 'all 300ms ease',
          }}
          onClick={handleAddWallet}
        >
          {walletAdded ? '✓ Added to Apple Wallet' : 'Add to Apple Wallet'}
        </button>

        <button
          className="pressable w-full mt-3 py-4 rounded-2xl"
          style={{ background: 'var(--surface-green-soft)', fontSize: 16, fontWeight: 800, color: '#357a1e', fontFamily: 'inherit' }}
          onClick={handleDone}
        >
          Done
        </button>
      </div>

      <div className="h-8" />
    </div>
  )
}
