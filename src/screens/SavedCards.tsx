import { useState } from 'react'
import NavHeader from '../components/NavHeader'
import { useNav } from '../App'
import { CheckIcon, PlusIcon2, PrestoLogo, TrashIcon } from '../components/Icons'

interface CardInfo {
  id: string
  type: 'visa' | 'mastercard'
  last4: string
  expiry: string
  isDefault: boolean
}

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
  const { prestoConnected, prestoBalance, showToast } = useNav()
  const [cards, setCards] = useState<CardInfo[]>([
    { id: 'c1', type: 'visa', last4: '4242', expiry: '08/27', isDefault: true },
    { id: 'c2', type: 'mastercard', last4: '8910', expiry: '03/28', isDefault: false },
  ])
  const [showAddForm, setShowAddForm] = useState(false)
  const [newCardNumber, setNewCardNumber] = useState('')
  const [newCardExpiry, setNewCardExpiry] = useState('')
  const [newCardCvv, setNewCardCvv] = useState('')
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null)

  const handleSetDefault = (id: string) => {
    setCards(prev => prev.map(c => ({ ...c, isDefault: c.id === id })))
    showToast('Default card updated')
  }

  const handleDelete = (id: string) => {
    const card = cards.find(c => c.id === id)
    if (card?.isDefault && cards.length > 1) {
      // Assign default to another card
      setCards(prev => {
        const remaining = prev.filter(c => c.id !== id)
        remaining[0].isDefault = true
        return remaining
      })
    } else {
      setCards(prev => prev.filter(c => c.id !== id))
    }
    setConfirmDelete(null)
    showToast('Card removed')
  }

  const handleAddCard = () => {
    if (!newCardNumber || !newCardExpiry) return
    const last4 = newCardNumber.replace(/\s/g, '').slice(-4) || '0000'
    const newCard: CardInfo = {
      id: `c-${Date.now()}`,
      type: newCardNumber.startsWith('4') || newCardNumber.startsWith('4') ? 'visa' : 'mastercard',
      last4,
      expiry: newCardExpiry,
      isDefault: cards.length === 0,
    }
    setCards(prev => [...prev, newCard])
    setNewCardNumber('')
    setNewCardExpiry('')
    setNewCardCvv('')
    setShowAddForm(false)
    showToast('Card added', `${newCard.type === 'visa' ? 'Visa' : 'Mastercard'} •••• ${last4}`)
  }

  // Format card number as user types
  const formatCardNumber = (value: string) => {
    const digits = value.replace(/\D/g, '').slice(0, 16)
    return digits.replace(/(.{4})/g, '$1 ').trim()
  }

  const formatExpiry = (value: string) => {
    const digits = value.replace(/\D/g, '').slice(0, 4)
    if (digits.length > 2) return `${digits.slice(0, 2)}/${digits.slice(2)}`
    return digits
  }

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
                {prestoConnected ? `Connected · •••• 4821 · Balance: $${prestoBalance.toFixed(2)}` : 'Not connected'}
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
          {cards.map((card, i) => (
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
                <div className="flex items-center gap-1.5">
                  {!card.isDefault && (
                    <button
                      className="pressable px-2.5 py-1.5 rounded-lg"
                      style={{ fontSize: 11, fontWeight: 700, color: '#357a1e', fontFamily: 'inherit', background: 'var(--surface-green-soft)' }}
                      onClick={() => handleSetDefault(card.id)}
                    >
                      Set Default
                    </button>
                  )}
                  <button
                    className="pressable w-8 h-8 rounded-full flex items-center justify-center"
                    style={{ background: confirmDelete === card.id ? '#fee2e2' : 'transparent' }}
                    onClick={() => {
                      if (confirmDelete === card.id) handleDelete(card.id)
                      else setConfirmDelete(card.id)
                    }}
                  >
                    <TrashIcon size={15} color={confirmDelete === card.id ? '#dc2626' : 'var(--text-muted)'} strokeWidth={2} />
                  </button>
                </div>
              </div>
              {/* Confirm delete inline */}
              {confirmDelete === card.id && (
                <div className="px-4 py-2.5 flex items-center justify-between" style={{ background: '#fef2f2', borderTop: '1px solid #fecaca' }}>
                  <p style={{ fontSize: 12, fontWeight: 600, color: '#dc2626', fontFamily: 'inherit' }}>Remove this card?</p>
                  <div className="flex gap-2">
                    <button
                      className="pressable px-3 py-1 rounded-lg"
                      style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-muted)', fontFamily: 'inherit', background: 'var(--surface-secondary)' }}
                      onClick={() => setConfirmDelete(null)}
                    >
                      Cancel
                    </button>
                    <button
                      className="pressable px-3 py-1 rounded-lg"
                      style={{ fontSize: 12, fontWeight: 700, color: 'white', fontFamily: 'inherit', background: '#dc2626' }}
                      onClick={() => handleDelete(card.id)}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}

          {/* Add new card button or form */}
          <div style={{ height: 1, background: 'var(--border-color)', marginLeft: 52 }} />
          {!showAddForm ? (
            <button
              className="pressable w-full flex items-center gap-3.5 px-4 py-3.5 text-left"
              style={{ background: 'var(--surface-primary)' }}
              onClick={() => setShowAddForm(true)}
            >
              <div className="w-[30px] h-[30px] rounded-lg flex items-center justify-center" style={{ background: 'var(--surface-secondary)', border: '1.5px dashed var(--border-color)' }}>
                <PlusIcon2 size={16} color="var(--text-muted)" strokeWidth={2} />
              </div>
              <p style={{ fontSize: 15, fontWeight: 700, color: '#357a1e', fontFamily: 'inherit' }}>Add New Card</p>
            </button>
          ) : (
            <div className="px-4 py-4" style={{ background: 'var(--surface-primary)' }}>
              <div className="mb-3">
                <label style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-muted)', fontFamily: 'inherit', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Card Number</label>
                <input
                  type="text"
                  value={newCardNumber}
                  onChange={e => setNewCardNumber(formatCardNumber(e.target.value))}
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
                    value={newCardExpiry}
                    onChange={e => setNewCardExpiry(formatExpiry(e.target.value))}
                    placeholder="MM/YY"
                    className="w-full mt-1.5 px-3 py-2.5 rounded-xl"
                    style={{ fontSize: 15, fontFamily: 'inherit', fontWeight: 600, background: 'var(--surface-secondary)', border: '1px solid var(--border-color)', color: 'var(--text-primary)', outline: 'none' }}
                  />
                </div>
                <div className="flex-1">
                  <label style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-muted)', fontFamily: 'inherit', textTransform: 'uppercase', letterSpacing: '0.5px' }}>CVV</label>
                  <input
                    type="text"
                    value={newCardCvv}
                    onChange={e => setNewCardCvv(e.target.value.replace(/\D/g, '').slice(0, 3))}
                    placeholder="123"
                    className="w-full mt-1.5 px-3 py-2.5 rounded-xl"
                    style={{ fontSize: 15, fontFamily: 'inherit', fontWeight: 600, background: 'var(--surface-secondary)', border: '1px solid var(--border-color)', color: 'var(--text-primary)', outline: 'none' }}
                  />
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  className="pressable flex-1 py-2.5 rounded-xl"
                  style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-muted)', fontFamily: 'inherit', background: 'var(--surface-secondary)', border: '1px solid var(--border-color)' }}
                  onClick={() => { setShowAddForm(false); setNewCardNumber(''); setNewCardExpiry(''); setNewCardCvv('') }}
                >
                  Cancel
                </button>
                <button
                  className="pressable flex-1 py-2.5 rounded-xl"
                  style={{
                    fontSize: 14, fontWeight: 700, fontFamily: 'inherit',
                    background: newCardNumber && newCardExpiry && newCardCvv ? '#357a1e' : 'var(--surface-secondary)',
                    color: newCardNumber && newCardExpiry && newCardCvv ? 'white' : 'var(--text-muted)',
                    border: newCardNumber && newCardExpiry && newCardCvv ? 'none' : '1px solid var(--border-color)',
                  }}
                  onClick={handleAddCard}
                  disabled={!newCardNumber || !newCardExpiry || !newCardCvv}
                >
                  Add Card
                </button>
              </div>
            </div>
          )}
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
