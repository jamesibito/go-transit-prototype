import { useState } from 'react'
import NavHeader from '../components/NavHeader'
import { useNav } from '../App'
import {
  UserIcon, MailIcon, PhoneIcon, MapPinIcon, CalendarIcon,
  CameraIcon, LogOutIcon, PencilIcon, CheckIcon,
} from '../components/Icons'

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

function InfoRow({ icon: Icon, label, value, onEdit }: {
  icon: React.ElementType
  label: string
  value: string
  onEdit?: () => void
}) {
  return (
    <div className="w-full flex items-center gap-3.5 px-4 py-3.5" style={{ background: 'var(--surface-primary)' }}>
      <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0" style={{ background: '#f0f7ec' }}>
        <Icon size={18} color="#357a1e" />
      </div>
      <div className="flex-1 min-w-0">
        <p style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-muted)', fontFamily: 'inherit', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{label}</p>
        <p style={{ fontSize: 15, fontWeight: 600, color: 'var(--text-primary)', fontFamily: 'inherit', marginTop: 2 }}>{value}</p>
      </div>
      {onEdit && (
        <button className="pressable w-9 h-9 rounded-full flex items-center justify-center" onClick={onEdit}
          aria-label={`Edit ${label}`}
          style={{ background: 'var(--surface-secondary)' }}>
          <PencilIcon size={14} color="var(--text-muted)" />
        </button>
      )}
    </div>
  )
}

interface EditModalProps {
  label: string
  value: string
  onSave: (val: string) => void
  onCancel: () => void
  type?: string
}

function EditModal({ label, value, onSave, onCancel, type = 'text' }: EditModalProps) {
  const [draft, setDraft] = useState(value)
  return (
    <>
      <div className="absolute inset-0 z-40" style={{ background: 'rgba(0,0,0,0.4)' }} onClick={onCancel} />
      <div className="absolute z-50 px-5" style={{ top: '50%', left: 0, right: 0, transform: 'translateY(-50%)' }}>
        <div className="rounded-2xl overflow-hidden" style={{ background: 'var(--surface-primary)', boxShadow: '0 16px 48px rgba(0,0,0,0.2)' }}>
          <div className="px-5 pt-5 pb-3">
            <h3 style={{ fontSize: 18, fontWeight: 800, color: 'var(--text-primary)', fontFamily: 'inherit' }}>Edit {label}</h3>
          </div>
          <div className="px-5 pb-4">
            <label htmlFor="edit-field" className="sr-only">{label}</label>
            <input
              id="edit-field"
              type={type}
              value={draft}
              onChange={e => setDraft(e.target.value)}
              autoFocus
              className="w-full px-4 py-3 rounded-xl"
              style={{
                fontSize: 16, fontWeight: 600, fontFamily: 'inherit',
                background: 'var(--surface-secondary)', border: '1px solid var(--border-color)',
                color: 'var(--text-primary)', outline: 'none',
              }}
            />
          </div>
          <div className="flex gap-3 px-5 pb-5">
            <button
              className="pressable flex-1 py-3 rounded-xl"
              style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-muted)', fontFamily: 'inherit', background: 'var(--surface-secondary)', border: '1px solid var(--border-color)' }}
              onClick={onCancel}
            >
              Cancel
            </button>
            <button
              className="pressable flex-1 py-3 rounded-xl"
              style={{ fontSize: 14, fontWeight: 700, color: 'white', fontFamily: 'inherit', background: '#357a1e' }}
              onClick={() => onSave(draft)}
            >
              Save
            </button>
          </div>
        </div>
      </div>
    </>
  )
}

