'use client'
import { useEffect, useState } from 'react'

export default function ChromeBanner() {
  const [show, setShow] = useState(false)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    const isChrome = /Chrome/.test(navigator.userAgent) && /Google Inc/.test(navigator.vendor)
    const isSamsung = /SamsungBrowser/.test(navigator.userAgent)
    if (isChrome && !isSamsung) return
    if (sessionStorage.getItem('chrome-prompt-dismissed')) return

    const timer = setTimeout(() => setShow(true), 2000)
    return () => clearTimeout(timer)
  }, [])

  function dismiss() {
    sessionStorage.setItem('chrome-prompt-dismissed', '1')
    setShow(false)
  }

  function copyLink() {
    navigator.clipboard.writeText(window.location.href).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  if (!show) return null

  const chromeUrl = `googlechrome://navigate?url=${encodeURIComponent(window.location.href)}`

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={dismiss}
        style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0,0,0,0.5)',
          zIndex: 999,
        }}
      />

      {/* Bottom sheet */}
      <div style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 1000,
        background: '#0F1117',
        borderTop: '1px solid #1E2130',
        borderRadius: '16px 16px 0 0',
        padding: '24px 20px 32px',
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
        animation: 'slideUp 0.25s ease-out',
      }}>
        <style>{`
          @keyframes slideUp {
            from { transform: translateY(100%); }
            to   { transform: translateY(0); }
          }
        `}</style>

        {/* Drag handle */}
        <div style={{
          width: '36px',
          height: '4px',
          borderRadius: '2px',
          background: '#2D3148',
          margin: '-8px auto 4px',
        }} />

        <div style={{ marginBottom: '4px' }}>
          <div style={{ fontSize: '17px', fontWeight: 700, color: '#F0F0F0', marginBottom: '6px', fontFamily: 'Outfit, sans-serif' }}>
            Get the best experience
          </div>
          <div style={{ fontSize: '13px', color: '#8B95A8', lineHeight: 1.55 }}>
            Open this chat in Chrome to save it to your home screen and access it anytime
          </div>
        </div>

        {/* Open in Chrome */}
        <a
          href={chromeUrl}
          style={{
            display: 'block',
            background: '#AAFF00',
            color: '#080A0E',
            textAlign: 'center',
            padding: '14px',
            borderRadius: '10px',
            fontWeight: 700,
            fontSize: '15px',
            textDecoration: 'none',
            fontFamily: 'Outfit, sans-serif',
          }}
        >
          Open in Chrome
        </a>

        {/* Copy link */}
        <button
          onClick={copyLink}
          style={{
            display: 'block',
            width: '100%',
            background: 'transparent',
            color: copied ? '#AAFF00' : '#F0F0F0',
            border: '1px solid #2D3148',
            borderColor: copied ? '#AAFF00' : '#2D3148',
            textAlign: 'center',
            padding: '13px',
            borderRadius: '10px',
            fontWeight: 600,
            fontSize: '15px',
            cursor: 'pointer',
            fontFamily: 'Outfit, sans-serif',
            transition: 'color 0.15s, border-color 0.15s',
          }}
        >
          {copied ? '✓ Link copied!' : 'Copy link'}
        </button>

        {/* Dismiss */}
        <button
          onClick={dismiss}
          style={{
            background: 'none',
            border: 'none',
            color: '#6B7280',
            fontSize: '13px',
            cursor: 'pointer',
            textAlign: 'center',
            padding: '4px',
            fontFamily: 'DM Sans, sans-serif',
          }}
        >
          Continue in this browser →
        </button>
      </div>
    </>
  )
}
