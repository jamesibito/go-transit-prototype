import { useState } from 'react'
import { useNav, type FareDetails } from '../App'
import NavHeader from '../components/NavHeader'
import SearchForm from '../components/SearchForm'
import QuantitySelector from '../components/QuantitySelector'
import { CheckCircleIcon, TrainIcon, BusIcon } from '../components/Icons'
import { ROUTES } from '../data/trips'

interface ToggleProps { on: boolean; onToggle: () => void }
function Toggle({ on, onToggle }: ToggleProps) {
  return (
    <button className="pressable relative" onClick={onToggle}
      role="switch" aria-checked={on}
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

// Price multipliers: adults 100%, seniors 85%, youth 65%, children free
function calcFare(basePrice: number, adults: number, seniors: number, youth: number, returnTrip: boolean): number {
  const adultTotal = basePrice * adults
  const seniorTotal = (basePrice * 0.85) * seniors
  const youthTotal = (basePrice * 0.65) * youth
  const subtotal = adultTotal + seniorTotal + youthTotal
  return returnTrip ? subtotal * 2 : subtotal
}

function buildPassengerLabel(adults: number, seniors: number, youth: number, children: number): string {
  const parts: string[] = []
  if (adults > 0) parts.push(`${adults} Adult${adults > 1 ? 's' : ''}`)
  if (seniors > 0) parts.push(`${seniors} Senior${seniors > 1 ? 's' : ''}`)
  if (youth > 0) parts.push(`${youth} Youth`)
  if (children > 0) parts.push(`${children} Child${children > 1 ? 'ren' : ''}`)
  return parts.length > 0 ? parts.join(', ') : '1 Adult'
}

function FareResult({ type, onReset, fareInfo }: { type: 'eticket' | 'passes'; onReset: () => void; fareInfo: FareDetails }) {
  const { navigate, setPurchaseType, setFareDetails, selectedRoute } = useNav()
  const route = ROUTES[selectedRoute] || ROUTES.stouffville
  const isBus = selectedRoute === 'highway-407'

  if (type === 'passes') {
    const passTotal = fareInfo.totalPrice
    return (
      <div className="px-5 pb-5">
        <div style={{ height: 1, background: 'var(--border-color)', marginBottom: 20, marginTop: 4 }} />

        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ background: '#357a1e' }}>
            <CheckCircleIcon size={22} color="white" strokeWidth={2} />
          </div>
          <div>
            <p style={{ fontSize: 16, fontWeight: 800, color: 'var(--text-primary)', fontFamily: 'inherit' }}>Fare Calculated</p>
            <p style={{ fontSize: 13, color: 'var(--text-muted)', fontFamily: 'inherit' }}>{fareInfo.passengerLabel}</p>
          </div>
        </div>

        <div className="rounded-2xl overflow-hidden mb-4" style={{ border: '1px solid var(--border-green)' }}>
          <div className="px-4 py-3 flex items-center justify-between" style={{ background: 'var(--surface-green-soft)' }}>
            <span style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-primary)', fontFamily: 'inherit' }}>{fareInfo.passengerLabel}</span>
            <span style={{ fontSize: 18, fontWeight: 900, color: 'var(--text-primary)', fontFamily: 'inherit' }}>${passTotal.toFixed(2)}</span>
          </div>
          <div className="px-4 py-2.5 flex items-center justify-between" style={{ background: 'var(--surface-card)' }}>
            <span style={{ fontSize: 13, color: 'var(--text-muted)', fontFamily: 'inherit' }}>All zones included</span>
            <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--accent-green)', fontFamily: 'inherit' }}>Unlimited rides</span>
          </div>
        </div>

        <button
          className="pressable w-full py-4 rounded-2xl mb-2.5"
          style={{ background: '#357a1e', fontSize: 16, fontWeight: 800, color: 'white', fontFamily: 'inherit', boxShadow: '0 4px 16px rgba(53,122,30,0.3)' }}
          onClick={() => { setFareDetails(fareInfo); setPurchaseType('pass'); navigate('payment') }}
        >
          Buy Pass — ${passTotal.toFixed(2)}
        </button>
        <button
          className="pressable w-full py-3 rounded-2xl"
          style={{ background: 'var(--surface-green-soft)', fontSize: 14, fontWeight: 700, color: 'var(--accent-green)', fontFamily: 'inherit' }}
          onClick={onReset}
        >
          Start Over
        </button>
      </div>
    )
  }

  const basePrice = parseFloat(route.eTicketPrice.replace('$', ''))
  const prestoBase = parseFloat(route.prestoPrice.replace('$', ''))
  const total = fareInfo.totalPrice
  const prestoTotal = calcFare(prestoBase, fareInfo.adults, fareInfo.seniors, fareInfo.youth, fareInfo.returnTrip)
  const savings = total - prestoTotal

  return (
    <div className="px-5 pb-5">
      <div style={{ height: 1, background: 'var(--border-color)', marginBottom: 20, marginTop: 4 }} />

      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ background: '#357a1e' }}>
          <CheckCircleIcon size={22} color="white" strokeWidth={2} />
        </div>
        <div>
          <p style={{ fontSize: 16, fontWeight: 800, color: 'var(--text-primary)', fontFamily: 'inherit' }}>Fare Calculated</p>
          <p style={{ fontSize: 13, color: 'var(--text-muted)', fontFamily: 'inherit' }}>E-Ticket · {fareInfo.returnTrip ? 'Return' : 'One Way'}</p>
        </div>
      </div>

      <div className="rounded-2xl overflow-hidden mb-4" style={{ border: '1px solid var(--border-green)' }}>
        <div className="px-4 py-3 flex items-center gap-3" style={{ background: '#357a1e' }}>
          {isBus ? <BusIcon size={18} color="white" /> : <TrainIcon size={18} color="white" />}
          <span style={{ fontSize: 14, fontWeight: 800, color: 'white', fontFamily: 'inherit' }}>{route.line}</span>
        </div>
        <div className="px-4 py-3" style={{ background: 'var(--surface-card)' }}>
          {fareInfo.adults > 0 && (
            <div className="flex items-center justify-between mb-1.5">
              <span style={{ fontSize: 13, color: 'var(--text-muted)', fontFamily: 'inherit' }}>{fareInfo.adults} Adult{fareInfo.adults > 1 ? 's' : ''} × ${basePrice.toFixed(2)}{fareInfo.returnTrip ? ' × 2' : ''}</span>
              <span style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-primary)', fontFamily: 'inherit' }}>${(basePrice * fareInfo.adults * (fareInfo.returnTrip ? 2 : 1)).toFixed(2)}</span>
            </div>
          )}
          {fareInfo.seniors > 0 && (
            <div className="flex items-center justify-between mb-1.5">
              <span style={{ fontSize: 13, color: 'var(--text-muted)', fontFamily: 'inherit' }}>{fareInfo.seniors} Senior{fareInfo.seniors > 1 ? 's' : ''} × ${(basePrice * 0.85).toFixed(2)}{fareInfo.returnTrip ? ' × 2' : ''}</span>
              <span style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-primary)', fontFamily: 'inherit' }}>${(basePrice * 0.85 * fareInfo.seniors * (fareInfo.returnTrip ? 2 : 1)).toFixed(2)}</span>
            </div>
          )}
          {fareInfo.youth > 0 && (
            <div className="flex items-center justify-between mb-1.5">
              <span style={{ fontSize: 13, color: 'var(--text-muted)', fontFamily: 'inherit' }}>{fareInfo.youth} Youth × ${(basePrice * 0.65).toFixed(2)}{fareInfo.returnTrip ? ' × 2' : ''}</span>
              <span style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-primary)', fontFamily: 'inherit' }}>${(basePrice * 0.65 * fareInfo.youth * (fareInfo.returnTrip ? 2 : 1)).toFixed(2)}</span>
            </div>
          )}
          {fareInfo.children > 0 && (
            <div className="flex items-center justify-between mb-1.5">
              <span style={{ fontSize: 13, color: 'var(--text-muted)', fontFamily: 'inherit' }}>{fareInfo.children} Child{fareInfo.children > 1 ? 'ren' : ''}</span>
              <span style={{ fontSize: 14, fontWeight: 700, color: 'var(--accent-green)', fontFamily: 'inherit' }}>Free</span>
            </div>
          )}
          {fareInfo.returnTrip && (
            <div className="flex items-center gap-1.5 mb-2 mt-1">
              <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--accent-green)', fontFamily: 'inherit', background: 'var(--surface-green-soft)', borderRadius: 6, padding: '2px 8px' }}>Return trip included</span>
            </div>
          )}
          <div className="flex items-center justify-between" style={{ borderTop: '1px solid var(--border-color)', paddingTop: 8 }}>
            <span style={{ fontSize: 14, fontWeight: 800, color: 'var(--text-primary)', fontFamily: 'inherit' }}>Total</span>
            <span style={{ fontSize: 20, fontWeight: 900, color: 'var(--text-primary)', fontFamily: 'inherit' }}>${total.toFixed(2)}</span>
          </div>
        </div>
        <div className="px-4 py-2.5 flex items-center justify-between" style={{ background: 'var(--surface-green-soft)' }}>
          <span style={{ fontSize: 12, color: 'var(--text-muted)', fontFamily: 'inherit' }}>PRESTO alternative</span>
          <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--accent-green)', fontFamily: 'inherit' }}>${prestoTotal.toFixed(2)} (save ${savings.toFixed(2)})</span>
        </div>
      </div>

      <button
        className="pressable w-full py-4 rounded-2xl mb-2.5"
        style={{ background: '#357a1e', fontSize: 16, fontWeight: 800, color: 'white', fontFamily: 'inherit', boxShadow: '0 4px 16px rgba(53,122,30,0.3)' }}
        onClick={() => { setFareDetails(fareInfo); setPurchaseType('eticket'); navigate('payment') }}
      >
        Buy E-Ticket — ${total.toFixed(2)}
      </button>
      <button
        className="pressable w-full py-3 rounded-2xl"
        style={{ background: 'var(--surface-green-soft)', fontSize: 14, fontWeight: 700, color: 'var(--accent-green)', fontFamily: 'inherit' }}
        onClick={onReset}
      >
        Start Over
      </button>
    </div>
  )
}

