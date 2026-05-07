import React from 'react'
import PageLayout, { SectionHeading, BodyText } from '../components/PageLayout'

const coverage = [
  {
    outlet: 'Vogue Africa',
    date: 'March 2025',
    headline: '"The Lagos Label Redefining What Nigerian Women Wear to Work"',
    excerpt: 'The Beeive Label has quietly become the go-to brand for the Lagos professional woman — a wardrobe built on the principle that you should never have to choose between looking put-together and feeling comfortable.',
    type: 'Feature',
  },
  {
    outlet: 'ThisDay Style',
    date: 'January 2025',
    headline: '"10 Nigerian Brands You Need to Know in 2025"',
    excerpt: 'Among the standouts: The Beeive Label, a Lagos-based ready-to-wear line that has mastered the art of dressing the modern Nigerian woman across every moment of her day.',
    type: 'List Feature',
  },
  {
    outlet: 'Zikoko',
    date: 'November 2024',
    headline: '"The Brand Making Affordable Luxury Feel Personal"',
    excerpt: 'Shopping The Beeive Label feels less like browsing an online store and more like having a very stylish friend who actually knows your body and your life.',
    type: 'Brand Profile',
  },
  {
    outlet: 'Guardian Life',
    date: 'September 2024',
    headline: '"Designed in Lagos, Worn Everywhere: The Rise of Homegrown Fashion"',
    excerpt: 'The Beeive Label is leading a new wave of Nigerian fashion that refuses to be categorised as "Afrocentric" or "contemporary" — it is simply excellent clothing, full stop.',
    type: 'Industry Feature',
  },
  {
    outlet: 'Bella Naija Style',
    date: 'July 2024',
    headline: '"The Beeive Label\'s New Work Collection Is Everything"',
    excerpt: 'Tailored blazers that mean business, trousers that hold their shape, dresses that transition from 9am to 9pm without missing a beat. The new Work collection is the wardrobe update you have been putting off.',
    type: 'Collection Review',
  },
  {
    outlet: 'Punch Lifestyle',
    date: 'April 2024',
    headline: '"How Nigerian Women Are Shopping Smarter in 2024"',
    excerpt: 'The shift towards quality-over-quantity is being led by labels like The Beeive Label, whose pieces are designed to last — and to be worn, not saved.',
    type: 'Trend Story',
  },
]

const awards = [
  { year: '2025', award: 'Best Emerging Nigerian Fashion Brand', body: 'Lagos Fashion Week' },
  { year: '2024', award: 'Readers\' Choice — Best Ready-to-Wear Label', body: 'Bella Naija Style Awards' },
  { year: '2024', award: 'Top 5 Brands to Watch', body: 'Vogue Africa Digital' },
  { year: '2023', award: 'Best New Brand — South-West', body: 'Nigerian Fashion Summit' },
]

