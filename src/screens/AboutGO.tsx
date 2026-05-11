import NavHeader from '../components/NavHeader'
import { GOLogo, TrainIcon, BusIcon, GlobeIcon, ExternalLinkIcon, LinkIcon } from '../components/Icons'

const stats = [
  { label: 'Train Lines', value: '7', icon: TrainIcon },
  { label: 'Bus Routes', value: '70+', icon: BusIcon },
  { label: 'Stations', value: '68', icon: TrainIcon },
]

const links = [
  { label: 'GO Transit Website', url: 'gotransit.com' },
  { label: 'Trip Planning Tools', url: 'gotransit.com/trip-planning' },
  { label: 'PRESTO Card Info', url: 'prestocard.ca' },
  { label: 'Accessibility Services', url: 'gotransit.com/accessibility' },
]

export default function AboutGO() {
  return (
    <div className="min-h-full" style={{ background: 'var(--surface-primary)' }}>
      <NavHeader title="About" showMenu hideCornerLogo />

      {/* Hero */}
      <div className="flex flex-col items-center px-5 pt-4 pb-6">
        <div className="mb-4">
          <GOLogo size={48} color="#357a1e" />
        </div>
        <h2 style={{ fontSize: 22, fontWeight: 900, color: 'var(--text-primary)', fontFamily: 'inherit', letterSpacing: '-0.4px', textAlign: 'center' }}>
          GO Transit
        </h2>
        <p style={{ fontSize: 14, color: 'var(--text-muted)', fontFamily: 'inherit', textAlign: 'center', marginTop: 4, lineHeight: 1.5, maxWidth: 300 }}>
          Regional public transit serving the Greater Toronto and Hamilton Area since 1967.
        </p>
      </div>

      {/* Stats */}
      <div className="px-5 pb-5">
        <div className="flex gap-2.5">
          {stats.map(({ label, value, icon: Icon }) => (
            <div key={label} className="flex-1 rounded-2xl px-3 py-4 flex flex-col items-center" style={{ background: 'var(--surface-green-soft)', border: '1px solid var(--border-green)' }}>
              <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-2" style={{ background: 'var(--surface-green-light)' }}>
                <Icon size={20} color="#357a1e" />
              </div>
              <span style={{ fontSize: 22, fontWeight: 900, color: 'var(--text-primary)', fontFamily: 'inherit' }}>{value}</span>
              <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-muted)', fontFamily: 'inherit', textTransform: 'uppercase', letterSpacing: '0.3px', marginTop: 2 }}>{label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* About section */}
      <div className="px-5 pb-5">
        <div className="rounded-2xl overflow-hidden" style={{ border: '1px solid var(--border-color)' }}>
          <div className="px-5 py-4" style={{ background: 'var(--surface-secondary)' }}>
            <h3 style={{ fontSize: 16, fontWeight: 800, color: 'var(--text-primary)', fontFamily: 'inherit', marginBottom: 8 }}>About This App</h3>
            <p style={{ fontSize: 14, color: 'var(--text-secondary)', fontFamily: 'inherit', lineHeight: 1.6 }}>
              This is a concept design of the GO Transit mobile experience, created as a UX case study to explore
              improvements in trip planning, fare purchasing, and real-time service information.
            </p>
          </div>
          <div style={{ height: 1, background: 'var(--border-color)' }} />
          <div className="px-5 py-3 flex items-center justify-between" style={{ background: 'var(--surface-secondary)' }}>
            <span style={{ fontSize: 13, color: 'var(--text-muted)', fontFamily: 'inherit' }}>Version</span>
            <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-primary)', fontFamily: 'inherit' }}>4.0.0</span>
          </div>
          <div style={{ height: 1, background: 'var(--border-color)' }} />
          <div className="px-5 py-3 flex items-center justify-between" style={{ background: 'var(--surface-secondary)' }}>
            <span style={{ fontSize: 13, color: 'var(--text-muted)', fontFamily: 'inherit' }}>Designed by</span>
            <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-primary)', fontFamily: 'inherit' }}>James Ibitoye</span>
          </div>
          <div style={{ height: 1, background: 'var(--border-color)' }} />
          <div className="px-5 py-3 flex items-center justify-between" style={{ background: 'var(--surface-secondary)' }}>
            <span style={{ fontSize: 13, color: 'var(--text-muted)', fontFamily: 'inherit' }}>Portfolio</span>
            <a
              href="https://jamesibitoye.framer.website"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5"
              style={{ textDecoration: 'none' }}
            >
              <LinkIcon size={13} color="#357a1e" strokeWidth={2} />
              <span style={{ fontSize: 13, fontWeight: 700, color: '#357a1e', fontFamily: 'inherit' }}>jamesibitoye.framer.website</span>
            </a>
          </div>
        </div>
      </div>

      {/* Links */}
      <div className="px-5 pb-5">
        <h3 style={{ fontSize: 16, fontWeight: 800, color: 'var(--text-primary)', fontFamily: 'inherit', marginBottom: 12 }}>Resources</h3>
        <div className="rounded-2xl overflow-hidden" style={{ border: '1px solid var(--border-color)' }}>
          {links.map((link, i) => (
            <div key={link.label}>
              {i > 0 && <div style={{ height: 1, background: 'var(--border-color)', marginLeft: 52 }} />}
              <button className="pressable w-full flex items-center gap-3 px-4 py-3.5 text-left" style={{ background: 'var(--surface-primary)' }}>
                <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0" style={{ background: 'var(--surface-green-soft)' }}>
                  <GlobeIcon size={18} color="#357a1e" />
                </div>
                <div className="flex-1 min-w-0">
                  <p style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-primary)', fontFamily: 'inherit' }}>{link.label}</p>
                  <p style={{ fontSize: 12, color: 'var(--text-muted)', fontFamily: 'inherit' }}>{link.url}</p>
                </div>
                <ExternalLinkIcon size={16} color="var(--text-muted)" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Legal */}
      <div className="px-5 pb-3">
        <p style={{ fontSize: 12, color: 'var(--text-muted)', fontFamily: 'inherit', textAlign: 'center', lineHeight: 1.5 }}>
          This app is an independent concept design and is not affiliated with, endorsed by, or connected to Metrolinx or GO Transit. There is no native GO Transit mobile app.
        </p>
      </div>

      <div className="h-8" />
    </div>
  )
}