export default function Fares() {
  const { faresTab, setFaresTab, selectedRoute } = useNav()
  const route = ROUTES[selectedRoute] || ROUTES.stouffville
  const [returnTrip, setReturnTrip] = useState(false)
  const [fareCalculated, setFareCalculated] = useState(false)
  const [adults, setAdults] = useState(1)
  const [seniors, setSeniors] = useState(0)
  const [youth, setYouth] = useState(0)
  const [children, setChildren] = useState(0)
  const [passQty, setPassQty] = useState(0)

  const isEticket = faresTab === 'eticket'

  const handleReset = () => {
    setFareCalculated(false)
    setAdults(1)
    setSeniors(0)
    setYouth(0)
    setChildren(0)
    setPassQty(0)
    setReturnTrip(false)
  }
  const handleTabSwitch = (tab: 'eticket' | 'passes') => {
    setFaresTab(tab)
    setFareCalculated(false)
  }

  // Build fare info for result display
  const basePrice = parseFloat(route.eTicketPrice.replace('$', ''))
  const eticketTotal = calcFare(basePrice, adults, seniors, youth, returnTrip)
  const passengerLabel = buildPassengerLabel(adults, seniors, youth, children)

  const fareInfo: FareDetails = isEticket
    ? { adults, seniors, youth, children, returnTrip, totalPrice: eticketTotal, passengerLabel }
    : { adults: passQty || 1, seniors: 0, youth: 0, children: 0, returnTrip: false, totalPrice: (passQty || 1) * 10, passengerLabel: `One-Day Pass × ${passQty || 1}` }

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
          <FareResult type={faresTab} onReset={handleReset} fareInfo={fareInfo} />
        ) : isEticket ? (
          <div className="px-5 pb-5">
            <div className="mb-5 mt-2">
              <div className="flex items-center gap-3">
                <Toggle on={returnTrip} onToggle={() => setReturnTrip(!returnTrip)} />
                <span style={{ fontSize: 15, fontWeight: 700, color: 'var(--text-primary)', fontFamily: 'inherit' }}>Return Trip</span>
              </div>
              <p style={{ fontSize: 12.5, color: 'var(--text-secondary)', fontFamily: 'inherit', marginTop: 6, marginLeft: 51, lineHeight: 1.4 }}>
                {returnTrip ? 'Fare doubled for same-day return' : 'Add a same-day return to your fare'}
              </p>
            </div>

            <div style={{ height: 1, background: 'var(--border-color)', marginBottom: 20 }} />

            <h3 style={{ fontSize: 16, fontWeight: 800, color: 'var(--text-primary)', fontFamily: 'inherit', marginBottom: 16 }}>Passenger(s)</h3>
            <div className="flex flex-col gap-4">
              {[
                { label: 'Adults', subtitle: 'Ages 13–64', initial: 1, setter: setAdults },
                { label: 'Senior', subtitle: 'Ages 65+', initial: 0, setter: setSeniors },
                { label: 'Youth', subtitle: 'Ages 6–12', initial: 0, setter: setYouth },
                { label: 'Child', subtitle: 'Ages 0–5 (free)', initial: 0, setter: setChildren },
              ].map(({ label, subtitle, initial, setter }) => (
                <div key={label} className="flex items-center justify-between">
                  <div>
                    <p style={{ fontSize: 15, fontWeight: 700, color: 'var(--text-primary)', fontFamily: 'inherit' }}>{label}</p>
                    <p style={{ fontSize: 12, color: 'var(--text-muted)', fontFamily: 'inherit' }}>{subtitle}</p>
                  </div>
                  <QuantitySelector initial={initial} onChange={setter} />
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
              <QuantitySelector onChange={setPassQty} />
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
