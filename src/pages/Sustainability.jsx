import React from 'react'
import PageLayout, { SectionHeading, BodyText } from '../components/PageLayout'

const pillars = [
  {
    icon: '🌿',
    title: 'Conscious Materials',
    desc: 'We are actively transitioning our fabric sourcing towards certified sustainable fibres — organic cotton, recycled polyester, and OEKO-TEX certified textiles. Every new season, we raise the bar.',
  },
  {
    icon: '🤝',
    title: 'Local Artisans First',
    desc: 'From our tailors in Lagos to the embroiderers we partner with across Nigeria, we keep production local. This reduces our carbon footprint and ensures every naira we spend circulates within the Nigerian economy.',
  },
  {
    icon: '📦',
    title: 'Minimal Packaging',
    desc: 'Our packaging is 100% recyclable. We have eliminated single-use plastic from our fulfilment process and use FSC-certified tissue paper and cardboard for all orders.',
  },
  {
    icon: '♻️',
    title: 'Designed to Last',
    desc: 'Fast fashion is not what we do. Our pieces are designed for multiple seasons — classic cuts, quality construction, and timeless colour palettes that you will reach for year after year.',
  },
]

const commitments = [
  { label: 'Recycled Packaging', value: '100%', desc: 'All packaging materials are fully recyclable or compostable.' },
  { label: 'Local Production', value: '90%', desc: 'Nine out of ten pieces are produced within Nigeria.' },
  { label: 'Sustainable Fabric Target', value: '60%', desc: 'Our 2026 target for certified sustainable fabrics across all collections.' },
  { label: 'Artisan Partners', value: '12+', desc: 'Independent Nigerian artisans and tailors who contribute to each collection.' },
]

export default function Sustainability() {
  return (
    <PageLayout
      title="Sustainability"
      subtitle="Fashion with a conscience. Building a brand that is as good for the planet as it is for your wardrobe."
      breadcrumb="Sustainability"
    >
      {/* Hero statement */}
      <div style={{ backgroundColor: '#f0ebe4', border: '1px solid #e0d8d0', padding: '36px', marginBottom: '48px' }}>
        <p style={{ fontFamily: '"Cormorant Garamond", serif', fontSize: '1.5rem', color: '#2c2c2c', fontWeight: 300, lineHeight: 1.7, margin: '0 0 16px' }}>
          We believe that beautiful clothing and responsible practice are not opposites. They are the same thing, done correctly.
        </p>
        <BodyText style={{ margin: 0 }}>
          At The Beeive Label, sustainability is not a marketing strategy. It is a set of real, ongoing choices — about where our fabrics come from, who makes our clothes, how we package them, and how we minimise our impact at every step. We are not perfect. But we are honest about where we are, and committed to where we are going.
        </BodyText>
      </div>

      <SectionHeading>Our Four Pillars</SectionHeading>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px', marginTop: '24px', marginBottom: '48px' }}>
        {pillars.map(p => (
          <div key={p.title} style={{ backgroundColor: '#fff', border: '1px solid #e0d8d0', padding: '28px' }}>
            <span style={{ fontSize: '28px', display: 'block', marginBottom: '16px' }}>{p.icon}</span>
            <p style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '11px', letterSpacing: '0.2em', textTransform: 'uppercase', color: '#2c2c2c', fontWeight: 600, margin: '0 0 10px' }}>{p.title}</p>
            <BodyText style={{ margin: 0 }}>{p.desc}</BodyText>
          </div>
        ))}
      </div>

      <SectionHeading>Our Numbers</SectionHeading>
      <BodyText>Transparency matters. Here is where we stand as of 2025 — the real figures, not aspirational ones.</BodyText>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1px', backgroundColor: '#e0d8d0', border: '1px solid #e0d8d0', marginBottom: '48px', marginTop: '24px' }}>
        {commitments.map(c => (
          <div key={c.label} style={{ backgroundColor: '#fff', padding: '28px' }}>
            <p style={{ fontFamily: '"Cormorant Garamond", serif', fontSize: '2.4rem', color: '#c4a28a', fontWeight: 300, margin: '0 0 4px', lineHeight: 1 }}>{c.value}</p>
            <p style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '10px', fontWeight: 600, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#2c2c2c', margin: '0 0 8px' }}>{c.label}</p>
            <BodyText style={{ margin: 0, fontSize: '12px' }}>{c.desc}</BodyText>
          </div>
        ))}
      </div>

      <SectionHeading>Made in Nigeria, For Nigeria</SectionHeading>
      <BodyText>One of the most powerful sustainability choices we make is keeping production local. Our Lagos-based studio works with a network of skilled artisans — tailors, pattern-cutters, hand-finishers — who have honed their craft over decades. By investing in this talent, we are not just reducing air miles; we are helping to sustain a creative ecosystem that deserves to thrive.</BodyText>
      <BodyText>We pay fair wages. We maintain consistent relationships with our maker partners. And we credit their work, because behind every well-cut seam is a human being whose skill made it possible.</BodyText>

      <SectionHeading>Our Packaging Promise</SectionHeading>
      <BodyText>Every order from The Beeive Label arrives in packaging designed to be recycled, reused, or composted. We use:</BodyText>

      <div style={{ marginBottom: '32px' }}>
        {[
          'FSC-certified tissue paper in our brand colours',
          'Recyclable cardboard boxes — no excess material, no unnecessary layers',
          'Paper-based thank-you cards (no plastic inserts)',
          'No bubble wrap, no single-use plastic fillers',
          'Compostable mailer bags for smaller orders',
        ].map((item, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', marginBottom: '10px' }}>
            <span style={{ color: '#c4a28a', fontFamily: 'Montserrat, sans-serif', fontSize: '14px', lineHeight: '1.9', flexShrink: 0 }}>✓</span>
            <BodyText style={{ margin: 0 }}>{item}</BodyText>
          </div>
        ))}
      </div>

      <SectionHeading>What's Next</SectionHeading>
      <BodyText>Our sustainability roadmap for 2025–2026 includes:</BodyText>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '16px', marginTop: '24px', marginBottom: '48px' }}>
        {[
          { year: '2025', goal: 'Launch our first collection featuring at least 50% certified organic cotton.' },
          { year: '2025', goal: 'Partner with a Lagos-based textile recycling initiative to offer a fabric take-back programme.' },
          { year: '2026', goal: 'Achieve zero single-use plastic across all operations.' },
          { year: '2026', goal: 'Publish our first full supply chain transparency report.' },
        ].map((item, i) => (
          <div key={i} style={{ backgroundColor: '#f8f4f0', padding: '20px', borderLeft: '3px solid #c4a28a' }}>
            <p style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '10px', fontWeight: 600, letterSpacing: '0.2em', color: '#c4a28a', textTransform: 'uppercase', margin: '0 0 8px' }}>{item.year}</p>
            <BodyText style={{ margin: 0 }}>{item.goal}</BodyText>
          </div>
        ))}
      </div>

      {/* Pull quote */}
      <div style={{ backgroundColor: '#2c2c2c', padding: '40px 36px', textAlign: 'center' }}>
        <p style={{ fontFamily: '"Cormorant Garamond", serif', fontSize: '1.5rem', color: '#fff', fontStyle: 'italic', fontWeight: 300, lineHeight: 1.7, margin: '0 0 16px' }}>
          "The bee does not ask whether the flower is worth visiting. It simply does the work — and the world is better for it."
        </p>
        <span style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '10px', letterSpacing: '0.3em', textTransform: 'uppercase', color: '#c4a28a' }}>The Beeive Label</span>
      </div>
    </PageLayout>
  )
}
