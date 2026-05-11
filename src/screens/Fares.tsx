import { useState } from 'react'
import { useNav } from '../App'
import NavHeader from '../components/NavHeader'
import SearchForm from '../components/SearchForm'
import QuantitySelector from '../components/QuantitySelector'
import { CheckCircleIcon, TrainIcon } from '../components/Icons'

interface ToggleProps { on: boolean; onToggle: () => void }
function Toggle({ on, onToggle }: ToggleProps) {
  return (
    <button className="pressable relative" onClick={onToggle}
      style={{ width: 48, height: 26, borderRadius: 13, background: on ? '#357a1e' : 'var(--border-color)', transition: 'background 200ms ease', flexShrink: 0 }}>
      <div style={{
        position: 'absolute', top: 2, left: on ? 24 : 2,
        width: 22, height: 22, borderRadius: 11,
        background: 'white', boxShadow: '0 1px 4px rgba(0,0,0,0.2)',
        transition: 'left 200ms cubic-bezier(0.34,1.56,0.64,1)',
      }} />
    </button>
  )
}

function FareResult({ type, onReset }: { type: 'eticket' | 'passes'; onReset: () => void }) {
  const { navigate } = useNav()

  if (type === 'passes') {
    return (
      <div className="px-5 pb-5">
        <div style={{ height: 1, background: 'var(--border-color)', marginBottom: 20, marginTop: 4 }} />

        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ background: '#357a1e' }}>
            <CheckCircleIcon size={22} color="white" strokeWidth={2} />
          </div>
          <div>
            <p style={{ fontSize: 16, fontWeight: 800, color: 'var(--text-primary)', fontFamily: 'inherit' }}>Fare Calculated</p>
            <p style={{ fontSize: 13, color: 'var(--text-muted)', fontFamily: 'inherit' }}>Weekend One-Day Pass</p>
          </div>
        </div>

        <div className="rounded-2xl overflow-hidden mb-4" style={{ border: '1px solid var(--border-green)' }}>
          <div className="px-4 py-3 flex items-center justify-between" style={{ background: 'var(--surface-green-soft)' }}>
            <span style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-primary)', fontFamily: 'inherit' }}>One-Day Pass × 1</span>
            <span style={{ fontSize: 18, fontWeight: 900, color: 'var(--text-primary)', fontFamily: 'inherit' }}>$10.00</span>
          </div>
          <div className="px-4 py-2.5 flex items-center justify-between" style={{ background: 'var(--surface-card)' }}>
            <span style={{ fontSize: 13, color: 'var(--text-muted)', fontFamily: 'inherit' }}>All zones included</span>
            <span style={{ fontSize: 13, fontWeight: 700, color: '#357a1e', fontFamily: 'inherit' }}>Unlimited rides</span>
          </div>
        </div>

        <button
          className="pressable w-full py-4 rounded-2xl mb-2.5"
          style={{ background: '#357a1e', fontSize: 16, fontWeight: 800, color: 'white', fontFamily: 'inherit', boxShadow: '0 4px 16px rgba(53,122,30,0.3)' }}
          onClick={() => navigate('payment')}
        >
          Buy Pass — $10.00
        </button>
        <button
          className="pressable w-full py-3 rounded-2xl"
          style={{ background: 'var(--surface-green-soft)', fontSize: 14, fontWeight: 700, color: '#357a1e', fontFamily: 'inherit' }}
          onClick={onReset}
        >
          Start Over
        </button>
      </div>
    )
  }

  return (
    <div className="px-5 pb-5">
      <div style={{ height: 1, background: 'var(--border-color)', marginBottom: 20, marginTop: 4 }} />

      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ background: '#357a1e' }}>
          <CheckCircleIcon size={22} color="white" strokeWidth={2} />
        </div>
        <div>
          <p style={{ fontSize: 16, fontWeight: 800, color: 'var(--text-primary)', fontFamily: 'inherit' }}>Fare Calculated</p>
          <p style={{ fontSize: 13, color: 'var(--text-muted)', fontFamily: 'inherit' }}>E-Ticket · One Way</p>
        </div>
      </div>

      <div className="rounded-2xl overflow-hidden mb-4" style={{ border: '1px solid var(--border-green)' }}>
        <div className="px-4 py-3 flex items-center gap-3" style={{ background: '#357a1e' }}>
          <TrainIcon size={18} color="white" />
          <span style={{ fontSize: 14, fontWeight: 800, color: 'white', fontFamily: 'inherit' }}>Stouffville Line</span>
        </div>
        <div className="px-4 py-3" style={{ background: 'var(--surface-card)' }}>
          <div className="flex items-center justify-between mb-2">
            <span style={{ fontSize: 13, color: 'var(--text-muted)', fontFamily: 'inherit' }}>1 Adult</span>
            <span style={{ fontSize: 15, fontWeight: 700, color: 'var(--text-primary)', fontFamily: 'inherit' }}>$9.05</span>
          </div>
          <div className="flex items-center justify-between" style={{ borderTop: '1px solid var(--border-color)', paddingTop: 8 }}>
            <span style={{ fontSize: 14, fontWeight: 800, color: 'var(--text-primary)', fontFamily: 'inherit' }}>Total</span>
            <span style={{ fontSize: 20, fontWeight: 900, color: 'var(--text-primary)', fontFamily: 'inherit' }}>$9.05</span>
          </div>
        </div>
        <div className="px-4 py-2.5 flex items-center justify-between" style={{ background: 'var(--surface-green-soft)' }}>
          <span style={{ fontSize: 12, color: 'var(--text-muted)', fontFamily: 'inherit' }}>PRESTO alternative</span>
          <span style={{ fontSize: 13, fontWeight: 700, color: '#357a1e', fontFamily: 'inherit' }}>$7.62 (save $1.43)</span>
        </div>
      </div>

      <button
        className="pressable w-full py-4 rounded-2xl mb-2.5"
        style={{ background: '#357a1e', fontSize: 16, fontWeight: 800, color: 'white', fontFamily: 'inherit', boxShadow: '0 4px 16px rgba(53,122,30,0.3)' }}
        onClick={() => navigate('payment')}
      >
        Buy E-Ticket — $9.05
      </button>
      <button
        className="pressable w-full py-3 rounded-2xl"
        style={{ background: 'var(--surface-green-soft)', fontSize: 14, fontWeight: 700, color: '#357a1e', fontFamily: 'inherit' }}
        onClick={onReset}
      >
        Start Over
      </button>
    </div>
  )
}

