import React, { useState } from 'react'
import PageLayout from '../components/PageLayout'

const seasons = ['All', 'Work', 'Everyday', 'Luxe']

const lookbookImages = [
  {
    id: 1, category: 'Work',
    src: 'https://images.unsplash.com/photo-1548690312-e3b507d8c110?w=700&q=80',
    title: 'The Power Suit', caption: 'Structured blazer · High-waist trouser · Work Collection',
  },
  {
    id: 2, category: 'Everyday',
    src: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=700&q=80',
    title: 'Effortless Sunday', caption: 'Relaxed linen set · Everyday Collection',
  },
  {
    id: 3, category: 'Luxe',
    src: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=700&q=80',
    title: 'Golden Hour', caption: 'Draped midi dress · Luxe Collection',
  },
  {
    id: 4, category: 'Work',
    src: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=700&q=80',
    title: 'Boardroom Ready', caption: 'Tailored dress · Pencil cut · Work Collection',
  },
  {
    id: 5, category: 'Luxe',
    src: 'https://images.unsplash.com/photo-1581044777550-4cfa60707c03?w=700&q=80',
    title: 'Evening Edit', caption: 'Silk-touch gown · Luxe Collection',
  },
  {
    id: 6, category: 'Everyday',
    src: 'https://images.unsplash.com/photo-1544441893-675973e31985?w=700&q=80',
    title: 'Market Day', caption: 'Printed co-ord · Everyday Collection',
  },
  {
    id: 7, category: 'Work',
    src: 'https://images.unsplash.com/photo-1551803091-e20673f15770?w=700&q=80',
    title: 'The Shift Dress', caption: 'Clean-cut shift · Work Collection',
  },
  {
    id: 8, category: 'Everyday',
    src: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=700&q=80',
    title: 'Weekend Uniform', caption: 'Cropped jacket · Wide-leg trousers · Everyday Collection',
  },
  {
    id: 9, category: 'Luxe',
    src: 'https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=700&q=80',
    title: 'The Statement', caption: 'Off-shoulder gown · Luxe Collection',
  },
]

