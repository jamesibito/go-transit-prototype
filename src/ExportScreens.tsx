import React from 'react'
import StatusBar from './components/StatusBar'
import Landing from './screens/Landing'
import SearchTrip from './screens/SearchTrip'
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
        <StatusBar />
        <div style={{ position: 'absolute', inset: 0, paddingTop: 48, overflowY: 'auto', overflowX: 'hidden', background: dark ? '#1a1d21' : '#ffffff' }}>
          {children}
        </div>
      </div>
      <span style={{ fontSize: 14, fontWeight: 600, color: '#555', fontFamily: 'inherit' }}>{label}</span>
    </div>
  )
}

function ScreenWithContext({ children, route = 'stouffville', dark = false, autoOpenResults = false }: { children: React.ReactNode; route?: string; dark?: boolean; autoOpenResults?: boolean }) {
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
    shouldShowResults: autoOpenResults,
    setShouldShowResults: noop as (v: boolean) => void,
    searchDateTime: null,
    setSearchDateTime: noop as (d: Date | null) => void,
    selectedDeparture: null,
    setSelectedDeparture: noop as (d: { departure: string; arrival: string } | null) => void,
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
      {/* Full-width header — also acts as a sacrificial first row for the Figma
          capture tool, which drops the topmost row behind its overlay toolbar. */}
      <div style={{ width: '100%', flexBasis: '100%', padding: '8px 0 16px' }}>
        <h1 style={{ fontSize: 34, fontWeight: 800, margin: 0, color: dark ? '#fff' : '#1a1d21', letterSpacing: '-0.5px' }}>
          GO Transit — App Screens
        </h1>
        <p style={{ fontSize: 16, margin: '6px 0 0', color: dark ? '#aaa' : '#555' }}>
          Redesigned mobile app · 10 key screens
        </p>
      </div>

      <ScreenWithContext dark={dark}>
        <ScreenShell label="Landing / Home" dark={dark}><Landing /></ScreenShell>
      </ScreenWithContext>

      <ScreenWithContext dark={dark}>
        <ScreenShell label="Search Trip" dark={dark}><SearchTrip /></ScreenShell>
      </ScreenWithContext>

      <ScreenWithContext route="stouffville" dark={dark} autoOpenResults>
        <ScreenShell label="Search Results (sheet)" dark={dark}><SearchTrip /></ScreenShell>
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
