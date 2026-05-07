import React, { useState } from 'react'

const BLUSH = '#c4a28a'
const CHARCOAL = '#2c2c2c'
const WARM_GRAY = '#8a7f7a'

const categories = [
  {
    name: 'Work',
    desc: 'Power your nine to five',
    count: '22 pieces',
    img: '/uploads/category-work.jpg',
    href: '#',
    emoji: '💼',
  },
  {
    name: 'Everyday',
    desc: 'Ease for every moment',
    count: '34 pieces',
    img: '/uploads/category-everyday.jpg',
    href: '#',
    emoji: '🌿',
  },
  {
    name: 'Luxe',
    desc: 'Elevated evenings & occasions',
    count: '18 pieces',
    img: '/uploads/category-luxe.jpg',
    href: '#',
    emoji: '✨',
  },
  {
    name: 'Accessories',
    desc: 'The finishing touch',
    count: '28 pieces',
    img: '/uploads/category-accessories.png',
    href: '#',
    emoji: '👜',
  },
]

export default function CategorySection() {
  const [hovered, setHovered] = useState(null)

  return (
    <section style={{ padding: '80px 0', backgroundColor: '#faf7f4' }}>
      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 2rem' }}>

        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: '40px', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
              <span style={{ height: '1px', width: '28px', backgroundColor: BLUSH, display: 'block' }}/>
              <p style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '10px', letterSpacing: '0.35em', textTransform: 'uppercase', color: BLUSH, margin: 0, fontWeight: 500 }}>
                Shop by Style
              </p>
            </div>
            <h2 style={{ fontFamily: '"Cormorant Garamond", "Playfair Display", Georgia, serif', fontSize: 'clamp(1.8rem, 3vw, 2.8rem)', fontWeight: 300, color: CHARCOAL, margin: 0 }}>
              Work · Everyday · <em>Luxe</em>
            </h2>
          </div>
          <a href="#" style={{
            fontFamily: 'Montserrat, sans-serif', fontSize: '10px', letterSpacing: '0.3em',
            textTransform: 'uppercase', color: CHARCOAL, textDecoration: 'none',
            display: 'flex', alignItems: 'center', gap: '8px',
          }}>
            View All
            <svg width="16" height="16" fill="none" stroke={CHARCOAL} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 8l4 4m0 0l-4 4m4-4H3"/>
            </svg>
          </a>
        </div>

        {/* Grid — 3 equal + 1 wide feature on desktop */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
          gap: '12px',
        }}>
          {categories.map((cat) => (
            <a
              key={cat.name}
              href={cat.href}
              onMouseEnter={() => setHovered(cat.name)}
              onMouseLeave={() => setHovered(null)}
              style={{
                position: 'relative',
                overflow: 'hidden',
                aspectRatio: '3/4',
                display: 'block',
                textDecoration: 'none',
              }}
            >
              <img
                src={cat.img}
                alt={cat.name}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  display: 'block',
                  transform: hovered === cat.name ? 'scale(1.05)' : 'scale(1)',
                  transition: 'transform 0.7s ease',
                }}
              />
              {/* Gradient overlay */}
              <div style={{
                position: 'absolute', inset: 0,
                background: 'linear-gradient(to top, rgba(44,44,44,0.7) 0%, rgba(44,44,44,0.1) 50%, transparent 100%)',
              }}/>
              {/* Text */}
              <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '24px 20px' }}>
                <p style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '9px', letterSpacing: '0.3em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.6)', margin: '0 0 6px' }}>
                  {cat.count}
                </p>
                <h3 style={{ fontFamily: '"Cormorant Garamond", Georgia, serif', fontSize: '22px', color: '#fff', fontWeight: 400, margin: '0 0 4px' }}>
                  {cat.name}
                </h3>
                <p style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '11px', color: 'rgba(255,255,255,0.55)', margin: 0, fontWeight: 300 }}>
                  {cat.desc}
                </p>
              </div>
              {/* Hover arrow */}
              <div style={{
                position: 'absolute', top: '16px', right: '16px',
                width: '32px', height: '32px', borderRadius: '50%',
                backgroundColor: hovered === cat.name ? 'rgba(255,255,255,0.95)' : 'rgba(255,255,255,0)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                transition: 'background-color 0.3s ease',
              }}>
                <svg width="12" height="12" fill="none" stroke={CHARCOAL} viewBox="0 0 24 24"
                  style={{ opacity: hovered === cat.name ? 1 : 0, transition: 'opacity 0.3s ease' }}>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7"/>
                </svg>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  )
}
