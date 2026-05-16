import { useState } from 'react'
import { useNav } from '../App'
import NavHeader from '../components/NavHeader'
import TripCard from '../components/TripCard'
import StationPicker from '../components/StationPicker'
import { getRouteKeyFromStations } from '../data/trips'
import { SwapIcon, LocationPin, ClockIcon, ChevronDown } from '../components/Icons'

const history = [
  { from: 'Milliken GO', to: 'Union Station GO', line: 'Stouffville', type: 'train' as const },
  { from: 'Union Station GO', to: 'Oshawa GO', line: 'Lakeshore East', type: 'train' as const },
  { from: 'Union Station GO', to: 'Aurora GO', line: 'Barrie', type: 'train' as const },
  { from: 'Union Station GO', to: 'Burlington GO', line: 'Lakeshore West', type: 'train' as const },
  { from: 'Bramalea GO', to: 'Union Station GO', line: 'Kitchener', type: 'train' as const },
]

const TIME_OPTIONS = ['Now', 'In 30 min', 'In 1 hour', 'In 2 hours', '9:00 AM', '12:00 PM', '3:00 PM', '6:00 PM']

export default function SearchTrip() {
  const { navigate, setSelectedRoute } = useNav()
  const [from, setFrom] = useState('')
  const [to, setTo] = useState('')
  const [pickerField, setPickerField] = useState<'from' | 'to' | null>(null)
  const [selectedTime, setSelectedTime] = useState('Now')
  const [showTimePicker, setShowTimePicker] = useState(false)

  const handleHistoryClick = (histFrom: string, histTo: string) => {
    const key = getRouteKeyFromStations(histFrom, histTo)
    setSelectedRoute(key)
    navigate('results')
  }

  const handleSearch = () => {
    if (from && to) {
      const key = getRouteKeyFromStations(from, to)
      setSelectedRoute(key)
    } else {
      setSelectedRoute('stouffville')
    }
    navigate('results')
  }

  const handleSwap = () => {
    const tmp = from
    setFrom(to)
    setTo(tmp)
  }

  const handleStationSelect = (station: string) => {
    if (pickerField === 'from') setFrom(station)
    else if (pickerField === 'to') setTo(station)
    setPickerField(null)
  }

  return (
    <div className="min-h-full relative" style={{ background: 'var(--surface-primary)' }}>
      <NavHeader title="Search Schedule" showBack />

      <div className="px-5">
        {/* From/To fields */}
        <div className="relative">
          {/* From field */}
          <button
            className="pressable w-full rounded-2xl overflow-hidden mb-1 text-left"
            style={{ background: 'var(--surface-green-soft)', border: '1.5px solid var(--border-green)' }}
            onClick={() => setPickerField('from')}
          >
            <div className="px-4 pt-2.5 pb-0.5">
              <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--accent-green)', textTransform: 'uppercase', letterSpacing: '0.8px', fontFamily: 'inherit' }}>From</span>
            </div>
            <div className="flex items-center gap-2.5 px-4 pb-3">
              <LocationPin size={18} color="#357a1e" strokeWidth={2} />
              <span style={{ fontSize: 15, fontFamily: 'inherit', fontWeight: 600, color: from ? 'var(--text-primary)' : 'var(--text-muted)' }}>
                {from || 'GO station, stop, address or place'}
              </span>
            </div>
          </button>

          {/* Swap button */}
          <div
            className="pressable absolute right-3 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full flex items-center justify-center"
            onClick={handleSwap}
            style={{ background: '#357a1e', boxShadow: '0 2px 10px rgba(53,122,30,0.4)', cursor: 'pointer' }}
          >
            <SwapIcon size={18} color="white" strokeWidth={2.5} />
          </div>

          {/* To field */}
          <button
            className="pressable w-full rounded-2xl overflow-hidden text-left"
            style={{ background: 'var(--surface-green-soft)', border: '1.5px solid var(--border-green)' }}
            onClick={() => setPickerField('to')}
          >
            <div className="px-4 pt-2.5 pb-0.5">
              <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--accent-green)', textTransform: 'uppercase', letterSpacing: '0.8px', fontFamily: 'inherit' }}>To</span>
            </div>
            <div className="flex items-center gap-2.5 px-4 pb-3">
              <LocationPin size={18} color="#357a1e" strokeWidth={2} />
              <span style={{ fontSize: 15, fontFamily: 'inherit', fontWeight: 600, color: to ? 'var(--text-primary)' : 'var(--text-muted)' }}>
                {to || 'GO station, stop, address or place'}
              </span>
            </div>
          </button>
        </div>

        {/* Time picker */}
        <button
          className="pressable w-full mt-3 px-4 py-3 rounded-2xl flex items-center gap-3 text-left"
          style={{ background: 'var(--surface-card)', border: '1px solid var(--border-color)' }}
          onClick={() => setShowTimePicker(!showTimePicker)}
        >
          <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: 'var(--surface-green-light)' }}>
            <ClockIcon size={17} color="#357a1e" strokeWidth={2} />
          </div>
          <div className="flex-1">
            <p style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-muted)', fontFamily: 'inherit', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Depart</p>
            <p style={{ fontSize: 15, fontWeight: 700, color: 'var(--text-primary)', fontFamily: 'inherit', marginTop: 1 }}>{selectedTime}</p>
          </div>
          <ChevronDown size={18} color="var(--text-muted)" style={{ transform: showTimePicker ? 'rotate(180deg)' : 'rotate(0)', transition: 'transform 200ms ease' }} />
        </button>

        {/* Time options dropdown */}
        {showTimePicker && (
          <div className="mt-1 rounded-2xl overflow-hidden" style={{ border: '1px solid var(--border-color)', boxShadow: '0 4px 16px rgba(0,0,0,0.08)' }}>
            {TIME_OPTIONS.map(time => (
              <button
                key={time}
                className="pressable w-full px-4 py-3 text-left flex items-center justify-between"
                style={{
                  background: time === selectedTime ? 'var(--surface-green-soft)' : 'var(--surface-primary)',
                  borderBottom: '1px solid var(--border-color)',
                  fontSize: 14, fontWeight: time === selectedTime ? 700 : 600,
                  color: time === selectedTime ? '#357a1e' : 'var(--text-primary)',
                  fontFamily: 'inherit',
                }}
                onClick={() => { setSelectedTime(time); setShowTimePicker(false) }}
              >
                {time}
                {time === selectedTime && (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#357a1e" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                )}
              </button>
            ))}
          </div>
        )}

        <button
          className="pressable w-full mt-4 py-4 rounded-2xl text-white font-bold text-lg"
          style={{ background: '#357a1e', fontSize: 16, fontWeight: 800, fontFamily: 'inherit', boxShadow: '0 4px 16px rgba(53,122,30,0.3)' }}
          onClick={handleSearch}
        >
          See Schedule
        </button>
      </div>

      <div className="px-5 pt-6">
        <h2 style={{ fontSize: 18, fontWeight: 800, color: 'var(--text-primary)', fontFamily: 'inherit', marginBottom: 12, letterSpacing: '-0.3px' }}>
          History
        </h2>
        <div className="flex flex-col gap-2.5">
          {history.map((trip, i) => (
            <TripCard
              key={i}
              {...trip}
              onClick={() => handleHistoryClick(trip.from, trip.to)}
            />
          ))}
        </div>
      </div>
      <div className="h-8" />

      {/* Station Picker overlay */}
      {pickerField && (
        <StationPicker
          label={pickerField === 'from' ? 'Departure' : 'Arrival'}
          onSelect={handleStationSelect}
          onClose={() => setPickerField(null)}
        />
      )}
    </div>
  )
}
