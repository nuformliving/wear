import React from 'react'
import PageLayout, { SectionHeading, BodyText, InfoCard } from '../components/PageLayout'

export default function Returns() {
  return (
    <PageLayout
      title="Returns & Exchanges"
      subtitle="We do not offer refunds. However, we gladly accept returns and offer exchanges or store credit for eligible items."
      breadcrumb="Returns & Exchanges"
    >
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '12px', marginBottom: '40px' }}>
        <InfoCard icon="📅" title="14-Day Window">You have 14 days from the delivery date to request a return or exchange.</InfoCard>
        <InfoCard icon="↩" title="Easy Process">Simply contact us on WhatsApp with your order number and reason, and we will guide you through the process.</InfoCard>
        <InfoCard icon="✨" title="Exchanges Welcome">We offer size and colour exchanges on all eligible items, subject to availability.</InfoCard>
        <InfoCard icon="💳" title="Store Credit">Approved returns are processed as store credit, which can be used on any future order. No cash refunds are issued.</InfoCard>
      </div>

      <SectionHeading>Eligibility for Returns</SectionHeading>
      <BodyText>To be eligible for a return or exchange, your item must meet all of the following conditions:</BodyText>
      {[
        'Returned within 14 days of the confirmed delivery date.',
        'Unworn, unwashed, and in its original condition.',
        'All original tags and labels are still attached.',
        'Returned in its original packaging where possible.',
        'Accompanied by your order number or proof of purchase.',
      ].map((c, i) => (
        <div key={i} style={{ display: 'flex', gap: '12px', alignItems: 'flex-start', marginBottom: '10px' }}>
          <div style={{ width: 20, height: 20, borderRadius: '50%', backgroundColor: '#2c2c2c', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: '1px' }}>
            <svg width="10" height="10" fill="none" stroke="#fff" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7"/></svg>
          </div>
          <BodyText style={{ margin: 0 }}>{c}</BodyText>
        </div>
      ))}

      <SectionHeading>Non-Returnable Items</SectionHeading>
      <BodyText>The following items cannot be returned or exchanged for hygiene and safety reasons:</BodyText>
      {[
        'Sale or discounted items (marked as "Final Sale").',
        'Accessories including jewellery, scarves, and bags.',
        'Items that have been worn, washed, altered, or dry-cleaned.',
        'Custom or made-to-order pieces.',
        'Items with removed tags or damaged packaging.',
      ].map((c, i) => (
        <div key={i} style={{ display: 'flex', gap: '12px', alignItems: 'flex-start', marginBottom: '10px' }}>
          <span style={{ color: '#dc2626', fontWeight: 700, flexShrink: 0, marginTop: '1px', fontSize: '14px' }}>×</span>
          <BodyText style={{ margin: 0 }}>{c}</BodyText>
        </div>
      ))}

      <SectionHeading>How to Initiate a Return</SectionHeading>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
        {[
          { step: '01', title: 'Contact Us', desc: 'Message us on WhatsApp (+234 901 301 9836) within 14 days of receiving your order. Include your order number and the reason for your return.' },
          { step: '02', title: 'Await Approval', desc: 'Our team will review your request and respond within 24 hours with a return approval and instructions.' },
          { step: '03', title: 'Send the Item', desc: 'Package the item securely and send it to our Lagos studio address provided in the approval message. The customer is responsible for return shipping costs unless the item is faulty.' },
          { step: '04', title: 'Processing', desc: 'Once we receive and inspect the returned item, we will process your exchange or store credit within 3–5 business days.' },
          { step: '05', title: 'Confirmation', desc: 'You will receive a confirmation on WhatsApp once your exchange has been dispatched or your store credit has been issued.' },
        ].map((s, i, arr) => (
          <div key={s.step} style={{ display: 'flex', gap: '20px', position: 'relative', paddingBottom: i < arr.length - 1 ? '24px' : 0 }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flexShrink: 0 }}>
              <div style={{ width: 40, height: 40, borderRadius: '50%', border: '2px solid #c4a28a', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <span style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '11px', color: '#c4a28a', fontWeight: 600 }}>{s.step}</span>
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

      <SectionHeading>Faulty or Incorrect Items</SectionHeading>
      <BodyText>If you have received a faulty, damaged, or incorrect item, please contact us within 48 hours of delivery with clear photos of the issue. In this case, The Beeive Label will cover all return shipping costs and offer a full replacement or store credit at no additional cost to you.</BodyText>

      <div style={{ backgroundColor: '#faf7f4', border: '1px solid #e0d8d0', padding: '24px', marginTop: '32px', textAlign: 'center' }}>
        <p style={{ fontFamily: '"Cormorant Garamond", serif', fontSize: '1.3rem', color: '#2c2c2c', fontWeight: 400, margin: '0 0 8px' }}>Still have questions?</p>
        <p style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '13px', color: '#8a7f7a', margin: '0 0 16px', fontWeight: 300 }}>Our team is available Monday to Saturday, 9am – 6pm (WAT).</p>
        <a href="https://wa.me/2349013019836" target="_blank" rel="noopener noreferrer" style={{
          display: 'inline-flex', alignItems: 'center', gap: '8px',
          backgroundColor: '#25D366', color: '#fff', padding: '13px 28px',
          fontFamily: 'Montserrat, sans-serif', fontSize: '11px', letterSpacing: '0.25em', textTransform: 'uppercase', fontWeight: 500, textDecoration: 'none',
        }}>
          💬 WhatsApp Us
        </a>
      </div>
    </PageLayout>
  )
}
