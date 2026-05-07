import React from 'react'
import PageLayout, { SectionHeading, BodyText, InfoCard, TableRow } from '../components/PageLayout'

const zones = [
  { label: 'Lagos (Island & Mainland)', time: 'Same Day Delivery', cost: 'Varies' },
  { label: 'Other Lagos Areas', time: '2–3 Business Days', cost: 'Varies' },
  { label: 'South-West Nigeria', time: '2–4 Business Days', cost: 'Varies' },
  { label: 'South-East & South-South', time: '3–5 Business Days', cost: 'Varies' },
  { label: 'North Nigeria', time: '4–6 Business Days', cost: 'Varies' },
]

export default function Shipping() {
  return (
    <PageLayout
      title="Shipping & Delivery"
      subtitle="We deliver across Nigeria with care. Every order is thoughtfully packaged and dispatched from our Lagos studio."
      breadcrumb="Shipping & Delivery"
    >
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '12px', marginBottom: '40px' }}>
        <InfoCard icon="🚚" title="Nationwide Delivery">We ship to all 36 states in Nigeria, including the FCT. Delivery timelines vary by location.</InfoCard>
        <InfoCard icon="📦" title="Premium Packaging">Every order is wrapped in our signature tissue paper and placed in a branded box — perfect for gifting.</InfoCard>
        <InfoCard icon="⚡" title="Fast Dispatch">Orders are processed and dispatched same day after payment confirmation.</InfoCard>
        <InfoCard icon="🔒" title="Order Protection">All orders are insured in transit. In the rare event of loss or damage, we will replace your order or issue store credit.</InfoCard>
      </div>

      <SectionHeading>Delivery Rates & Timelines</SectionHeading>
      <BodyText>Delivery times are estimates from the date of dispatch, not the date of order. Orders are processed and dispatched same day after payment confirmation.</BodyText>

      <div style={{ border: '1px solid #e0d8d0', overflow: 'hidden', marginBottom: '32px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', backgroundColor: '#2c2c2c', padding: '12px 16px' }}>
          {['Delivery Zone', 'Estimated Time', 'Cost'].map(h => (
            <span key={h} style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '10px', letterSpacing: '0.2em', textTransform: 'uppercase', color: '#fff', fontWeight: 500, flex: 1 }}>{h}</span>
          ))}
        </div>
        {zones.map((z, i) => (
          <div key={z.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '13px 16px', backgroundColor: z.highlight ? '#f8f4f0' : i % 2 === 0 ? '#fff' : '#faf7f4', borderBottom: '1px solid #e0d8d0' }}>
            <span style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '13px', color: '#2c2c2c', fontWeight: z.highlight ? 600 : 300, flex: 1 }}>{z.label}</span>
            <span style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '13px', color: '#5a5550', fontWeight: 300, flex: 1 }}>{z.time}</span>
            <span style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '13px', color: z.highlight ? '#16a34a' : '#2c2c2c', fontWeight: 600, flex: 1 }}>{z.cost}</span>
          </div>
        ))}
      </div>

      <SectionHeading>How It Works</SectionHeading>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
        {[
          { step: '01', title: 'Place Your Order', desc: 'Complete your order and make payment via debit card or bank transfer.' },
          { step: '02', title: 'Order Confirmation', desc: 'Our team reviews your order and confirms via WhatsApp within 2–4 hours during business hours (Mon–Sat, 9am–6pm).' },
          { step: '03', title: 'Packaging & Dispatch', desc: 'Your pieces are carefully quality-checked, steamed, wrapped in tissue, and packaged in our branded box.' },
          { step: '04', title: 'Out for Delivery', desc: 'Your order is handed to our trusted courier partner. You will receive a tracking update via WhatsApp.' },
          { step: '05', title: 'Delivered to You', desc: 'Your order arrives at your door. We hope you love every piece as much as we loved creating it.' },
        ].map((s, i, arr) => (
          <div key={s.step} style={{ display: 'flex', gap: '20px', position: 'relative', paddingBottom: i < arr.length - 1 ? '24px' : 0 }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flexShrink: 0 }}>
              <div style={{ width: 40, height: 40, borderRadius: '50%', backgroundColor: '#2c2c2c', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <span style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '11px', color: '#fff', fontWeight: 600 }}>{s.step}</span>
              </div>
              {i < arr.length - 1 && <div style={{ width: '1px', flex: 1, backgroundColor: '#e0d8d0', marginTop: '4px' }}/>}
            </div>
            <div style={{ paddingTop: '8px' }}>
              <p style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '13px', fontWeight: 600, color: '#2c2c2c', margin: '0 0 5px' }}>{s.title}</p>
              <p style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '13px', color: '#5a5550', lineHeight: 1.8, fontWeight: 300, margin: 0 }}>{s.desc}</p>
            </div>
          </div>
        ))}
      </div>

      <SectionHeading>Important Notes</SectionHeading>
      {[
        'Business days exclude Sundays and Nigerian public holidays.',
        'Delivery timelines begin from the day of dispatch, not the day of order placement.',
        'For delivery outside Lagos, timelines may vary. Contact us on WhatsApp if you need an urgent delivery.',
        'The Beeive Label is not liable for delays caused by courier partners once the order has been dispatched.',
        'Ensure your delivery address and phone number are correct at checkout. We cannot redirect orders once dispatched.',
      ].map((note, i) => (
        <div key={i} style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
          <span style={{ color: '#c4a28a', flexShrink: 0, marginTop: '2px' }}>✦</span>
          <BodyText style={{ margin: 0 }}>{note}</BodyText>
        </div>
      ))}
    </PageLayout>
  )
}