export default function LookbookPage() {
  const [active, setActive] = useState('All')
  const [lightbox, setLightbox] = useState(null)

  const filtered = active === 'All' ? lookbookImages : lookbookImages.filter(img => img.category === active)

  return (
    <div style={{ backgroundColor: '#faf7f4', minHeight: '60vh' }}>
      {/* Hero */}
      <div style={{ backgroundColor: '#2c2c2c', padding: '72px 2rem 56px', textAlign: 'center' }}>
        <div style={{ maxWidth: '680px', margin: '0 auto' }}>
          <p style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '10px', letterSpacing: '0.4em', textTransform: 'uppercase', color: '#c4a28a', margin: '0 0 16px' }}>
            The Beeive Label
          </p>
          <h1 style={{
            fontFamily: '"Cormorant Garamond", "Playfair Display", Georgia, serif',
            fontSize: 'clamp(2.2rem, 5vw, 3.6rem)',
            fontWeight: 300,
            color: '#fff',
            margin: '0 0 16px',
            lineHeight: 1.15,
          }}>
            Lookbook
          </h1>
          <p style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '13px', color: 'rgba(255,255,255,0.5)', lineHeight: 1.8, fontWeight: 300, margin: 0 }}>
            Style for every version of you — Work · Everyday · Luxe
          </p>
        </div>
      </div>

      {/* Season filter */}
      <div style={{ borderBottom: '1px solid #e0d8d0', backgroundColor: '#faf7f4', position: 'sticky', top: 0, zIndex: 10 }}>
        <div style={{ maxWidth: '900px', margin: '0 auto', padding: '0 2rem', display: 'flex', gap: '0', overflowX: 'auto' }}>
          {seasons.map(s => (
            <button
              key={s}
              onClick={() => setActive(s)}
              style={{
                fontFamily: 'Montserrat, sans-serif',
                fontSize: '10px',
                letterSpacing: '0.25em',
                textTransform: 'uppercase',
                color: active === s ? '#2c2c2c' : '#8a7f7a',
                backgroundColor: 'transparent',
                border: 'none',
                borderBottom: active === s ? '2px solid #2c2c2c' : '2px solid transparent',
                padding: '18px 24px',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                whiteSpace: 'nowrap',
              }}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Gallery grid */}
      <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '48px 2rem 80px' }}>
        <div style={{
          columns: '3 280px',
          columnGap: '16px',
        }}>
          {filtered.map(img => (
            <div
              key={img.id}
              onClick={() => setLightbox(img)}
              style={{
                breakInside: 'avoid',
                marginBottom: '16px',
                cursor: 'pointer',
                overflow: 'hidden',
                position: 'relative',
                backgroundColor: '#e0d8d0',
              }}
              onMouseEnter={e => {
                e.currentTarget.querySelector('.lb-overlay').style.opacity = '1'
              }}
              onMouseLeave={e => {
                e.currentTarget.querySelector('.lb-overlay').style.opacity = '0'
              }}
            >
              <img
                src={img.src}
                alt={img.title}
                loading="lazy"
                style={{ width: '100%', display: 'block', transition: 'transform 0.5s ease' }}
                onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.03)'}
                onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
              />
              <div className="lb-overlay" style={{
                position: 'absolute', inset: 0,
                backgroundColor: 'rgba(44,44,44,0.55)',
                display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-end',
                padding: '24px',
                opacity: 0,
                transition: 'opacity 0.3s ease',
              }}>
                <p style={{ fontFamily: '"Cormorant Garamond", serif', fontSize: '1.2rem', color: '#fff', margin: '0 0 4px', fontWeight: 300 }}>{img.title}</p>
                <p style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '10px', letterSpacing: '0.1em', color: 'rgba(255,255,255,0.7)', margin: 0, textAlign: 'center' }}>{img.caption}</p>
              </div>
              {/* Category tag */}
              <span style={{
                position: 'absolute', top: '12px', left: '12px',
                fontFamily: 'Montserrat, sans-serif', fontSize: '9px', letterSpacing: '0.2em', textTransform: 'uppercase',
                backgroundColor: '#c4a28a', color: '#fff', padding: '4px 10px',
              }}>
                {img.category}
              </span>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div style={{ textAlign: 'center', marginTop: '48px', paddingTop: '48px', borderTop: '1px solid #e0d8d0' }}>
          <p style={{ fontFamily: '"Cormorant Garamond", serif', fontSize: '1.6rem', color: '#2c2c2c', fontWeight: 300, margin: '0 0 8px' }}>
            See something you love?
          </p>
          <p style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '12px', color: '#8a7f7a', margin: '0 0 24px', fontWeight: 300 }}>
            Shop the full collection — every piece is available now.
          </p>
          <a href="/" style={{ display: 'inline-block', backgroundColor: '#2c2c2c', color: '#fff', fontFamily: 'Montserrat, sans-serif', fontSize: '10px', letterSpacing: '0.25em', textTransform: 'uppercase', padding: '15px 40px', textDecoration: 'none' }}>
            Shop Now
          </a>
        </div>
      </div>

      {/* Lightbox */}
      {lightbox && (
        <div
          onClick={() => setLightbox(null)}
          style={{
            position: 'fixed', inset: 0, zIndex: 999,
            backgroundColor: 'rgba(0,0,0,0.88)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            padding: '24px',
          }}
        >
          <div onClick={e => e.stopPropagation()} style={{ maxWidth: '640px', width: '100%', position: 'relative' }}>
            <button
              onClick={() => setLightbox(null)}
              style={{
                position: 'absolute', top: '-40px', right: 0,
                background: 'none', border: 'none', cursor: 'pointer',
                color: '#fff', fontFamily: 'Montserrat, sans-serif', fontSize: '10px', letterSpacing: '0.2em',
              }}
            >
              CLOSE ✕
            </button>
            <img src={lightbox.src} alt={lightbox.title} style={{ width: '100%', display: 'block', maxHeight: '80vh', objectFit: 'contain' }}/>
            <div style={{ backgroundColor: '#2c2c2c', padding: '16px 20px' }}>
              <p style={{ fontFamily: '"Cormorant Garamond", serif', fontSize: '1.2rem', color: '#fff', margin: '0 0 4px', fontWeight: 300 }}>{lightbox.title}</p>
              <p style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '10px', color: 'rgba(255,255,255,0.5)', margin: 0, letterSpacing: '0.1em' }}>{lightbox.caption}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
