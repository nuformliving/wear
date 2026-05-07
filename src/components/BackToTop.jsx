import React, { useState, useEffect } from 'react'

export default function BackToTop() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 400)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  if (!visible) return null

  return (
    <button
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      aria-label="Back to top"
      style={{
        position: 'fixed', bottom: '88px', right: '24px', zIndex: 998,
        width: '40px', height: '40px',
        backgroundColor: '#2c2c2c', color: '#fff',
        border: 'none', cursor: 'pointer',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        boxShadow: '0 2px 12px rgba(0,0,0,0.15)',
        transition: 'background-color 0.2s ease, transform 0.2s ease',
        opacity: visible ? 1 : 0,
      }}
      onMouseEnter={e => { e.currentTarget.style.backgroundColor = '#c4a28a'; e.currentTarget.style.transform = 'translateY(-2px)' }}
      onMouseLeave={e => { e.currentTarget.style.backgroundColor = '#2c2c2c'; e.currentTarget.style.transform = 'translateY(0)' }}
    >
      <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7"/>
      </svg>
    </button>
  )
}
