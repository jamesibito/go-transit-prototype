import { useRef, useEffect, useState } from 'react'

interface MarqueeTextProps {
  children: React.ReactNode
  style?: React.CSSProperties
  className?: string
}

export default function MarqueeText({ children, style, className = '' }: MarqueeTextProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const textRef = useRef<HTMLSpanElement>(null)
  const [isOverflowing, setIsOverflowing] = useState(false)
  const [distance, setDistance] = useState(0)

  useEffect(() => {
    const check = () => {
      if (containerRef.current && textRef.current) {
        const containerW = containerRef.current.offsetWidth
        const textW = textRef.current.scrollWidth
        const overflow = textW > containerW + 2
        setIsOverflowing(overflow)
        if (overflow) {
          setDistance(-(textW - containerW + 12))
        }
      }
    }
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [children])

  if (!isOverflowing) {
    return (
      <div className={`truncate ${className}`} style={style}>
        {children}
      </div>
    )
  }

  return (
    <div
      ref={containerRef}
      className={`marquee-container ${className}`}
      style={style}
    >
      <span
        ref={textRef}
        className="marquee-text"
        style={{ '--marquee-distance': `${distance}px` } as React.CSSProperties}
      >
        {children}
      </span>
    </div>
  )
}
