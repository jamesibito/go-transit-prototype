export {
  Train as TrainIcon,
  Bus as BusIcon,
  Footprints as PersonIcon,
  Menu as MenuHamburger,
  X as MenuClose,
  ChevronLeft,
  ChevronDown,
  ChevronUp,
  ArrowRight,
  ArrowUpDown as SwapIcon,
  MapPin as LocationPin,
  Star as StarIcon,
  Minus as MinusIcon,
  Plus as PlusIcon,
  Ticket as TicketIcon,
  Bell as BellIcon,
  BellOff as BellOffIcon,
  Clock as ClockIcon,
  Search as SearchIcon,
  Wallet as WalletIcon,
  CircleCheckBig as CheckCircleIcon,
  QrCode as QrCodeIcon,
  AlertTriangle as AlertIcon,
  Home as HomeIcon,
  Info as InfoIcon,
  Settings as SettingsIcon,
  Moon as MoonIcon,
  Sun as SunIcon,
  Globe as GlobeIcon,
  Shield as ShieldIcon,
  MessageSquare as FeedbackIcon,
  MoreVertical as MoreVerticalIcon,
  Trash2 as TrashIcon,
  ExternalLink as ExternalLinkIcon,
  ChevronRight,
  Smartphone as SmartphoneIcon,
  Accessibility as AccessibilityIcon,
  Languages as LanguagesIcon,
  Map as MapIcon,
  CreditCard as FaresIcon,
  AlertCircle as ServiceUpdatesIcon,
  Link as LinkIcon,
  CreditCard as CreditCardIcon,
  Wallet as WalletIcon2,
  Plus as PlusIcon2,
  Check as CheckIcon,
  Lock as LockIcon,
} from 'lucide-react'

export function PrestoLogo({ size = 20 }: { size?: number }) {
  return (
    <img
      src="https://themetrolinxshop.com/cdn/shop/collections/PRESTO-LOGO-BOX.png?v=1612296818"
      alt="PRESTO"
      style={{
        width: size + 8,
        height: size + 8,
        borderRadius: 8,
        objectFit: 'cover',
      }}
    />
  )
}

export function GOLogo({ size = 48, color = '#4a7729' }: { size?: number; color?: string }) {
  const w = size * (460 / 220)
  return (
    <svg width={w} height={size} viewBox="-23 -11 46 22" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <clipPath id="go-clip">
          <path d="m-23-11h46v22h-46zM23 1v-2h-34v-10h-2v22h2V1z"/>
        </clipPath>
      </defs>
      <path clipPath="url(#go-clip)" fill={color} d="m-1 0a11 11 0 1 0-11 11h11zm2 0a1 1 0 0 0 22 0A1 1 0 0 0 1 0z"/>
    </svg>
  )
}
