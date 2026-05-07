import React from 'react'
import PageLayout, { SectionHeading, BodyText } from '../components/PageLayout'

const timeline = [
  { year: '2020', title: 'The Seed is Planted', desc: 'Born from a personal frustration — beautiful clothes that never quite fit right, affordable options that fell apart after one wash, luxury pieces that were simply out of reach. The Beeive Label began as a simple idea: what if Nigerian women could have fashion that actually worked for them?' },
  { year: '2021', title: 'First Stitches', desc: 'Working from a small studio in Lagos, the founder began designing the first capsule collection. Every piece was sewn, revised, and refined by hand. The first ten customers became the first ten believers — and their feedback shaped everything that followed.' },
  { year: '2022', title: 'Finding Our Voice', desc: 'The three pillars of the brand came into focus: Work. Everyday. Luxe. Not three separate brands, but three facets of the same woman — the same woman who presents in a boardroom at 10am, runs errands in style at 2pm, and turns heads at a dinner at 8pm.' },
  { year: '2023', title: 'Growing the Hive', desc: 'Word spread — not through advertising, but through women who wore The Beeive Label and got asked "where is that from?" The community grew. The team grew. The studio moved to a larger space. The bee had found its wings.' },
  { year: '2024', title: 'Ready for You', desc: 'The launch of our online store brought The Beeive Label to women across all 36 states of Nigeria. With the ability to shop from home, choose your size with confidence, and receive your order at your door, the brand stepped fully into the digital age — without losing the personal touch at its heart.' },
  { year: '2025', title: 'What\'s Next', desc: 'We are expanding our size range, investing in sustainable fabrics, and building partnerships with Nigerian artisans. The hive is growing — and you are part of it.' },
]

export default function OurStory() {
  return (
    <PageLayout
      title="Our Story"
      subtitle="Every great brand begins with a feeling. Ours began with a woman who wanted more."
      breadcrumb="Our Story"
    >
      {/* Opening editorial */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '40px', alignItems: 'center', marginBottom: '56px' }}>
        <div style={{ aspectRatio: '4/5', overflow: 'hidden' }}>
          <img src="https://images.unsplash.com/photo-1529139574466-a303027c1d8b?w=700&q=80" alt="Our Story" style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'top' }}/>
        </div>
        <div>
          <p style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '10px', letterSpacing: '0.4em', textTransform: 'uppercase', color: '#c4a28a', margin: '0 0 16px' }}>The Beginning</p>
          <BodyText>The Beeive Label was born in Lagos — a city of impossible energy, relentless ambition, and women who carry entire worlds on their shoulders and still manage to look extraordinary doing it.</BodyText>
          <BodyText>Our founder was one of those women. Juggling a career, a social life, a family, and a personal sense of style that refused to be compromised. She noticed a gap — between the clothes that were available and the clothes that were actually needed. Between "affordable" and "quality". Between "fashionable" and "functional".</BodyText>
          <BodyText>So she decided to bridge it herself.</BodyText>
          <BodyText>The bee became the symbol of everything the brand stands for: industrious, purposeful, part of a community, and unapologetically present. The hive is not just a brand — it is a movement of women who dress with intention.</BodyText>
        </div>
      </div>

      <SectionHeading>Our Journey</SectionHeading>
      <BodyText>From a small studio to a nationwide brand — here is how The Beeive Label grew.</BodyText>

      <div style={{ marginBottom: '48px', marginTop: '32px' }}>
        {timeline.map((t, i) => (
          <div key={t.year} style={{ display: 'flex', gap: '24px', marginBottom: '32px' }}>
            {/* Year bubble */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flexShrink: 0 }}>
              <div style={{ width: 60, height: 60, borderRadius: '50%', backgroundColor: i % 2 === 0 ? '#2c2c2c' : '#c4a28a', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <span style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '11px', fontWeight: 700, color: '#fff', letterSpacing: '0.05em' }}>{t.year}</span>
              </div>
              {i < timeline.length - 1 && <div style={{ width: 1, flex: 1, backgroundColor: '#e0d8d0', marginTop: '6px', minHeight: '20px' }}/>}
            </div>
            <div style={{ paddingTop: '12px', flex: 1 }}>
              <p style={{ fontFamily: '"Cormorant Garamond", serif', fontSize: '1.3rem', color: '#2c2c2c', fontWeight: 400, margin: '0 0 8px' }}>{t.title}</p>
              <BodyText style={{ margin: 0 }}>{t.desc}</BodyText>
            </div>
          </div>
        ))}
      </div>

      <SectionHeading>Why "Beeive"?</SectionHeading>
      <BodyText>The name is intentional. A beehive is one of nature's most perfectly organised structures — every member has a purpose, every action contributes to something greater. We built this brand the same way: with purpose, community, and the belief that great things happen when women work together.</BodyText>
      <BodyText>The bee is also a symbol of resilience. It is small, but it is mighty. It is focused. It builds something lasting. That is The Beeive Label — and that is the woman we design for.</BodyText>

      {/* Pull quote */}
      <div style={{ backgroundColor: '#f0ebe4', border: '1px solid #e0d8d0', padding: '36px', textAlign: 'center', marginTop: '40px' }}>
        <p style={{ fontFamily: '"Cormorant Garamond", serif', fontSize: '1.6rem', color: '#2c2c2c', fontStyle: 'italic', fontWeight: 300, lineHeight: 1.6, margin: '0 0 16px' }}>
          "Dress like you mean it. Because you do."
        </p>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px' }}>
          <span style={{ height: '0.5px', width: 28, backgroundColor: '#c4a28a', display: 'block' }}/>
          <span style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '10px', letterSpacing: '0.3em', textTransform: 'uppercase', color: '#c4a28a' }}>The Beeive Label, Lagos</span>
          <span style={{ height: '0.5px', width: 28, backgroundColor: '#c4a28a', display: 'block' }}/>
        </div>
      </div>
    </PageLayout>
  )
}
