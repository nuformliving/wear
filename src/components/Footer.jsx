import React from 'react'
import { Link } from 'react-router-dom'
import Logo from './Logo'

const BLUSH = '#c4a28a'
const CHARCOAL = '#2c2c2c'

const footerLinks = {
  'Shop': [
    { label: 'New In', to: '/' },
    { label: 'Work', to: '/' },
    { label: 'Everyday', to: '/' },
    { label: 'Luxe', to: '/' },
    { label: 'Accessories', to: '/' },
    { label: 'Sale', to: '/' },
  ],
  'Help': [
    { label: 'Size Guide', to: '/size-guide' },
    { label: 'Shipping & Delivery', to: '/shipping' },
    { label: 'Returns & Exchanges', to: '/returns' },
    { label: 'FAQ', to: '/faq' },
    { label: 'Track Your Order', to: '/track-order' },
  ],
  'Brand': [
    { label: 'About Us', to: '/about' },
    { label: 'Our Story', to: '/our-story' },
    { label: 'Lookbook', to: '/lookbook' },
    { label: 'Press', to: '/press' },
    { label: 'Sustainability', to: '/sustainability' },
  ],
}

const socials = [
  {
    name: 'Instagram',
    href: 'https://www.instagram.com/thebeeivelabel/',
    path: 'M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z',
  },
  {
    name: 'WhatsApp',
    href: 'https://wa.me/2349013019836',
    path: 'M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z',
  },
]

const features = [
  { icon: '🐝', title: 'Designed in Lagos', desc: 'Made for the confident woman' },
  { icon: '↩', title: 'Easy Returns', desc: '14-day return policy' },
  { icon: '✦', title: 'Premium Quality', desc: 'Crafted with intention' },
  { icon: '★', title: 'Loyalty Rewards', desc: 'Earn on every purchase' },
]

export default function Footer() {
  return (
    <footer style={{ backgroundColor: CHARCOAL, color: '#fff' }}>

      {/* Features bar */}
      <div style={{ borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '32px 2rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '24px' }}>
            {features.map(f => (
              <div key={f.title} style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                <span style={{ fontSize: '16px', marginTop: '1px' }}>{f.icon}</span>
                <div>
                  <p style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '11px', letterSpacing: '0.15em', textTransform: 'uppercase', fontWeight: 500, color: '#fff', margin: '0 0 3px' }}>
                    {f.title}
                  </p>
                  <p style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '11px', color: 'rgba(255,255,255,0.35)', margin: 0 }}>
                    {f.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main footer content */}
      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '64px 2rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '40px' }}>

          {/* Brand column */}
          <div style={{ gridColumn: 'span 2' }}>
            <div style={{ marginBottom: '20px' }}>
              <Logo size="sm" dark={true} />
            </div>
            <p style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '13px', color: 'rgba(255,255,255,0.45)', lineHeight: 1.8, fontWeight: 300, maxWidth: '280px', margin: '0 0 20px' }}>
              Ready-to-Wear for confident women.<br/>
              Work · Everyday · Luxe<br/>
              Designed in Lagos 🐝
            </p>
            {/* Social links */}
            <div style={{ display: 'flex', gap: '16px' }}>
              {socials.map(s => (
                <a key={s.name} href={s.href} target="_blank" rel="noopener noreferrer" aria-label={s.name} style={{ color: 'rgba(255,255,255,0.35)', transition: 'color 0.2s ease', textDecoration: 'none' }}
                  onMouseEnter={e => e.currentTarget.style.color = BLUSH}
                  onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.35)'}>
                  <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24">
                    <path d={s.path}/>
                  </svg>
                </a>
              ))}
            </div>
          </div>

          {/* Link columns */}
          {Object.entries(footerLinks).map(([group, links]) => (
            <div key={group}>
              <h4 style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '10px', letterSpacing: '0.3em', textTransform: 'uppercase', color: '#fff', fontWeight: 500, margin: '0 0 20px' }}>
                {group}
              </h4>
              <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {links.map(link => (
                  <li key={link.label}>
                    <Link to={link.to}
                      style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '12px', color: 'rgba(255,255,255,0.38)', textDecoration: 'none', transition: 'color 0.2s ease' }}
                      onMouseEnter={e => e.currentTarget.style.color = '#fff'}
                      onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.38)'}>
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom bar */}
      <div style={{ borderTop: '1px solid rgba(255,255,255,0.08)' }}>
        <div style={{
          maxWidth: '1280px', margin: '0 auto', padding: '20px 2rem',
          display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '12px',
        }}>
          <p style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '11px', color: 'rgba(255,255,255,0.25)', margin: 0 }}>
            © {new Date().getFullYear()} The Beeive Label. All rights reserved.
          </p>
          <div style={{ display: 'flex', gap: '20px' }}>
            {['Privacy Policy', 'Terms of Service', 'Cookie Policy'].map(link => (
              <a key={link} href="#"
                style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '11px', color: 'rgba(255,255,255,0.25)', textDecoration: 'none' }}
                onMouseEnter={e => e.currentTarget.style.color = 'rgba(255,255,255,0.55)'}
                onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.25)'}>
                {link}
              </a>
            ))}
          </div>
          <div style={{ display: 'flex', gap: '6px' }}>
            {['Visa', 'Mastercard', 'PayStack', 'Flutterwave'].map(p => (
              <span key={p} style={{
                fontFamily: 'Montserrat, sans-serif', fontSize: '9px', letterSpacing: '0.1em',
                backgroundColor: 'rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.35)',
                padding: '4px 8px',
              }}>
                {p}
              </span>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}
