import { useState, createContext, useContext, useCallback } from 'react'
import Landing from './screens/Landing'
import SearchTrip from './screens/SearchTrip'
import SearchResults from './screens/SearchResults'
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
import MenuDrawer from './components/MenuDrawer'
import StatusBar from './components/StatusBar'

export type ScreenName = 'landing' | 'search' | 'results' | 'tripDetails' | 'fares' | 'serviceUpdates' | 'payment' | 'ticketConfirmation' | 'about' | 'settings' | 'paymentHistory' | 'savedCards' | 'accessibility' | 'savedTrips' | 'account'

export interface SavedLine {
  id: string
  from: string
  to: string
  line: string
  muted: boolean
}

export interface ToastData {
  message: string
  subtitle?: string
  visible: boolean
}

export interface FareDetails {
  adults: number
  seniors: number
  youth: number
  children: number
  returnTrip: boolean
  totalPrice: number
  passengerLabel: string
}

export interface ActiveTrip {
  line: string
  from: string
  to: string
  departure: string
  arrival: string
  platform?: string
  ticketId: string
}

interface NavContextType {
  currentScreen: ScreenName
  navigate: (screen: ScreenName) => void
  goBack: () => void
  goHome: () => void
  openMenu: () => void
  faresTab: 'eticket' | 'passes'
  setFaresTab: (tab: 'eticket' | 'passes') => void
  favorites: Set<string>
  toggleFavorite: (id: string) => void
  savedLines: SavedLine[]
  toggleMuteLine: (id: string) => void
  removeSavedLine: (id: string) => void
  darkMode: boolean
  setDarkMode: (on: boolean) => void
  prestoConnected: boolean
  setPrestoConnected: (on: boolean) => void
  selectedRoute: string
  setSelectedRoute: (key: string) => void
  purchaseType: 'eticket' | 'pass'
  setPurchaseType: (type: 'eticket' | 'pass') => void
  fareDetails: FareDetails
  setFareDetails: (fd: FareDetails) => void
  prestoBalance: number
  setPrestoBalance: (bal: number) => void
  activeTrip: ActiveTrip | null
  setActiveTrip: (trip: ActiveTrip | null) => void
  showToast: (message: string, subtitle?: string, duration?: number) => void
  toast: ToastData
}

export const NavContext = createContext<NavContextType>({} as NavContextType)
export const useNav = () => useContext(NavContext)

const SCREEN_DEPTH: Record<ScreenName, number> = {
  landing: 0, search: 1, results: 2, tripDetails: 3, fares: 1, serviceUpdates: 1, payment: 4, ticketConfirmation: 5, about: 1, settings: 1, paymentHistory: 2, savedCards: 2, accessibility: 2, savedTrips: 1, account: 2,
}

const DEFAULT_SAVED_LINES: SavedLine[] = [
  { id: 'sl-1', from: 'Miliken GO', to: 'Union Station GO', line: 'Stouffville', muted: false },
  { id: 'sl-2', from: 'Union Station GO', to: 'Miliken GO', line: 'Stouffville', muted: false },
  { id: 'sl-3', from: 'Union Station GO', to: 'Oshawa GO', line: 'Lakeshore East', muted: false },
  { id: 'sl-4', from: 'Mississauga City Centre', to: 'Markham Stouffville Hospital', line: 'Highway 407 Bus', muted: true },
]

