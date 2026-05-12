import { useState } from 'react'
import NavHeader from '../components/NavHeader'
import { useNav } from '../App'
import {
  MoonIcon, SunIcon, BellIcon, ShieldIcon, GlobeIcon, SmartphoneIcon,
  AccessibilityIcon, ChevronRight, LanguagesIcon, FeedbackIcon,
  CreditCardIcon, WalletIcon, PrestoLogo,
} from '../components/Icons'

function Toggle({ on, onToggle }: { on: boolean; onToggle: () => void }) {
  return (
    <button className="pressable relative shrink-0" onClick={onToggle}
      role="switch" aria-checked={on}
      style={{ width: 48, height: 26, borderRadius: 13, background: on ? '#357a1e' : '#d5d7da', transition: 'background 200ms ease' }}>
      <div style={{
        position: 'absolute', top: 2, left: on ? 24 : 2,
        width: 22, height: 22, borderRadius: 11,
        background: 'white', boxShadow: '0 1px 4px rgba(0,0,0,0.2)',
        transition: 'left 200ms cubic-bezier(0.34,1.56,0.64,1)',
      }} />
    </button>
  )
}

function SettingsRow({ icon: Icon, label, subtitle, right, onClick }: {
  icon: React.ElementType
  label: string
  subtitle?: string
  right?: React.ReactNode
  onClick?: () => void
}) {
  const Wrapper = onClick ? 'button' : 'div' as any
  return (
    <Wrapper
      className={`w-full flex items-center gap-3.5 px-4 py-3.5 text-left ${onClick ? 'pressable' : ''}`}
      onClick={onClick}
      style={{ background: 'var(--surface-primary)' }}
    >
      <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0" style={{ background: '#f0f7ec' }}>
        <Icon size={18} color="#357a1e" />
      </div>
      <div className="flex-1 min-w-0">
        <p style={{ fontSize: 15, fontWeight: 700, color: 'var(--text-primary)', fontFamily: 'inherit' }}>{label}</p>
        {subtitle && <p style={{ fontSize: 12, color: 'var(--text-muted)', fontFamily: 'inherit', marginTop: 1 }}>{subtitle}</p>}
      </div>
      {right || (onClick && <ChevronRight size={18} color="var(--text-muted)" />)}
    </Wrapper>
  )
}

function SectionCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="px-5 pb-5">
      <h3 style={{ fontSize: 14, fontWeight: 800, color: 'var(--text-muted)', fontFamily: 'inherit', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 10 }}>
        {title}
      </h3>
      <div className="rounded-2xl overflow-hidden" style={{ border: '1px solid var(--border-color)' }}>
        {children}
      </div>
    </div>
  )
}

function Divider() {
  return <div style={{ height: 1, background: 'var(--border-color)', marginLeft: 52 }} />
}

