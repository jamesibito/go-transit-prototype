import { useState, useEffect } from 'react'
import { useNav } from '../App'
import { TrainIcon } from '../components/Icons'

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

export default function TicketConfirmation() {
  const { navigate, showToast } = useNav()
  const [walletAdded, setWalletAdded] = useState(false)

  const handleAddWallet = () => {
    if (walletAdded) return
    setWalletAdded(true)
    showToast('Added to Apple Wallet', 'Your ticket is ready to use')
  }

  return (
    <div className="min-h-full flex flex-col pt-4" style={{ background: 'var(--surface-primary)' }}>

      <div className="flex-1 flex flex-col items-center px-5">
        <CheckAnimation />

        <h1 style={{ fontSize: 22, fontWeight: 900, color: 'var(--text-primary)', fontFamily: 'inherit', letterSpacing: '-0.4px', marginTop: 16, textAlign: 'center' }}>
          Ticket Purchased!
        </h1>
        <p style={{ fontSize: 14, color: 'var(--text-muted)', fontFamily: 'inherit', marginTop: 6, textAlign: 'center' }}>
          Your e-ticket is ready. Show the QR code when boarding.
        </p>

        {/* Ticket card */}
        <div className="w-full mt-5 rounded-2xl overflow-hidden" style={{ background: 'var(--surface-card)', border: '1.5px solid var(--border-green)', boxShadow: '0 2px 12px rgba(53,122,30,0.08)' }}>
          <div className="px-5 py-4 flex items-center gap-3" style={{ background: '#357a1e' }}>
            <TrainIcon size={20} color="white" />
            <div>
              <p style={{ fontSize: 15, fontWeight: 800, color: 'white', fontFamily: 'inherit' }}>Stouffville Line</p>
              <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.75)', fontFamily: 'inherit' }}>E-Ticket · 1 Adult</p>
            </div>
          </div>

          <div className="px-5 py-4">
            <div className="flex justify-between mb-4">
              <div>
                <p style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-muted)', fontFamily: 'inherit', textTransform: 'uppercase', letterSpacing: '0.5px' }}>From</p>
                <p style={{ fontSize: 15, fontWeight: 800, color: 'var(--text-primary)', fontFamily: 'inherit', marginTop: 2 }}>Miliken GO</p>
              </div>
              <div style={{ textAlign: 'right' }}>
                <p style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-muted)', fontFamily: 'inherit', textTransform: 'uppercase', letterSpacing: '0.5px' }}>To</p>
                <p style={{ fontSize: 15, fontWeight: 800, color: 'var(--text-primary)', fontFamily: 'inherit', marginTop: 2 }}>Union Station GO</p>
              </div>
            </div>

            <div className="flex justify-between mb-5">
              <div>
                <p style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-muted)', fontFamily: 'inherit', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Departs</p>
                <p style={{ fontSize: 15, fontWeight: 800, color: 'var(--text-primary)', fontFamily: 'inherit', marginTop: 2 }}>10:54 AM</p>
              </div>
              <div style={{ textAlign: 'right' }}>
                <p style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-muted)', fontFamily: 'inherit', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Date</p>
                <p style={{ fontSize: 15, fontWeight: 800, color: 'var(--text-primary)', fontFamily: 'inherit', marginTop: 2 }}>Thu, May 7</p>
              </div>
            </div>

            <div style={{ borderTop: '2px dashed var(--border-green)', marginBottom: 20 }} />

            <div className="flex flex-col items-center">
              <div style={{ padding: 12, background: 'var(--surface-primary)', borderRadius: 12, border: '1px solid var(--border-green)' }}>
                <QRCode />
              </div>
              <p style={{ fontSize: 11, color: 'var(--text-muted)', fontFamily: 'inherit', marginTop: 8, letterSpacing: '2px', fontWeight: 700 }}>
                GTX-2026-0507-4821
              </p>
            </div>
          </div>

          <div className="px-5 py-3 flex items-center justify-between" style={{ background: 'var(--surface-green-soft)' }}>
            <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-secondary)', fontFamily: 'inherit' }}>Total Paid</span>
            <span style={{ fontSize: 18, fontWeight: 900, color: 'var(--text-primary)', fontFamily: 'inherit' }}>$9.05</span>
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
          onClick={() => navigate('landing')}
        >
          Done
        </button>
      </div>

      <div className="h-8" />
    </div>
  )
}
