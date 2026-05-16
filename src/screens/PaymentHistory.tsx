import { useState, useMemo } from 'react'
import NavHeader from '../components/NavHeader'
import { TrainIcon, BusIcon } from '../components/Icons'

interface Transaction {
  id: string
  type: 'train' | 'bus'
  line: string
  from: string
  to: string
  date: string
  time: string
  amount: string
  method: 'eticket' | 'presto'
  daysAgo: number // for filtering
}

const transactions: Transaction[] = [
  { id: 't1', type: 'train', line: 'Stouffville Line', from: 'Milliken GO', to: 'Union Station GO', date: 'Today', time: '10:54 AM', amount: '$6.25', method: 'eticket', daysAgo: 0 },
  { id: 't2', type: 'train', line: 'Stouffville Line', from: 'Union Station GO', to: 'Milliken GO', date: 'Today', time: '5:30 PM', amount: '$5.31', method: 'presto', daysAgo: 0 },
  { id: 't3', type: 'train', line: 'Lakeshore East', from: 'Union Station GO', to: 'Oshawa GO', date: 'May 9', time: '9:15 AM', amount: '$10.07', method: 'presto', daysAgo: 2 },
  { id: 't4', type: 'train', line: 'Kitchener Line', from: 'Bramalea GO', to: 'Union Station GO', date: 'May 8', time: '7:48 AM', amount: '$7.35', method: 'presto', daysAgo: 3 },
  { id: 't5', type: 'train', line: 'Barrie Line', from: 'Union Station GO', to: 'Aurora GO', date: 'May 7', time: '8:30 AM', amount: '$7.35', method: 'presto', daysAgo: 4 },
  { id: 't6', type: 'train', line: 'Lakeshore West', from: 'Union Station GO', to: 'Burlington GO', date: 'May 5', time: '10:00 AM', amount: '$11.10', method: 'eticket', daysAgo: 6 },
  { id: 't7', type: 'train', line: 'Stouffville Line', from: 'Milliken GO', to: 'Union Station GO', date: 'May 4', time: '7:45 AM', amount: '$5.31', method: 'presto', daysAgo: 7 },
  { id: 't8', type: 'train', line: 'Lakeshore East', from: 'Oshawa GO', to: 'Union Station GO', date: 'Apr 28', time: '6:15 PM', amount: '$10.07', method: 'presto', daysAgo: 13 },
  { id: 't9', type: 'train', line: 'Stouffville Line', from: 'Union Station GO', to: 'Milliken GO', date: 'Apr 25', time: '5:00 PM', amount: '$5.31', method: 'presto', daysAgo: 16 },
]

type FilterTab = 'all' | 'week' | 'month' | 'presto' | 'eticket'

const FILTERS: { key: FilterTab; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'week', label: 'This Week' },
  { key: 'month', label: 'This Month' },
  { key: 'presto', label: 'PRESTO' },
  { key: 'eticket', label: 'E-Ticket' },
]

function TransactionRow({ tx }: { tx: Transaction }) {
  const Icon = tx.type === 'bus' ? BusIcon : TrainIcon
  return (
    <div className="flex items-center gap-3.5 px-4 py-3.5" style={{ background: 'var(--surface-primary)' }}>
      <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ background: 'var(--surface-green-soft)' }}>
        <Icon size={20} color="#357a1e" />
      </div>
      <div className="flex-1 min-w-0">
        <p style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-primary)', fontFamily: 'inherit' }}>{tx.line}</p>
        <p style={{ fontSize: 12, color: 'var(--text-muted)', fontFamily: 'inherit', marginTop: 1 }}>
          {tx.from} → {tx.to}
        </p>
        <p style={{ fontSize: 11, color: 'var(--text-muted)', fontFamily: 'inherit', marginTop: 1, opacity: 0.7 }}>
          {tx.date} · {tx.time}
        </p>
      </div>
      <div className="text-right shrink-0">
        <p style={{ fontSize: 16, fontWeight: 800, color: 'var(--text-primary)', fontFamily: 'inherit' }}>{tx.amount}</p>
        <p style={{ fontSize: 11, fontWeight: 600, color: tx.method === 'presto' ? '#357a1e' : 'var(--text-muted)', fontFamily: 'inherit', marginTop: 1 }}>
          {tx.method === 'presto' ? 'PRESTO' : 'E-Ticket'}
        </p>
      </div>
    </div>
  )
}

