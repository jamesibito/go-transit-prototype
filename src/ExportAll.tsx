import React from 'react'
import StatusBar from './components/StatusBar'
import Landing from './screens/Landing'
import SearchTrip from './screens/SearchTrip'
import TripDetails from './screens/TripDetails'
import Fares from './screens/Fares'
import ServiceUpdates from './screens/ServiceUpdates'
import TicketConfirmation from './screens/TicketConfirmation'
import Payment from './screens/Payment'
import AboutGO from './screens/AboutGO'
import Settings from './screens/Settings'
import PaymentHistory from './screens/PaymentHistory'
import SavedCards from './screens/SavedCards'
import AccessibilityFeatures from './screens/AccessibilityFeatures'
import SavedTrips from './screens/SavedTrips'
import Account from './screens/Account'
import TicketView from './screens/TicketView'
import MenuDrawer from './components/MenuDrawer'
import StationPicker from './components/StationPicker'
import ResultsSheet from './components/ResultsSheet'
import SplashScreen from './components/SplashScreen'
import { NavContext, type ScreenName, type SavedLine, type FareDetails } from './App'

// ─────────────────────────────────────────────────────────────────────────────
// Shared helpers
// ─────────────────────────────────────────────────────────────────────────────

const noop = () => {}

const DEFAULT_SAVED_LINES: SavedLine[] = [
  { id: 'sl-1', from: 'Milliken GO', to: 'Union Station GO', line: 'Stouffville', muted: false },
  { id: 'sl-2', from: 'Union Station GO', to: 'Milliken GO', line: 'Stouffville', muted: false },
  { id: 'sl-3', from: 'Union Station GO', to: 'Oshawa GO', line: 'Lakeshore East', muted: false },
  { id: 'sl-4', from: 'Newmarket GO', to: 'Pearson Airport Terminal 1', line: 'Route 34 Bus', muted: false },
  { id: 'sl-5', from: 'Bramalea GO', to: 'Union Station GO', line: 'Kitchener', muted: true },
]

const DEFAULT_FARE: FareDetails = { adults: 1, seniors: 0, youth: 0, children: 0, returnTrip: false, totalPrice: 0, passengerLabel: '1 Adult' }

const SAMPLE_TRIP = { line: 'Stouffville', from: 'Milliken GO', to: 'Union Station GO', departure: '8:12 AM', arrival: '8:47 AM', platform: '2', ticketId: 'GO-2024-8821' }

type CtxOverrides = Partial<React.ContextType<typeof NavContext>>