export default function App() {
  const [stack, setStack] = useState<ScreenName[]>(['landing'])
  const [menuOpen, setMenuOpen] = useState(false)
  const [faresTab, setFaresTab] = useState<'eticket' | 'passes'>('eticket')
  const [favorites, setFavorites] = useState<Set<string>>(new Set())
  const [savedLines, setSavedLines] = useState<SavedLine[]>(DEFAULT_SAVED_LINES)
  const [darkMode, setDarkMode] = useState(false)
  const [prestoConnected, setPrestoConnected] = useState(false)
  const [selectedRoute, setSelectedRoute] = useState('stouffville')
  const [purchaseType, setPurchaseType] = useState<'eticket' | 'pass'>('eticket')
  const [fareDetails, setFareDetails] = useState<FareDetails>({ adults: 1, seniors: 0, youth: 0, children: 0, returnTrip: false, totalPrice: 0, passengerLabel: '1 Adult' })
  const [prestoBalance, setPrestoBalance] = useState(42.50)
  const [activeTrip, setActiveTrip] = useState<ActiveTrip | null>(null)
  const [toast, setToast] = useState<ToastData>({ message: '', visible: false })

  const showToast = useCallback((message: string, subtitle?: string, duration = 2500) => {
    setToast({ message, subtitle, visible: true })
    setTimeout(() => setToast(prev => ({ ...prev, visible: false })), duration)
  }, [])

  const currentScreen = stack[stack.length - 1]

  const navigate = useCallback((screen: ScreenName) => {
    setStack(prev => [...prev, screen])
  }, [])

  const goBack = useCallback(() => {
    setStack(prev => prev.length > 1 ? prev.slice(0, -1) : prev)
  }, [])

  const goHome = useCallback(() => {
    setStack(['landing'])
  }, [])

  const openMenu = useCallback(() => setMenuOpen(true), [])

  const toggleFavorite = useCallback((id: string) => {
    setFavorites(prev => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }, [])

  const toggleMuteLine = useCallback((id: string) => {
    setSavedLines(prev => prev.map(l => l.id === id ? { ...l, muted: !l.muted } : l))
  }, [])

  const removeSavedLine = useCallback((id: string) => {
    setSavedLines(prev => prev.filter(l => l.id !== id))
  }, [])

  const screens: ScreenName[] = ['landing', 'search', 'results', 'tripDetails', 'fares', 'serviceUpdates', 'payment', 'ticketConfirmation', 'about', 'settings', 'paymentHistory', 'savedCards', 'accessibility', 'savedTrips', 'account']
  const screenNodes: Record<ScreenName, React.ReactNode> = {
    landing: <Landing />,
    search: <SearchTrip />,
    results: <SearchResults />,
    tripDetails: <TripDetails />,
    fares: <Fares />,
    serviceUpdates: <ServiceUpdates />,
    payment: <Payment />,
    ticketConfirmation: <TicketConfirmation />,
    about: <AboutGO />,
    settings: <Settings />,
    paymentHistory: <PaymentHistory />,
    savedCards: <SavedCards />,
    accessibility: <AccessibilityFeatures />,
    savedTrips: <SavedTrips />,
    account: <Account />,
  }

  const currentDepth = SCREEN_DEPTH[currentScreen]

  return (
    <NavContext.Provider value={{
      currentScreen, navigate, goBack, goHome, openMenu,
      faresTab, setFaresTab,
      favorites, toggleFavorite,
      savedLines, toggleMuteLine, removeSavedLine,
      darkMode, setDarkMode,
      prestoConnected, setPrestoConnected,
      selectedRoute, setSelectedRoute,
      purchaseType, setPurchaseType,
      fareDetails, setFareDetails,
      prestoBalance, setPrestoBalance,
      activeTrip, setActiveTrip,
      showToast, toast,
    }}>
      <div className={`phone-shell${darkMode ? ' dark' : ''}`}>
        {/* Status bar — fixed layer above all content */}
        <StatusBar />

        {/* Screen stack */}
        {screens.map(name => {
          const depth = SCREEN_DEPTH[name]
          const isActive = name === currentScreen
          const isInStack = stack.includes(name)
          const isPrev = stack.length > 1 && stack[stack.length - 2] === name

          let tx = '100%'
          if (isActive) tx = '0%'
          else if (depth < currentDepth && isInStack) tx = '-28%'
          else if (isPrev) tx = '-28%'

          return (
            <div
              key={name}
              className="screen"
              style={{
                transform: `translateX(${tx})`,
                transition: 'transform 320ms cubic-bezier(0.32,0.72,0,1)',
                zIndex: isActive ? 10 : isPrev ? 5 : 1,
                pointerEvents: isActive ? 'auto' : 'none',
                visibility: (isActive || isPrev || isInStack) ? 'visible' : 'hidden',
              }}
            >
              {(isActive || isPrev) && screenNodes[name]}
            </div>
          )
        })}

        {/* Global toast — above scroll containers so always visible */}
        <div style={{
          position: 'absolute', top: 56, left: 20, right: 20, zIndex: 150,
          background: '#357a1e', borderRadius: 16, padding: '14px 20px',
          display: 'flex', alignItems: 'center', gap: 12,
          transform: toast.visible ? 'translateY(0)' : 'translateY(-120px)',
          opacity: toast.visible ? 1 : 0,
          transition: 'transform 350ms cubic-bezier(0.34,1.56,0.64,1), opacity 250ms ease',
          boxShadow: '0 8px 32px rgba(53,122,30,0.35)',
          pointerEvents: toast.visible ? 'auto' : 'none',
        }}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" />
          </svg>
          <div>
            <p style={{ fontSize: 14, fontWeight: 800, color: 'white', fontFamily: 'inherit' }}>{toast.message}</p>
            {toast.subtitle && <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.75)', fontFamily: 'inherit' }}>{toast.subtitle}</p>}
          </div>
        </div>

        <MenuDrawer open={menuOpen} onClose={() => setMenuOpen(false)} />
      </div>
    </NavContext.Provider>
  )
}
