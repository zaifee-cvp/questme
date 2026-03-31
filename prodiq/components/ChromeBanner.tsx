'use client'
import { useEffect, useState } from 'react'

export default function ChromeBanner() {
  const [show, setShow] = useState(false)

  useEffect(() => {
    const isChrome = /Chrome/.test(navigator.userAgent) && /Google Inc/.test(navigator.vendor)
    const isSamsung = /SamsungBrowser/.test(navigator.userAgent)

    if (!isChrome || isSamsung) {
      setShow(true)
    }
  }, [])

  if (!show) return null

  return (
    <div style={{
      background: '#AAFF00',
      color: '#080A0E',
      padding: '10px 16px',
      textAlign: 'center',
      fontSize: '13px',
      fontWeight: '600',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '8px',
      flexShrink: 0,
    }}>
      <span>For best experience, open in Chrome</span>
      <a
        href="https://www.google.com/chrome/"
        target="_blank"
        rel="noopener noreferrer"
        style={{
          background: '#080A0E',
          color: '#AAFF00',
          padding: '4px 12px',
          borderRadius: '4px',
          textDecoration: 'none',
          fontSize: '12px',
        }}
      >
        Get Chrome →
      </a>
      <button
        onClick={() => setShow(false)}
        style={{
          background: 'none',
          border: 'none',
          color: '#080A0E',
          cursor: 'pointer',
          fontWeight: '700',
          fontSize: '16px',
          lineHeight: 1,
          padding: '0 4px',
        }}
      >
        ×
      </button>
    </div>
  )
}
