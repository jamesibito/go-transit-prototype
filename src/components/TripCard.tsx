import { TrainIcon, BusIcon, PersonIcon } from './Icons'
import { useNav } from '../App'

export type TransitType = 'train' | 'bus' | 'ped'

interface TripCardProps {
  from: string
  to: string
  line: string
  departure?: string
  arrival?: string
  type?: TransitType
  onClick?: () => void
}

function TransitIcon({ type, size }: { type: TransitType; size?: number }) {
  const s = size ?? 22
  const color = '#357a1e'
  if (type === 'bus') return <BusIcon size={s} color={color} />
  if (type === 'ped') return <PersonIcon size={s} color={color} />
  return <TrainIcon size={s} color={color} />
}

export default function TripCard({ from, to, line, departure, arrival, type = 'train', onClick }: TripCardProps) {
  const { navigate } = useNav()
  const handleClick = onClick ?? (() => navigate('tripDetails'))

  return (
    <button
      onClick={handleClick}
      className="w-full text-left pressable rounded-2xl px-4 py-4 flex items-center gap-3"
      style={{ minHeight: 80, background: 'var(--surface-card)', border: '1px solid var(--border-color)' }}
    >
      <div className="shrink-0 w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'var(--surface-green-light)' }}>
        <TransitIcon type={type} size={20} />
      </div>
      <div className="flex-1 min-w-0">
        <div className="truncate" style={{ fontSize: 16, fontWeight: 800, color: 'var(--text-primary)', fontFamily: 'inherit' }}>
          {departure && arrival ? `${departure} – ${arrival}` : `${from} → ${to}`}
        </div>
        <div className="mt-0.5 truncate" style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-secondary)', fontFamily: 'inherit' }}>
          {departure ? `${from} → ${to}` : line}
        </div>
        {departure && (
          <div className="mt-0.5" style={{ fontSize: 12, color: 'var(--text-muted)', fontFamily: 'inherit' }}>{line}</div>
        )}
      </div>
    </button>
  )
}