function makeCtx(overrides: CtxOverrides = {}): React.ContextType<typeof NavContext> {
  return {
    currentScreen: 'landing' as ScreenName,
    navigate: noop as (s: ScreenName) => void,
    goBack: noop,
    goHome: noop,
    openMenu: noop,
    faresTab: 'eticket',
    setFaresTab: noop as (t: 'eticket' | 'passes') => void,
    favorites: new Set<string>(),
    toggleFavorite: noop as (id: string) => void,
    savedLines: DEFAULT_SAVED_LINES,
    toggleMuteLine: noop as (id: string) => void,
    removeSavedLine: noop as (id: string) => void,
    darkMode: false,
    setDarkMode: noop as (on: boolean) => void,
    prestoConnected: false,
    setPrestoConnected: noop as (on: boolean) => void,
    selectedRoute: 'stouffville',
    setSelectedRoute: noop as (key: string) => void,
    shouldShowResults: false,
    setShouldShowResults: noop as (v: boolean) => void,
    searchDateTime: null,
    setSearchDateTime: noop as (d: Date | null) => void,
    selectedDeparture: null,
    setSelectedDeparture: noop as (d: { departure: string; arrival: string } | null) => void,
    purchaseType: 'eticket',
    setPurchaseType: noop as (t: 'eticket' | 'pass') => void,
    fareDetails: DEFAULT_FARE,
    setFareDetails: noop as (fd: FareDetails) => void,
    prestoBalance: 42.5,
    setPrestoBalance: noop as (bal: number) => void,
    activeTrip: null,
    setActiveTrip: noop as never,
    showToast: noop as (m: string, s?: string, d?: number) => void,
    toast: { message: '', visible: false },
    ...overrides,
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Toast overlay — replicates the markup in App.tsx so we can render toast assets
// ─────────────────────────────────────────────────────────────────────────────

function ToastOverlay({ message, subtitle }: { message: string; subtitle?: string }) {
  return (
    <div style={{
      position: 'absolute', top: 56, left: 20, right: 20, zIndex: 150,
      background: '#357a1e', borderRadius: 16, padding: '14px 20px',
      display: 'flex', alignItems: 'center', gap: 12,
      border: '2px solid rgba(255,255,255,0.95)',
      boxShadow: '0 12px 40px rgba(0,0,0,0.32), 0 4px 12px rgba(0,0,0,0.18)',
    }}>
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" />
      </svg>
      <div>
        <p style={{ fontSize: 14, fontWeight: 800, color: 'white', fontFamily: 'inherit' }}>{message}</p>
        {subtitle && <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.75)', fontFamily: 'inherit' }}>{subtitle}</p>}
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// Phone shell — a 390×844 device frame with status bar; content clipped like a
// real device viewport. Optional `overlay` (modal/sheet/picker) and `toast`.
// ─────────────────────────────────────────────────────────────────────────────

function ScreenShell({
  children, label, sublabel, dark = false, overlay, toast, ctx,
}: {
  children: React.ReactNode
  label: string
  sublabel?: string
  dark?: boolean
  overlay?: React.ReactNode
  toast?: { message: string; subtitle?: string }
  ctx: React.ContextType<typeof NavContext>
}) {
  return (
    <div style={{ display: 'inline-flex', flexDirection: 'column', gap: 12, width: 390 }}>
      <div
        className={`phone-shell${dark ? ' dark' : ''}`}
        style={{
          width: 390, height: 844, position: 'relative', overflow: 'hidden',
          borderRadius: 44, background: dark ? '#1a1d21' : '#ffffff',
          boxShadow: '0 20px 60px rgba(0,0,0,0.2), 0 0 0 1px rgba(0,0,0,0.08)',
        }}
      >
        <StatusBar />

        <NavContext.Provider value={ctx}>
          <div style={{ position: 'absolute', inset: 0, paddingTop: 48, overflowY: 'auto', overflowX: 'hidden', background: dark ? '#1a1d21' : '#ffffff' }}>
            {children}
          </div>
          {/* Overlays sit above the base screen, inside the shell */}
          {overlay}
          {toast && <ToastOverlay message={toast.message} subtitle={toast.subtitle} />}
        </NavContext.Provider>
      </div>
      <div>
        <span style={{ fontSize: 15, fontWeight: 700, color: '#1a1d21', fontFamily: 'inherit', display: 'block' }}>{label}</span>
        {sublabel && <span style={{ fontSize: 12, fontWeight: 500, color: '#777', fontFamily: 'inherit' }}>{sublabel}</span>}
      </div>
    </div>
  )
}

// A simple screen cell with its own context
function Cell(props: {
  label: string; sublabel?: string; dark?: boolean
  ctx?: CtxOverrides; overlay?: React.ReactNode; toast?: { message: string; subtitle?: string }
  children: React.ReactNode
}) {
  const ctx = makeCtx({ darkMode: props.dark, ...props.ctx })
  return (
    <ScreenShell label={props.label} sublabel={props.sublabel} dark={props.dark} overlay={props.overlay} toast={props.toast} ctx={ctx}>
      {props.children}
    </ScreenShell>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// Section + grid layout
// ─────────────────────────────────────────────────────────────────────────────

function PageHeader({ title, subtitle, dark }: { title: string; subtitle: string; dark?: boolean }) {
  return (
    <div style={{ width: '100%', flexBasis: '100%', padding: '8px 0 20px' }}>
      <h1 style={{ fontSize: 38, fontWeight: 800, margin: 0, color: dark ? '#fff' : '#1a1d21', letterSpacing: '-0.6px' }}>{title}</h1>
      <p style={{ fontSize: 17, margin: '8px 0 0', color: dark ? '#aaa' : '#555' }}>{subtitle}</p>
    </div>
  )
}

// Sacrificial first shell-row. The Figma capture tool reliably drops the first
// row of phone-shell frames; these 4 dummies absorb that drop so real screens
// (row 2+) always survive. Deleted during Figma cleanup.
function SacrificeRow() {
  return (
    <>
      {[0, 1, 2, 3].map(i => (
        <div key={i} style={{ display: 'inline-flex', flexDirection: 'column', gap: 12, width: 390 }}>
          <div style={{ width: 390, height: 844, borderRadius: 44, background: '#fde2e2', border: '3px dashed #dc2626', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ fontSize: 18, fontWeight: 800, color: '#dc2626', fontFamily: 'inherit', textAlign: 'center', padding: 20 }}>SACRIFICIAL<br/>delete in Figma</span>
          </div>
          <span style={{ fontSize: 15, fontWeight: 700, color: '#dc2626', fontFamily: 'inherit' }}>spacer {i + 1}</span>
        </div>
      ))}
    </>
  )
}

function Grid({ children, dark }: { children: React.ReactNode; dark?: boolean }) {
  return (
    <div style={{
      display: 'flex', flexWrap: 'wrap', gap: 48, padding: 48,
      width: 1896, boxSizing: 'border-box',
      background: dark ? '#0d0f11' : '#eef0ee', minHeight: '100vh', alignItems: 'flex-start',
      fontFamily: '"Avenir", "Avenir Next", -apple-system, BlinkMacSystemFont, "Helvetica Neue", Arial, sans-serif',
      alignSelf: 'flex-start',
    }}>
      {children}
      {/* note: SacrificeRow is inserted by each set right after the header */}
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// SETS
// ─────────────────────────────────────────────────────────────────────────────

function AllScreens({ dark }: { dark: boolean }) {
  const d = dark
  return (
    <Grid dark={d}>
      <PageHeader title={`GO Transit — App Screens${d ? ' (Dark)' : ' (Light)'}`} subtitle="Redesigned GO Transit mobile app · all 15 screens" dark={d} />
      <SacrificeRow />
      <Cell label="01 · Landing / Home" sublabel="Next departures, saved trips, quick actions" dark={d}><Landing /></Cell>
      <Cell label="02 · Trip Planning" sublabel="Search form — From / To / date-time" dark={d} ctx={{ currentScreen: 'search' }}><SearchTrip /></Cell>
      <Cell label="03 · Trip Details" sublabel="Stouffville line · route map + stops" dark={d} ctx={{ currentScreen: 'tripDetails', selectedRoute: 'stouffville' }}><TripDetails /></Cell>
      <Cell label="04 · Fares — E-Ticket" sublabel="Buy single-ride e-tickets" dark={d} ctx={{ currentScreen: 'fares', faresTab: 'eticket' }}><Fares /></Cell>
      <Cell label="05 · Service Updates" sublabel="Live alerts by line (one expanded)" dark={d} ctx={{ currentScreen: 'serviceUpdates' }}><ServiceUpdates /></Cell>
      <Cell label="06 · Payment" sublabel="Visa selected (PRESTO not linked)" dark={d} ctx={{ currentScreen: 'payment', prestoConnected: false }}><Payment /></Cell>
      <Cell label="07 · Ticket Confirmation" sublabel="Purchase success + QR boarding pass" dark={d} ctx={{ currentScreen: 'ticketConfirmation' }}><TicketConfirmation /></Cell>
      <Cell label="08 · About GO" sublabel="App info / concept context" dark={d} ctx={{ currentScreen: 'about' }}><AboutGO /></Cell>
      <Cell label="09 · Settings" sublabel="Preferences, dark mode, notifications" dark={d} ctx={{ currentScreen: 'settings' }}><Settings /></Cell>
      <Cell label="10 · Payment History" sublabel="Past transactions (filter: All)" dark={d} ctx={{ currentScreen: 'paymentHistory' }}><PaymentHistory /></Cell>
      <Cell label="11 · Saved Cards" sublabel="Manage payment methods" dark={d} ctx={{ currentScreen: 'savedCards' }}><SavedCards /></Cell>
      <Cell label="12 · Accessibility" sublabel="Accessibility feature toggles" dark={d} ctx={{ currentScreen: 'accessibility' }}><AccessibilityFeatures /></Cell>
      <Cell label="13 · Saved Trips" sublabel="Saved lines with mute toggles" dark={d} ctx={{ currentScreen: 'savedTrips' }}><SavedTrips /></Cell>
      <Cell label="14 · Account" sublabel="Profile & personal info" dark={d} ctx={{ currentScreen: 'account' }}><Account /></Cell>
      <Cell label="15 · Ticket View" sublabel="Active ticket / boarding pass" dark={d} ctx={{ currentScreen: 'ticketView', activeTrip: SAMPLE_TRIP }}><TicketView /></Cell>
    </Grid>
  )
}

function Variants({ dark }: { dark: boolean }) {
  const d = dark
  return (
    <Grid dark={d}>
      <PageHeader title="Variants & States" subtitle="Key alternate states — routes, tabs, payment methods, sheets" dark={d} />
      <SacrificeRow />
      <Cell label="Trip Details — Lakeshore East" sublabel="Service-alert variant on the line" dark={d} ctx={{ currentScreen: 'tripDetails', selectedRoute: 'lakeshore-east' }}><TripDetails /></Cell>
      <Cell label="Trip Details — Kitchener" sublabel="Longer corridor / more stops" dark={d} ctx={{ currentScreen: 'tripDetails', selectedRoute: 'kitchener' }}><TripDetails /></Cell>
      <Cell label="Trip Details — Milton" sublabel="Alternate line" dark={d} ctx={{ currentScreen: 'tripDetails', selectedRoute: 'milton' }}><TripDetails /></Cell>
      <Cell label="Fares — Passes tab" sublabel="Monthly / day passes" dark={d} ctx={{ currentScreen: 'fares', faresTab: 'passes' }}><Fares /></Cell>
      <Cell label="Payment — PRESTO" sublabel="PRESTO linked → PRESTO selected" dark={d} ctx={{ currentScreen: 'payment', prestoConnected: true }}><Payment /></Cell>
      <Cell label="Landing — PRESTO connected" sublabel="Balance surfaced on home" dark={d} ctx={{ prestoConnected: true }}><Landing /></Cell>
      <Cell
        label="Trip Planning — Results sheet"
        sublabel="Departures sheet open over search"
        dark={d}
        ctx={{ currentScreen: 'search', selectedRoute: 'stouffville' }}
        overlay={<ResultsSheet visible routeKey="stouffville" atDate={new Date()} onClose={noop} onPickTrip={noop} />}
      ><SearchTrip /></Cell>
    </Grid>
  )
}

function Overlays({ dark }: { dark: boolean }) {
  const d = dark
  return (
    <Grid dark={d}>
      <PageHeader title="Overlays, Modals & Toasts" subtitle="Drawer, pickers, modals, confirmations, toasts, splash" dark={d} />
      <SacrificeRow />

      <Cell label="Menu Drawer" sublabel="Global navigation drawer (open)" dark={d}
        overlay={<MenuDrawer open onClose={noop} />}><Landing /></Cell>

      <Cell label="Station Picker" sublabel="Searchable station list (Departure)" dark={d} ctx={{ currentScreen: 'search' }}
        overlay={<StationPicker label="Departure" onSelect={noop} onClose={noop} />}><SearchTrip /></Cell>

      <Cell label="Results Sheet" sublabel="Departures list over Trip Planning" dark={d} ctx={{ currentScreen: 'search', selectedRoute: 'stouffville' }}
        overlay={<ResultsSheet visible routeKey="stouffville" atDate={new Date()} onClose={noop} onPickTrip={noop} />}><SearchTrip /></Cell>

      <Cell label="Account — Edit field modal" sublabel="Inline edit (Email)" dark={d} ctx={{ currentScreen: 'account' }}>
        <Account forceEditing={{ field: 'Email', value: 'john.smith@email.com', type: 'email' }} />
      </Cell>

      <Cell label="Saved Cards — Add card" sublabel="Add payment method form" dark={d} ctx={{ currentScreen: 'savedCards' }}>
        <SavedCards forceAddForm />
      </Cell>

      <Cell label="Saved Cards — Delete confirm" sublabel="Remove-card confirmation" dark={d} ctx={{ currentScreen: 'savedCards' }}>
        <SavedCards forceConfirmDelete="c2" />
      </Cell>

      <Cell label="Splash Screen" sublabel="App launch screen" dark={d}>
        <div style={{ position: 'absolute', inset: 0 }}><SplashScreen forceVisible /></div>
      </Cell>

      {/* Toasts */}
      <Cell label="Toast — PRESTO Connected" dark={d} toast={{ message: 'PRESTO Connected', subtitle: 'Card •••• 4821 linked successfully' }}><Landing /></Cell>
      <Cell label="Toast — Field updated" dark={d} ctx={{ currentScreen: 'account' }} toast={{ message: 'Email updated' }}><Account /></Cell>
      <Cell label="Toast — Signed out" dark={d} ctx={{ currentScreen: 'account' }} toast={{ message: 'Signed out', subtitle: 'See you next time!' }}><Account /></Cell>
      <Cell label="Toast — Default card updated" dark={d} ctx={{ currentScreen: 'savedCards' }} toast={{ message: 'Default card updated' }}><SavedCards /></Cell>
      <Cell label="Toast — Card removed" dark={d} ctx={{ currentScreen: 'savedCards' }} toast={{ message: 'Card removed' }}><SavedCards /></Cell>
      <Cell label="Toast — Card added" dark={d} ctx={{ currentScreen: 'savedCards' }} toast={{ message: 'Card added', subtitle: 'Visa •••• 1234' }}><SavedCards /></Cell>
      <Cell label="Toast — Added to Apple Wallet" dark={d} ctx={{ currentScreen: 'ticketConfirmation' }} toast={{ message: 'Added to Apple Wallet', subtitle: 'Your ticket is ready to use' }}><TicketConfirmation /></Cell>
    </Grid>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// Entry
// ─────────────────────────────────────────────────────────────────────────────

export default function ExportAll() {
  const params = new URLSearchParams(window.location.search)
  const dark = params.has('dark')
  const set = params.get('set') || 'screens'

  if (set === 'variants') return <Variants dark={dark} />
  if (set === 'overlays') return <Overlays dark={dark} />
  return <AllScreens dark={dark} />
}
