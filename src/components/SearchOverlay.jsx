import React, { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { formatPrice } from '../data/products'

const C = { charcoal: '#2c2c2c', blush: '#c4a28a', warmGray: '#8a7f7a', border: '#e0d8d0', cream: '#faf7f4' }

const suggestions = ['Work dresses', 'Blazer sets', 'Luxe gowns', 'Everyday midi', 'Co-ords', 'Jumpsuits']

export default function SearchOverlay({ open, onClose, products = [] }) {
  const [query, setQuery] = useState('')
  const inputRef = useRef(null)

  useEffect(() => {
    if (open) { setQuery(''); setTimeout(() => inputRef.current?.focus(), 80) }
  }, [open])

  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') onClose() }
    if (open) window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [open, onClose])

  const results = query.trim().length > 1
    ? products.filter(p =>
        p.name.toLowerCase().includes(query.toLowerCase()) ||
        p.category.toLowerCase().includes(query.toLowerCase())
      )
    : []

  if (!open) return null

  return (
    <div
      onClick={onClose}
      style={{ position: 'fixed', inset: 0, zIndex: 200, backgroundColor: 'rgba(44,44,44,0.5)', backdropFilter: 'blur(4px)' }}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{
          position: 'absolute', top: 0, left: 0, right: 0,
          backgroundColor: '#fff',
          boxShadow: '0 4px 32px rgba(0,0,0,0.1)',
          padding: '24px 2rem',
          maxHeight: '80vh',
          overflowY: 'auto',
        }}
      >
        <div style={{ maxWidth: '680px', margin: '0 auto' }}>
          {/* Input row */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', borderBottom: `2px solid ${C.charcoal}`, paddingBottom: '12px', marginBottom: '28px' }}>
            <svg width="18" height="18" fill="none" stroke={C.warmGray} viewBox="0 0 24 24" style={{ flexShrink: 0 }}>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
            </svg>
            <input
              ref={inputRef}
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="Search for pieces, styles, occasions..."
              style={{
                flex: 1, border: 'none', outline: 'none', background: 'transparent',
                fontFamily: 'Montserrat, sans-serif', fontSize: '16px', color: C.charcoal,
                letterSpacing: '0.02em',
              }}
            />
            {query && (
              <button onClick={() => setQuery('')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: C.warmGray, padding: 0 }}>
                <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12"/>
                </svg>
              </button>
            )}
            <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'Montserrat, sans-serif', fontSize: '9px', letterSpacing: '0.25em', textTransform: 'uppercase', color: C.warmGray, whiteSpace: 'nowrap', paddingLeft: '12px', borderLeft: `1px solid ${C.border}` }}>
              Close
            </button>
          </div>

          {/* No query — show suggestions */}
          {!query.trim() && (
            <div>
              <p style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '9px', letterSpacing: '0.3em', textTransform: 'uppercase', color: C.warmGray, margin: '0 0 14px' }}>Popular Searches</p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {suggestions.map(s => (
                  <button
                    key={s}
                    onClick={() => setQuery(s)}
                    style={{
                      fontFamily: 'Montserrat, sans-serif', fontSize: '11px', color: C.charcoal,
                      backgroundColor: C.cream, border: `1px solid ${C.border}`, padding: '8px 16px', cursor: 'pointer',
                      transition: 'border-color 0.15s ease',
                    }}
                    onMouseEnter={e => e.currentTarget.style.borderColor = C.charcoal}
                    onMouseLeave={e => e.currentTarget.style.borderColor = C.border}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Results */}
          {query.trim().length > 1 && (
            <div>
              <p style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '9px', letterSpacing: '0.3em', textTransform: 'uppercase', color: C.warmGray, margin: '0 0 16px' }}>
                {results.length} result{results.length !== 1 ? 's' : ''} for "{query}"
              </p>
              {results.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '32px 0' }}>
                  <p style={{ fontFamily: '"Cormorant Garamond", serif', fontSize: '1.4rem', color: C.charcoal, fontWeight: 300, margin: '0 0 8px' }}>Nothing found for "{query}"</p>
                  <p style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '12px', color: C.warmGray, fontWeight: 300, margin: 0 }}>Try a different search — or browse all collections.</p>
                </div>
              ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '20px' }}>
                  {results.map(p => (
                    <Link key={p.id} to={`/product/${p.id}`} onClick={onClose} style={{ textDecoration: 'none', color: 'inherit' }}>
                      <div
                        style={{ cursor: 'pointer' }}
                        onMouseEnter={e => e.currentTarget.querySelector('img').style.transform = 'scale(1.04)'}
                        onMouseLeave={e => e.currentTarget.querySelector('img').style.transform = 'scale(1)'}
                      >
                        <div style={{ aspectRatio: '3/4', overflow: 'hidden', backgroundColor: '#f5f0eb' }}>
                          <img src={p.img} alt={p.name} style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.4s ease' }}/>
                        </div>
                        <div style={{ marginTop: '8px' }}>
                          <p style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '9px', letterSpacing: '0.2em', textTransform: 'uppercase', color: C.blush, margin: '0 0 3px' }}>{p.category}</p>
                          <p style={{ fontFamily: '"Cormorant Garamond", serif', fontSize: '1rem', color: C.charcoal, margin: '0 0 4px', fontWeight: 300 }}>{p.name}</p>
                          <p style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '11px', color: C.charcoal, fontWeight: 500, margin: 0 }}>{formatPrice(p.price)}</p>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