export default function Press() {
  return (
    <PageLayout
      title="Press"
      subtitle="Stories about The Beeive Label, as told by those who've experienced it."
      breadcrumb="Press"
    >
      <BodyText>We are proud of the conversations our brand has sparked. Below is a selection of media coverage, features, and recognition that The Beeive Label has received since our founding. For press enquiries, imagery, or interview requests, please reach out to us directly.</BodyText>

      {/* Press contact CTA */}
      <div style={{ backgroundColor: '#fff', border: '1px solid #e0d8d0', padding: '24px 28px', marginBottom: '48px', display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '16px' }}>
        <div>
          <p style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '11px', letterSpacing: '0.25em', textTransform: 'uppercase', color: '#c4a28a', margin: '0 0 4px' }}>Press Enquiries</p>
          <p style={{ fontFamily: '"Cormorant Garamond", serif', fontSize: '1.2rem', color: '#2c2c2c', margin: 0 }}>For media, press and partnerships</p>
        </div>
        <a
          href="https://wa.me/2349013019836"
          target="_blank"
          rel="noopener noreferrer"
          style={{ display: 'inline-block', backgroundColor: '#2c2c2c', color: '#fff', fontFamily: 'Montserrat, sans-serif', fontSize: '10px', letterSpacing: '0.25em', textTransform: 'uppercase', padding: '13px 24px', textDecoration: 'none', whiteSpace: 'nowrap' }}
        >
          Get in Touch
        </a>
      </div>

      <SectionHeading>In the Media</SectionHeading>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
        {coverage.map((item, i) => (
          <div key={i} style={{ borderBottom: '1px solid #e0d8d0', padding: '28px 0' }}>
            <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'flex-start', justifyContent: 'space-between', gap: '12px', marginBottom: '10px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
                <span style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '11px', fontWeight: 600, letterSpacing: '0.15em', textTransform: 'uppercase', color: '#2c2c2c' }}>{item.outlet}</span>
                <span style={{ width: '1px', height: '12px', backgroundColor: '#e0d8d0', display: 'inline-block' }}/>
                <span style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '10px', letterSpacing: '0.1em', textTransform: 'uppercase', color: '#c4a28a', backgroundColor: '#f0ebe4', padding: '3px 10px' }}>{item.type}</span>
              </div>
              <span style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '11px', color: '#8a7f7a', flexShrink: 0 }}>{item.date}</span>
            </div>
            <p style={{ fontFamily: '"Cormorant Garamond", serif', fontSize: '1.1rem', color: '#2c2c2c', fontStyle: 'italic', margin: '0 0 10px', lineHeight: 1.5 }}>{item.headline}</p>
            <BodyText style={{ margin: 0 }}>{item.excerpt}</BodyText>
          </div>
        ))}
      </div>

      <SectionHeading>Awards & Recognition</SectionHeading>

      <div style={{ border: '1px solid #e0d8d0', overflow: 'hidden', marginBottom: '48px' }}>
        {awards.map((a, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '24px', padding: '16px 20px', backgroundColor: i % 2 === 0 ? '#fff' : '#f8f4f0', borderBottom: i < awards.length - 1 ? '1px solid #e0d8d0' : 'none', flexWrap: 'wrap' }}>
            <span style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '11px', fontWeight: 600, color: '#c4a28a', minWidth: '40px' }}>{a.year}</span>
            <div style={{ flex: 1 }}>
              <p style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '12px', color: '#2c2c2c', fontWeight: 500, margin: '0 0 2px' }}>{a.award}</p>
              <p style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '11px', color: '#8a7f7a', margin: 0, fontWeight: 300 }}>{a.body}</p>
            </div>
          </div>
        ))}
      </div>

      <SectionHeading>Press Assets</SectionHeading>
      <BodyText>Journalists and content creators looking for high-resolution imagery, brand guidelines, or product photography are welcome to request our official press kit. All assets are provided for editorial use only and must be credited to The Beeive Label.</BodyText>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px', marginTop: '24px' }}>
        {[
          { title: 'Brand Logo Pack', desc: 'PNG, SVG in multiple colourways' },
          { title: 'Lookbook Images', desc: 'Season campaign photography' },
          { title: 'Founder Profile', desc: 'Official biography and headshots' },
          { title: 'Product Imagery', desc: 'High-res, white background shots' },
        ].map(asset => (
          <div key={asset.title} style={{ backgroundColor: '#fff', border: '1px solid #e0d8d0', padding: '20px' }}>
            <p style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '11px', fontWeight: 600, letterSpacing: '0.15em', textTransform: 'uppercase', color: '#2c2c2c', margin: '0 0 6px' }}>{asset.title}</p>
            <p style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '12px', color: '#8a7f7a', margin: 0, fontWeight: 300 }}>{asset.desc}</p>
          </div>
        ))}
      </div>

      <div style={{ textAlign: 'center', marginTop: '40px' }}>
        <a
          href="https://wa.me/2349013019836?text=Hi%2C%20I%20would%20like%20to%20request%20the%20press%20kit%20for%20The%20Beeive%20Label."
          target="_blank"
          rel="noopener noreferrer"
          style={{ display: 'inline-block', backgroundColor: '#c4a28a', color: '#fff', fontFamily: 'Montserrat, sans-serif', fontSize: '10px', letterSpacing: '0.25em', textTransform: 'uppercase', padding: '15px 36px', textDecoration: 'none' }}
        >
          Request Press Kit
        </a>
      </div>
    </PageLayout>
  )
}
