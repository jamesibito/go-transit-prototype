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
import MenuDrawer from './components/MenuDrawer'

export type ScreenName = 'landing' | 'search' | 'results' | 'tripDetails' | 'fares' | 'serviceUpdates' | 'payment' | 'ticketConfirmation' | 'about' | 'settings'

export interface SavedLine {
  id: string
  from: string
  to: string
  line: string
  muted: boolean
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
}

export const NavContext = createContext<NavContextType>({} as NavContextType)
export const useNav = () => useContext(NavContext)

const SCREEN_DEPTH: Record<ScreenName, number> = {
  landing: 0, search: 1, results: 2, tripDetails: 3, fares: 1, serviceUpdates: 1, payment: 4, ticketConfirmation: 5, about: 1, settings: 1,
}

const DEFAULT_SAVED_LINES: SavedLine[] = [
  { id: 'sl-1', from: 'Miliken GO', to: 'Union Station GO', line: 'Stouffville', muted: false },
  { id: 'sl-2', from: 'Union Station GO', to: 'Miliken GO', line: 'Stouffville', muted: false },
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

  const screens: ScreenName[] = ['landing', 'search', 'results', 'tripDetails', 'fares', 'serviceUpdates', 'payment', 'ticketConfirmation', 'about', 'settings']
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
    }}>
      <div className={`phone-shell${darkMode ? ' dark' : ''}`}>
        {/* Status bar — fixed layer above all content */}
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

        <MenuDrawer open={menuOpen} onClose={() => setMenuOpen(false)} />
      </div>
    </NavContext.Provider>
  )
}
