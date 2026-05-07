import React from 'react'
import { Link } from 'react-router-dom'
import PageLayout, { SectionHeading, BodyText } from '../components/PageLayout'

export default function About() {
  return (
    <PageLayout title="About Us" subtitle="Crafting confidence, one piece at a time." breadcrumb="About Us">

      {/* Mission statement */}
      <div style={{ backgroundColor: '#2c2c2c', padding: '40px', textAlign: 'center', marginBottom: '48px' }}>
        <p style={{ fontFamily: '"Cormorant Garamond", Georgia, serif', fontSize: 'clamp(1.3rem, 3vw, 1.8rem)', color: '#fff', fontWeight: 300, lineHeight: 1.7, fontStyle: 'italic', margin: 0, maxWidth: '600px', marginLeft: 'auto', marginRight: 'auto' }}>
          "We believe every woman deserves to dress with intention — pieces that move with her life, honour her story, and announce her presence before she speaks."
        </p>
        <p style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '11px', letterSpacing: '0.3em', textTransform: 'uppercase', color: '#c4a28a', margin: '20px 0 0' }}>
          — The Beeive Label
        </p>
      </div>

      {/* Who we are */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '40px', alignItems: 'center', marginBottom: '48px' }}>
        <div>
          <p style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '10px', letterSpacing: '0.4em', textTransform: 'uppercase', color: '#c4a28a', margin: '0 0 14px' }}>Who We Are</p>
          <h2 style={{ fontFamily: '"Cormorant Garamond", serif', fontSize: '2rem', color: '#2c2c2c', fontWeight: 300, margin: '0 0 20px', lineHeight: 1.3 }}>
            A Lagos-Born Label for the Confident Woman
          </h2>
          <BodyText>The Beeive Label is a Ready-to-Wear fashion brand designed in Lagos, Nigeria, for women who live purposefully and dress accordingly. We create contemporary, thoughtfully crafted pieces that span three distinct worlds: the polished demands of the workplace, the ease of everyday life, and the elevated moments that call for something special.</BodyText>
          <BodyText>Founded with the belief that style is a form of self-expression — not a luxury reserved for a few — The Beeive Label makes fashion that is accessible, beautiful, and made to last.</BodyText>
        </div>
        <div style={{ aspectRatio: '4/5', overflow: 'hidden' }}>
          <img src="https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=700&q=80" alt="The Beeive Label Studio" style={{ width: '100%', height: '100%', objectFit: 'cover' }}/>
        </div>
      </div>

      <SectionHeading>What We Stand For</SectionHeading>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px', marginBottom: '40px' }}>
        {[
          { icon: '🐝', title: 'Community', desc: 'We are more than a brand — we are a community of women who celebrate each other. Every purchase supports a local business and the vision of an African woman building something remarkable.' },
          { icon: '✦', title: 'Quality', desc: 'Every piece in our collection is held to a rigorous standard of craftsmanship. We use premium fabrics and construction techniques that ensure each item feels as good as it looks.' },
          { icon: '♦', title: 'Inclusivity', desc: 'We design for real bodies. Our size range (XS–3XL) reflects our commitment to making every woman feel seen, celebrated, and beautifully dressed.' },
          { icon: '🌿', title: 'Intention', desc: 'We create pieces that are meant to be worn and loved — not fast fashion to be discarded. We encourage our customers to invest in fewer, better things.' },
        ].map(v => (
          <div key={v.title} style={{ backgroundColor: '#fff', border: '1px solid #e0d8d0', padding: '24px' }}>
            <span style={{ fontSize: '22px', display: 'block', marginBottom: '12px' }}>{v.icon}</span>
            <p style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '12px', fontWeight: 600, letterSpacing: '0.15em', textTransform: 'uppercase', color: '#2c2c2c', margin: '0 0 8px' }}>{v.title}</p>
            <p style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '13px', color: '#5a5550', lineHeight: 1.8, fontWeight: 300, margin: 0 }}>{v.desc}</p>
          </div>
        ))}
      </div>

      <SectionHeading>Our Collections</SectionHeading>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', marginBottom: '40px' }}>
        {[
          { name: 'Work', desc: 'Structured, polished pieces that command attention in the boardroom and beyond.', img: 'https://images.unsplash.com/photo-1594938298603-c8148c4b4057?w=400&q=80', link: '/#shop' },
          { name: 'Everyday', desc: 'Relaxed, effortless pieces for the in-between moments that make up your life.', img: 'https://images.unsplash.com/photo-1495385794356-15371f348c31?w=400&q=80', link: '/#shop' },
          { name: 'Luxe', desc: 'Elevated pieces for the occasions that deserve a little more — because you do.', img: 'https://images.unsplash.com/photo-1581338834647-b0fb40704e21?w=400&q=80', link: '/#shop' },
        ].map(col => (
          <div key={col.name} style={{ position: 'relative', overflow: 'hidden', aspectRatio: '3/4' }}>
            <img src={col.img} alt={col.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }}/>
            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(44,44,44,0.7) 0%, transparent 60%)' }}/>
            <div style={{ position: 'absolute', bottom: '16px', left: '16px' }}>
              <p style={{ fontFamily: '"Cormorant Garamond", serif', fontSize: '20px', color: '#fff', fontWeight: 400, margin: '0 0 4px' }}>{col.name}</p>
              <p style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '10px', color: 'rgba(255,255,255,0.7)', margin: 0, lineHeight: 1.5 }}>{col.desc}</p>
            </div>
          </div>
        ))}
      </div>

      <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
        <Link to="/our-story" style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '11px', letterSpacing: '0.25em', textTransform: 'uppercase', color: '#fff', backgroundColor: '#2c2c2c', padding: '13px 28px', textDecoration: 'none', fontWeight: 500 }}>
          Read Our Story
        </Link>
        <a href="https://www.instagram.com/thebeeivelabel/" target="_blank" rel="noopener noreferrer" style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '11px', letterSpacing: '0.25em', textTransform: 'uppercase', color: '#2c2c2c', border: '1px solid #2c2c2c', padding: '13px 28px', textDecoration: 'none', fontWeight: 500 }}>
          Follow on Instagram
        </a>
      </div>
    </PageLayout>
  )
}
