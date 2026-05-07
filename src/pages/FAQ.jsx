import React, { useState } from 'react'
import PageLayout, { SectionHeading, BodyText } from '../components/PageLayout'

const faqs = [
  {
    category: 'Orders',
    items: [
      { q: 'How do I place an order?', a: 'Simply browse our collection, select your size and colour, and add items to your cart. When you are ready, proceed to checkout, fill in your delivery details, and choose your preferred payment method — debit card or bank transfer.' },
      { q: 'Can I modify or cancel my order after placing it?', a: 'You may modify or cancel your order within 2 hours of placing it, provided it has not yet been processed. Please contact us immediately via WhatsApp with your order number. Once an order has been confirmed and dispatched, it cannot be cancelled.' },
      { q: 'How will I know my order has been confirmed?', a: 'After placing your order, our team will review it and send a confirmation message to your WhatsApp and email address. This typically happens within 2–4 hours on business days (Monday to Saturday, 9am–6pm).' },
      { q: 'Do you offer custom or made-to-order pieces?', a: 'Yes, we occasionally offer made-to-order and bespoke services. Please reach out to us on WhatsApp or Instagram (@thebeeivelabel) to discuss your requirements, timeline, and pricing.' },
    ],
  },
  {
    category: 'Sizing & Fit',
    items: [
      { q: 'How do I find my size?', a: 'We recommend checking our detailed Size Guide page. Measure your bust, waist, and hips with a soft tape measure and compare with our size chart. If you are between sizes, we generally advise sizing up for a more comfortable fit.' },
      { q: 'Do your pieces run true to size?', a: 'Most of our pieces are true to size with a slightly relaxed fit. Structured work pieces such as blazers are cut with a more tailored silhouette. Each product page includes specific fit notes to help you decide.' },
      { q: 'What if I am unsure about my size?', a: 'Our team is happy to help. Send us a message on WhatsApp with your measurements and the item you are interested in, and we will personally recommend the best size for you.' },
    ],
  },
  {
    category: 'Payments',
    items: [
      { q: 'What payment methods do you accept?', a: 'We accept debit and credit card payments (Visa, Mastercard) secured through Paystack, as well as direct bank transfers to our Access Bank account (Beeive Fabrics — 1976391602).' },
      { q: 'Is it safe to pay on your website?', a: 'Absolutely. Card payments are processed through Paystack, a leading Nigerian payment gateway with bank-level security and SSL encryption. We never store your card details.' },
      { q: 'How do I pay via bank transfer?', a: 'Select "Bank Transfer" at checkout. You will be shown our bank details. Transfer the exact amount and use your order number as the payment narration. Upload your proof of payment screenshot at checkout so we can verify your payment quickly.' },
      { q: 'When will my payment be confirmed?', a: 'Card payments are confirmed instantly. Bank transfers are typically verified within 1–3 hours during business hours once proof of payment has been submitted.' },
    ],
  },
  {
    category: 'Delivery',
    items: [
      { q: 'Do you deliver nationwide?', a: 'Yes, we deliver to all 36 states in Nigeria including the FCT. Please see our Shipping & Delivery page for estimated delivery times and rates by location.' },
      { q: 'How long does delivery take?', a: 'Orders are dispatched same day after payment confirmation. Delivery within Lagos (Island & Mainland) is same day. Other states may take 2–6 business days depending on location. All timelines begin from the date of dispatch.' },
      { q: 'Is there free shipping?', a: 'We do not currently offer free shipping. Delivery rates vary by location — please see our Shipping & Delivery page for a full breakdown of rates and timelines.' },
      { q: 'Can I track my order?', a: 'Yes. Once your order is dispatched, we will send you a tracking update via WhatsApp. You can also use our Track Your Order page by entering your order number.' },
    ],
  },
  {
    category: 'Returns & Exchanges',
    items: [
      { q: 'Can I return an item?', a: 'Yes. We accept returns within 14 days of delivery for unworn, unwashed items with all tags attached. Please note that we do not offer cash refunds — approved returns are exchanged or issued as store credit. Please see our Returns & Exchanges page for full details and eligibility criteria.' },
      { q: 'Do you offer refunds?', a: 'We do not offer cash refunds. Instead, approved returns are processed as store credit, which can be used toward any future purchase. Store credit is issued within 3–5 business days of receiving and inspecting your returned item.' },
      { q: 'What if I received a wrong or faulty item?', a: 'We sincerely apologise. Please contact us within 48 hours of delivery with photos of the issue. We will prioritise a full replacement or store credit at absolutely no cost to you.' },
    ],
  },
]

