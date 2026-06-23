/**
 * Realistic iOS 17+ Status Bar
 * Pixel-accurate signal, WiFi, and battery glyphs matching Apple's HIG
 * proportions. Live clock updates every 15s.
 */
import { useState, useEffect } from 'react'

function useCurrentTime() {
  const fmt = () => {
    const d = new Date()
    let h = d.getHours()
    const m = d.getMinutes().toString().padStart(2, '0')
    h = h % 12 || 12
    return `${h}:${m}`
  }
  const [time, setTime] = useState(fmt)
  useEffect(() => {
    const id = setInterval(() => setTime(fmt()), 15_000)
    return () => clearInterval(id)
  }, [])
  return time
}

export default function StatusBar() {
  const time = useCurrentTime()
  return (
    <div className="status-bar">
      <span
        style={{
          fontSize: 16,
          fontWeight: 600,
          fontFamily: '-apple-system, "SF Pro Text", "Helvetica Neue", sans-serif',
          letterSpacing: '-0.02em',
          fontVariantNumeric: 'tabular-nums',
          fontFeatureSettings: '"tnum"',
        }}
      >
        {time}
      </span>

      <div className="flex items-center" style={{ gap: 6 }}>
        {/* Cellular — 4 ascending bars, all filled at full signal */}
        <svg width="18" height="11" viewBox="0 0 18 11" fill="currentColor" aria-hidden>
          <rect x="0" y="7.5" width="3" height="3.5" rx="0.8" />
          <rect x="4.5" y="5" width="3" height="6" rx="0.8" />
          <rect x="9" y="2.5" width="3" height="8.5" rx="0.8" />
          <rect x="13.5" y="0" width="3" height="11" rx="0.8" />
        </svg>

        {/* WiFi — three concentric arcs + dot, round-capped for a clean solid read */}
        <svg width="16" height="12" viewBox="0 0 16 12" fill="none" aria-hidden>
          <path
            d="M2.1 4.4a8.7 8.7 0 0 1 11.8 0"
            stroke="currentColor"
            strokeWidth="1.7"
            strokeLinecap="round"
          />
          <path
            d="M4.5 6.9a5.2 5.2 0 0 1 7 0"
            stroke="currentColor"
            strokeWidth="1.7"
            strokeLinecap="round"
          />
          <circle cx="8" cy="9.6" r="1.35" fill="currentColor" />
        </svg>

        {/* Battery — rounded shell, terminal nub, inset fill (iOS proportions) */}
        <svg width="27.4" height="13" viewBox="0 0 27.4 13" fill="none" aria-hidden>
          <rect
            x="0.6"
            y="0.6"
            width="23.5"
            height="11.8"
            rx="3.4"
            stroke="currentColor"
            strokeWidth="1.1"
            opacity="0.4"
          />
          <rect x="2.1" y="2.1" width="20.5" height="8.8" rx="2.1" fill="currentColor" />
          <path
            d="M25.6 4.4c.9.35.9 3.85 0 4.2v-4.2Z"
            fill="currentColor"
            opacity="0.4"
          />
        </svg>
      </div>
    </div>
  )
}
