import { useState } from 'react'
import NavHeader from '../components/NavHeader'
import { AccessibilityIcon, SmartphoneIcon, ChevronRight } from '../components/Icons'

function Toggle({ on, onToggle }: { on: boolean; onToggle: () => void }) {
  return (
    <button className="pressable relative shrink-0" onClick={onToggle}
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

// Inline icon components for this screen
function EyeIcon({ size = 18, color = 'currentColor' }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" />
    </svg>
  )
}

function VolumeIcon({ size = 18, color = 'currentColor' }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" /><path d="M15.54 8.46a5 5 0 0 1 0 7.07" /><path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
    </svg>
  )
}

function HandIcon({ size = 18, color = 'currentColor' }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 11V6a2 2 0 0 0-4 0v5" /><path d="M14 10V4a2 2 0 0 0-4 0v6" /><path d="M10 10.5V6a2 2 0 0 0-4 0v8" /><path d="M18 8a2 2 0 1 1 4 0v6a8 8 0 0 1-8 8h-2c-2.8 0-4.5-.86-5.99-2.34l-3.6-3.6a2 2 0 0 1 2.83-2.82L7 15" />
    </svg>
  )
}

function TypeIcon({ size = 18, color = 'currentColor' }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="4 7 4 4 20 4 20 7" /><line x1="9" y1="20" x2="15" y2="20" /><line x1="12" y1="4" x2="12" y2="20" />
    </svg>
  )
}

function ContrastIcon({ size = 18, color = 'currentColor' }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" /><path d="M12 2a10 10 0 0 1 0 20z" fill={color} />
    </svg>
  )
}

export default function AccessibilityFeatures() {
  const [screenReader, setScreenReader] = useState(false)
  const [reduceMotion, setReduceMotion] = useState(false)
  const [haptics, setHaptics] = useState(true)
  const [largeText, setLargeText] = useState(false)
  const [highContrast, setHighContrast] = useState(false)
  const [voiceAnnouncements, setVoiceAnnouncements] = useState(false)

  return (
    <div className="min-h-full" style={{ background: 'var(--surface-secondary)' }}>
      <NavHeader title="Accessibility" showBack />

      {/* Info banner */}
      <div className="px-5 pb-5">
        <div className="rounded-2xl px-4 py-3.5 flex items-start gap-3" style={{ background: 'var(--surface-green-soft)', border: '1px solid var(--border-green)' }}>
          <AccessibilityIcon size={20} color="#357a1e" style={{ marginTop: 2 }} />
          <p style={{ fontSize: 13, color: 'var(--text-secondary)', fontFamily: 'inherit', lineHeight: 1.5 }}>
            GO Transit is committed to providing accessible services for all riders. These settings customize your in-app experience.
          </p>
        </div>
      </div>

      <SectionCard title="Vision">
        <SettingsRow
          icon={EyeIcon}
          label="Screen Reader Support"
          subtitle="Optimize layout for VoiceOver"
          right={<Toggle on={screenReader} onToggle={() => setScreenReader(!screenReader)} />}
        />
        <Divider />
        <SettingsRow
          icon={TypeIcon}
          label="Larger Text"
          subtitle="Increase default font sizes"
          right={<Toggle on={largeText} onToggle={() => setLargeText(!largeText)} />}
        />
        <Divider />
        <SettingsRow
          icon={ContrastIcon}
          label="High Contrast"
          subtitle="Stronger borders and text"
          right={<Toggle on={highContrast} onToggle={() => setHighContrast(!highContrast)} />}
        />
      </SectionCard>

      <SectionCard title="Motion & Haptics">
        <SettingsRow
          icon={HandIcon}
          label="Reduce Motion"
          subtitle="Minimize animations and transitions"
          right={<Toggle on={reduceMotion} onToggle={() => setReduceMotion(!reduceMotion)} />}
        />
        <Divider />
        <SettingsRow
          icon={SmartphoneIcon}
          label="Haptic Feedback"
          subtitle="Vibration on button press"
          right={<Toggle on={haptics} onToggle={() => setHaptics(!haptics)} />}
        />
      </SectionCard>

      <SectionCard title="Audio">
        <SettingsRow
          icon={VolumeIcon}
          label="Voice Announcements"
          subtitle="Speak upcoming stops aloud"
          right={<Toggle on={voiceAnnouncements} onToggle={() => setVoiceAnnouncements(!voiceAnnouncements)} />}
        />
      </SectionCard>

      <SectionCard title="Station Accessibility">
        <SettingsRow
          icon={AccessibilityIcon}
          label="Accessible Route Preferences"
          subtitle="Prioritize elevator and ramp access"
          onClick={() => {}}
        />
      </SectionCard>

      <div className="h-8" />
    </div>
  )
}
