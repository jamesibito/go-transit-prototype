import { useState, useMemo, useRef, useEffect } from 'react'
import { useNav } from '../App'
import NavHeader from '../components/NavHeader'
import TripCard from '../components/TripCard'
import StationPicker from '../components/StationPicker'
import ResultsSheet from '../components/ResultsSheet'
import { getRouteKeyFromStations, ROUTES } from '../data/trips'
import { SwapIcon, LocationPin, ClockIcon, ChevronDown } from '../components/Icons'

const history = [
  { from: 'Milliken GO', to: 'Union Station GO', line: 'Stouffville', type: 'train' as const },
  { from: 'Union Station GO', to: 'Oshawa GO', line: 'Lakeshore East', type: 'train' as const },
  { from: 'Union Station GO', to: 'Aurora GO', line: 'Barrie', type: 'train' as const },
  { from: 'Newmarket GO', to: 'Pearson Airport Terminal 1', line: 'Route 34 Bus', type: 'bus' as const },
  { from: 'Bramalea GO', to: 'Union Station GO', line: 'Kitchener', type: 'train' as const },
]

// ── Build next 14 days for the date pill row ──────────────────────────────────
function buildDateOptions() {
  const out: { value: string; label: string; sublabel: string; date: Date }[] = []
  const now = new Date()
  for (let i = 0; i < 14; i++) {
    const d = new Date(now.getFullYear(), now.getMonth(), now.getDate() + i)
    const value = d.toISOString().slice(0, 10) // YYYY-MM-DD
    let label: string
    if (i === 0) label = 'Today'
    else if (i === 1) label = 'Tomorrow'
    else label = d.toLocaleDateString('en-US', { weekday: 'short' })
    const sublabel = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    out.push({ value, label, sublabel, date: d })
  }
  return out
}

// ── Build 30-minute time slots for a whole day ────────────────────────────────
function buildTimeOptions() {
  const out: { value: string; label: string; h: number; m: number }[] = []
  for (let h = 0; h < 24; h++) {
    for (const m of [0, 30]) {
      const period = h >= 12 ? 'PM' : 'AM'
      const h12 = h % 12 || 12
      out.push({
        value: `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`,
        label: `${h12}:${m.toString().padStart(2, '0')} ${period}`,
        h, m,
      })
    }
  }
  return out
}

// Round a Date up to the next 30-min boundary; used to highlight the "default
// next slot" when the user hasn't picked a specific time.
function nextHalfHour(d: Date): { h: number; m: number } {
  const total = d.getHours() * 60 + d.getMinutes()
  const next = Math.ceil(total / 30) * 30
  return { h: Math.floor(next / 60) % 24, m: next % 60 }
}

