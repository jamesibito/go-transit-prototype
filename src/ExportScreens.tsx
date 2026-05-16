import React from 'react'
import Landing from './screens/Landing'
import SearchTrip from './screens/SearchTrip'
import SearchResults from './screens/SearchResults'
import TripDetails from './screens/TripDetails'
import Fares from './screens/Fares'
import ServiceUpdates from './screens/ServiceUpdates'
import TicketConfirmation from './screens/TicketConfirmation'
import Payment from './screens/Payment'
import Settings from './screens/Settings'
import { NavContext, type ScreenName, type SavedLine } from './App'

const DEFAULT_SAVED_LINES: SavedLine[] = [
  { id: 'sl-1', from: 'Milliken GO', to: 'Union Station GO', line: 'Stouffville', muted: false },
  { id: 'sl-2', from: 'Union Station GO', to: 'Milliken GO', line: 'Stouffville', muted: false },
]

function ScreenShell({ children, label, dark = false }: { children: React.ReactNode; label: string; dark?: boolean }) {
  return (
    <div style={{ display: 'inline-flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
      <div
        className={`phone-shell${dark ? ' dark' : ''}`}
        style={{
          width: 390,
          height: 844,
          position: 'relative',
          overflow: 'hidden',
          borderRadius: 44,
          background: dark ? '#1a1d21' : '#ffffff',
          boxShadow: '0 20px 60px rgba(0,0,0,0.2), 0 0 0 1px rgba(0,0,0,0.08)',
        }}
      >
        {/* Status bar */}
        <div className="status-bar">
          <span style={{ fontSize: 15, fontWeight: 700, fontFamily: 'inherit', letterSpacing: '-0.2px' }}>9:41</span>
          <div className="flex items-center gap-1.5">
            <svg width="17" height="12" viewBox="0 0 17 12"><rect x="0" y="4" width="3" height="8" rx="0.8" fill="currentColor"/><rect x="4.5" y="2.5" width="3" height="9.5" rx="0.8" fill="currentColor"/><rect x="9" y="1" width="3" height="11" rx="0.8" fill="currentColor"/><rect x="13.5" y="0" width="3" height="12" rx="0.8" fill="currentColor" opacity="0.25"/></svg>
            <svg width="16" height="12" viewBox="0 0 16 12"><path d="M8 2.5C10.2 2.5 12.2 3.4 13.6 4.9L15 3.5C13.2 1.4 10.7 0.1 8 0.1C5.3 0.1 2.8 1.4 1 3.5L2.4 4.9C3.8 3.4 5.8 2.5 8 2.5Z" fill="currentColor"/><path d="M8 5.5C9.5 5.5 10.8 6.1 11.8 7.1L13.2 5.7C11.8 4.2 9.9 3.5 8 3.5C6.1 3.5 4.2 4.3 2.8 5.7L4.2 7.1C5.2 6.1 6.5 5.5 8 5.5Z" fill="currentColor"/><circle cx="8" cy="10" r="1.8" fill="currentColor"/></svg>
            <div className="flex items-center">
              <div style={{ width: 25, height: 12, borderRadius: 3, border: '1.5px solid currentColor', opacity: 0.45, padding: '1.5px', display: 'flex', alignItems: 'center' }}>
                <div style={{ width: '85%', height: '100%', borderRadius: 1.5, background: 'currentColor' }}/>
              </div>
              <div style={{ width: 2, height: 5, borderRadius: '0 1px 1px 0', background: 'currentColor', opacity: 0.35, marginLeft: 1 }}/>
            </div>
          </div>
        </div>
        <div style={{ position: 'absolute', inset: 0, paddingTop: 48, overflowY: 'auto', overflowX: 'hidden', background: dark ? '#1a1d21' : '#ffffff' }}>
          {children}
        </div>
      </div>
      <span style={{ fontSize: 14, fontWeight: 600, color: '#555', fontFamily: 'inherit' }}>{label}</span>
    </div>
  )
}

function ScreenWithContext({ children, route = 'stouffville', dark = false }: { children: React.ReactNode; route?: string; dark?: boolean }) {
  const noop = () => {}
  const navValue = {
    currentScreen: 'landing' as ScreenName,
    navigate: noop as (s: ScreenName) => void,
    goBack: noop,
    goHome: noop,
    openMenu: noop,
    faresTab: 'eticket' as const,
    setFaresTab: noop as (t: 'eticket' | 'passes') => void,
    favorites: new Set<string>(),
    toggleFavorite: noop as (id: string) => void,
    savedLines: DEFAULT_SAVED_LINES,
    toggleMuteLine: noop as (id: string) => void,
    removeSavedLine: noop as (id: string) => void,
    darkMode: dark,
    setDarkMode: noop as (on: boolean) => void,
    prestoConnected: true,
    setPrestoConnected: noop as (on: boolean) => void,
    selectedRoute: route,
    setSelectedRoute: noop as (key: string) => void,
    searchDateTime: null,
    setSearchDateTime: noop as (d: Date | null) => void,
    purchaseType: 'eticket' as const,
    setPurchaseType: noop as (type: 'eticket' | 'pass') => void,
    fareDetails: { adults: 1, seniors: 0, youth: 0, children: 0, returnTrip: false, totalPrice: 0, passengerLabel: '1 Adult' },
    setFareDetails: noop as (fd: import('./App').FareDetails) => void,
    showToast: noop as (message: string, subtitle?: string, duration?: number) => void,
    toast: { message: '', visible: false },
    prestoBalance: 42.50,
    setPrestoBalance: noop as (bal: number) => void,
    activeTrip: null,
    setActiveTrip: noop as (trip: import('./App').ActiveTrip | null) => void,
  }

  return (
    <NavContext.Provider value={navValue}>
      {children}
    </NavContext.Provider>
  )
}

export default function ExportScreens() {
  const dark = new URLSearchParams(window.location.search).has('dark')

  return (
    <div style={{
      display: 'flex',
      flexWrap: 'wrap',
      gap: 40,
      padding: 40,
      background: dark ? '#111' : '#f0f0f0',
      minHeight: '100vh',
      fontFamily: '"Avenir", "Avenir Next", -apple-system, BlinkMacSystemFont, "Helvetica Neue", Arial, sans-serif',
    }}>
      <ScreenWithContext dark={dark}>
        <ScreenShell label="Landing / Home" dark={dark}><Landing /></ScreenShell>
      </ScreenWithContext>

      <ScreenWithContext dark={dark}>
        <ScreenShell label="Search Trip" dark={dark}><SearchTrip /></ScreenShell>
      </ScreenWithContext>

      <ScreenWithContext route="stouffville" dark={dark}>
        <ScreenShell label="Search Results" dark={dark}><SearchResults /></ScreenShell>
      </ScreenWithContext>

      <ScreenWithContext route="stouffville" dark={dark}>
        <ScreenShell label="Trip Details — Stouffville" dark={dark}><TripDetails /></ScreenShell>
      </ScreenWithContext>

      <ScreenWithContext route="lakeshore-east" dark={dark}>
        <ScreenShell label="Trip Details — Lakeshore East (Alert)" dark={dark}><TripDetails /></ScreenShell>
      </ScreenWithContext>

      <ScreenWithContext route="stouffville" dark={dark}>
        <ScreenShell label="Payment" dark={dark}><Payment /></ScreenShell>
      </ScreenWithContext>

      <ScreenWithContext route="stouffville" dark={dark}>
        <ScreenShell label="Ticket Confirmation" dark={dark}><TicketConfirmation /></ScreenShell>
      </ScreenWithContext>

      <ScreenWithContext dark={dark}>
        <ScreenShell label="Fares" dark={dark}><Fares /></ScreenShell>
      </ScreenWithContext>

      <ScreenWithContext dark={dark}>
        <ScreenShell label="Service Updates" dark={dark}><ServiceUpdates /></ScreenShell>
      </ScreenWithContext>

      <ScreenWithContext dark={dark}>
        <ScreenShell label="Settings" dark={dark}><Settings /></ScreenShell>
      </ScreenWithContext>
    </div>
  )
}
