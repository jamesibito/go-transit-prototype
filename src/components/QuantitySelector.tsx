import { useState } from 'react'
import { MinusIcon, PlusIcon, TicketIcon } from './Icons'

interface QuantitySelectorProps {
  initial?: number
  min?: number
  max?: number
  onChange?: (val: number) => void
}

export default function QuantitySelector({ initial = 0, min = 0, max = 9, onChange }: QuantitySelectorProps) {
  const [count, setCount] = useState(initial)

  const update = (n: number) => {
    const clamped = Math.max(min, Math.min(max, n))
    setCount(clamped)
    onChange?.(clamped)
  }

  return (
    <div className="flex items-center gap-2 rounded-xl px-2 py-1.5" style={{ background: 'var(--surface-green-soft)', border: '1px solid var(--border-green)' }}>
      <div className="flex items-center gap-2 px-1">
        <TicketIcon size={22} color="#357a1e" strokeWidth={1.8} />
        <span style={{ fontSize: 20, fontWeight: 700, color: 'var(--text-primary)', fontFamily: 'inherit', minWidth: 20, textAlign: 'center' }}>{count}</span>
      </div>
      <div className="flex items-center gap-1">
        <button
          className="pressable p-0.5 rounded-full"
          onClick={() => update(count - 1)}
          disabled={count <= min}
          style={{ opacity: count <= min ? 0.3 : 1 }}
        >
          <MinusIcon size={26} color="var(--text-secondary)" strokeWidth={1.8} />
        </button>
        <button
          className="pressable p-0.5 rounded-full"
          onClick={() => update(count + 1)}
          disabled={count >= max}
          style={{ opacity: count >= max ? 0.3 : 1 }}
        >
          <PlusIcon size={26} color="var(--text-secondary)" strokeWidth={1.8} />
        </button>
      </div>
    </div>
  )
}
