/**
 * Realistic iOS 17+ Status Bar
 * Pixel-accurate signal, WiFi, and battery icons matching Apple's HIG.
 * Live clock updates every minute.
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
    const id = setInterval(() => setTime(fmt()), 15_000) // update every 15s for responsiveness
    return () => clearInterval(id)
  }, [])
  return time
}

export default function StatusBar() {
  const time = useCurrentTime()
  return (
    <div className="status-bar">
      <span style={{ fontSize: 15, fontWeight: 600, fontFamily: '-apple-system, "SF Pro Text", "Helvetica Neue", sans-serif', letterSpacing: '-0.3px' }}>
        {time}
      </span>
      <div className="flex items-center gap-[7px]">
        {/* Cellular signal bars — iOS style: 4 rounded bars with progressive heights */}
        <svg width="17" height="11" viewBox="0 0 17 11" fill="none">
          <rect x="0" y="7" width="3" height="4" rx="1" fill="currentColor" />
          <rect x="4.5" y="4.5" width="3" height="6.5" rx="1" fill="currentColor" />
          <rect x="9" y="2" width="3" height="9" rx="1" fill="currentColor" />
          <rect x="13.5" y="0" width="3" height="11" rx="1" fill="currentColor" opacity="0.3" />
        </svg>

        {/* WiFi — iOS style: concentric arcs with a dot */}
        <svg width="15" height="11" viewBox="0 0 15 11" fill="none">
          <path d="M7.5 3.2c2.1 0 4 .8 5.4 2.1l1.1-1.2C12.3 2.5 10 1.5 7.5 1.5S2.7 2.5 1 4.1l1.1 1.2C3.5 4 5.4 3.2 7.5 3.2z" fill="currentColor" />
          <path d="M7.5 6c1.3 0 2.5.5 3.4 1.3l1.1-1.2C10.8 5 9.2 4.3 7.5 4.3S4.2 5 3 6.1l1.1 1.2C5 6.5 6.2 6 7.5 6z" fill="currentColor" />
          <circle cx="7.5" cy="9.5" r="1.5" fill="currentColor" />
        </svg>

        {/* Battery — iOS style: rounded rect with cap nub */}
        <svg width="27" height="12" viewBox="0 0 27 12" fill="none">
          {/* Outer shell */}
          <rect x="0.5" y="0.5" width="22" height="11" rx="2.5" stroke="currentColor" strokeWidth="1" opacity="0.35" />
          {/* Inner fill */}
          <rect x="2" y="2" width="19" height="8" rx="1.5" fill="currentColor" />
          {/* Battery cap */}
          <path d="M24 4v4a2 2 0 0 0 0-4z" fill="currentColor" opacity="0.4" />
        </svg>
      </div>
    </div>
  )
}
