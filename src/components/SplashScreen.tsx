import { useEffect, useState } from 'react'
import { GOLogo } from './Icons'

/**
 * Splash screen shown for ~1.4s when the app first mounts, then fades out.
 * Full GO green background with a white GO logo, centered.
 * Mounted inside the phone shell so it doesn't bleed onto the marketing page.
 */
export default function SplashScreen() {
  const [phase, setPhase] = useState<'visible' | 'fading' | 'gone'>('visible')

  useEffect(() => {
    const t1 = setTimeout(() => setPhase('fading'), 1400)
    const t2 = setTimeout(() => setPhase('gone'), 1800)
    return () => { clearTimeout(t1); clearTimeout(t2) }
  }, [])

  if (phase === 'gone') return null

  return (
    <div
      aria-hidden
      style={{
        position: 'absolute',
        inset: 0,
        zIndex: 200,
        background: '#357a1e',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        opacity: phase === 'fading' ? 0 : 1,
        transition: 'opacity 0.4s ease-out',
        pointerEvents: phase === 'fading' ? 'none' : 'auto',
      }}
    >
      {/* Subtle outer pulse glow to add life */}
      <div
        style={{
          position: 'absolute',
          width: '70%',
          paddingBottom: '70%',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(255,255,255,0.06) 0%, transparent 65%)',
          animation: 'splash-pulse 1.6s ease-in-out infinite',
        }}
      />
      {/* Centered GO logo */}
      <div
        style={{
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          animation: 'splash-rise 0.5s cubic-bezier(0.22, 1, 0.36, 1) both',
        }}
      >
        <GOLogo size={92} color="#ffffff" />
      </div>

      <style>{`
        @keyframes splash-pulse {
          0%, 100% { opacity: 0.6; transform: scale(1); }
          50%      { opacity: 1;   transform: scale(1.05); }
        }
        @keyframes splash-rise {
          from { opacity: 0; transform: translateY(8px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  )
}
