import NavHeader from '../components/NavHeader'
import { useNav } from '../App'
import { CheckIcon, PlusIcon2, PrestoLogo } from '../components/Icons'

interface CardInfo {
  id: string
  type: 'visa' | 'mastercard'
  last4: string
  expiry: string
  isDefault: boolean
}

const savedCards: CardInfo[] = [
  { id: 'c1', type: 'visa', last4: '4242', expiry: '08/27', isDefault: true },
  { id: 'c2', type: 'mastercard', last4: '8910', expiry: '03/28', isDefault: false },
]

function CardLogo({ type, size = 30 }: { type: 'visa' | 'mastercard'; size?: number }) {
  if (type === 'visa') {
    return (
      <div className="rounded-lg flex items-center justify-center" style={{ width: size, height: size, background: '#1a1f71' }}>
        <span style={{ fontSize: 10, fontWeight: 900, color: 'white', fontFamily: 'inherit', fontStyle: 'italic' }}>VISA</span>
      </div>
    )
  }
  return (
    <div className="rounded-lg flex items-center justify-center" style={{ width: size, height: size, background: '#1a1a1a' }}>
      <svg width="16" height="10" viewBox="0 0 16 10">
        <circle cx="6" cy="5" r="4.5" fill="#eb001b" opacity="0.9" />
        <circle cx="10" cy="5" r="4.5" fill="#f79e1b" opacity="0.9" />
        <path d="M8 1.5a4.5 4.5 0 0 0 0 7" fill="#ff5f00" opacity="0.9" />
      </svg>
    </div>
  )
}

export default function SavedCards() {
  const { prestoConnected } = useNav()

  return (
    <div className="min-h-full" style={{ background: 'var(--surface-secondary)' }}>
      <NavHeader title="Saved Cards" showBack />

      {/* PRESTO section */}
      <div className="px-5 pb-5">
        <h3 style={{ fontSize: 14, fontWeight: 800, color: 'var(--text-muted)', fontFamily: 'inherit', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 10 }}>
          Transit Card
        </h3>
        <div className="rounded-2xl overflow-hidden" style={{ border: '1px solid var(--border-color)' }}>
          <div className="flex items-center gap-3.5 px-4 py-3.5" style={{ background: 'var(--surface-primary)' }}>
            <PrestoLogo size={20} />
            <div className="flex-1 min-w-0">
              <p style={{ fontSize: 15, fontWeight: 700, color: 'var(--text-primary)', fontFamily: 'inherit' }}>PRESTO Card</p>
              <p style={{ fontSize: 12, color: 'var(--text-muted)', fontFamily: 'inherit', marginTop: 1 }}>
                {prestoConnected ? 'Connected · •••• 4821 · Balance: $42.50' : 'Not connected'}
              </p>
            </div>
            {prestoConnected && (
              <div className="w-6 h-6 rounded-full flex items-center justify-center" style={{ background: '#357a1e' }}>
                <CheckIcon size={14} color="white" strokeWidth={3} />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Payment cards */}
      <div className="px-5 pb-5">
        <h3 style={{ fontSize: 14, fontWeight: 800, color: 'var(--text-muted)', fontFamily: 'inherit', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 10 }}>
          Payment Cards
        </h3>
        <div className="rounded-2xl overflow-hidden" style={{ border: '1px solid var(--border-color)' }}>
          {savedCards.map((card, i) => (
            <div key={card.id}>
              {i > 0 && <div style={{ height: 1, background: 'var(--border-color)', marginLeft: 52 }} />}
              <div className="flex items-center gap-3.5 px-4 py-3.5" style={{ background: 'var(--surface-primary)' }}>
                <CardLogo type={card.type} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p style={{ fontSize: 15, fontWeight: 700, color: 'var(--text-primary)', fontFamily: 'inherit' }}>
                      {card.type === 'visa' ? 'Visa' : 'Mastercard'} •••• {card.last4}
                    </p>
                    {card.isDefault && (
                      <span style={{ fontSize: 10, fontWeight: 700, color: '#357a1e', background: 'var(--surface-green-soft)', padding: '2px 8px', borderRadius: 6, fontFamily: 'inherit' }}>
                        Default
                      </span>
                    )}
                  </div>
                  <p style={{ fontSize: 12, color: 'var(--text-muted)', fontFamily: 'inherit', marginTop: 1 }}>
                    Expires {card.expiry}
                  </p>
                </div>
              </div>
            </div>
          ))}

          {/* Add new card */}
          <div style={{ height: 1, background: 'var(--border-color)', marginLeft: 52 }} />
          <button className="pressable w-full flex items-center gap-3.5 px-4 py-3.5 text-left" style={{ background: 'var(--surface-primary)' }}>
            <div className="w-[30px] h-[30px] rounded-lg flex items-center justify-center" style={{ background: 'var(--surface-secondary)', border: '1.5px dashed var(--border-color)' }}>
              <PlusIcon2 size={16} color="var(--text-muted)" strokeWidth={2} />
            </div>
            <p style={{ fontSize: 15, fontWeight: 700, color: '#357a1e', fontFamily: 'inherit' }}>Add New Card</p>
          </button>
        </div>
      </div>

      <div className="px-5">
        <p style={{ fontSize: 12, color: 'var(--text-muted)', fontFamily: 'inherit', textAlign: 'center', lineHeight: 1.5 }}>
          Card information is encrypted and stored securely. You can remove a card at any time.
        </p>
      </div>

      <div className="h-8" />
    </div>
  )
}