export default function Account() {
  const { showToast } = useNav()

  const [name, setName] = useState('James Ibitoye')
  const [email, setEmail] = useState('j.ibitoye@email.com')
  const [phone, setPhone] = useState('+1 (416) 555-0192')
  const [address, setAddress] = useState('Scarborough, ON')
  const [editing, setEditing] = useState<{ field: string; value: string; type?: string } | null>(null)

  const memberSince = 'March 2024'
  const initials = name.split(' ').map(n => n[0]).join('').toUpperCase()

  const handleSave = (newValue: string) => {
    if (!editing) return
    switch (editing.field) {
      case 'Name': setName(newValue); break
      case 'Email': setEmail(newValue); break
      case 'Phone': setPhone(newValue); break
      case 'Address': setAddress(newValue); break
    }
    setEditing(null)
    showToast(`${editing.field} updated`)
  }

  return (
    <div className="min-h-full" style={{ background: 'var(--surface-secondary)' }}>
      <NavHeader title="Account" showBack />

      {/* Profile header */}
      <div className="px-5 pb-6 flex flex-col items-center">
        <div className="relative">
          <div className="w-24 h-24 rounded-full flex items-center justify-center" style={{ background: '#357a1e', boxShadow: '0 4px 16px rgba(53,122,30,0.3)' }}>
            <span style={{ fontSize: 32, fontWeight: 900, color: 'white', fontFamily: 'inherit', letterSpacing: '-0.5px' }}>{initials}</span>
          </div>
          <button
            className="pressable absolute flex items-center justify-center rounded-full"
            aria-label="Change profile photo"
            style={{
              bottom: 0, right: -4, width: 32, height: 32,
              background: 'var(--surface-primary)', border: '2px solid var(--surface-secondary)',
              boxShadow: '0 2px 8px rgba(0,0,0,0.12)',
            }}
          >
            <CameraIcon size={14} color="var(--text-secondary)" />
          </button>
        </div>
        <h2 style={{ fontSize: 22, fontWeight: 900, color: 'var(--text-primary)', fontFamily: 'inherit', marginTop: 16, letterSpacing: '-0.3px' }}>{name}</h2>
        <p style={{ fontSize: 13, color: 'var(--text-muted)', fontFamily: 'inherit', marginTop: 4 }}>
          GO Transit Member since {memberSince}
        </p>
      </div>

      {/* Personal Information */}
      <SectionCard title="Personal Information">
        <InfoRow
          icon={UserIcon}
          label="Full Name"
          value={name}
          onEdit={() => setEditing({ field: 'Name', value: name })}
        />
        <Divider />
        <InfoRow
          icon={MailIcon}
          label="Email"
          value={email}
          onEdit={() => setEditing({ field: 'Email', value: email, type: 'email' })}
        />
        <Divider />
        <InfoRow
          icon={PhoneIcon}
          label="Phone"
          value={phone}
          onEdit={() => setEditing({ field: 'Phone', value: phone, type: 'tel' })}
        />
        <Divider />
        <InfoRow
          icon={MapPinIcon}
          label="City"
          value={address}
          onEdit={() => setEditing({ field: 'Address', value: address })}
        />
      </SectionCard>

      {/* Membership */}
      <SectionCard title="Membership">
        <div className="w-full flex items-center gap-3.5 px-4 py-3.5" style={{ background: 'var(--surface-primary)' }}>
          <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0" style={{ background: '#f0f7ec' }}>
            <CalendarIcon size={18} color="#357a1e" />
          </div>
          <div className="flex-1 min-w-0">
            <p style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-muted)', fontFamily: 'inherit', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Member Since</p>
            <p style={{ fontSize: 15, fontWeight: 600, color: 'var(--text-primary)', fontFamily: 'inherit', marginTop: 2 }}>{memberSince}</p>
          </div>
        </div>
        <Divider />
        <div className="w-full flex items-center gap-3.5 px-4 py-3.5" style={{ background: 'var(--surface-primary)' }}>
          <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0" style={{ background: '#f0f7ec' }}>
            <CheckIcon size={18} color="#357a1e" />
          </div>
          <div className="flex-1 min-w-0">
            <p style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-muted)', fontFamily: 'inherit', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Account Status</p>
            <p style={{ fontSize: 15, fontWeight: 600, color: 'var(--accent-green)', fontFamily: 'inherit', marginTop: 2 }}>Verified</p>
          </div>
          <div className="px-2.5 py-1 rounded-lg" style={{ background: 'var(--surface-green-soft)' }}>
            <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--accent-green)', fontFamily: 'inherit' }}>Active</span>
          </div>
        </div>
      </SectionCard>

      {/* Ride Stats */}
      <div className="px-5 pb-5">
        <h3 style={{ fontSize: 14, fontWeight: 800, color: 'var(--text-muted)', fontFamily: 'inherit', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 10 }}>
          Ride Statistics
        </h3>
        <div className="grid grid-cols-3 gap-3">
          {[
            { value: '142', label: 'Total Rides' },
            { value: '$1,284', label: 'Total Spent' },
            { value: '$218', label: 'PRESTO Savings' },
          ].map((stat, i) => (
            <div key={i} className="rounded-2xl px-3 py-4 text-center" style={{ background: 'var(--surface-primary)', border: '1px solid var(--border-color)' }}>
              <p style={{ fontSize: 22, fontWeight: 900, color: 'var(--text-primary)', fontFamily: 'inherit', letterSpacing: '-0.5px' }}>{stat.value}</p>
              <p style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-muted)', fontFamily: 'inherit', marginTop: 4 }}>{stat.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Sign Out */}
      <div className="px-5 pb-5">
        <button
          className="pressable w-full flex items-center justify-center gap-2.5 py-3.5 rounded-2xl"
          style={{ background: 'var(--surface-primary)', border: '1px solid var(--border-color)' }}
          onClick={() => showToast('Signed out', 'See you next time!')}
        >
          <LogOutIcon size={18} color="#dc2626" />
          <span style={{ fontSize: 15, fontWeight: 700, color: '#dc2626', fontFamily: 'inherit' }}>Sign Out</span>
        </button>
      </div>

      <div className="px-5 pb-3">
        <p style={{ fontSize: 12, color: 'var(--text-muted)', fontFamily: 'inherit', textAlign: 'center', lineHeight: 1.5 }}>
          Account data is encrypted and stored securely.
        </p>
      </div>

      <div className="h-8" />

      {/* Edit modal */}
      {editing && (
        <EditModal
          label={editing.field}
          value={editing.value}
          type={editing.type}
          onSave={handleSave}
          onCancel={() => setEditing(null)}
        />
      )}
    </div>
  )
}
