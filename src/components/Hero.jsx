import React, { useState, useEffect } from 'react'

const slides = [
  {
    id: 1,
    bg: '#e8ddd5',
    heading: 'For the Confident Woman',
    subheading: 'New Collection',
    tagline: 'Ready-to-wear pieces designed for every version of you — Work. Everyday. Luxe.',
    cta: 'Shop the Collection',
    imgUrl: '/uploads/hero-luxe-edit.jpg',
    align: 'left',
    floatLabel: 'Luxe Edit',
  },
  {
    id: 2,
    bg: '#d4c9bf',
    heading: 'Designed in Lagos',
    subheading: 'Work Wear',
    tagline: 'Polished silhouettes that take you from the boardroom to after-hours with ease.',
    cta: 'Shop Work',
    imgUrl: '/uploads/hero-work-wear.jpg',
    align: 'right',
    floatLabel: 'Work Wear',
  },
  {
    id: 3,
    bg: '#ece4db',
    heading: 'Everyday Luxury',
    subheading: 'Everyday Wear',
    tagline: 'Effortless pieces that move with your life — relaxed, refined and always you.',
    cta: 'Shop Everyday',
    imgUrl: '/uploads/hero-slide-3.jpeg',
    align: 'left',
    floatLabel: 'Everyday',
  },
]

const BLUSH = '#c4a28a'
const CHARCOAL = '#2c2c2c'
const WARM_GRAY = '#8a7f7a'

