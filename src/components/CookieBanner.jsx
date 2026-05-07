import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'

export default function CookieBanner() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const accepted = localStorage.getItem('tbl_cookies_accepted')
    if (!accepted) {
      const timer = setTimeout(() => setVisible(true), 1500)
      return () => clearTimeout(timer)
    }
  }, [])

  const accept = () => {
    localStorage.setItem('tbl_cookies_accepted', '1')
    setVisible(false)
  }

  const decline = () => {
    localStorage.setItem('tbl_cookies_accepted', '0')
    setVisible(false)
  }

  if (!visible) return null

  return (
    <div
      role="dialog"
      aria-label="Cookie consent"
      style={{
        position: 'fixed', bottom: '24px', left: '24px', zIndex: 9999,
        backgroundColor: '#2c2c2c', color: '#fff',
        maxWidth: '420px', width: 'calc(100vw - 48px)',
        padding: '24px 28px',
        boxShadow: '0 8px 40px rgba(0,0,0,0.25)',
        animation: 'slideUpIn 0.4s ease',
      }}
    >
      <style>{`@keyframes slideUpIn { from { transform: translateY(20px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }`}</style>
      <p style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '10px', letterSpacing: '0.25em', textTransform: 'uppercase', color: '#c4a28a', margin: '0 0 8px' }}>
        🍪 Cookies
      </p>
      <p style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '12px', color: 'rgba(255,255,255,0.75)', lineHeight: 1.7, fontWeight: 300, margin: '0 0 20px' }}>
        We use cookies to enhance your shopping experience, personalise content, and analyse our traffic. By continuing, you agree to our{' '}
        <Link to="/" style={{ color: '#c4a28a', textDecoration: 'underline' }}>privacy policy</Link>.
      </p>
      <div style={{ display: 'flex', gap: '8px' }}>
        <button
          onClick={accept}
          style={{
            flex: 1, padding: '10px', backgroundColor: '#c4a28a', color: '#fff', border: 'none', cursor: 'pointer',
            fontFamily: 'Montserrat, sans-serif', fontSize: '9px', letterSpacing: '0.25em', textTransform: 'uppercase',
          }}
        >
          Accept All
        </button>
        <button
          onClick={decline}
          style={{
            flex: 1, padding: '10px', backgroundColor: 'transparent', color: 'rgba(255,255,255,0.55)', border: '1px solid rgba(255,255,255,0.15)', cursor: 'pointer',
            fontFamily: 'Montserrat, sans-serif', fontSize: '9px', letterSpacing: '0.25em', textTransform: 'uppercase',
          }}
        >
          Decline
        </button>
      </div>
    </div>
  )
}
