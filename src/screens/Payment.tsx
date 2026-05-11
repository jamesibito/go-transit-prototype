import { useState } from 'react'
import { useNav } from '../App'
import { ChevronLeft, ChevronRight, CheckIcon, LockIcon, PlusIcon2, TrainIcon, PrestoLogo } from '../components/Icons'
import { ROUTES } from '../data/trips'

type PaymentMethod = 'presto' | 'visa' | 'new'

export default function Payment() {
  const { goBack, navigate, prestoConnected, setPrestoConnected, selectedRoute, purchaseType, showToast } = useNav()
  const route = ROUTES[selectedRoute] || ROUTES.stouffville
  const isPass = purchaseType === 'pass'
  const displayPrice = isPass ? '$10.00' : route.eTicketPrice
  const displayLabel = isPass ? 'One-Day Pass' : 'E-Ticket'
  const [selected, setSelected] = useState<PaymentMethod>(prestoConnected ? 'presto' : 'visa')
  const [saveCard, setSaveCard] = useState(true)
  const [processing, setProcessing] = useState(false)

  const handlePay = () => {
    setProcessing(true)
    setTimeout(() => {
      setProcessing(false)
      navigate('ticketConfirmation')
    }, 1200)
  }

  return (
    <div className="min-h-full" style={{ background: 'var(--surface-primary)' }}>
      {/* Header */}
      <div className="flex items-center gap-3 px-5 pt-2 pb-3">
        <button className="pressable w-11 h-11 flex items-center justify-center -ml-2 rounded-full" onClick={goBack}>
          <ChevronLeft size={24} color="var(--text-primary)" strokeWidth={2.5} />
        </button>
        <span style={{ fontSize: 18, fontWeight: 800, color: 'var(--text-primary)', fontFamily: 'inherit', letterSpacing: '-0.3px' }}>Payment</span>
      </div>

      {/* Order Summary */}
      <div className="px-5 pb-4">
        <div className="rounded-2xl overflow-hidden" style={{ border: '1px solid var(--border-green)' }}>
          <div className="px-4 py-3 flex items-center gap-3" style={{ background: '#357a1e' }}>
            <TrainIcon size={18} color="white" />
            <div className="flex-1">
              <span style={{ fontSize: 14, fontWeight: 800, color: 'white', fontFamily: 'inherit' }}>{route.line}</span>
            </div>
          </div>
          <div className="px-4 py-3" style={{ background: 'var(--surface-card)' }}>
            {!isPass && (
              <div className="flex items-center justify-between mb-1">
                <span style={{ fontSize: 13, color: 'var(--text-secondary)', fontFamily: 'inherit' }}>{route.from} → {route.to}</span>
              </div>
            )}
            <div className="flex items-center justify-between">
              <span style={{ fontSize: 13, color: 'var(--text-muted)', fontFamily: 'inherit' }}>{displayLabel} · 1 Adult</span>
              <span style={{ fontSize: 18, fontWeight: 900, color: 'var(--text-primary)', fontFamily: 'inherit' }}>{displayPrice}</span>
            </div>
            {isPass && (
              <div className="flex items-center justify-between mt-1">
                <span style={{ fontSize: 12, color: 'var(--text-muted)', fontFamily: 'inherit' }}>All zones · Unlimited rides</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Payment Method */}
      <div className="px-5 pb-4">
        <h3 style={{ fontSize: 16, fontWeight: 800, color: 'var(--text-primary)', fontFamily: 'inherit', marginBottom: 12 }}>
          Payment Method
        </h3>

        <div className="flex flex-col gap-2.5">
          {/* PRESTO Card */}
          {prestoConnected && (
            <button
              className="pressable w-full flex items-center gap-3.5 px-4 py-3.5 rounded-2xl text-left"
              style={{
                background: selected === 'presto' ? 'var(--surface-green-soft)' : 'var(--surface-card)',
                border: selected === 'presto' ? '2px solid #357a1e' : '1.5px solid var(--border-color)',
              }}
              onClick={() => setSelected('presto')}
            >
              <PrestoLogo size={22} />
              <div className="flex-1 min-w-0">
                <p style={{ fontSize: 15, fontWeight: 700, color: 'var(--text-primary)', fontFamily: 'inherit' }}>PRESTO Card</p>
                <p style={{ fontSize: 12, color: 'var(--text-muted)', fontFamily: 'inherit' }}>•••• 4821 · Balance: $42.50</p>
              </div>
              {selected === 'presto' && (
                <div className="w-6 h-6 rounded-full flex items-center justify-center" style={{ background: '#357a1e' }}>
                  <CheckIcon size={14} color="white" strokeWidth={3} />
                </div>
              )}
            </button>
          )}

          {/* Saved Visa */}
          <button
            className="pressable w-full flex items-center gap-3.5 px-4 py-3.5 rounded-2xl text-left"
            style={{
              background: selected === 'visa' ? 'var(--surface-green-soft)' : 'var(--surface-card)',
              border: selected === 'visa' ? '2px solid #357a1e' : '1.5px solid var(--border-color)',
            }}
            onClick={() => setSelected('visa')}
          >
            <div className="w-[30px] h-[30px] rounded-lg flex items-center justify-center" style={{ background: '#1a1f71' }}>
              <span style={{ fontSize: 11, fontWeight: 900, color: 'white', fontFamily: 'inherit', fontStyle: 'italic' }}>VISA</span>
            </div>
            <div className="flex-1 min-w-0">
              <p style={{ fontSize: 15, fontWeight: 700, color: 'var(--text-primary)', fontFamily: 'inherit' }}>Visa ending in 4242</p>
              <p style={{ fontSize: 12, color: 'var(--text-muted)', fontFamily: 'inherit' }}>Expires 08/27</p>
            </div>
            {selected === 'visa' && (
              <div className="w-6 h-6 rounded-full flex items-center justify-center" style={{ background: '#357a1e' }}>
                <CheckIcon size={14} color="white" strokeWidth={3} />
              </div>
            )}
          </button>

          {/* Add New Card */}
          <button
            className="pressable w-full flex items-center gap-3.5 px-4 py-3.5 rounded-2xl text-left"
            style={{
              background: selected === 'new' ? 'var(--surface-green-soft)' : 'var(--surface-card)',
              border: selected === 'new' ? '2px solid #357a1e' : '1.5px dashed var(--border-color)',
            }}
            onClick={() => setSelected('new')}
          >
            <div className="w-[30px] h-[30px] rounded-lg flex items-center justify-center" style={{ background: 'var(--surface-secondary)' }}>
              <PlusIcon2 size={18} color="var(--text-muted)" strokeWidth={2} />
            </div>
            <div className="flex-1 min-w-0">
              <p style={{ fontSize: 15, fontWeight: 700, color: 'var(--text-primary)', fontFamily: 'inherit' }}>Add New Card</p>
              <p style={{ fontSize: 12, color: 'var(--text-muted)', fontFamily: 'inherit' }}>Credit or debit card</p>
            </div>
            {selected === 'new' && (
              <div className="w-6 h-6 rounded-full flex items-center justify-center" style={{ background: '#357a1e' }}>
                <CheckIcon size={14} color="white" strokeWidth={3} />
              </div>
            )}
          </button>
        </div>
      </div>

      {/* New Card Form (shown when "Add New Card" is selected) */}
      {selected === 'new' && (
        <div className="px-5 pb-4">
          <div className="rounded-2xl px-4 py-4" style={{ background: 'var(--surface-card)', border: '1px solid var(--border-color)' }}>
            <div className="mb-3">
              <label style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-muted)', fontFamily: 'inherit', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Card Number</label>
              <input
                type="text"
                placeholder="1234 5678 9012 3456"
                className="w-full mt-1.5 px-3 py-2.5 rounded-xl"
                style={{ fontSize: 15, fontFamily: 'inherit', fontWeight: 600, background: 'var(--surface-secondary)', border: '1px solid var(--border-color)', color: 'var(--text-primary)', outline: 'none' }}
              />
            </div>
            <div className="flex gap-3 mb-3">
              <div className="flex-1">
                <label style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-muted)', fontFamily: 'inherit', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Expiry</label>
                <input
                  type="text"
                  placeholder="MM/YY"
                  className="w-full mt-1.5 px-3 py-2.5 rounded-xl"
                  style={{ fontSize: 15, fontFamily: 'inherit', fontWeight: 600, background: 'var(--surface-secondary)', border: '1px solid var(--border-color)', color: 'var(--text-primary)', outline: 'none' }}
                />
              </div>
              <div className="flex-1">
                <label style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-muted)', fontFamily: 'inherit', textTransform: 'uppercase', letterSpacing: '0.5px' }}>CVV</label>
                <input
                  type="text"
                  placeholder="123"
                  className="w-full mt-1.5 px-3 py-2.5 rounded-xl"
                  style={{ fontSize: 15, fontFamily: 'inherit', fontWeight: 600, background: 'var(--surface-secondary)', border: '1px solid var(--border-color)', color: 'var(--text-primary)', outline: 'none' }}
                />
              </div>
            </div>

            <button
              className="pressable flex items-center gap-2 mt-1"
              onClick={() => setSaveCard(!saveCard)}
            >
              <div className="w-5 h-5 rounded flex items-center justify-center" style={{ background: saveCard ? '#357a1e' : 'transparent', border: saveCard ? 'none' : '2px solid var(--border-color)' }}>
                {saveCard && <CheckIcon size={13} color="white" strokeWidth={3} />}
              </div>
              <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-secondary)', fontFamily: 'inherit' }}>Save card for future purchases</span>
            </button>
          </div>
        </div>
      )}

      {/* PRESTO savings hint */}
      {selected !== 'presto' && prestoConnected && (
        <div className="px-5 pb-4">
          <div className="flex items-center gap-3 px-4 py-3 rounded-2xl" style={{ background: 'var(--surface-green-soft)', border: '1px solid var(--border-green)' }}>
            <PrestoLogo size={16} />
            <p style={{ fontSize: 13, color: '#357a1e', fontFamily: 'inherit', fontWeight: 600, flex: 1 }}>
              Pay with PRESTO and save {route.prestoSavings}
            </p>
          </div>
        </div>
      )}

      {/* Not connected hint — tappable to connect inline */}
      {!prestoConnected && (
        <div className="px-5 pb-4">
          <button
            className="pressable w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-left"
            style={{ background: 'var(--surface-green-soft)', border: '1px solid var(--border-green)' }}
            onClick={() => {
              setPrestoConnected(true)
              setSelected('presto')
              showToast('PRESTO Connected', 'Card •••• 4821 linked successfully')
            }}
          >
            <PrestoLogo size={16} />
            <p style={{ fontSize: 13, color: '#357a1e', fontFamily: 'inherit', fontWeight: 700, flex: 1 }}>
              Connect PRESTO to save {route.prestoSavings}
            </p>
            <ChevronRight size={16} color="#357a1e" />
          </button>
        </div>
      )}

      {/* Pay button */}
      <div className="px-5 pb-4">
        <button
          className="pressable w-full py-4 rounded-2xl flex items-center justify-center gap-2"
          style={{
            background: processing ? '#2d6618' : '#357a1e',
            fontSize: 16, fontWeight: 800, color: 'white', fontFamily: 'inherit',
            boxShadow: '0 4px 16px rgba(53,122,30,0.3)',
            opacity: processing ? 0.9 : 1,
          }}
          onClick={handlePay}
          disabled={processing}
        >
          {processing ? (
            <>
              <div style={{
                width: 18, height: 18, borderRadius: '50%',
                border: '2.5px solid rgba(255,255,255,0.3)',
                borderTopColor: 'white',
                animation: 'spin 0.8s linear infinite',
              }} />
              Processing...
            </>
          ) : (
            <>
              <LockIcon size={16} color="white" strokeWidth={2.5} />
              Pay {displayPrice}
            </>
          )}
        </button>
        <p className="text-center mt-5 flex items-center justify-center gap-1.5" style={{ fontSize: 12, color: 'var(--text-muted)', fontFamily: 'inherit' }}>
          <LockIcon size={11} color="var(--text-muted)" strokeWidth={2} />
          Secured with 256-bit encryption
        </p>
      </div>

      <div className="h-8" />

      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  )
}
