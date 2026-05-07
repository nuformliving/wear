import React, { useState, useEffect, useRef } from 'react'
import { useSearchParams } from 'react-router-dom'
import PageLayout, { SectionHeading, BodyText } from '../components/PageLayout'
import { fetchCloudOrder } from '../config/orderCloud'

const statusColors = {
  'Order Placed':       { bg: '#f0f9ff', border: '#bae6fd', dot: '#0284c7', text: '#075985' },
  'Payment Confirmed':  { bg: '#f0fdf4', border: '#bbf7d0', dot: '#16a34a', text: '#14532d' },
  'Order Processing':   { bg: '#fefce8', border: '#fde68a', dot: '#ca8a04', text: '#713f12' },
  'Dispatched':         { bg: '#fefce8', border: '#fde68a', dot: '#ca8a04', text: '#713f12' },
  'Out for Delivery':   { bg: '#fff7ed', border: '#fed7aa', dot: '#ea580c', text: '#7c2d12' },
  'Delivered':          { bg: '#f0fdf4', border: '#bbf7d0', dot: '#16a34a', text: '#14532d' },
}

function deriveStatus(steps) {
  const done = steps.filter(s => s.done)
  if (!done.length) return 'Order Placed'
  return done[done.length - 1].label
}

export default function TrackOrder() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [orderNum, setOrderNum] = useState('')
  const [result, setResult] = useState(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [lastChecked, setLastChecked] = useState(null)
  const pollRef = useRef(null)

  // If URL has ?id=, auto-load that order on mount
  useEffect(() => {
    const id = searchParams.get('id')
    if (id) {
      const cleanId = id.toUpperCase().trim()
      setOrderNum(cleanId)
      // Clean the URL to the permanent form immediately
      setSearchParams({ id: cleanId }, { replace: true })
      loadOrder(cleanId)
    }
    return () => clearInterval(pollRef.current)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  async function loadOrder(id) {
    const cleanId = (id || orderNum).trim().replace(/^#/, '').toUpperCase()
    if (!cleanId) return
    setLoading(true)
    setError('')
    try {
      const order = await fetchCloudOrder(cleanId)
      if (!order) {
        setError(
          `No order found for "${cleanId}". Make sure you're using the exact order number from your confirmation screen (e.g. TBL-XXXXXX). Contact us on WhatsApp if you need help.`
        )
        setResult(null)
      } else {
        setResult(order)
        setLastChecked(new Date())
        // Update the URL to show the permanent link
        setSearchParams({ id: cleanId }, { replace: true })
        // Poll every 5 s for near-real-time updates
        clearInterval(pollRef.current)
        pollRef.current = setInterval(() => pollOrder(cleanId), 5000)
      }
    } catch {
      setError('Unable to reach the tracking server. Please try again.')
    }
    setLoading(false)
  }

  async function pollOrder(cleanId) {
    try {
      const order = await fetchCloudOrder(cleanId)
      if (order) {
        setResult(order)
        setLastChecked(new Date())
      }
    } catch {
      // silent — don't interrupt the user view on poll failure
    }
  }

  function handleTrack(e) {
    e.preventDefault()
    clearInterval(pollRef.current)
    loadOrder(orderNum)
  }

  const statusStyle = result ? (statusColors[deriveStatus(result.steps)] || statusColors['Order Placed']) : null

  return (
    <PageLayout
      title="Track Your Order"
      subtitle="Enter your order number to see your live delivery status."
      breadcrumb="Track Your Order"
    >
      {/* Search form */}
      <div style={{ backgroundColor: '#fff', border: '1px solid #e0d8d0', padding: '32px', marginBottom: '32px', maxWidth: '560px' }}>
        <p style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '11px', letterSpacing: '0.3em', textTransform: 'uppercase', color: '#8a7f7a', margin: '0 0 20px' }}>
          Enter Order Details
        </p>
        <form onSubmit={handleTrack}>
          <div style={{ marginBottom: '20px' }}>
            <label style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '10px', letterSpacing: '0.2em', textTransform: 'uppercase', color: '#8a7f7a', display: 'block', marginBottom: '6px' }}>
              Order Number *
            </label>
            <input
              value={orderNum}
              onChange={e => setOrderNum(e.target.value)}
              placeholder="e.g. TBL-LSH1BD"
              required
              autoComplete="off"
              autoCorrect="off"
              autoCapitalize="characters"
              spellCheck={false}
              style={{ width: '100%', padding: '11px 14px', boxSizing: 'border-box', border: '1px solid #e0d8d0', outline: 'none', fontFamily: 'Montserrat, sans-serif', fontSize: '16px', color: '#2c2c2c', backgroundColor: '#faf7f4', WebkitAppearance: 'none', borderRadius: 0, letterSpacing: '0.05em' }}
            />
          </div>
          <button type="submit" disabled={loading} style={{
            width: '100%', padding: '13px', backgroundColor: '#2c2c2c', color: '#fff', border: 'none', cursor: loading ? 'not-allowed' : 'pointer',
            fontFamily: 'Montserrat, sans-serif', fontSize: '11px', letterSpacing: '0.25em', textTransform: 'uppercase', fontWeight: 500,
            opacity: loading ? 0.65 : 1, transition: 'opacity 0.2s',
          }}>
            {loading ? 'Checking…' : 'Track Order'}
          </button>
        </form>
      </div>

      {/* Error */}
      {error && (
        <div style={{ backgroundColor: '#fef2f2', border: '1px solid #fecaca', padding: '16px 20px', marginBottom: '28px', display: 'flex', gap: '12px', alignItems: 'flex-start', maxWidth: '560px' }}>
          <span style={{ fontSize: '18px', flexShrink: 0 }}>⚠️</span>
          <div>
            <p style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '13px', color: '#991b1b', margin: '0 0 10px', lineHeight: 1.7 }}>{error}</p>
            <a
              href={`https://wa.me/2349013019836?text=Hi%2C%20I%20need%20help%20tracking%20my%20order%20${encodeURIComponent(orderNum.trim())}`}
              target="_blank"
              rel="noopener noreferrer"
              style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '11px', color: '#25D366', textDecoration: 'none', fontWeight: 600 }}
            >
              💬 Chat on WhatsApp →
            </a>
          </div>
        </div>
      )}

      {/* Result */}
      {result && (
        <div style={{ maxWidth: '640px' }}>

          {/* Live indicator + manual refresh */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px', flexWrap: 'wrap' }}>
            <span style={{ display: 'inline-block', width: 8, height: 8, borderRadius: '50%', backgroundColor: '#22c55e', boxShadow: '0 0 0 2px rgba(34,197,94,0.3)', animation: 'livePulse 2s ease-in-out infinite', flexShrink: 0 }}/>
            <span style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '10px', color: '#16a34a', letterSpacing: '0.15em', textTransform: 'uppercase', fontWeight: 500 }}>
              Live — checks every 5 seconds
            </span>
            {lastChecked && (
              <span style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '10px', color: '#8a7f7a' }}>
                · {lastChecked.toLocaleTimeString('en-NG', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
              </span>
            )}
            <button
              onClick={() => { clearInterval(pollRef.current); loadOrder(result?.id || orderNum); pollRef.current = setInterval(() => pollOrder(result?.id || orderNum), 5000) }}
              style={{ marginLeft: 'auto', background: 'none', border: '1px solid #e0d8d0', padding: '4px 12px', cursor: 'pointer', fontFamily: 'Montserrat, sans-serif', fontSize: '9px', letterSpacing: '0.2em', textTransform: 'uppercase', color: '#8a7f7a' }}
            >
              ↻ Refresh
            </button>
          </div>
          <style>{`@keyframes livePulse { 0%,100%{ box-shadow:0 0 0 2px rgba(34,197,94,0.3) } 50%{ box-shadow:0 0 0 5px rgba(34,197,94,0.1) } }`}</style>

          {/* Status badge */}
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', backgroundColor: statusStyle.bg, border: `1px solid ${statusStyle.border}`, padding: '8px 16px', marginBottom: '24px' }}>
            <span style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: statusStyle.dot, display: 'block', flexShrink: 0 }}/>
            <span style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '11px', fontWeight: 600, letterSpacing: '0.15em', textTransform: 'uppercase', color: statusStyle.text }}>
              {deriveStatus(result.steps)}
            </span>
          </div>

          {/* Order details card */}
          <div style={{ backgroundColor: '#fff', border: '1px solid #e0d8d0', padding: '20px', marginBottom: '28px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '16px' }}>
              {[
                { label: 'Order Number', value: result.id },
                { label: 'Customer', value: result.customer },
                { label: 'Order Placed', value: result.placed },
                { label: 'Payment', value: result.payMethod },
                { label: 'Deliver to', value: result.address },
                { label: 'Items', value: Array.isArray(result.items) ? result.items.join(' · ') : '' },
              ].filter(d => d.value).map(d => (
                <div key={d.label} style={{ gridColumn: d.label === 'Items' || d.label === 'Deliver to' ? 'span 2' : 'span 1' }}>
                  <p style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '9px', letterSpacing: '0.25em', textTransform: 'uppercase', color: '#8a7f7a', margin: '0 0 3px' }}>{d.label}</p>
                  <p style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '13px', color: '#2c2c2c', fontWeight: 500, margin: 0, lineHeight: 1.5 }}>{d.value}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Progress tracker */}
          <p style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '10px', letterSpacing: '0.3em', textTransform: 'uppercase', color: '#8a7f7a', margin: '0 0 20px' }}>
            Delivery Progress
          </p>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {result.steps.map((s, i, arr) => (
              <div key={s.label} style={{ display: 'flex', gap: '16px', paddingBottom: i < arr.length - 1 ? '20px' : 0 }}>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flexShrink: 0 }}>
                  <div style={{
                    width: 32, height: 32, borderRadius: '50%',
                    backgroundColor: s.done ? '#2c2c2c' : '#f0ebe4',
                    border: `2px solid ${s.done ? '#2c2c2c' : '#e0d8d0'}`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    {s.done
                      ? <svg width="12" height="12" fill="none" stroke="#fff" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7"/></svg>
                      : <div style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: '#e0d8d0' }}/>
                    }
                  </div>
                  {i < arr.length - 1 && (
                    <div style={{ width: 2, flex: 1, backgroundColor: s.done ? '#2c2c2c' : '#e0d8d0', marginTop: '3px', borderRadius: 1 }}/>
                  )}
                </div>
                <div style={{ paddingTop: '5px' }}>
                  <p style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '13px', fontWeight: s.done ? 600 : 400, color: s.done ? '#2c2c2c' : '#8a7f7a', margin: '0 0 2px' }}>{s.label}</p>
                  <p style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '11px', color: '#c4a28a', margin: 0 }}>{s.date}</p>
                </div>
              </div>
            ))}
          </div>

          {/* WhatsApp quick link */}
          <div style={{ marginTop: '32px', backgroundColor: '#f0fdf4', border: '1px solid #bbf7d0', padding: '16px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px', flexWrap: 'wrap' }}>
            <p style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '12px', color: '#14532d', margin: 0, fontWeight: 300 }}>
              Have a question about this order?
            </p>
            <a
              href={`https://wa.me/2349013019836?text=Hi%2C%20I%27d%20like%20an%20update%20on%20my%20order%20*${encodeURIComponent(result.id)}*`}
              target="_blank"
              rel="noopener noreferrer"
              style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', backgroundColor: '#25D366', color: '#fff', padding: '10px 20px', fontFamily: 'Montserrat, sans-serif', fontSize: '10px', letterSpacing: '0.2em', textTransform: 'uppercase', fontWeight: 500, textDecoration: 'none', whiteSpace: 'nowrap' }}
            >
              💬 Chat with Us
            </a>
          </div>
        </div>
      )}

      <SectionHeading>Need Help?</SectionHeading>
      <BodyText>
        Your order number is shown on your confirmation screen immediately after checkout — it looks like <strong>TBL-XXXXXX</strong>. If you can't find it, contact us on WhatsApp with your name and phone number and we'll look it up for you.
      </BodyText>
      <a href="https://wa.me/2349013019836" target="_blank" rel="noopener noreferrer" style={{
        display: 'inline-flex', alignItems: 'center', gap: '8px',
        backgroundColor: '#25D366', color: '#fff', padding: '13px 28px',
        fontFamily: 'Montserrat, sans-serif', fontSize: '11px', letterSpacing: '0.25em', textTransform: 'uppercase', fontWeight: 500, textDecoration: 'none',
      }}>
        💬 Contact Us on WhatsApp
      </a>
    </PageLayout>
  )
}
