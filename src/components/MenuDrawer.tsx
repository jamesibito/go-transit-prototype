import { MenuClose, HomeIcon, MapIcon, FaresIcon, AlertIcon, InfoIcon, SettingsIcon } from './Icons'
import { useNav } from '../App'

const navItems = [
  { label: 'Home', screen: 'landing' as const, Icon: HomeIcon },
  { label: 'Trip Planning', screen: 'search' as const, Icon: MapIcon },
  { label: 'Fares', screen: 'fares' as const, Icon: FaresIcon },
  { label: 'Service Alerts', screen: 'serviceUpdates' as const, Icon: AlertIcon },
  { label: 'About', screen: 'about' as const, Icon: InfoIcon },
  { label: 'Settings', screen: 'settings' as const, Icon: SettingsIcon },
]

interface MenuDrawerProps {
  open: boolean
  onClose: () => void
}

export default function MenuDrawer({ open, onClose }: MenuDrawerProps) {
  const { goHome, navigate, currentScreen } = useNav()

  return (
    <>
      {/* Backdrop */}
      <div
        className="absolute inset-0 z-40"
        style={{
          background: 'rgba(0,0,0,0.4)',
          opacity: open ? 1 : 0,
          pointerEvents: open ? 'auto' : 'none',
          transition: 'opacity 280ms ease',
        }}
        onClick={onClose}
      />

      {/* Drawer panel */}
      <div
        className="absolute top-0 left-0 bottom-0 z-50 flex flex-col"
        style={{
          width: '72%',
          background: '#357a1e',
          transform: open ? 'translateX(0)' : 'translateX(-100%)',
          transition: 'transform 320ms cubic-bezier(0.32,0.72,0,1)',
        }}
      >
        {/* Close button */}
        <div className="flex justify-end pt-16 pr-5">
          <button className="pressable w-10 h-10 flex items-center justify-center rounded-full" onClick={onClose}
            style={{ background: 'rgba(255,255,255,0.12)' }}>
            <MenuClose size={20} color="white" />
          </button>
        </div>

        {/* Nav items */}
        <nav className="flex flex-col gap-1 px-6 pt-4">
          {navItems.map((item, i) => {
            const isActive = item.screen === currentScreen || (item.screen === 'landing' && currentScreen === 'landing')
            const iconColor = isActive ? 'white' : 'rgba(255,255,255,0.45)'
            return (
              <button
                key={i}
                className="pressable text-left py-3 px-3 rounded-xl flex items-center gap-3"
                style={{
                  fontSize: 22,
                  fontWeight: 900,
                  fontFamily: 'inherit',
                  color: isActive ? 'white' : 'rgba(255,255,255,0.45)',
                  background: isActive ? 'rgba(255,255,255,0.12)' : 'transparent',
                  letterSpacing: '-0.3px',
                }}
                onClick={() => {
                  if (item.screen === 'landing') {
                    goHome()
                  } else {
                    navigate(item.screen)
                  }
                  onClose()
                }}
              >
                <item.Icon size={22} color={iconColor} strokeWidth={2.2} />
                {item.label}
              </button>
            )
          })}
        </nav>

        {/* Footer */}
        <div className="mt-auto px-6 pb-12">
          <div style={{ width: 60, height: 3, background: 'rgba(255,255,255,0.2)', borderRadius: 2 }} />
          <p style={{ marginTop: 12, fontSize: 12, color: 'rgba(255,255,255,0.3)', fontFamily: 'inherit' }}>
            GO Transit Concept App · v4.2.2
          </p>
          <a
            href="https://jamesibitoye.framer.website"
            target="_blank"
            rel="noopener noreferrer"
            style={{ marginTop: 4, fontSize: 11, color: 'rgba(255,255,255,0.4)', fontFamily: 'inherit', textDecoration: 'none', display: 'block' }}
          >
            Designed by James Ibitoye
          </a>
        </div>
      </div>
    </>
  )
}
