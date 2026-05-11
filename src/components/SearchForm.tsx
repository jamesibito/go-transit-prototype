import { useState } from 'react'
import { LocationPin, SwapIcon } from './Icons'

interface SearchFormProps {
  fromValue?: string
  toValue?: string
  onFromChange?: (v: string) => void
  onToChange?: (v: string) => void
  onSwap?: () => void
}

export default function SearchForm({ fromValue = '', toValue = '', onFromChange, onToChange, onSwap }: SearchFormProps) {
  const [from, setFrom] = useState(fromValue)
  const [to, setTo] = useState(toValue)

  const handleSwap = () => {
    const tmp = from
    setFrom(to)
    setTo(tmp)
    onSwap?.()
  }

  return (
    <div className="relative">
      {/* From field */}
      <div className="rounded-2xl overflow-hidden mb-1" style={{ background: 'var(--surface-green-soft)', border: '1.5px solid var(--border-green)' }}>
        <div className="px-4 pt-2.5 pb-0.5">
          <span style={{ fontSize: 11, fontWeight: 700, color: '#357a1e', textTransform: 'uppercase', letterSpacing: '0.8px', fontFamily: 'inherit' }}>From</span>
        </div>
        <div className="flex items-center gap-2.5 px-4 pb-3">
          <LocationPin size={18} color="#357a1e" strokeWidth={2} />
          <input
            type="text"
            value={from}
            onChange={e => { setFrom(e.target.value); onFromChange?.(e.target.value) }}
            placeholder="GO station, stop, address or place"
            className="flex-1 bg-transparent"
            style={{ fontSize: 15, fontFamily: 'inherit', fontWeight: 600, border: 'none', outline: 'none', color: 'var(--text-primary)', opacity: 1 }}
          />
        </div>
      </div>

      {/* Swap button */}
      <div
        className="pressable absolute right-3 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full flex items-center justify-center"
        onClick={handleSwap}
        style={{ background: '#357a1e', boxShadow: '0 2px 10px rgba(53,122,30,0.4)' }}
      >
        <SwapIcon size={18} color="white" strokeWidth={2.5} />
      </div>

      {/* To field */}
      <div className="rounded-2xl overflow-hidden" style={{ background: 'var(--surface-green-soft)', border: '1.5px solid var(--border-green)' }}>
        <div className="px-4 pt-2.5 pb-0.5">
          <span style={{ fontSize: 11, fontWeight: 700, color: '#357a1e', textTransform: 'uppercase', letterSpacing: '0.8px', fontFamily: 'inherit' }}>To</span>
        </div>
        <div className="flex items-center gap-2.5 px-4 pb-3">
          <LocationPin size={18} color="#357a1e" strokeWidth={2} />
          <input
            type="text"
            value={to}
            onChange={e => { setTo(e.target.value); onToChange?.(e.target.value) }}
            placeholder="GO station, stop, address or place"
            className="flex-1 bg-transparent"
            style={{ fontSize: 15, fontFamily: 'inherit', fontWeight: 600, border: 'none', outline: 'none', color: 'var(--text-primary)', opacity: 1 }}
          />
        </div>
      </div>
    </div>
  )
}