function FAQItem({ q, a }) {
  const [open, setOpen] = useState(false)
  return (
    <div style={{ borderBottom: '1px solid #e0d8d0' }}>
      <button
        onClick={() => setOpen(o => !o)}
        style={{
          width: '100%', padding: '18px 0', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          background: 'none', border: 'none', cursor: 'pointer', gap: '16px', textAlign: 'left',
        }}
      >
        <span style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '14px', fontWeight: 500, color: '#2c2c2c', lineHeight: 1.5 }}>{q}</span>
        <div style={{ width: 24, height: 24, borderRadius: '50%', border: '1.5px solid #e0d8d0', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, transition: 'all 0.2s ease', backgroundColor: open ? '#2c2c2c' : 'transparent', borderColor: open ? '#2c2c2c' : '#e0d8d0' }}>
          <svg width="10" height="10" fill="none" stroke={open ? '#fff' : '#8a7f7a'} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d={open ? 'M5 15l7-7 7 7' : 'M19 9l-7 7-7-7'}/>
          </svg>
        </div>
      </button>
      {open && (
        <div style={{ paddingBottom: '18px' }}>
          <p style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '13px', color: '#5a5550', lineHeight: 1.9, fontWeight: 300, margin: 0 }}>{a}</p>
        </div>
      )}
    </div>
  )
}

export default function FAQ() {
  return (
    <PageLayout
      title="Frequently Asked Questions"
      subtitle="Everything you need to know about shopping with The Beeive Label."
      breadcrumb="FAQ"
    >
      {faqs.map(cat => (
        <div key={cat.category}>
          <SectionHeading>{cat.category}</SectionHeading>
          {cat.items.map(item => <FAQItem key={item.q} q={item.q} a={item.a}/>)}
        </div>
      ))}

      <div style={{ backgroundColor: '#2c2c2c', padding: '32px', marginTop: '48px', textAlign: 'center' }}>
        <p style={{ fontFamily: '"Cormorant Garamond", serif', fontSize: '1.5rem', color: '#fff', fontWeight: 300, margin: '0 0 8px' }}>
          Didn't find your answer?
        </p>
        <p style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '12px', color: 'rgba(255,255,255,0.55)', margin: '0 0 20px', fontWeight: 300 }}>
          Our team responds on WhatsApp and Instagram within a few hours.
        </p>
        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <a href="https://wa.me/2349013019836" target="_blank" rel="noopener noreferrer" style={{
            display: 'inline-flex', alignItems: 'center', gap: '8px', backgroundColor: '#25D366', color: '#fff',
            padding: '12px 24px', fontFamily: 'Montserrat, sans-serif', fontSize: '11px', letterSpacing: '0.2em', textTransform: 'uppercase', fontWeight: 500, textDecoration: 'none',
          }}>💬 WhatsApp</a>
          <a href="https://www.instagram.com/thebeeivelabel/" target="_blank" rel="noopener noreferrer" style={{
            display: 'inline-flex', alignItems: 'center', gap: '8px', backgroundColor: 'transparent', color: '#fff',
            padding: '12px 24px', fontFamily: 'Montserrat, sans-serif', fontSize: '11px', letterSpacing: '0.2em', textTransform: 'uppercase', fontWeight: 500, textDecoration: 'none', border: '1px solid rgba(255,255,255,0.3)',
          }}>📸 Instagram</a>
        </div>
      </div>
    </PageLayout>
  )
}
