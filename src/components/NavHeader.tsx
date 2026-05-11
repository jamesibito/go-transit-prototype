import { MenuHamburger, ChevronLeft, GOLogo } from './Icons'
import { useNav } from '../App'

interface NavHeaderProps {
  title?: string
  showLogo?: boolean
  showBack?: boolean
  showMenu?: boolean
  hideCornerLogo?: boolean
}

export default function NavHeader({ title, showLogo, showBack = false, showMenu = false, hideCornerLogo = false }: NavHeaderProps) {
  const { goBack, goHome, openMenu } = useNav()

  return (
    <div className="flex items-center justify-between px-5 pt-2 pb-3">
      {showBack ? (
        <button className="pressable w-11 h-11 flex items-center justify-center -ml-2 rounded-full" onClick={goBack}>
          <ChevronLeft size={24} color="var(--text-primary)" strokeWidth={2.5} />
        </button>
      ) : showMenu ? (
        <button className="pressable w-11 h-11 flex items-center justify-center -ml-2 rounded-full" onClick={openMenu}>
          <MenuHamburger size={22} color="var(--text-primary)" strokeWidth={2.5} />
        </button>
      ) : (
        <div className="w-11" />
      )}

      {showLogo ? (
        <button className="pressable" onClick={goHome}>
          <GOLogo size={28} color="#357a1e" />
        </button>
      ) : title ? (
        <span className="nav-title">{title}</span>
      ) : (
        <div />
      )}

      {/* Right side: tappable logo when showing title (for getting home) */}
      {title && !showLogo && !hideCornerLogo ? (
        <button className="pressable h-11 flex items-center justify-center rounded-full" style={{ width: 44, marginRight: -8 }} onClick={goHome}>
          <div style={{ marginLeft: -6 }}>
            <GOLogo size={16} color="#357a1e" />
          </div>
        </button>
      ) : (
        <div className="w-11" />
      )}
    </div>
  )
}
