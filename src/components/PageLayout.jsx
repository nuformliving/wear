import React from 'react'
import { Link } from 'react-router-dom'


const C = {
  charcoal: '#2c2c2c',
  blush: '#c4a28a',
  cream: '#faf7f4',
  warmGray: '#8a7f7a',
  border: '#e0d8d0',
}

export default function PageLayout({ title, subtitle, breadcrumb, children, hero = true }) {
  return (
    <div style={{ backgroundColor: C.cream, minHeight: '60vh' }}>
      {/* Hero header */}
      {hero && (
        <div style={{
          backgroundColor: '#f0ebe4',
          borderBottom: `1px solid ${C.border}`,
          padding: '56px 2rem 48px',
          textAlign: 'center',
        }}>
          <div style={{ maxWidth: '680px', margin: '0 auto' }}>
            {/* Breadcrumb */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginBottom: '20px' }}>
              <Link to="/" style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '10px', letterSpacing: '0.25em', textTransform: 'uppercase', color: C.warmGray, textDecoration: 'none' }}>
                Home
              </Link>
              <span style={{ color: C.border, fontSize: '12px' }}>›</span>
              <span style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '10px', letterSpacing: '0.25em', textTransform: 'uppercase', color: C.blush }}>
                {breadcrumb || title}
              </span>
            </div>

            <h1 style={{
              fontFamily: '"Cormorant Garamond", "Playfair Display", Georgia, serif',
              fontSize: 'clamp(2rem, 5vw, 3.2rem)',
              fontWeight: 300,
              color: C.charcoal,
              margin: '0 0 14px',
              lineHeight: 1.2,
            }}>
              {title}
            </h1>
            {subtitle && (
              <p style={{
                fontFamily: 'Montserrat, sans-serif',
                fontSize: '13px',
                color: C.warmGray,
                lineHeight: 1.8,
                fontWeight: 300,
                margin: 0,
              }}>
                {subtitle}
              </p>
            )}
          </div>
        </div>
      )}

      {/* Page content */}
      <div style={{ maxWidth: '900px', margin: '0 auto', padding: '56px 2rem 80px' }}>
        {children}
      </div>
    </div>
  )
}

// Reusable section heading
export function SectionHeading({ children }) {
  return (
    <h2 style={{
      fontFamily: '"Cormorant Garamond", Georgia, serif',
      fontSize: '1.7rem',
      fontWeight: 400,
      color: '#2c2c2c',
      margin: '48px 0 16px',
      paddingBottom: '10px',
      borderBottom: '1px solid #e0d8d0',
    }}>
      {children}
    </h2>
  )
}

// Reusable body text
export function BodyText({ children, style = {} }) {
  return (
    <p style={{
      fontFamily: 'Montserrat, sans-serif',
      fontSize: '13.5px',
      color: '#5a5550',
      lineHeight: 1.9,
      fontWeight: 300,
      margin: '0 0 16px',
      ...style,
    }}>
      {children}
    </p>
  )
}

// Info card / highlight box
export function InfoCard({ icon, title, children }) {
  return (
    <div style={{
      backgroundColor: '#fff',
      border: '1px solid #e0d8d0',
      padding: '24px',
      display: 'flex',
      gap: '16px',
      marginBottom: '16px',
    }}>
      {icon && <span style={{ fontSize: '22px', flexShrink: 0, marginTop: '2px' }}>{icon}</span>}
      <div>
        {title && <p style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '12px', fontWeight: 600, letterSpacing: '0.15em', textTransform: 'uppercase', color: '#2c2c2c', margin: '0 0 6px' }}>{title}</p>}
        <p style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '13px', color: '#5a5550', lineHeight: 1.8, fontWeight: 300, margin: 0 }}>{children}</p>
      </div>
    </div>
  )
}

// Table row
export function TableRow({ label, value, highlight }) {
  return (
    <div style={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '12px 16px',
      backgroundColor: highlight ? '#f8f4f0' : '#fff',
      borderBottom: '1px solid #e0d8d0',
    }}>
      <span style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '12px', color: '#8a7f7a', fontWeight: 400 }}>{label}</span>
      <span style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '13px', color: '#2c2c2c', fontWeight: 500 }}>{value}</span>
    </div>
  )
}
