import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import Logo from './Logo'

const CHARCOAL = '#2c2c2c'
const BLUSH = '#c4a28a'
const WARM_GRAY = '#8a7f7a'

export default function Navbar({ cartCount, onCartOpen, onSearchOpen }) {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [shopOpen, setShopOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 60)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const shopLinks = ['New In', 'Work', 'Everyday', 'Luxe', 'Accessories', 'Sale']
  const leftLinks = [
    { label: 'New In', to: '/new-in' },
    { label: 'Shop', to: '/new-in', hasDropdown: true },
    { label: 'Collections', to: '/lookbook' },
  ]
  const rightLinks = [
    { label: 'Lookbook', to: '/lookbook' },
    { label: 'About', to: '/about' },
  ]

  const navLinkStyle = {
    fontFamily: 'Montserrat, sans-serif',
    fontSize: '11px',
    letterSpacing: '0.2em',
    textTransform: 'uppercase',
    color: CHARCOAL,
    textDecoration: 'none',
    fontWeight: 400,
    whiteSpace: 'nowrap',
    transition: 'color 0.2s ease',
    cursor: 'pointer',
    background: 'none',
    border: 'none',
    padding: 0,
  }

  return (
    <>
      <header style={{
        backgroundColor: '#faf7f4',
        boxShadow: scrolled ? '0 1px 16px rgba(0,0,0,0.07)' : 'none',
        transition: 'box-shadow 0.4s ease',
      }}>
        {/* Main nav row */}
        <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 2rem' }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            height: '88px',
            gap: '24px',
          }}>
            {/* Mobile: hamburger */}
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              style={{ ...navLinkStyle, display: 'none', letterSpacing: 0 }}
              className="mobile-menu-btn"
              aria-label="Menu"
            >
              <svg width="22" height="22" fill="none" stroke={CHARCOAL} viewBox="0 0 24 24">
                {menuOpen
                  ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12"/>
                  : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6h16M4 12h16M4 18h16"/>
                }
              </svg>
            </button>

            {/* Left nav links */}
            <nav style={{ display: 'flex', alignItems: 'center', gap: '32px', flex: 1 }} className="desktop-nav">
              {leftLinks.map(link => (
                <div
                  key={link.label}
                  style={{ position: 'relative' }}
                  onMouseEnter={() => link.hasDropdown && setShopOpen(true)}
                  onMouseLeave={() => link.hasDropdown && setShopOpen(false)}
                >
                  <Link
                    to={link.to}
                    style={navLinkStyle}
                    onMouseEnter={e => e.currentTarget.style.color = BLUSH}
                    onMouseLeave={e => e.currentTarget.style.color = CHARCOAL}
                  >
                    {link.label}
                  </Link>

                  {/* Shop dropdown */}
                  {link.hasDropdown && shopOpen && (
                    <div style={{
                      position: 'absolute',
                      top: '100%',
                      left: 0,
                      paddingTop: '16px',
                      zIndex: 100,
                    }}>
                      <div style={{
                        backgroundColor: '#fff',
                        boxShadow: '0 4px 24px rgba(0,0,0,0.08)',
                        border: '1px solid #e0d8d0',
                        padding: '16px 24px',
                        minWidth: '160px',
                      }}>
                        {shopLinks.map(s => (
                          <Link key={s} to="/new-in" style={{
                            display: 'block',
                            padding: '7px 0',
                            fontFamily: 'Montserrat, sans-serif',
                            fontSize: '11px',
                            letterSpacing: '0.2em',
                            textTransform: 'uppercase',
                            color: WARM_GRAY,
                            textDecoration: 'none',
                            transition: 'color 0.2s ease',
                          }}
                          onMouseEnter={e => e.currentTarget.style.color = CHARCOAL}
                          onMouseLeave={e => e.currentTarget.style.color = WARM_GRAY}
                          >
                            {s}
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </nav>

            {/* Logo — center */}
            <div style={{ flexShrink: 0 }}>
              <Logo size="sm" />
            </div>

            {/* Right nav links */}
            <nav style={{ display: 'flex', alignItems: 'center', gap: '32px', flex: 1, justifyContent: 'flex-end' }} className="desktop-nav">
              {rightLinks.map(link => (
                <Link key={link.label} to={link.to} style={navLinkStyle}
                  onMouseEnter={e => e.currentTarget.style.color = BLUSH}
                  onMouseLeave={e => e.currentTarget.style.color = CHARCOAL}
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            {/* Icon cluster */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '18px' }}>
              {/* Search */}
              <button
                onClick={onSearchOpen}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: CHARCOAL, padding: 0, transition: 'color 0.2s ease' }}
                onMouseEnter={e => e.currentTarget.style.color = BLUSH}
                onMouseLeave={e => e.currentTarget.style.color = CHARCOAL}
                aria-label="Search"
              >
                <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
                </svg>
              </button>

              {/* Account */}
              <button style={{ background: 'none', border: 'none', cursor: 'pointer', color: CHARCOAL, padding: 0, transition: 'color 0.2s ease' }}
                onMouseEnter={e => e.currentTarget.style.color = BLUSH}
                onMouseLeave={e => e.currentTarget.style.color = CHARCOAL}
                aria-label="Account"
                className="desktop-icon"
              >
                <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
                </svg>
              </button>

              {/* Cart */}
              <button
                onClick={onCartOpen}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: CHARCOAL, padding: 0, position: 'relative', transition: 'color 0.2s ease' }}
                onMouseEnter={e => e.currentTarget.style.color = BLUSH}
                onMouseLeave={e => e.currentTarget.style.color = CHARCOAL}
                aria-label="Cart"
              >
                <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"/>
                </svg>
                {cartCount > 0 && (
                  <span style={{
                    position: 'absolute', top: '-7px', right: '-7px',
                    backgroundColor: BLUSH, color: '#fff',
                    fontSize: '9px', fontFamily: 'Montserrat, sans-serif', fontWeight: 600,
                    width: '16px', height: '16px', borderRadius: '50%',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    {cartCount}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>

      </header>

      {/* Mobile menu overlay */}
      {menuOpen && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 40, backgroundColor: '#faf7f4',
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '28px',
        }}>
          <button onClick={() => setMenuOpen(false)} style={{ position: 'absolute', top: '24px', right: '24px', background: 'none', border: 'none', cursor: 'pointer' }}>
            <svg width="22" height="22" fill="none" stroke={CHARCOAL} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12"/>
            </svg>
          </button>
          <Logo size="sm" />
          {[...leftLinks, ...rightLinks].map(link => (
            <Link key={link.label} to={link.to} onClick={() => setMenuOpen(false)} style={{
              ...navLinkStyle, fontSize: '13px', letterSpacing: '0.3em',
            }}>
              {link.label}
            </Link>
          ))}
        </div>
      )}

      <style>{`
        @media (max-width: 768px) {
          .desktop-nav { display: none !important; }
          .desktop-icon { display: none !important; }
          .mobile-menu-btn { display: flex !important; }
        }
      `}</style>
    </>
  )
}
