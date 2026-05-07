import React, { useState, useEffect } from 'react'
import { formatPrice } from '../data/products'
import { BANK_DETAILS, PAYSTACK_PUBLIC_KEY, OWNER_WHATSAPP } from '../config/payment'
import { saveCloudOrder } from '../config/orderCloud'

const C = {
  charcoal: '#2c2c2c',
  blush: '#c4a28a',
  cream: '#faf7f4',
  warmGray: '#8a7f7a',
  border: '#e0d8d0',
  green: '#16a34a',
  red: '#dc2626',
}

const steps = ['Details', 'Payment', 'Confirm']

function generateOrderId() {
  return 'TBL-' + Date.now().toString(36).toUpperCase().slice(-6)
}

function loadPaystack() {
  return new Promise((resolve) => {
    if (window.PaystackPop) return resolve()
    const script = document.createElement('script')
    script.src = 'https://js.paystack.co/v1/inline.js'
    script.onload = resolve
    document.head.appendChild(script)
  })
}

export default function CheckoutModal({ open, onClose, items }) {
  const [step, setStep] = useState(0)
  const [payMethod, setPayMethod] = useState(null) // 'card' | 'transfer'
  const [proofFile, setProofFile] = useState(null)
  const [proofPreview, setProofPreview] = useState(null)
  const [orderDone, setOrderDone] = useState(false)
  const [orderId] = useState(generateOrderId)
  const [errors, setErrors] = useState({})
  const [form, setForm] = useState({
    firstName: '', lastName: '', email: '', phone: '', address: '', city: '', state: '',
  })

  const subtotal = items.reduce((s, i) => s + i.price * i.qty, 0)
  const total = subtotal

  useEffect(() => {
    if (open) {
      // Lock body scroll so the page doesn't jump behind the modal on mobile
      document.body.style.overflow = 'hidden'
      document.body.style.position = 'fixed'
      document.body.style.width = '100%'
    } else {
      document.body.style.overflow = ''
      document.body.style.position = ''
      document.body.style.width = ''
      setTimeout(() => { setStep(0); setPayMethod(null); setProofFile(null); setProofPreview(null); setOrderDone(false); setErrors({}) }, 400)
    }
    return () => {
      document.body.style.overflow = ''
      document.body.style.position = ''
      document.body.style.width = ''
    }
  }, [open])

  function validate() {
    const e = {}
    if (!form.firstName.trim()) e.firstName = 'Required'
    if (!form.lastName.trim()) e.lastName = 'Required'
    if (!form.email.trim() || !/\S+@\S+\.\S+/.test(form.email)) e.email = 'Valid email required'
    if (!form.phone.trim() || form.phone.length < 10) e.phone = 'Valid phone required'
    if (!form.address.trim()) e.address = 'Required'
    if (!form.city.trim()) e.city = 'Required'
    if (!form.state.trim()) e.state = 'Required'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  function handleField(k, v) {
    setForm(p => ({ ...p, [k]: v }))
    if (errors[k]) setErrors(p => ({ ...p, [k]: undefined }))
  }

  function buildOrderSummary() {
    const lines = items.map(i => `• ${i.name} (${i.selectedSize || 'N/A'}) x${i.qty} – ${formatPrice(i.price * i.qty)}`).join('\n')
    return (
      `🛍️ *NEW ORDER – ${orderId}*\n\n` +
      `*Customer:* ${form.firstName} ${form.lastName}\n` +
      `*Phone:* ${form.phone}\n` +
      `*Email:* ${form.email}\n` +
      `*Address:* ${form.address}, ${form.city}, ${form.state}\n\n` +
      `*Items:*\n${lines}\n\n` +
      `*Subtotal:* ${formatPrice(subtotal)}\n` +
      `*Shipping:* To be confirmed\n` +
      `*Total:* ${formatPrice(total)}\n\n` +
      `*Payment:* ${payMethod === 'card' ? '💳 Card (Paystack)' : '🏦 Bank Transfer'}\n\n` +
      `Please confirm this order to proceed.`
    )
  }

  function notifyOwner() {
    const msg = encodeURIComponent(buildOrderSummary())
    window.open(`https://wa.me/${OWNER_WHATSAPP}?text=${msg}`, '_blank')
  }

  function buildOrderObject(resolvedPayMethod) {
    const now = new Date()
    const dateStr = now.toLocaleDateString('en-NG', { day: 'numeric', month: 'short', year: 'numeric' })
    const timeStr = now.toLocaleTimeString('en-NG', { hour: '2-digit', minute: '2-digit' })
    const pm = resolvedPayMethod || payMethod
    return {
      id: orderId,
      customer: `${form.firstName} ${form.lastName}`,
      phone: form.phone,
      email: form.email,
      address: `${form.address}, ${form.city}, ${form.state}`,
      items: items.map(i => `${i.name}${i.selectedSize ? ' – Size ' + i.selectedSize : ''} ×${i.qty}`),
      total,
      payMethod: pm === 'card' ? 'Card (Paystack)' : 'Bank Transfer',
      placed: `${dateStr}, ${timeStr}`,
      status: 'Order Placed',
      steps: [
        { label: 'Order Placed',       done: true,          date: `${dateStr}, ${timeStr}` },
        { label: 'Payment Confirmed',  done: pm === 'card', date: pm === 'card' ? `${dateStr}, ${timeStr}` : 'Pending confirmation' },
        { label: 'Order Processing',   done: false,         date: 'Pending' },
        { label: 'Dispatched',         done: false,         date: 'Pending' },
        { label: 'Out for Delivery',   done: false,         date: 'Pending' },
        { label: 'Delivered',          done: false,         date: 'Pending' },
      ],
    }
  }

  function saveOrderToStorage(order) {
    try {
      const existing = JSON.parse(localStorage.getItem('tbl_orders') || '{}')
      existing[order.id] = order
      localStorage.setItem('tbl_orders', JSON.stringify(existing))
    } catch {}
  }

  async function persistOrder(resolvedPayMethod) {
    const order = buildOrderObject(resolvedPayMethod)
    // Save locally first (instant), then push to cloud
    saveOrderToStorage(order)
    try {
      await saveCloudOrder(order)
    } catch (err) {
      console.warn('Cloud save failed, order is in localStorage only:', err)
    }
  }

  async function handleCardPayment() {
    await loadPaystack()
    const handler = window.PaystackPop.setup({
      key: PAYSTACK_PUBLIC_KEY,
      email: form.email,
      amount: total * 100,
      currency: 'NGN',
      ref: orderId,
      metadata: { orderId, customer: `${form.firstName} ${form.lastName}`, phone: form.phone },
      callback: () => {
        setPayMethod('card')
        persistOrder('card')
        setOrderDone(true)
        notifyOwner()
      },
      onClose: () => {},
    })
    handler.openIframe()
  }

  function handleTransferConfirm() {
    if (!proofFile) { setErrors({ proof: 'Please upload your proof of payment' }); return }
    persistOrder('transfer')
    setOrderDone(true)
    notifyOwner()
  }

  function handleProofUpload(e) {
    const file = e.target.files[0]
    if (!file) return
    setProofFile(file)
    setProofPreview(URL.createObjectURL(file))
    setErrors(p => ({ ...p, proof: undefined }))
  }

  if (!open) return null

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 200,
      display: 'flex', alignItems: 'flex-end', justifyContent: 'center',
      overscrollBehavior: 'contain',
    }}>
      {/* Backdrop */}
      <div onClick={onClose} style={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(44,44,44,0.55)', backdropFilter: 'blur(3px)' }}/>

      {/* Panel */}
      <div style={{
        position: 'relative', zIndex: 1,
        backgroundColor: C.cream,
        width: '100%', maxWidth: '580px',
        maxHeight: '92dvh',
        borderRadius: '16px 16px 0 0',
        display: 'flex', flexDirection: 'column',
        boxShadow: '0 -8px 40px rgba(0,0,0,0.15)',
        overflow: 'hidden',
      }}>

        {/* Header */}
        <div style={{ padding: '20px 24px 16px', borderBottom: `1px solid ${C.border}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0 }}>
          <div>
            <h2 style={{ fontFamily: '"Cormorant Garamond", serif', fontSize: '20px', color: C.charcoal, margin: 0, fontWeight: 400 }}>
              {orderDone ? 'Order Placed 🎉' : 'Checkout'}
            </h2>
            {!orderDone && (
              <p style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '11px', color: C.warmGray, margin: '3px 0 0', letterSpacing: '0.05em' }}>
                Order #{orderId}
              </p>
            )}
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: C.warmGray, padding: 4 }}>
            <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12"/>
            </svg>
          </button>
        </div>

        {/* Step indicators */}
        {!orderDone && (
          <div style={{ display: 'flex', alignItems: 'center', padding: '12px 24px', gap: 0, borderBottom: `1px solid ${C.border}`, flexShrink: 0 }}>
            {steps.map((s, i) => (
              <React.Fragment key={s}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <div style={{
                    width: 24, height: 24, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
                    backgroundColor: i <= step ? C.charcoal : 'transparent',
                    border: `1.5px solid ${i <= step ? C.charcoal : C.border}`,
                    transition: 'all 0.3s ease',
                  }}>
                    {i < step
                      ? <svg width="12" height="12" fill="none" stroke="#fff" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7"/></svg>
                      : <span style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '10px', fontWeight: 600, color: i <= step ? '#fff' : C.warmGray }}>{i + 1}</span>
                    }
                  </div>
                  <span style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '10px', letterSpacing: '0.15em', textTransform: 'uppercase', color: i <= step ? C.charcoal : C.warmGray, fontWeight: i === step ? 600 : 400 }}>
                    {s}
                  </span>
                </div>
                {i < steps.length - 1 && (
                  <div style={{ flex: 1, height: 1, backgroundColor: i < step ? C.charcoal : C.border, margin: '0 8px', transition: 'background-color 0.3s ease' }}/>
                )}
              </React.Fragment>
            ))}
          </div>
        )}

        {/* Scrollable body */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '20px 24px', WebkitOverflowScrolling: 'touch', overscrollBehavior: 'contain' }}>

          {/* ── ORDER DONE ── */}
          {orderDone && (
            <div style={{ textAlign: 'center', padding: '20px 0' }}>
              <div style={{ width: 64, height: 64, borderRadius: '50%', backgroundColor: '#dcfce7', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
                <svg width="32" height="32" fill="none" stroke={C.green} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7"/>
                </svg>
              </div>
              <h3 style={{ fontFamily: '"Cormorant Garamond", serif', fontSize: '24px', color: C.charcoal, margin: '0 0 8px', fontWeight: 400 }}>
                Thank you, {form.firstName}!
              </h3>
              <p style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '13px', color: C.warmGray, lineHeight: 1.7, margin: '0 0 20px' }}>
                Your order <strong style={{ color: C.charcoal }}>#{orderId}</strong> has been received.<br/>
                The Beeive Label team will review and confirm your order shortly via WhatsApp.
              </p>

              {/* Order receipt */}
              <div style={{ backgroundColor: '#fff', border: `1px solid ${C.border}`, padding: '16px', textAlign: 'left', marginBottom: '20px' }}>
                <p style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '10px', letterSpacing: '0.3em', textTransform: 'uppercase', color: C.warmGray, margin: '0 0 12px' }}>Order Summary</p>
                {items.map(i => (
                  <div key={i.id} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <span style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '12px', color: C.charcoal }}>{i.name} ×{i.qty}</span>
                    <span style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '12px', color: C.charcoal, fontWeight: 500 }}>{formatPrice(i.price * i.qty)}</span>
                  </div>
                ))}
                <div style={{ borderTop: `1px solid ${C.border}`, marginTop: '10px', paddingTop: '10px', display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '12px', fontWeight: 600, color: C.charcoal }}>Total</span>
                  <span style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '13px', fontWeight: 700, color: C.charcoal }}>{formatPrice(total)}</span>
                </div>
              </div>

              <div style={{ backgroundColor: '#fff7ed', border: '1px solid #fed7aa', padding: '12px 16px', borderRadius: 4, marginBottom: '20px' }}>
                <p style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '12px', color: '#92400e', margin: 0, lineHeight: 1.6 }}>
                  ⏳ <strong>Awaiting confirmation.</strong> Our team will message you on WhatsApp at <strong>{form.phone}</strong> to confirm your order before dispatch.
                </p>
              </div>

              <button onClick={notifyOwner} style={{
                width: '100%', padding: '14px', backgroundColor: '#25D366', color: '#fff',
                border: 'none', cursor: 'pointer', fontFamily: 'Montserrat, sans-serif',
                fontSize: '12px', letterSpacing: '0.2em', textTransform: 'uppercase', fontWeight: 500,
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
              }}>
                <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
                Notify Store on WhatsApp
              </button>
            </div>
          )}

          {/* ── STEP 0: Customer Details ── */}
          {!orderDone && step === 0 && (
            <div>
              <p style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '11px', letterSpacing: '0.3em', textTransform: 'uppercase', color: C.warmGray, marginBottom: '18px' }}>
                Delivery Information
              </p>

              {/* Order mini summary */}
              <div style={{ backgroundColor: '#fff', border: `1px solid ${C.border}`, padding: '12px 16px', marginBottom: '20px' }}>
                {items.map(i => (
                  <div key={i.id} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                    <span style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '12px', color: C.charcoal }}>{i.name} ×{i.qty}</span>
                    <span style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '12px', color: C.charcoal }}>{formatPrice(i.price * i.qty)}</span>
                  </div>
                ))}
                <div style={{ borderTop: `1px solid ${C.border}`, marginTop: '8px', paddingTop: '8px', display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '11px', color: C.warmGray }}>Subtotal (shipping confirmed separately)</span>
                  <span style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '13px', fontWeight: 700, color: C.charcoal }}>{formatPrice(total)}</span>
                </div>
              </div>

              {/* Form fields */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                {[
                  { key: 'firstName', label: 'First Name', col: 1 },
                  { key: 'lastName', label: 'Last Name', col: 1 },
                  { key: 'email', label: 'Email Address', col: 2, type: 'email' },
                  { key: 'phone', label: 'Phone Number', col: 2, type: 'tel', placeholder: '+234...' },
                  { key: 'address', label: 'Delivery Address', col: 2 },
                  { key: 'city', label: 'City', col: 1 },
                  { key: 'state', label: 'State', col: 1 },
                ].map(f => (
                  <div key={f.key} style={{ gridColumn: f.col === 2 ? 'span 2' : 'span 1' }}>
                    <label style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '10px', letterSpacing: '0.2em', textTransform: 'uppercase', color: errors[f.key] ? C.red : C.warmGray, display: 'block', marginBottom: '5px' }}>
                      {f.label} {errors[f.key] && <span style={{ color: C.red }}>— {errors[f.key]}</span>}
                    </label>
                    <input
                      type={f.type || 'text'}
                      placeholder={f.placeholder || ''}
                      value={form[f.key]}
                      onChange={e => handleField(f.key, e.target.value)}
                      style={{
                        width: '100%', padding: '10px 12px', boxSizing: 'border-box',
                        border: `1px solid ${errors[f.key] ? C.red : C.border}`,
                        backgroundColor: '#fff', outline: 'none',
                        fontFamily: 'Montserrat, sans-serif',
                        fontSize: '16px', /* prevents iOS auto-zoom on focus */
                        color: C.charcoal,
                        transition: 'border-color 0.2s ease',
                        WebkitAppearance: 'none',
                        borderRadius: 0,
                      }}
                      onFocus={e => e.target.style.borderColor = C.charcoal}
                      onBlur={e => e.target.style.borderColor = errors[f.key] ? C.red : C.border}
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ── STEP 1: Payment Method ── */}
          {!orderDone && step === 1 && (
            <div>
              <p style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '11px', letterSpacing: '0.3em', textTransform: 'uppercase', color: C.warmGray, marginBottom: '18px' }}>
                Choose Payment Method
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {/* Card option */}
                <button onClick={() => setPayMethod('card')} style={{
                  width: '100%', padding: '18px 20px', textAlign: 'left', cursor: 'pointer',
                  border: `2px solid ${payMethod === 'card' ? C.charcoal : C.border}`,
                  backgroundColor: payMethod === 'card' ? '#f8f4f0' : '#fff',
                  transition: 'all 0.2s ease', outline: 'none',
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                    <div style={{ width: 40, height: 40, backgroundColor: '#f0ece8', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 4 }}>
                      <svg width="20" height="20" fill="none" stroke={C.charcoal} viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"/>
                      </svg>
                    </div>
                    <div>
                      <p style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '13px', fontWeight: 600, color: C.charcoal, margin: '0 0 2px' }}>Pay with Debit/Credit Card</p>
                      <p style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '11px', color: C.warmGray, margin: 0 }}>Visa, Mastercard · Secured by Paystack</p>
                    </div>
                  </div>
                  <div style={{ width: 20, height: 20, borderRadius: '50%', border: `2px solid ${payMethod === 'card' ? C.charcoal : C.border}`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    {payMethod === 'card' && <div style={{ width: 10, height: 10, borderRadius: '50%', backgroundColor: C.charcoal }}/>}
                  </div>
                </button>

                {/* Bank transfer option */}
                <button onClick={() => setPayMethod('transfer')} style={{
                  width: '100%', padding: '18px 20px', textAlign: 'left', cursor: 'pointer',
                  border: `2px solid ${payMethod === 'transfer' ? C.charcoal : C.border}`,
                  backgroundColor: payMethod === 'transfer' ? '#f8f4f0' : '#fff',
                  transition: 'all 0.2s ease', outline: 'none',
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                    <div style={{ width: 40, height: 40, backgroundColor: '#f0ece8', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 4 }}>
                      <svg width="20" height="20" fill="none" stroke={C.charcoal} viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z"/>
                      </svg>
                    </div>
                    <div>
                      <p style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '13px', fontWeight: 600, color: C.charcoal, margin: '0 0 2px' }}>Bank Transfer</p>
                      <p style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '11px', color: C.warmGray, margin: 0 }}>Transfer directly to our account</p>
                    </div>
                  </div>
                  <div style={{ width: 20, height: 20, borderRadius: '50%', border: `2px solid ${payMethod === 'transfer' ? C.charcoal : C.border}`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    {payMethod === 'transfer' && <div style={{ width: 10, height: 10, borderRadius: '50%', backgroundColor: C.charcoal }}/>}
                  </div>
                </button>
              </div>

              {/* Bank details (shown when transfer selected) */}
              {payMethod === 'transfer' && (
                <div style={{ marginTop: '16px', backgroundColor: '#fff', border: `1px solid ${C.border}`, padding: '20px' }}>
                  <p style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '10px', letterSpacing: '0.3em', textTransform: 'uppercase', color: C.warmGray, margin: '0 0 14px' }}>
                    Transfer Details
                  </p>
                  {[
                    { label: 'Bank Name', value: BANK_DETAILS.bankName },
                    { label: 'Account Name', value: BANK_DETAILS.accountName },
                    { label: 'Account Number', value: BANK_DETAILS.accountNumber },
                    { label: 'Amount to Transfer', value: formatPrice(total) },
                  ].map(d => (
                    <div key={d.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: `1px solid ${C.border}` }}>
                      <span style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '11px', color: C.warmGray }}>{d.label}</span>
                      <span style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '13px', fontWeight: 600, color: C.charcoal }}>{d.value}</span>
                    </div>
                  ))}
                  <p style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '11px', color: C.warmGray, marginTop: '12px', lineHeight: 1.6 }}>
                    ⚠️ Use your <strong style={{ color: C.charcoal }}>order number ({orderId})</strong> as the transfer narration so we can identify your payment.
                  </p>
                </div>
              )}

              {/* Total */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '20px', padding: '14px 0', borderTop: `1px solid ${C.border}` }}>
                <span style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '12px', color: C.warmGray }}>
                  {'Shipping: To be confirmed'}

                </span>
                <span style={{ fontFamily: '"Cormorant Garamond", serif', fontSize: '22px', color: C.charcoal, fontWeight: 500 }}>
                  {formatPrice(total)}
                </span>
              </div>
            </div>
          )}

          {/* ── STEP 2: Confirm & Upload Proof ── */}
          {!orderDone && step === 2 && (
            <div>
              <p style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '11px', letterSpacing: '0.3em', textTransform: 'uppercase', color: C.warmGray, marginBottom: '18px' }}>
                {payMethod === 'card' ? 'Review & Pay' : 'Upload Proof of Payment'}
              </p>

              {/* Summary */}
              <div style={{ backgroundColor: '#fff', border: `1px solid ${C.border}`, padding: '16px', marginBottom: '16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                  <div>
                    <p style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '11px', color: C.warmGray, margin: '0 0 2px' }}>Delivering to</p>
                    <p style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '13px', color: C.charcoal, margin: 0, fontWeight: 500 }}>{form.firstName} {form.lastName}</p>
                    <p style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '12px', color: C.warmGray, margin: '2px 0 0' }}>{form.address}, {form.city}, {form.state}</p>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <p style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '11px', color: C.warmGray, margin: '0 0 2px' }}>Payment</p>
                    <p style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '12px', color: C.charcoal, margin: 0, fontWeight: 500 }}>
                      {payMethod === 'card' ? '💳 Card' : '🏦 Transfer'}
                    </p>
                  </div>
                </div>
                {items.map(i => (
                  <div key={i.id} style={{ display: 'flex', gap: '10px', marginBottom: '10px', alignItems: 'center' }}>
                    <img src={i.img} alt={i.name} style={{ width: 44, height: 52, objectFit: 'cover', flexShrink: 0 }}/>
                    <div style={{ flex: 1 }}>
                      <p style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '12px', color: C.charcoal, margin: '0 0 2px', fontWeight: 500 }}>{i.name}</p>
                      <p style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '11px', color: C.warmGray, margin: 0 }}>Size: {i.selectedSize || 'N/A'} · Qty: {i.qty}</p>
                    </div>
                    <p style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '12px', color: C.charcoal, fontWeight: 600 }}>{formatPrice(i.price * i.qty)}</p>
                  </div>
                ))}
                <div style={{ borderTop: `1px solid ${C.border}`, paddingTop: '10px', display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '12px', color: C.warmGray }}>Total</span>
                  <span style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '14px', fontWeight: 700, color: C.charcoal }}>{formatPrice(total)}</span>
                </div>
              </div>

              {/* Bank transfer: upload proof */}
              {payMethod === 'transfer' && (
                <div>
                  <label style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '11px', letterSpacing: '0.2em', textTransform: 'uppercase', color: errors.proof ? C.red : C.warmGray, display: 'block', marginBottom: '8px' }}>
                    Upload Proof of Payment {errors.proof && <span style={{ color: C.red }}>— {errors.proof}</span>}
                  </label>
                  <label style={{
                    display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                    border: `2px dashed ${errors.proof ? C.red : proofFile ? C.green : C.border}`,
                    padding: '24px', cursor: 'pointer', backgroundColor: proofFile ? '#f0fdf4' : '#fff',
                    transition: 'all 0.2s ease', marginBottom: '12px',
                  }}>
                    <input type="file" accept="image/*,.pdf" onChange={handleProofUpload} style={{ display: 'none' }}/>
                    {proofPreview
                      ? <img src={proofPreview} alt="Proof" style={{ maxHeight: '120px', maxWidth: '100%', objectFit: 'contain' }}/>
                      : <>
                          <svg width="28" height="28" fill="none" stroke={C.warmGray} viewBox="0 0 24 24" style={{ marginBottom: 8 }}>
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                          </svg>
                          <p style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '12px', color: C.charcoal, margin: '0 0 4px', fontWeight: 500 }}>Click to upload screenshot</p>
                          <p style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '11px', color: C.warmGray, margin: 0 }}>PNG, JPG or PDF accepted</p>
                        </>
                    }
                  </label>
                  {proofFile && (
                    <p style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '11px', color: C.green, marginBottom: '12px' }}>
                      ✓ {proofFile.name}
                    </p>
                  )}
                </div>
              )}

              {/* Notice */}
              <div style={{ backgroundColor: '#fefce8', border: '1px solid #fde68a', padding: '12px 16px', borderRadius: 4 }}>
                <p style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '12px', color: '#92400e', margin: 0, lineHeight: 1.6 }}>
                  📋 After placing your order, the store owner will be notified on WhatsApp and will confirm your order before processing dispatch.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Footer actions */}
        {!orderDone && (
          <div style={{ padding: '16px 24px', borderTop: `1px solid ${C.border}`, flexShrink: 0, display: 'flex', gap: '10px' }}>
            {step > 0 && (
              <button onClick={() => setStep(s => s - 1)} style={{
                flex: '0 0 auto', padding: '13px 20px',
                border: `1px solid ${C.border}`, backgroundColor: 'transparent', cursor: 'pointer',
                fontFamily: 'Montserrat, sans-serif', fontSize: '11px', letterSpacing: '0.2em', textTransform: 'uppercase', color: C.charcoal,
              }}>
                Back
              </button>
            )}

            {/* Step 0 → 1 */}
            {step === 0 && (
              <button onClick={() => { if (validate()) setStep(1) }} style={{
                flex: 1, padding: '14px', backgroundColor: C.charcoal, color: '#fff', border: 'none', cursor: 'pointer',
                fontFamily: 'Montserrat, sans-serif', fontSize: '12px', letterSpacing: '0.25em', textTransform: 'uppercase', fontWeight: 500,
              }}>
                Continue to Payment
              </button>
            )}

            {/* Step 1 → 2 */}
            {step === 1 && (
              <button onClick={() => { if (payMethod) setStep(2) }} disabled={!payMethod} style={{
                flex: 1, padding: '14px', backgroundColor: payMethod ? C.charcoal : '#d1d5db', color: '#fff', border: 'none',
                cursor: payMethod ? 'pointer' : 'not-allowed',
                fontFamily: 'Montserrat, sans-serif', fontSize: '12px', letterSpacing: '0.25em', textTransform: 'uppercase', fontWeight: 500,
                transition: 'background-color 0.2s ease',
              }}>
                Review Order
              </button>
            )}

            {/* Step 2 → Pay */}
            {step === 2 && payMethod === 'card' && (
              <button onClick={handleCardPayment} style={{
                flex: 1, padding: '14px', backgroundColor: C.charcoal, color: '#fff', border: 'none', cursor: 'pointer',
                fontFamily: 'Montserrat, sans-serif', fontSize: '12px', letterSpacing: '0.25em', textTransform: 'uppercase', fontWeight: 500,
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
              }}>
                <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/>
                </svg>
                Pay {formatPrice(total)} Securely
              </button>
            )}
            {step === 2 && payMethod === 'transfer' && (
              <button onClick={handleTransferConfirm} style={{
                flex: 1, padding: '14px', backgroundColor: C.charcoal, color: '#fff', border: 'none', cursor: 'pointer',
                fontFamily: 'Montserrat, sans-serif', fontSize: '12px', letterSpacing: '0.25em', textTransform: 'uppercase', fontWeight: 500,
              }}>
                I've Made the Transfer
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