export default function Settings() {
  const { darkMode, setDarkMode, prestoConnected, setPrestoConnected, navigate } = useNav()
  const [notifications, setNotifications] = useState(true)
  const [haptics, setHaptics] = useState(true)
  const [largeText, setLargeText] = useState(false)

  return (
    <div className="min-h-full" style={{ background: 'var(--surface-secondary)' }}>
      <NavHeader title="Settings" showMenu />

      {/* Account profile card */}
      <div className="px-5 pb-5">
        <button
          className="pressable w-full rounded-2xl px-4 py-4 flex items-center gap-3.5 text-left"
          style={{ background: 'var(--surface-primary)', border: '1px solid var(--border-color)' }}
          onClick={() => navigate('account')}
        >
          <div className="w-12 h-12 rounded-full flex items-center justify-center shrink-0" style={{ background: '#357a1e' }}>
            <span style={{ fontSize: 18, fontWeight: 900, color: 'white', fontFamily: 'inherit' }}>JS</span>
          </div>
          <div className="flex-1 min-w-0">
            <p style={{ fontSize: 16, fontWeight: 800, color: 'var(--text-primary)', fontFamily: 'inherit' }}>John Smith</p>
            <p style={{ fontSize: 13, color: 'var(--text-muted)', fontFamily: 'inherit', marginTop: 1 }}>View account details</p>
          </div>
          <ChevronRight size={18} color="var(--text-muted)" />
        </button>
      </div>

      <SectionCard title="Appearance">
        <SettingsRow
          icon={darkMode ? MoonIcon : SunIcon}
          label="Dark Mode"
          subtitle={darkMode ? 'Currently on' : 'Currently off'}
          right={<Toggle on={darkMode} onToggle={() => setDarkMode(!darkMode)} />}
        />
      </SectionCard>

      <SectionCard title="Payment">
        <div className="w-full flex items-center gap-3.5 px-4 py-3.5 text-left" style={{ background: 'var(--surface-primary)' }}>
          <PrestoLogo size={20} />
          <div className="flex-1 min-w-0">
            <p style={{ fontSize: 15, fontWeight: 700, color: 'var(--text-primary)', fontFamily: 'inherit' }}>PRESTO Card</p>
            <p style={{ fontSize: 12, color: 'var(--text-muted)', fontFamily: 'inherit', marginTop: 1 }}>
              {prestoConnected ? 'Connected · •••• 4821' : 'Save on fares with PRESTO'}
            </p>
          </div>
          {prestoConnected ? (
            <button className="pressable px-3 py-1.5 rounded-lg" style={{ background: 'var(--surface-green-soft)', border: '1px solid var(--border-green)' }}
              onClick={() => setPrestoConnected(false)}>
              <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--accent-green)', fontFamily: 'inherit' }}>Disconnect</span>
            </button>
          ) : (
            <button className="pressable px-3 py-1.5 rounded-lg" style={{ background: '#357a1e' }}
              onClick={() => setPrestoConnected(true)}>
              <span style={{ fontSize: 12, fontWeight: 700, color: 'white', fontFamily: 'inherit' }}>Connect</span>
            </button>
          )}
        </div>
        <Divider />
        <SettingsRow
          icon={CreditCardIcon}
          label="Saved Cards"
          subtitle="Visa •••• 4242"
          onClick={() => navigate('savedCards')}
        />
        <Divider />
        <SettingsRow
          icon={WalletIcon}
          label="Payment History"
          subtitle="View past transactions"
          onClick={() => navigate('paymentHistory')}
        />
      </SectionCard>

      <SectionCard title="Notifications">
        <SettingsRow
          icon={BellIcon}
          label="Push Notifications"
          subtitle="Service alerts & trip updates"
          right={<Toggle on={notifications} onToggle={() => setNotifications(!notifications)} />}
        />
      </SectionCard>

      <SectionCard title="Accessibility">
        <SettingsRow
          icon={AccessibilityIcon}
          label="Accessibility Features"
          subtitle="Screen reader, high contrast"
          onClick={() => navigate('accessibility')}
        />
        <Divider />
        <SettingsRow
          icon={SmartphoneIcon}
          label="Haptic Feedback"
          subtitle="Vibration on button press"
          right={<Toggle on={haptics} onToggle={() => setHaptics(!haptics)} />}
        />
        <Divider />
        <SettingsRow
          icon={LanguagesIcon}
          label="Larger Text"
          subtitle="Increase default font sizes"
          right={<Toggle on={largeText} onToggle={() => setLargeText(!largeText)} />}
        />
      </SectionCard>

      <SectionCard title="General">
        <SettingsRow
          icon={GlobeIcon}
          label="Language"
          subtitle="English"
          onClick={() => {}}
        />
        <Divider />
        <SettingsRow
          icon={ShieldIcon}
          label="Privacy & Data"
          onClick={() => {}}
        />
        <Divider />
        <SettingsRow
          icon={FeedbackIcon}
          label="Send Feedback"
          subtitle="Help us improve GO Transit"
          onClick={() => {}}
        />
      </SectionCard>

      <div className="px-5 pb-3">
        <p style={{ fontSize: 12, color: 'var(--text-muted)', fontFamily: 'inherit', textAlign: 'center', lineHeight: 1.5 }}>
          GO Transit Concept App v4.4
        </p>
        <a
          href="https://jamesibitoye.framer.website"
          target="_blank"
          rel="noopener noreferrer"
          style={{ fontSize: 11, color: 'var(--text-muted)', fontFamily: 'inherit', textAlign: 'center', marginTop: 2, opacity: 0.7, display: 'block', textDecoration: 'none' }}
        >
          Designed by James Ibitoye
        </a>
      </div>

      <div className="h-8" />
    </div>
  )
}