export default function Hero() {
  const [current, setCurrent] = useState(0)
  const [transitioning, setTransitioning] = useState(false)

  useEffect(() => {
    const timer = setInterval(() => goNext(), 5500)
    return () => clearInterval(timer)
  }, [current])

  const goNext = () => {
    if (transitioning) return
    setTransitioning(true)
    setTimeout(() => { setCurrent(p => (p + 1) % slides.length); setTransitioning(false) }, 400)
  }

  const goPrev = () => {
    if (transitioning) return
    setTransitioning(true)
    setTimeout(() => { setCurrent(p => (p - 1 + slides.length) % slides.length); setTransitioning(false) }, 400)
  }

  const slide = slides[current]

  return (
    <section style={{ backgroundColor: slide.bg, transition: 'background-color 0.7s ease', position: 'relative', overflow: 'hidden' }}>
      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 2rem', opacity: transitioning ? 0 : 1, transition: 'opacity 0.4s ease' }}>
        <div style={{
          display: 'flex',
          flexDirection: 'row',
          flexWrap: 'wrap',
          alignItems: 'center',
          minHeight: '88vh',
          gap: '2rem',
        }}>

          {/* Text side */}
          <div style={{
            flex: '1 1 340px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            padding: '4rem 0',
            order: slide.align === 'right' ? 2 : 1,
            zIndex: 2,
          }}>
            {/* Sub label with bee */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '18px' }}>
              <span style={{ height: '1px', width: '32px', backgroundColor: BLUSH, display: 'block' }}/>
              <p style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '10px', letterSpacing: '0.35em', textTransform: 'uppercase', color: BLUSH, fontWeight: 500, margin: 0 }}>
                {slide.subheading}
              </p>
            </div>

            {/* Heading */}
            <h1 style={{
              fontFamily: '"Cormorant Garamond", "Playfair Display", Georgia, serif',
              fontSize: 'clamp(2.8rem, 5vw, 5rem)',
              fontWeight: 300,
              color: CHARCOAL,
              lineHeight: 1.1,
              marginBottom: '20px',
              margin: '0 0 20px',
            }}>
              {slide.heading.split(' ').map((word, i) => (
                <span key={i} style={{ fontStyle: i === 1 || i === 3 ? 'italic' : 'normal' }}>{word} </span>
              ))}
            </h1>

            {/* Tagline */}
            <p style={{
              fontFamily: 'Montserrat, sans-serif',
              fontSize: '13px',
              color: WARM_GRAY,
              lineHeight: 1.7,
              fontWeight: 300,
              maxWidth: '320px',
              marginBottom: '36px',
            }}>
              {slide.tagline}
            </p>

            {/* Category pills */}
            <div style={{ display: 'flex', gap: '8px', marginBottom: '32px', flexWrap: 'wrap' }}>
              {['Work', 'Everyday', 'Luxe'].map(cat => (
                <a key={cat} href="#" style={{
                  fontFamily: 'Montserrat, sans-serif',
                  fontSize: '10px',
                  letterSpacing: '0.25em',
                  textTransform: 'uppercase',
                  color: WARM_GRAY,
                  border: `1px solid ${WARM_GRAY}40`,
                  padding: '6px 14px',
                  textDecoration: 'none',
                  transition: 'all 0.25s ease',
                }}>
                  {cat}
                </a>
              ))}
            </div>

            {/* CTAs */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '24px', flexWrap: 'wrap' }}>
              <a href="#" style={{
                backgroundColor: CHARCOAL,
                color: '#fff',
                fontFamily: 'Montserrat, sans-serif',
                fontSize: '11px',
                letterSpacing: '0.3em',
                textTransform: 'uppercase',
                padding: '14px 32px',
                textDecoration: 'none',
                fontWeight: 500,
                display: 'inline-block',
              }}>
                {slide.cta}
              </a>
              <a href="#lookbook" style={{
                fontFamily: 'Montserrat, sans-serif',
                fontSize: '11px',
                letterSpacing: '0.25em',
                textTransform: 'uppercase',
                color: CHARCOAL,
                textDecoration: 'none',
                borderBottom: `1px solid ${CHARCOAL}`,
                paddingBottom: '2px',
              }}>
                View Lookbook
              </a>
            </div>
          </div>

          {/* Image side */}
          <div style={{
            flex: '1 1 380px',
            height: 'clamp(400px, 75vh, 700px)',
            position: 'relative',
            order: slide.align === 'right' ? 1 : 2,
          }}>
            <img
              src={slide.imgUrl}
              alt={slide.heading}
              style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'top', display: 'block' }}
            />
            {/* Floating badge */}
            <div style={{
              position: 'absolute',
              bottom: '28px',
              left: '20px',
              backgroundColor: 'rgba(255,255,255,0.92)',
              backdropFilter: 'blur(8px)',
              padding: '14px 20px',
              boxShadow: '0 2px 16px rgba(0,0,0,0.08)',
            }}>
              <p style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '9px', letterSpacing: '0.3em', textTransform: 'uppercase', color: WARM_GRAY, margin: '0 0 4px' }}>
                🐝 Designed in Lagos
              </p>
              <p style={{ fontFamily: '"Cormorant Garamond", Georgia, serif', fontSize: '16px', color: CHARCOAL, margin: 0, fontWeight: 400 }}>
                {slide.floatLabel}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Dots */}
      <div style={{ position: 'absolute', bottom: '28px', left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: '10px', zIndex: 10 }}>
        {slides.map((_, i) => (
          <button key={i} onClick={() => setCurrent(i)} style={{
            border: 'none', cursor: 'pointer', padding: 0, borderRadius: '99px',
            width: i === current ? '28px' : '6px', height: '6px',
            backgroundColor: i === current ? CHARCOAL : `${WARM_GRAY}60`,
            transition: 'all 0.3s ease',
          }}/>
        ))}
      </div>

      {/* Arrows */}
      {[
        { dir: 'prev', onClick: goPrev, style: { left: '16px' }, icon: 'M15 19l-7-7 7-7' },
        { dir: 'next', onClick: goNext, style: { right: '16px' }, icon: 'M9 5l7 7-7 7' },
      ].map(btn => (
        <button key={btn.dir} onClick={btn.onClick} style={{
          position: 'absolute', top: '50%', transform: 'translateY(-50%)', ...btn.style,
          width: '40px', height: '40px', backgroundColor: 'rgba(255,255,255,0.65)',
          border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
          zIndex: 10, transition: 'background-color 0.2s ease',
        }}>
          <svg width="16" height="16" fill="none" stroke={CHARCOAL} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={btn.icon} />
          </svg>
        </button>
      ))}
    </section>
  )
}