export default function SearchTrip() {
  const { navigate, selectedRoute, setSelectedRoute, searchDateTime, setSearchDateTime, shouldShowResults, setShouldShowResults, setSelectedDeparture } = useNav()
  const [from, setFrom] = useState('')
  const [to, setTo] = useState('')
  const [pickerField, setPickerField] = useState<'from' | 'to' | null>(null)
  const [showResults, setShowResults] = useState(false)

  // Validation state — surfaced when the user taps "See Schedule" with an
  // empty or duplicate field. Mirrors the GO Transit website's behaviour:
  // red error caption + the offending field briefly shakes / turns red.
  // `tick` is incremented on each failed attempt so the shake re-fires even
  // if the field is already in the error state.
  const [errors, setErrors] = useState<{ from: boolean; to: boolean; same: boolean }>({ from: false, to: false, same: false })
  const [shakeTick, setShakeTick] = useState(0)

  // If we arrived here via a path that wants the results sheet to auto-open
  // (e.g. Landing's "Next Departure" card, a Saved Trip), seed the form from
  // the chosen route and open the sheet. The flag is consumed once.
  useEffect(() => {
    if (!shouldShowResults) return
    const r = ROUTES[selectedRoute]
    if (r) {
      setFrom(r.from)
      setTo(r.to)
    }
    setShowResults(true)
    setShouldShowResults(false)
  }, [shouldShowResults, selectedRoute, setShouldShowResults])

  const dateOptions = useMemo(buildDateOptions, [])
  const timeOptions = useMemo(buildTimeOptions, [])

  // Local picker state — defaults to "now"
  const [useNow, setUseNow] = useState(searchDateTime === null)
  const [dateValue, setDateValue] = useState<string>(() => {
    const d = searchDateTime ?? new Date()
    return d.toISOString().slice(0, 10)
  })
  const [timeValue, setTimeValue] = useState<string>(() => {
    const d = searchDateTime ?? new Date()
    const { h, m } = nextHalfHour(d)
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`
  })
  const [showTimeSheet, setShowTimeSheet] = useState(false)
  const timeListRef = useRef<HTMLDivElement>(null)

  // Scroll the chosen time into view when opening the sheet
  useEffect(() => {
    if (!showTimeSheet) return
    const id = setTimeout(() => {
      const target = timeListRef.current?.querySelector(`[data-time="${timeValue}"]`)
      if (target && timeListRef.current) {
        const tRect = (target as HTMLElement).getBoundingClientRect()
        const lRect = timeListRef.current.getBoundingClientRect()
        timeListRef.current.scrollTop += tRect.top - lRect.top - lRect.height / 2 + tRect.height / 2
      }
    }, 50)
    return () => clearTimeout(id)
  }, [showTimeSheet, timeValue])

  const selectedTimeLabel = useMemo(() => {
    return timeOptions.find(t => t.value === timeValue)?.label ?? '—'
  }, [timeValue, timeOptions])

  const selectedDate = useMemo(() => {
    const inWindow = dateOptions.find(d => d.value === dateValue)
    if (inWindow) return inWindow
    // Date is outside the 14-day window — synthesize a label for the
    // header summary so it still reads cleanly.
    const [yyyy, mm, dd] = dateValue.split('-').map(Number)
    const d = new Date(yyyy, mm - 1, dd)
    return {
      value: dateValue,
      date: d,
      label: d.toLocaleDateString('en-US', { weekday: 'short' }),
      sublabel: d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    }
  }, [dateValue, dateOptions])

  // True when the chosen date is beyond the 14-day pill window
  const isCustomDate = useMemo(
    () => !dateOptions.some(d => d.value === dateValue),
    [dateValue, dateOptions]
  )

  const dateInputRef = useRef<HTMLInputElement>(null)
  const openCalendar = () => {
    const el = dateInputRef.current
    if (!el) return
    if (typeof (el as any).showPicker === 'function') (el as any).showPicker()
    else el.click()
  }

  const handleHistoryClick = (histFrom: string, histTo: string) => {
    const key = getRouteKeyFromStations(histFrom, histTo)
    setSelectedRoute(key)
    setFrom(histFrom)
    setTo(histTo)
    setSearchDateTime(null)
    setShowResults(true)
  }

  const handleSearch = () => {
    // Invalid form: flag the empty/duplicate fields, trigger the shake, and
    // bail out without navigating. Bumping `shakeTick` re-runs the animation
    // even if the same field was already in the error state.
    const same = !!from && !!to && from === to
    if (!from || !to || same) {
      setErrors({ from: !from, to: !to || same, same })
      setShakeTick(t => t + 1)
      return
    }
    setErrors({ from: false, to: false, same: false })
    const key = getRouteKeyFromStations(from, to)
    setSelectedRoute(key)
    if (useNow) {
      setSearchDateTime(null)
    } else {
      // Build a Date from chosen date + time
      const [yyyy, mm, dd] = dateValue.split('-').map(Number)
      const [hh, mn] = timeValue.split(':').map(Number)
      setSearchDateTime(new Date(yyyy, mm - 1, dd, hh, mn, 0, 0))
    }
    setShowResults(true)
  }

  // Search is only valid once both endpoints are picked AND they differ
  const canSearch = Boolean(from && to && from !== to)

  const handleSwap = () => {
    const tmp = from
    setFrom(to)
    setTo(tmp)
  }

  const handleStationSelect = (station: string) => {
    if (pickerField === 'from') {
      setFrom(station)
      // Clear the corresponding error as soon as the user picks a value.
      setErrors(e => ({ ...e, from: false, same: station === to ? e.same : false }))
    } else if (pickerField === 'to') {
      setTo(station)
      setErrors(e => ({ ...e, to: false, same: station === from ? e.same : false }))
    }
    setPickerField(null)
  }

  // Summary label for the date+time button
  const whenLabel = useNow ? 'Leave now' : `${selectedDate?.label ?? 'Today'} · ${selectedTimeLabel}`
  const whenSubLabel = useNow
    ? `next slot ${(() => { const { h, m } = nextHalfHour(new Date()); const p = h >= 12 ? 'PM' : 'AM'; const h12 = h % 12 || 12; return `${h12}:${m.toString().padStart(2, '0')} ${p}` })()}`
    : selectedDate?.sublabel ?? ''

  return (
    // Outer is pinned to the viewport (height 100% of .screen, overflow
    // hidden) so the absolutely-positioned overlays — station picker,
    // time-picker sheet, and the results sheet — resolve their `bottom: 0`
    // and `height: %` against the visible area, not the scroll-grown form
    // content. The scrollable form lives in its own inner container.
    <div className="relative" style={{ background: 'var(--surface-primary)', height: '100%', overflow: 'hidden' }}>
      <div className="absolute inset-0 overflow-y-auto" style={{ WebkitOverflowScrolling: 'touch' }}>
      <NavHeader title="Plan Your Trip" showBack />

      <div className="px-5">
        {/* From/To fields. Each is wrapped in a keyed div so the shake
            animation can be re-triggered on every failed See-Schedule tap.
            Error state styles the field with a red border + light red tint
            and surfaces an inline caption beneath, à la the GO Transit web
            booking form. */}
        <div className="relative">
          <div key={`from-shake-${shakeTick}-${errors.from}`} className={errors.from ? 'field-shake' : ''}>
            <button
              className="pressable w-full rounded-2xl overflow-hidden text-left"
              style={{
                background: errors.from ? 'var(--surface-error-soft)' : 'var(--surface-green-soft)',
                border: `1.5px solid ${errors.from ? 'var(--border-error)' : 'var(--border-green)'}`,
                transition: 'background 200ms ease, border-color 200ms ease',
              }}
              onClick={() => setPickerField('from')}
            >
              <div className="px-4 pt-2.5 pb-0.5">
                <span style={{ fontSize: 11, fontWeight: 700, color: errors.from ? 'var(--accent-error)' : 'var(--accent-green)', textTransform: 'uppercase', letterSpacing: '0.8px', fontFamily: 'inherit' }}>From</span>
              </div>
              <div className="flex items-center gap-2.5 px-4 pb-3">
                <LocationPin size={18} color={errors.from ? 'var(--accent-error)' : '#357a1e'} strokeWidth={2} />
                <span style={{ fontSize: 15, fontFamily: 'inherit', fontWeight: 600, color: from ? 'var(--text-primary)' : 'var(--text-muted)' }}>
                  {from || 'GO station, stop, address or place'}
                </span>
              </div>
            </button>
          </div>
          {errors.from && (
            <p style={{ fontSize: 12, fontWeight: 700, color: 'var(--accent-error)', fontFamily: 'inherit', marginTop: 4, marginLeft: 4 }}>
              Please enter the departure
            </p>
          )}

          <div
            className="pressable absolute right-3 z-10 w-10 h-10 rounded-full flex items-center justify-center"
            onClick={handleSwap}
            style={{
              top: 'calc(50% - 8px)',
              transform: 'translateY(-50%)',
              background: '#357a1e', boxShadow: '0 2px 10px rgba(53,122,30,0.4)', cursor: 'pointer',
            }}
          >
            <SwapIcon size={18} color="white" strokeWidth={2.5} />
          </div>

          <div key={`to-shake-${shakeTick}-${errors.to}`} className={errors.to ? 'field-shake mt-1' : 'mt-1'}>
            <button
              className="pressable w-full rounded-2xl overflow-hidden text-left"
              style={{
                background: errors.to ? 'var(--surface-error-soft)' : 'var(--surface-green-soft)',
                border: `1.5px solid ${errors.to ? 'var(--border-error)' : 'var(--border-green)'}`,
                transition: 'background 200ms ease, border-color 200ms ease',
              }}
              onClick={() => setPickerField('to')}
            >
              <div className="px-4 pt-2.5 pb-0.5">
                <span style={{ fontSize: 11, fontWeight: 700, color: errors.to ? 'var(--accent-error)' : 'var(--accent-green)', textTransform: 'uppercase', letterSpacing: '0.8px', fontFamily: 'inherit' }}>To</span>
              </div>
              <div className="flex items-center gap-2.5 px-4 pb-3">
                <LocationPin size={18} color={errors.to ? 'var(--accent-error)' : '#357a1e'} strokeWidth={2} />
                <span style={{ fontSize: 15, fontFamily: 'inherit', fontWeight: 600, color: to ? 'var(--text-primary)' : 'var(--text-muted)' }}>
                  {to || 'GO station, stop, address or place'}
                </span>
              </div>
            </button>
          </div>
          {errors.to && (
            <p style={{ fontSize: 12, fontWeight: 700, color: 'var(--accent-error)', fontFamily: 'inherit', marginTop: 4, marginLeft: 4 }}>
              {errors.same ? 'Pick a different destination' : 'Please enter the destination'}
            </p>
          )}
        </div>

        {/* Now / Schedule toggle */}
        <div className="mt-4 mb-2 flex items-center gap-2 p-1 rounded-full" style={{ background: 'var(--surface-secondary)', border: '1px solid var(--border-color)' }}>
          {[
            { key: true, label: 'Leave now' },
            { key: false, label: 'Schedule' },
          ].map(opt => (
            <button
              key={String(opt.key)}
              className="pressable flex-1 py-2 rounded-full text-center"
              style={{
                background: useNow === opt.key ? '#357a1e' : 'transparent',
                color: useNow === opt.key ? '#ffffff' : 'var(--text-secondary)',
                fontSize: 13, fontWeight: 700, fontFamily: 'inherit',
                transition: 'background 200ms ease, color 200ms ease',
              }}
              onClick={() => setUseNow(opt.key)}
            >
              {opt.label}
            </button>
          ))}
        </div>

        {/* Date pill row (only when scheduling) */}
        {!useNow && (
          <div className="mt-2 -mx-5 px-5">
            <div className="flex gap-2 overflow-x-auto pb-1" style={{ WebkitOverflowScrolling: 'touch' }}>
              {dateOptions.map(d => {
                const active = dateValue === d.value
                return (
                  <button
                    key={d.value}
                    className="pressable shrink-0 px-3.5 py-2 rounded-xl text-center"
                    style={{
                      background: active ? '#357a1e' : 'var(--surface-card)',
                      border: `1px solid ${active ? '#357a1e' : 'var(--border-color)'}`,
                      minWidth: 70,
                    }}
                    onClick={() => setDateValue(d.value)}
                  >
                    <p style={{
                      fontSize: 13, fontWeight: 800, fontFamily: 'inherit',
                      color: active ? '#ffffff' : 'var(--text-primary)',
                      lineHeight: 1.2,
                    }}>{d.label}</p>
                    <p style={{
                      fontSize: 11, fontFamily: 'inherit', marginTop: 1,
                      color: active ? 'rgba(255,255,255,0.85)' : 'var(--text-muted)',
                    }}>{d.sublabel}</p>
                  </button>
                )
              })}
              {/* Pill showing the custom-picked date when it's beyond the 14-day window */}
              {isCustomDate && selectedDate && (
                <button
                  className="pressable shrink-0 px-3.5 py-2 rounded-xl text-center"
                  style={{
                    background: '#357a1e',
                    border: '1px solid #357a1e',
                    minWidth: 70,
                  }}
                  onClick={openCalendar}
                >
                  <p style={{ fontSize: 13, fontWeight: 800, fontFamily: 'inherit', color: '#ffffff', lineHeight: 1.2 }}>{selectedDate.label}</p>
                  <p style={{ fontSize: 11, fontFamily: 'inherit', marginTop: 1, color: 'rgba(255,255,255,0.85)' }}>{selectedDate.sublabel}</p>
                </button>
              )}
              {/* Calendar pill — opens the OS-native date picker for any future date */}
              <button
                className="pressable shrink-0 px-3 py-2 rounded-xl flex items-center justify-center gap-1.5"
                style={{
                  background: 'var(--surface-card)',
                  border: '1px dashed var(--border-color)',
                  minWidth: 56,
                }}
                onClick={openCalendar}
                aria-label="Pick another date"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#357a1e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="4" width="18" height="18" rx="2" />
                  <line x1="16" y1="2" x2="16" y2="6" />
                  <line x1="8"  y1="2" x2="8"  y2="6" />
                  <line x1="3" y1="10" x2="21" y2="10" />
                </svg>
                <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-secondary)', fontFamily: 'inherit' }}>More</span>
              </button>
            </div>
            {/* Hidden native input — its onChange writes to dateValue */}
            <input
              ref={dateInputRef}
              type="date"
              value={dateValue}
              min={dateOptions[0].value}
              onChange={e => { if (e.target.value) setDateValue(e.target.value) }}
              style={{ position: 'absolute', opacity: 0, pointerEvents: 'none', width: 0, height: 0 }}
            />
          </div>
        )}

        {/* When summary button */}
        <button
          className="pressable w-full mt-2 px-4 py-3 rounded-2xl flex items-center gap-3 text-left"
          style={{ background: 'var(--surface-card)', border: '1px solid var(--border-color)' }}
          onClick={() => { if (!useNow) setShowTimeSheet(true) }}
          disabled={useNow}
        >
          <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: 'var(--surface-green-light)' }}>
            <ClockIcon size={17} color="#357a1e" strokeWidth={2} />
          </div>
          <div className="flex-1">
            <p style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-muted)', fontFamily: 'inherit', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Depart at
            </p>
            <p style={{ fontSize: 15, fontWeight: 800, color: 'var(--text-primary)', fontFamily: 'inherit', marginTop: 1, letterSpacing: '-0.2px' }}>
              {whenLabel}
            </p>
            {whenSubLabel && (
              <p style={{ fontSize: 12, color: 'var(--text-muted)', fontFamily: 'inherit', marginTop: 1 }}>{whenSubLabel}</p>
            )}
          </div>
          {!useNow && <ChevronDown size={18} color="var(--text-muted)" />}
        </button>

        {/* Always reads "See Schedule" — when the form is invalid the button
            stays visually muted but is still tappable so the user gets
            actionable feedback (red field + caption + shake) instead of
            silent inaction. Matches the GO Transit web booking pattern. */}
        <button
          className="pressable w-full mt-4 py-4 rounded-2xl"
          style={{
            background: canSearch ? '#357a1e' : 'var(--surface-secondary)',
            color: canSearch ? '#ffffff' : 'var(--text-muted)',
            fontSize: 16, fontWeight: 800, fontFamily: 'inherit',
            boxShadow: canSearch ? '0 4px 16px rgba(53,122,30,0.3)' : 'none',
            border: canSearch ? 'none' : '1px solid var(--border-color)',
            transition: 'background 200ms ease, color 200ms ease, box-shadow 200ms ease',
          }}
          onClick={handleSearch}
          aria-disabled={!canSearch}
        >
          See Schedule
        </button>
      </div>

      <div className="px-5 pt-6">
        <h2 style={{ fontSize: 18, fontWeight: 800, color: 'var(--text-primary)', fontFamily: 'inherit', marginBottom: 12, letterSpacing: '-0.3px' }}>
          Recent trips
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
      </div>{/* end scrollable inner */}

      {/* ── Time picker bottom sheet ─────────────────────────────────────── */}
      {showTimeSheet && (
        <div
          className="absolute inset-0 z-30 flex flex-col justify-end"
          style={{ background: 'rgba(0,0,0,0.4)' }}
          onClick={() => setShowTimeSheet(false)}
        >
          <div
            className="rounded-t-3xl flex flex-col"
            style={{ background: 'var(--surface-primary)', maxHeight: '70%', animation: 'sheet-up 0.25s cubic-bezier(0.22, 1, 0.36, 1)' }}
            onClick={e => e.stopPropagation()}
          >
            <div className="pt-3 pb-1 flex justify-center">
              <div style={{ width: 36, height: 4, borderRadius: 2, background: 'var(--border-color)' }} />
            </div>
            <div className="flex items-center justify-between px-5 pt-2 pb-3" style={{ borderBottom: '1px solid var(--border-color)' }}>
              <p style={{ fontSize: 17, fontWeight: 800, color: 'var(--text-primary)', fontFamily: 'inherit', letterSpacing: '-0.3px' }}>
                Depart at
              </p>
              <button
                className="pressable px-3 py-1.5 rounded-full"
                style={{ background: '#357a1e', fontSize: 13, fontWeight: 700, color: 'white', fontFamily: 'inherit' }}
                onClick={() => setShowTimeSheet(false)}
              >
                Done
              </button>
            </div>
            <div ref={timeListRef} className="flex-1 overflow-y-auto" style={{ WebkitOverflowScrolling: 'touch' }}>
              {timeOptions.map(t => {
                const active = t.value === timeValue
                return (
                  <button
                    key={t.value}
                    data-time={t.value}
                    className="pressable w-full px-5 py-3 text-left flex items-center justify-between"
                    style={{
                      background: active ? 'var(--surface-green-soft)' : 'transparent',
                      borderBottom: '1px solid var(--border-color)',
                    }}
                    onClick={() => setTimeValue(t.value)}
                  >
                    <span style={{
                      fontSize: 15, fontWeight: active ? 800 : 600,
                      color: active ? '#357a1e' : 'var(--text-primary)',
                      fontFamily: 'inherit',
                    }}>{t.label}</span>
                    {active && (
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#357a1e" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    )}
                  </button>
                )
              })}
            </div>
          </div>
          <style>{`@keyframes sheet-up { from { transform: translateY(20%); opacity: 0 } to { transform: translateY(0); opacity: 1 } }`}</style>
        </div>
      )}

      {/* Station Picker overlay */}
      {pickerField && (
        <StationPicker
          label={pickerField === 'from' ? 'Departure' : 'Arrival'}
          onSelect={handleStationSelect}
          onClose={() => setPickerField(null)}
        />
      )}

      {/* Results bottom sheet — replaces the old standalone "Search Schedule"
          page. Dismissing returns the user to the editable form below, which
          is the right place to be when no trips match or the user wants to
          change date/time/stations. */}
      <ResultsSheet
        visible={showResults}
        routeKey={selectedRoute}
        atDate={searchDateTime ?? new Date()}
        onClose={() => setShowResults(false)}
        onPickTrip={(trip) => {
          setSelectedDeparture(trip)
          navigate('tripDetails')
        }}
      />
    </div>
  )
}
