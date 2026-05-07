import React from 'react'
import { Link } from 'react-router-dom'

export default function NotFound() {
  return (
    <div style={{ minHeight: '70vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '4rem 2rem', backgroundColor: '#faf7f4' }}>
      <p style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '10px', letterSpacing: '0.4em', textTransform: 'uppercase', color: '#c4a28a', margin: '0 0 20px' }}>404 · Page Not Found</p>
      <h1 style={{ fontFamily: '"Cormorant Garamond", Georgia, serif', fontSize: 'clamp(2.4rem, 6vw, 4rem)', fontWeight: 300, color: '#2c2c2c', margin: '0 0 16px', lineHeight: 1.2 }}>
        This page has left the building.
      </h1>
      <p style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '13px', color: '#8a7f7a', fontWeight: 300, lineHeight: 1.8, maxWidth: '420px', margin: '0 0 36px' }}>
        The page you're looking for doesn't exist or may have moved. Let's get you back to something beautiful.
      </p>
      <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', justifyContent: 'center' }}>
        <Link to="/" style={{ display: 'inline-block', backgroundColor: '#2c2c2c', color: '#fff', fontFamily: 'Montserrat, sans-serif', fontSize: '10px', letterSpacing: '0.25em', textTransform: 'uppercase', padding: '14px 32px', textDecoration: 'none' }}>
          Back to Shop
        </Link>
        <Link to="/about" style={{ display: 'inline-block', border: '1px solid #e0d8d0', color: '#2c2c2c', fontFamily: 'Montserrat, sans-serif', fontSize: '10px', letterSpacing: '0.25em', textTransform: 'uppercase', padding: '14px 32px', textDecoration: 'none' }}>
          Our Story
        </Link>
      </div>
    </div>
  )
}
