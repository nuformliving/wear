import React, { useState } from 'react'
import PageLayout, { SectionHeading, BodyText, InfoCard, TableRow } from '../components/PageLayout'

const measurements = {
  UK: [
    { size: 'XS', uk: '6', ng: '34', bust: '81–84', waist: '62–65', hips: '86–89' },
    { size: 'S',  uk: '8', ng: '36', bust: '85–88', waist: '66–69', hips: '90–93' },
    { size: 'M',  uk: '10', ng: '38', bust: '89–92', waist: '70–73', hips: '94–97' },
    { size: 'L',  uk: '12', ng: '40', bust: '93–96', waist: '74–77', hips: '98–101' },
    { size: 'XL', uk: '14', ng: '42', bust: '97–100', waist: '78–81', hips: '102–105' },
    { size: 'XXL', uk: '16', ng: '44', bust: '101–106', waist: '82–87', hips: '106–111' },
    { size: '3XL', uk: '18', ng: '46', bust: '107–112', waist: '88–93', hips: '112–117' },
  ],
}

const tips = [
  { icon: '📏', title: 'Measure Correctly', desc: 'Use a soft measuring tape. Measure over your undergarments, not over clothing. Keep the tape snug but not tight.' },
  { icon: '👗', title: 'Bust Measurement', desc: 'Measure around the fullest part of your bust, keeping the tape parallel to the ground.' },
  { icon: '⌛', title: 'Waist Measurement', desc: 'Measure around the narrowest part of your natural waist, usually just above your belly button.' },
  { icon: '🔄', title: 'Hip Measurement', desc: 'Stand with feet together and measure around the fullest part of your hips and seat, about 20cm below your waist.' },
]

export default function SizeGuide() {
  const [unit, setUnit] = useState('cm')

  return (
    <PageLayout
      title="Size Guide"
      subtitle="We want every piece to fit you beautifully. Use this guide to find your perfect size before ordering."
      breadcrumb="Size Guide"
    >
      {/* Tip cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px', marginBottom: '40px' }}>
        {tips.map(t => <InfoCard key={t.title} icon={t.icon} title={t.title}>{t.desc}</InfoCard>)}
      </div>

      <SectionHeading>Measurements Chart</SectionHeading>
      <BodyText>All measurements are in centimetres (cm). If you are between sizes, we recommend sizing up for a more comfortable fit.</BodyText>

      {/* Table */}
      <div style={{ overflowX: 'auto', marginBottom: '32px' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', border: '1px solid #e0d8d0' }}>
          <thead>
            <tr style={{ backgroundColor: '#2c2c2c' }}>
              {['TBL Size', 'UK', 'NG', 'Bust (cm)', 'Waist (cm)', 'Hips (cm)'].map(h => (
                <th key={h} style={{ padding: '12px 16px', fontFamily: 'Montserrat, sans-serif', fontSize: '10px', letterSpacing: '0.2em', textTransform: 'uppercase', color: '#fff', fontWeight: 500, textAlign: 'left', whiteSpace: 'nowrap' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {measurements.UK.map((row, i) => (
              <tr key={row.size} style={{ backgroundColor: i % 2 === 0 ? '#fff' : '#faf7f4' }}>
                {[row.size, row.uk, row.ng, row.bust, row.waist, row.hips].map((v, j) => (
                  <td key={j} style={{ padding: '12px 16px', fontFamily: 'Montserrat, sans-serif', fontSize: '13px', color: j === 0 ? '#2c2c2c' : '#5a5550', fontWeight: j === 0 ? 600 : 300, borderBottom: '1px solid #e0d8d0', whiteSpace: 'nowrap' }}>{v}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <SectionHeading>Fit Notes by Style</SectionHeading>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '16px', marginBottom: '32px' }}>
        {[
          { style: 'Dresses & Jumpsuits', note: 'Our dresses are cut to skim the body with ease. For a relaxed fit, size up. For bodycon styles, your true size will give the best silhouette.' },
          { style: 'Co-ord Sets', note: 'Tops and bottoms are sold as a set. We recommend sizing based on your larger measurement — either bust or hip.' },
          { style: 'Work Blazers', note: 'Blazers are tailored with structured shoulders. If you have broader shoulders or prefer room to layer, consider sizing up.' },
          { style: 'Trousers & Skirts', note: 'Cut to sit at the natural waist. Size based on hip measurement for the most comfortable and flattering fit.' },
        ].map(f => (
          <div key={f.style} style={{ backgroundColor: '#fff', border: '1px solid #e0d8d0', padding: '20px' }}>
            <p style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '11px', fontWeight: 600, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#c4a28a', margin: '0 0 8px' }}>{f.style}</p>
            <p style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '13px', color: '#5a5550', lineHeight: 1.8, fontWeight: 300, margin: 0 }}>{f.note}</p>
          </div>
        ))}
      </div>

      <SectionHeading>Still Unsure?</SectionHeading>
      <BodyText>Our team is always happy to help you find the right size. Send us a message on WhatsApp with your measurements and the item you are interested in, and we will guide you personally.</BodyText>
      <a href="https://wa.me/2349013019836" target="_blank" rel="noopener noreferrer" style={{
        display: 'inline-flex', alignItems: 'center', gap: '8px',
        backgroundColor: '#25D366', color: '#fff', padding: '13px 28px',
        fontFamily: 'Montserrat, sans-serif', fontSize: '11px', letterSpacing: '0.25em', textTransform: 'uppercase', fontWeight: 500, textDecoration: 'none',
      }}>
        💬 Chat with Us on WhatsApp
      </a>
    </PageLayout>
  )
}