export default function Fares() {
  const { faresTab, setFaresTab } = useNav()
  const [returnTrip, setReturnTrip] = useState(false)
  const [fareCalculated, setFareCalculated] = useState(false)

  const isEticket = faresTab === 'eticket'

  const handleReset = () => setFareCalculated(false)
  const handleTabSwitch = (tab: 'eticket' | 'passes') => {
    setFaresTab(tab)
    setFareCalculated(false)
  }

  return (
    <div className="min-h-full" style={{ background: 'var(--surface-primary)' }}>
      <NavHeader title="Fares" showMenu />

      <div className="px-5 pb-4">
        <p style={{ fontSize: 15, fontWeight: 700, color: 'var(--text-primary)', fontFamily: 'inherit', marginBottom: 6 }}>
          Buy GO Transit E-tickets and Passes
        </p>
        <p style={{ fontSize: 14, color: 'var(--text-secondary)', fontFamily: 'inherit', lineHeight: 1.5 }}>
          Enjoy the ease and convenience of having tickets and passes emailed to you.
          Activate your e-tickets and passes 5 minutes prior to boarding GO to use.
        </p>
      </div>

      {/* Tab switcher */}
      <div className="mx-5 mb-5">
        <div className="flex rounded-2xl overflow-hidden" style={{ background: 'var(--surface-secondary)', padding: 3 }}>
          {(['eticket', 'passes'] as const).map(tab => (
            <button
              key={tab}
              className="pressable flex-1 py-3 rounded-xl text-center"
              style={{
                fontSize: 15, fontWeight: 800, fontFamily: 'inherit',
                background: faresTab === tab ? '#357a1e' : 'transparent',
                color: faresTab === tab ? 'white' : 'var(--text-muted)',
                transition: 'background 200ms ease, color 200ms ease',
              }}
              onClick={() => handleTabSwitch(tab)}
            >
              {tab === 'eticket' ? 'E-Ticket' : 'Passes'}
            </button>
          ))}
        </div>
      </div>

      {/* Card */}
      <div className="mx-5 rounded-2xl overflow-hidden" style={{ border: '1px solid var(--border-color)', boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>
        {!fareCalculated && (
          <div className="px-5 pt-5 pb-3">
            <SearchForm fromValue="" toValue="" />
          </div>
        )}

        {fareCalculated ? (
          <FareResult type={faresTab} onReset={handleReset} />
        ) : isEticket ? (
          <div className="px-5 pb-5">
            <div className="mb-5 mt-2">
              <div className="flex items-center gap-3">
                <Toggle on={returnTrip} onToggle={() => setReturnTrip(!returnTrip)} />
                <span style={{ fontSize: 15, fontWeight: 700, color: 'var(--text-primary)', fontFamily: 'inherit' }}>Return Trip</span>
              </div>
              <p style={{ fontSize: 12.5, color: 'var(--text-secondary)', fontFamily: 'inherit', marginTop: 6, marginLeft: 51, lineHeight: 1.4 }}>
                {returnTrip ? 'Same-day return included — no extra charge' : 'Add a same-day return to your fare'}
              </p>
            </div>

            <div style={{ height: 1, background: 'var(--border-color)', marginBottom: 20 }} />

            <h3 style={{ fontSize: 16, fontWeight: 800, color: 'var(--text-primary)', fontFamily: 'inherit', marginBottom: 16 }}>Passenger(s)</h3>
            <div className="flex flex-col gap-4">
              {[
                { label: 'Adults', subtitle: 'Ages 13–64' },
                { label: 'Senior', subtitle: 'Ages 65+' },
                { label: 'Youth', subtitle: 'Ages 6–12' },
                { label: 'Child', subtitle: 'Ages 0–5 (free)' },
              ].map(({ label, subtitle }) => (
                <div key={label} className="flex items-center justify-between">
                  <div>
                    <p style={{ fontSize: 15, fontWeight: 700, color: 'var(--text-primary)', fontFamily: 'inherit' }}>{label}</p>
                    <p style={{ fontSize: 12, color: 'var(--text-muted)', fontFamily: 'inherit' }}>{subtitle}</p>
                  </div>
                  <QuantitySelector initial={label === 'Adults' ? 1 : 0} />
                </div>
              ))}
            </div>

            <button
              className="pressable w-full mt-6 py-4 rounded-2xl"
              style={{ background: '#357a1e', fontSize: 16, fontWeight: 800, color: 'white', fontFamily: 'inherit', boxShadow: '0 4px 16px rgba(53,122,30,0.3)' }}
              onClick={() => setFareCalculated(true)}
            >
              Calculate Fare
            </button>
          </div>
        ) : (
          <div className="px-5 pb-5">
            <div style={{ height: 1, background: 'var(--border-color)', marginBottom: 20, marginTop: 4 }} />

            <h3 style={{ fontSize: 16, fontWeight: 800, color: 'var(--text-primary)', fontFamily: 'inherit', marginBottom: 16 }}>
              Weekends &amp; Holidays
            </h3>
            <div className="flex items-center justify-between mb-5">
              <div>
                <p style={{ fontSize: 15, fontWeight: 700, color: 'var(--text-primary)', fontFamily: 'inherit' }}>One-Day Pass</p>
                <p style={{ fontSize: 14, color: 'var(--text-secondary)', fontFamily: 'inherit' }}>$10 · All zones</p>
              </div>
              <QuantitySelector />
            </div>

            <h3 style={{ fontSize: 16, fontWeight: 800, color: 'var(--text-primary)', fontFamily: 'inherit', marginBottom: 16 }}>Weekdays</h3>
            <div className="flex flex-col gap-4">
              {[
                { label: 'Group Pass for 2', price: '$30' },
                { label: 'Group Pass for 3', price: '$40' },
                { label: 'Group Pass for 4', price: '$50' },
                { label: 'Group Pass for 5', price: '$50' },
              ].map(({ label, price }) => (
                <div key={label} className="flex items-center justify-between">
                  <div>
                    <p style={{ fontSize: 15, fontWeight: 700, color: 'var(--text-primary)', fontFamily: 'inherit' }}>{label}</p>
                    <p style={{ fontSize: 14, color: 'var(--text-secondary)', fontFamily: 'inherit' }}>{price}</p>
                  </div>
                  <QuantitySelector />
                </div>
              ))}
            </div>

            <button
              className="pressable w-full mt-6 py-4 rounded-2xl"
              style={{ background: '#357a1e', fontSize: 16, fontWeight: 800, color: 'white', fontFamily: 'inherit', boxShadow: '0 4px 16px rgba(53,122,30,0.3)' }}
              onClick={() => setFareCalculated(true)}
            >
              Calculate Fare
            </button>
          </div>
        )}
      </div>

      <div className="h-8" />
    </div>
  )
}