function Divider() {
  return <div style={{ height: 1, background: 'var(--border-color)', marginLeft: 56 }} />
}

export default function PaymentHistory() {
  const [activeFilter, setActiveFilter] = useState<FilterTab>('all')

  const filtered = useMemo(() => {
    switch (activeFilter) {
      case 'week': return transactions.filter(tx => tx.daysAgo <= 7)
      case 'month': return transactions.filter(tx => tx.daysAgo <= 30)
      case 'presto': return transactions.filter(tx => tx.method === 'presto')
      case 'eticket': return transactions.filter(tx => tx.method === 'eticket')
      default: return transactions
    }
  }, [activeFilter])

  // Group by date
  const grouped: { date: string; items: Transaction[] }[] = []
  filtered.forEach(tx => {
    const existing = grouped.find(g => g.date === tx.date)
    if (existing) existing.items.push(tx)
    else grouped.push({ date: tx.date, items: [tx] })
  })

  const totalSpent = filtered.reduce((sum, tx) => sum + parseFloat(tx.amount.replace('$', '')), 0)

  return (
    <div className="min-h-full" style={{ background: 'var(--surface-secondary)' }}>
      <NavHeader title="Payment History" showBack />

      {/* Summary card */}
      <div className="px-5 pb-4">
        <div className="rounded-2xl px-5 py-4" style={{ background: '#357a1e' }}>
          <p style={{ fontSize: 12, fontWeight: 700, color: 'rgba(255,255,255,0.6)', fontFamily: 'inherit', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            {activeFilter === 'week' ? 'This Week' : activeFilter === 'presto' ? 'PRESTO Spending' : activeFilter === 'eticket' ? 'E-Ticket Spending' : 'This Month'}
          </p>
          <p style={{ fontSize: 32, fontWeight: 900, color: 'white', fontFamily: 'inherit', letterSpacing: '-0.5px', marginTop: 4 }}>
            ${totalSpent.toFixed(2)}
          </p>
          <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.6)', fontFamily: 'inherit', marginTop: 4 }}>
            {filtered.length} transaction{filtered.length !== 1 ? 's' : ''}
          </p>
        </div>
      </div>

      {/* Filter tabs */}
      <div className="px-5 pb-4">
        <div className="flex gap-2 overflow-x-auto pb-1" style={{ WebkitOverflowScrolling: 'touch', scrollbarWidth: 'none' }}>
          {FILTERS.map(f => (
            <button
              key={f.key}
              className="pressable shrink-0 px-3.5 py-2 rounded-xl"
              style={{
                background: activeFilter === f.key ? '#357a1e' : 'var(--surface-card)',
                border: activeFilter === f.key ? 'none' : '1px solid var(--border-color)',
                fontSize: 13,
                fontWeight: 700,
                color: activeFilter === f.key ? 'white' : 'var(--text-secondary)',
                fontFamily: 'inherit',
                whiteSpace: 'nowrap',
              }}
              onClick={() => setActiveFilter(f.key)}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Transaction list */}
      {grouped.length === 0 ? (
        <div className="px-5 pb-5">
          <div className="rounded-2xl px-5 py-8 text-center" style={{ background: 'var(--surface-card)', border: '1px dashed var(--border-color)' }}>
            <p style={{ fontSize: 14, color: 'var(--text-muted)', fontFamily: 'inherit' }}>No transactions found</p>
            <p style={{ fontSize: 13, color: 'var(--text-muted)', fontFamily: 'inherit', marginTop: 4, opacity: 0.7 }}>Try a different filter</p>
          </div>
        </div>
      ) : (
        grouped.map(group => (
          <div key={group.date} className="px-5 pb-5">
            <h3 style={{ fontSize: 14, fontWeight: 800, color: 'var(--text-muted)', fontFamily: 'inherit', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 10 }}>
              {group.date}
            </h3>
            <div className="rounded-2xl overflow-hidden" style={{ border: '1px solid var(--border-color)' }}>
              {group.items.map((tx, i) => (
                <div key={tx.id}>
                  {i > 0 && <Divider />}
                  <TransactionRow tx={tx} />
                </div>
              ))}
            </div>
          </div>
        ))
      )}

      <div className="h-8" />
    </div>
  )
}
