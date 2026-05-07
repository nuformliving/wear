import React, { useState, useEffect, useRef } from 'react'
import { updateCloudOrderStatus } from '../config/orderCloud'
import { products as staticProducts, formatPrice } from '../data/products'

const ADMIN_PASSWORD = 'beeive2024'

const STEPS = [
  { label: 'Payment Confirmed',  desc: 'Payment verified — ready to process',    emoji: '✅' },
  { label: 'Order Processing',   desc: 'Team is preparing the order',             emoji: '🐝' },
  { label: 'Dispatched',         desc: 'Order handed to courier',                 emoji: '📦' },
  { label: 'Out for Delivery',   desc: 'Courier is on the way to customer',       emoji: '🚚' },
  { label: 'Delivered',          desc: 'Order successfully delivered',             emoji: '🎉' },
]

const STEP_INDEX = {
  'Payment Confirmed': 1, 'Order Processing': 2,
  'Dispatched': 3, 'Out for Delivery': 4, 'Delivered': 5,
}

const CATEGORIES = ['Everyday', 'Work', 'Luxe']
const ALL_SIZES   = ['XS', 'S', 'M', 'L', 'XL', 'XXL']

const C = {
  charcoal: '#2c2c2c', blush: '#c4a28a', warmGray: '#8a7f7a',
  border: '#e0d8d0', cream: '#faf7f4', lightBg: '#f8f4f0',
}

const inp = {
  width: '100%', padding: '11px 14px', boxSizing: 'border-box',
  border: `1px solid ${C.border}`, outline: 'none',
  fontFamily: 'Montserrat, sans-serif', fontSize: '14px', color: C.charcoal,
  backgroundColor: '#fff', WebkitAppearance: 'none', borderRadius: 0,
  transition: 'border-color 0.15s',
}

const lbl = {
  fontFamily: 'Montserrat, sans-serif', fontSize: '10px', letterSpacing: '0.18em',
  textTransform: 'uppercase', color: C.warmGray, display: 'block', marginBottom: '6px',
  fontWeight: 600,
}

const API = '/api/products'

async function fetchProducts() {
  try {
    const r = await fetch(API)
    const d = await r.json()
    return d.products && d.products.length ? d.products : staticProducts
  } catch {
    return staticProducts
  }
}

async function saveProducts(list) {
  await fetch(API, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ products: list }),
  })
}

const blankProduct = () => ({
  id: Date.now(),
  name: '', tagline: '', price: '', originalPrice: '',
  category: 'Everyday', isNew: false, isBestSeller: false,
  colors: ['#2c2c2c'], sizes: ['S', 'M', 'L'],
  img: '', imgHover: '',
})

/* ─── Reusable styled button ─────────────────────────────────────── */
function Btn({ children, onClick, disabled, variant = 'dark', style = {}, type = 'button' }) {
  const base = {
    border: 'none', cursor: disabled ? 'not-allowed' : 'pointer',
    fontFamily: 'Montserrat, sans-serif', fontSize: '10px',
    letterSpacing: '0.22em', textTransform: 'uppercase', fontWeight: 600,
    padding: '11px 22px', display: 'inline-flex', alignItems: 'center', gap: '7px',
    transition: 'opacity 0.15s',
    opacity: disabled ? 0.5 : 1,
  }
  const variants = {
    dark:    { backgroundColor: C.charcoal, color: '#fff' },
    ghost:   { backgroundColor: 'transparent', color: C.warmGray, border: `1px solid ${C.border}` },
    danger:  { backgroundColor: '#ef4444', color: '#fff' },
    blush:   { backgroundColor: C.blush, color: '#fff' },
  }
  return (
    <button type={type} onClick={onClick} disabled={disabled} style={{ ...base, ...variants[variant], ...style }}>
      {children}
    </button>
  )
}

/* ─── Spinner ─────────────────────────────────────────────────────── */
const Spinner = ({ color = '#fff', size = 14 }) => (
  <span style={{ display: 'inline-block', width: size, height: size, border: `2px solid rgba(255,255,255,0.3)`, borderTopColor: color, borderRadius: '50%', animation: 'spin 0.7s linear infinite', flexShrink: 0 }} />
)

/* ─── Color swatch picker ─────────────────────────────────────────── */
function ColorList({ colors, onChange }) {
  const addColor = () => onChange([...colors, '#888888'])
  const removeColor = (i) => onChange(colors.filter((_, idx) => idx !== i))
  const updateColor = (i, v) => onChange(colors.map((c, idx) => idx === i ? v : c))
  return (
    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', alignItems: 'center' }}>
      {colors.map((c, i) => (
        <div key={i} style={{ position: 'relative', display: 'flex', alignItems: 'center', gap: '4px' }}>
          <input type="color" value={c} onChange={e => updateColor(i, e.target.value)}
            style={{ width: 36, height: 36, border: `1.5px solid ${C.border}`, cursor: 'pointer', padding: 2, borderRadius: 0, backgroundColor: '#fff' }} />
          {colors.length > 1 && (
            <button type="button" onClick={() => removeColor(i)}
              style={{ width: 18, height: 18, borderRadius: '50%', backgroundColor: '#ef4444', color: '#fff', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, lineHeight: 1, flexShrink: 0 }}>
              ×
            </button>
          )}
        </div>
      ))}
      <button type="button" onClick={addColor}
        style={{ width: 36, height: 36, border: `1.5px dashed ${C.border}`, backgroundColor: 'transparent', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, color: C.warmGray }}>
        +
      </button>
    </div>
  )
}

/* ─── Image Uploader ─────────────────────────────────────────────── */
function ImageUploader({ label, value, onChange }) {
  const [uploading, setUploading] = useState(false)
  const [error, setError]         = useState('')
  const [dragOver, setDragOver]   = useState(false)
  const [tab, setTab]             = useState('upload') // 'upload' | 'url'
  const fileRef = useRef()

  async function handleFile(file) {
    if (!file) return
    const allowed = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/avif']
    if (!allowed.includes(file.type)) {
      setError('Please upload a JPG, PNG, WebP, GIF or AVIF image.')
      return
    }
    if (file.size > 8 * 1024 * 1024) {
      setError('File is too large. Max size is 8 MB.')
      return
    }
    setError('')
    setUploading(true)
    try {
      const fd = new FormData()
      fd.append('image', file)
      const res = await fetch('/api/upload', { method: 'POST', body: fd })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Upload failed')
      onChange(data.url)
    } catch (e) {
      setError(e.message || 'Upload failed. Please try again.')
    }
    setUploading(false)
  }

  function onInputChange(e) { handleFile(e.target.files[0]); e.target.value = '' }
  function onDrop(e) {
    e.preventDefault(); setDragOver(false)
    handleFile(e.dataTransfer.files[0])
  }

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
        <label style={lbl}>{label}</label>
        <div style={{ display: 'flex', gap: 0 }}>
          {['upload', 'url'].map(t => (
            <button key={t} type="button" onClick={() => setTab(t)}
              style={{ padding: '3px 10px', fontFamily: 'Montserrat, sans-serif', fontSize: '9px', letterSpacing: '0.15em', textTransform: 'uppercase', fontWeight: 600, cursor: 'pointer', border: `1px solid ${C.border}`, backgroundColor: tab === t ? C.charcoal : '#fff', color: tab === t ? '#fff' : C.warmGray, transition: 'all 0.12s' }}>
              {t === 'upload' ? '📁 Upload' : '🔗 URL'}
            </button>
          ))}
        </div>
      </div>

      {tab === 'upload' ? (
        <div
          onClick={() => !uploading && fileRef.current?.click()}
          onDragOver={e => { e.preventDefault(); setDragOver(true) }}
          onDragLeave={() => setDragOver(false)}
          onDrop={onDrop}
          style={{ border: `2px dashed ${dragOver ? C.charcoal : error ? '#ef4444' : C.border}`, padding: '18px 12px', textAlign: 'center', cursor: uploading ? 'default' : 'pointer', backgroundColor: dragOver ? '#faf7f4' : '#fff', transition: 'all 0.15s', position: 'relative' }}
        >
          <input ref={fileRef} type="file" accept="image/*" onChange={onInputChange} style={{ display: 'none' }} />
          {uploading ? (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
              <span style={{ display: 'inline-block', width: 22, height: 22, border: `2px solid ${C.border}`, borderTopColor: C.charcoal, borderRadius: '50%', animation: 'spin 0.7s linear infinite' }} />
              <p style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '11px', color: C.warmGray, margin: 0 }}>Uploading…</p>
            </div>
          ) : value ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, justifyContent: 'center' }}>
              <img src={value} alt="" style={{ width: 52, height: 68, objectFit: 'cover', border: `1px solid ${C.border}`, flexShrink: 0 }} onError={e => e.target.style.display='none'} />
              <div style={{ textAlign: 'left' }}>
                <p style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '11px', color: C.charcoal, margin: '0 0 4px', fontWeight: 600 }}>Image set ✓</p>
                <p style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '10px', color: C.warmGray, margin: 0 }}>Click or drag to replace</p>
              </div>
            </div>
          ) : (
            <div>
              <p style={{ fontSize: 28, margin: '0 0 6px' }}>🖼️</p>
              <p style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '12px', color: C.charcoal, margin: '0 0 3px', fontWeight: 600 }}>
                {dragOver ? 'Drop image here' : 'Click to upload or drag & drop'}
              </p>
              <p style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '10px', color: C.warmGray, margin: 0 }}>JPG, PNG, WebP — max 8 MB</p>
            </div>
          )}
        </div>
      ) : (
        <input className="inp-focus" value={value} onChange={e => onChange(e.target.value)}
          placeholder="https://…" style={inp} />
      )}

      {error && <p style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '11px', color: '#ef4444', margin: '5px 0 0' }}>{error}</p>}

      {tab === 'url' && value && (
        <img src={value} alt="" style={{ marginTop: 8, width: 72, height: 96, objectFit: 'cover', border: `1px solid ${C.border}`, display: 'block' }} onError={e => e.target.style.display='none'} />
      )}
    </div>
  )
}

/* ─── Quick Price Edit inline cell ───────────────────────────────── */
function QuickPriceCell({ value, onSave, placeholder = '0' }) {
  const [editing, setEditing] = useState(false)
  const [val, setVal] = useState(value ? String(value) : '')
  const ref = useRef()

  function commit() {
    setEditing(false)
    const n = parseInt(val, 10)
    if (!isNaN(n) && n !== value) onSave(n)
    else if (val === '' && value !== null) onSave(null)
  }

  if (!editing) {
    return (
      <button type="button" onClick={() => { setVal(value ? String(value) : ''); setEditing(true) }}
        style={{ background: 'none', border: '1px dashed transparent', cursor: 'text', padding: '3px 6px', fontFamily: 'Montserrat, sans-serif', fontSize: '13px', color: value ? C.charcoal : '#ccc', fontWeight: value ? 500 : 400, borderRadius: 0, textAlign: 'left', transition: 'border-color 0.15s' }}
        onMouseEnter={e => e.currentTarget.style.borderColor = C.border}
        onMouseLeave={e => e.currentTarget.style.borderColor = 'transparent'}
        title="Click to edit price"
      >
        {value ? `₦${value.toLocaleString('en-NG')}` : <span style={{ fontSize: 11, color: '#ccc' }}>{placeholder}</span>}
      </button>
    )
  }

  return (
    <input ref={ref} type="number" value={val} autoFocus
      onChange={e => setVal(e.target.value)}
      onBlur={commit}
      onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); commit() } if (e.key === 'Escape') setEditing(false) }}
      style={{ width: 100, padding: '3px 6px', border: `1px solid ${C.charcoal}`, outline: 'none', fontFamily: 'Montserrat, sans-serif', fontSize: '13px', color: C.charcoal }} />
  )
}

/* ═══════════════════════════════════════════════════════════════════
   MAIN ADMIN COMPONENT
═══════════════════════════════════════════════════════════════════ */
export default function Admin() {
  const [authed, setAuthed]   = useState(() => sessionStorage.getItem('tbl_admin') === '1')
  const [pw, setPw]           = useState('')
  const [pwError, setPwError] = useState(false)
  const [tab, setTab]         = useState('products') // 'orders' | 'products'

  /* ── Orders state ─────────────────────────────────────────────── */
  const [orderId, setOrderId]         = useState('')
  const [selectedStep, setSelected]   = useState(null)
  const [updating, setUpdating]       = useState(false)
  const [updateError, setUpdateError] = useState('')
  const [successLabel, setSuccess]    = useState('')

  /* ── Products state ───────────────────────────────────────────── */
  const [products, setProducts]             = useState([])
  const [prodLoading, setProdLoading]       = useState(true)
  const [editingId, setEditingId]           = useState(null)
  const [form, setForm]                     = useState(blankProduct())
  const [saving, setSaving]                 = useState(false)
  const [prodMsg, setProdMsg]               = useState({ type: '', text: '' })
  const [deleteConfirm, setDeleteConfirm]   = useState(null)
  const [search, setSearch]                 = useState('')
  const [filterCat, setFilterCat]           = useState('All')
  const [sortBy, setSortBy]                 = useState('default')

  /* ── Login ────────────────────────────────────────────────────── */
  function handleLogin(e) {
    e.preventDefault()
    if (pw === ADMIN_PASSWORD) { sessionStorage.setItem('tbl_admin', '1'); setAuthed(true) }
    else { setPwError(true); setTimeout(() => setPwError(false), 1500) }
  }

  useEffect(() => {
    if (!authed) return
    fetchProducts().then(p => { setProducts(p); setProdLoading(false) })
  }, [authed])

  /* ── Order update ─────────────────────────────────────────────── */
  const cleanId   = orderId.trim().replace(/^#/, '').toUpperCase()
  const canUpdate = !!(cleanId && selectedStep !== null)

  async function handleUpdate() {
    if (!canUpdate) return
    setUpdating(true); setUpdateError(''); setSuccess('')
    try {
      const allStepLabels = ['Order Placed', ...STEPS.map(s => s.label)]
      await updateCloudOrderStatus(cleanId, STEP_INDEX[STEPS[selectedStep].label], allStepLabels)
      setSuccess(STEPS[selectedStep].label)
      setSelected(null)
    } catch { setUpdateError('Could not reach the server. Please check your connection and try again.') }
    setUpdating(false)
  }

  /* ── Product helpers ──────────────────────────────────────────── */
  function notify(type, text) {
    setProdMsg({ type, text })
    setTimeout(() => setProdMsg({ type: '', text: '' }), 4000)
  }

  function startEdit(product) {
    setForm({
      ...product,
      price: String(product.price),
      originalPrice: product.originalPrice != null ? String(product.originalPrice) : '',
      colors: [...(product.colors || [])],
      sizes: [...(product.sizes || [])],
    })
    setEditingId(product.id)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  function startAdd() {
    setForm(blankProduct())
    setEditingId('new')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  function cancelEdit() { setEditingId(null); setForm(blankProduct()) }
  function setField(key, val) { setForm(f => ({ ...f, [key]: val })) }

  function toggleSize(size) {
    setForm(f => ({
      ...f,
      sizes: f.sizes.includes(size) ? f.sizes.filter(s => s !== size) : [...f.sizes, size],
    }))
  }

  async function handleSave() {
    if (!form.name.trim() || !form.price) return
    setSaving(true)
    const parsed = {
      ...form,
      price: parseInt(form.price, 10),
      originalPrice: form.originalPrice ? parseInt(form.originalPrice, 10) : null,
      id: editingId === 'new' ? Date.now() : form.id,
    }
    const updated = editingId === 'new'
      ? [...products, parsed]
      : products.map(p => p.id === editingId ? parsed : p)
    await saveProducts(updated)
    setProducts(updated)
    setSaving(false)
    setEditingId(null)
    notify('success', editingId === 'new' ? `"${parsed.name}" has been added.` : `"${parsed.name}" has been updated.`)
  }

  async function handleDelete(id) {
    const product = products.find(p => p.id === id)
    const updated = products.filter(p => p.id !== id)
    await saveProducts(updated)
    setProducts(updated)
    setDeleteConfirm(null)
    if (editingId === id) setEditingId(null)
    notify('info', `"${product?.name}" has been removed.`)
  }

  /* Quick inline price update */
  async function quickUpdatePrice(id, field, value) {
    const updated = products.map(p =>
      p.id === id ? { ...p, [field]: value } : p
    )
    await saveProducts(updated)
    setProducts(updated)
    notify('success', 'Price updated.')
  }

  /* ── Filtered / sorted product list ──────────────────────────── */
  const displayed = products
    .filter(p => filterCat === 'All' || p.category === filterCat)
    .filter(p => !search || p.name.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => {
      if (sortBy === 'price-asc')  return a.price - b.price
      if (sortBy === 'price-desc') return b.price - a.price
      if (sortBy === 'name-asc')   return a.name.localeCompare(b.name)
      return 0
    })

  /* ── Login screen ─────────────────────────────────────────────── */
  if (!authed) return (
    <div style={{ minHeight: '100vh', backgroundColor: C.charcoal, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      <div style={{ backgroundColor: '#fff', padding: '48px 40px', width: '100%', maxWidth: '380px' }}>
        <p style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '9px', letterSpacing: '0.4em', textTransform: 'uppercase', color: C.blush, margin: '0 0 10px', textAlign: 'center' }}>The Beeive Label</p>
        <h1 style={{ fontFamily: '"Cormorant Garamond", serif', fontSize: '1.8rem', fontWeight: 300, color: C.charcoal, margin: '0 0 36px', textAlign: 'center' }}>Owner Portal</h1>
        <form onSubmit={handleLogin}>
          <label style={lbl}>Password</label>
          <input type="password" value={pw} onChange={e => setPw(e.target.value)}
            placeholder="Enter admin password" autoFocus
            style={{ ...inp, marginBottom: '16px', borderColor: pwError ? '#ef4444' : C.border }} />
          {pwError && <p style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '11px', color: '#ef4444', margin: '-8px 0 14px' }}>Incorrect password.</p>}
          <button type="submit" style={{ width: '100%', padding: '14px', backgroundColor: C.charcoal, color: '#fff', border: 'none', cursor: 'pointer', fontFamily: 'Montserrat, sans-serif', fontSize: '10px', letterSpacing: '0.28em', textTransform: 'uppercase', fontWeight: 600 }}>
            Sign In
          </button>
        </form>
      </div>
    </div>
  )

  /* ── Dashboard ────────────────────────────────────────────────── */
  return (
    <div style={{ minHeight: '100vh', backgroundColor: C.lightBg, fontFamily: 'Montserrat, sans-serif' }}>
      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(-6px); } to { opacity: 1; transform: translateY(0); } }
        .adm-tab { background: none; border: none; cursor: pointer; padding: 13px 30px; font-family: Montserrat,sans-serif; font-size: 11px; letter-spacing: 0.22em; text-transform: uppercase; font-weight: 600; transition: all 0.15s; }
        .adm-tab.active { border-bottom: 2.5px solid ${C.blush}; color: ${C.charcoal}; }
        .adm-tab:not(.active) { color: ${C.warmGray}; border-bottom: 2.5px solid transparent; }
        .adm-tab:not(.active):hover { color: ${C.charcoal}; }
        .prod-row { transition: background 0.12s; }
        .prod-row:hover { background: #fdf9f6 !important; }
        .prod-row:hover .row-actions { opacity: 1 !important; }
        .row-actions { opacity: 0; transition: opacity 0.15s; }
        .inp-focus:focus { border-color: ${C.charcoal} !important; }
        .badge { display: inline-block; padding: 2px 7px; font-size: 9px; letter-spacing: 0.12em; font-weight: 600; text-transform: uppercase; }
        .stat-card { background: #fff; border: 1px solid ${C.border}; padding: 20px 24px; }
      `}</style>

      {/* ── Top bar ── */}
      <div style={{ backgroundColor: C.charcoal, padding: '0 2rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 64 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <div>
            <p style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '8px', letterSpacing: '0.38em', textTransform: 'uppercase', color: C.blush, margin: '0 0 1px' }}>The Beeive Label</p>
            <p style={{ fontFamily: '"Cormorant Garamond", serif', fontSize: '1.25rem', fontWeight: 300, color: '#fff', margin: 0 }}>Owner Dashboard</p>
          </div>
        </div>
        <button onClick={() => { sessionStorage.removeItem('tbl_admin'); setAuthed(false) }}
          style={{ background: 'none', border: '1px solid rgba(255,255,255,0.2)', color: 'rgba(255,255,255,0.55)', cursor: 'pointer', padding: '7px 16px', fontFamily: 'Montserrat, sans-serif', fontSize: '9px', letterSpacing: '0.2em', textTransform: 'uppercase' }}>
          Sign Out
        </button>
      </div>

      {/* ── Tabs ── */}
      <div style={{ backgroundColor: '#fff', borderBottom: `1px solid ${C.border}`, display: 'flex', paddingLeft: '1rem' }}>
        <button className={`adm-tab ${tab === 'products' ? 'active' : ''}`} onClick={() => setTab('products')}>
          🛍️ Products
        </button>
        <button className={`adm-tab ${tab === 'orders' ? 'active' : ''}`} onClick={() => setTab('orders')}>
          📦 Orders
        </button>
      </div>

      {/* ══════════════════════════════════════════════════
          PRODUCTS TAB
      ══════════════════════════════════════════════════ */}
      {tab === 'products' && (
        <div style={{ maxWidth: 1100, margin: '0 auto', padding: '32px 1.5rem 80px' }}>

          {/* Toast notification */}
          {prodMsg.text && (
            <div style={{ backgroundColor: prodMsg.type === 'success' ? '#f0fdf4' : '#eff6ff', border: `1px solid ${prodMsg.type === 'success' ? '#bbf7d0' : '#bfdbfe'}`, padding: '13px 18px', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px', animation: 'fadeIn 0.2s ease' }}>
              <svg width="16" height="16" fill="none" stroke={prodMsg.type === 'success' ? '#16a34a' : '#2563eb'} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7"/></svg>
              <p style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '12px', color: prodMsg.type === 'success' ? '#14532d' : '#1e3a8a', margin: 0 }}>{prodMsg.text}</p>
            </div>
          )}

          {/* ── Stats row ── */}
          {editingId === null && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginBottom: 28 }}>
              {[
                { label: 'Total Products', value: products.length, icon: '🛍️' },
                { label: 'On Sale', value: products.filter(p => p.originalPrice).length, icon: '🏷️' },
                { label: 'New Arrivals', value: products.filter(p => p.isNew).length, icon: '✨' },
                { label: 'Best Sellers', value: products.filter(p => p.isBestSeller).length, icon: '⭐' },
              ].map(s => (
                <div key={s.label} className="stat-card">
                  <p style={{ fontSize: 22, margin: '0 0 6px' }}>{s.icon}</p>
                  <p style={{ fontFamily: '"Cormorant Garamond", serif', fontSize: '1.9rem', fontWeight: 400, color: C.charcoal, margin: '0 0 2px', lineHeight: 1 }}>{s.value}</p>
                  <p style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '9px', letterSpacing: '0.18em', color: C.warmGray, margin: 0, textTransform: 'uppercase' }}>{s.label}</p>
                </div>
              ))}
            </div>
          )}

          {/* ── Add / Edit Form ── */}
          {editingId !== null && (
            <div style={{ backgroundColor: '#fff', border: `1px solid ${C.border}`, padding: '32px', marginBottom: '28px', animation: 'fadeIn 0.2s ease' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '28px' }}>
                <div>
                  <p style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '9px', letterSpacing: '0.3em', textTransform: 'uppercase', color: C.blush, margin: '0 0 4px' }}>
                    {editingId === 'new' ? 'New Product' : 'Editing Product'}
                  </p>
                  <h2 style={{ fontFamily: '"Cormorant Garamond", serif', fontSize: '1.6rem', fontWeight: 400, color: C.charcoal, margin: 0 }}>
                    {editingId === 'new' ? 'Add New Product' : form.name || 'Edit Product'}
                  </h2>
                </div>
                <button onClick={cancelEdit} style={{ background: 'none', border: 'none', cursor: 'pointer', color: C.warmGray, fontSize: 22, lineHeight: 1, padding: 4 }} title="Cancel">×</button>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '18px' }}>

                {/* Product Name */}
                <div style={{ gridColumn: '1 / -1' }}>
                  <label style={lbl}>Product Name *</label>
                  <input className="inp-focus" value={form.name} onChange={e => setField('name', e.target.value)}
                    placeholder="e.g. The Adaeze Wrap Dress" style={inp} />
                </div>

                {/* Tagline */}
                <div style={{ gridColumn: '1 / -1' }}>
                  <label style={lbl}>Tagline / Description</label>
                  <textarea className="inp-focus" value={form.tagline} onChange={e => setField('tagline', e.target.value)}
                    placeholder="Short description of the product…" rows={2}
                    style={{ ...inp, resize: 'vertical', fontFamily: 'Montserrat, sans-serif' }} />
                </div>

                {/* ── Pricing section ── */}
                <div style={{ gridColumn: '1 / -1', borderTop: `1px solid ${C.border}`, borderBottom: `1px solid ${C.border}`, padding: '18px 0', margin: '4px 0' }}>
                  <p style={{ ...lbl, margin: '0 0 14px', color: C.charcoal }}>Pricing</p>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                    <div>
                      <label style={lbl}>Selling Price (₦) *</label>
                      <div style={{ position: 'relative' }}>
                        <span style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', fontFamily: 'Montserrat, sans-serif', fontSize: 14, color: C.warmGray, pointerEvents: 'none' }}>₦</span>
                        <input className="inp-focus" type="number" value={form.price} onChange={e => setField('price', e.target.value)}
                          placeholder="85000" style={{ ...inp, paddingLeft: 26 }} />
                      </div>
                      {form.price && <p style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '11px', color: C.blush, margin: '4px 0 0' }}>= {parseInt(form.price || 0).toLocaleString('en-NG')} Naira</p>}
                    </div>
                    <div>
                      <label style={lbl}>Original / Was Price (₦) — leave blank if no sale</label>
                      <div style={{ position: 'relative' }}>
                        <span style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', fontFamily: 'Montserrat, sans-serif', fontSize: 14, color: C.warmGray, pointerEvents: 'none' }}>₦</span>
                        <input className="inp-focus" type="number" value={form.originalPrice} onChange={e => setField('originalPrice', e.target.value)}
                          placeholder="100000" style={{ ...inp, paddingLeft: 26 }} />
                      </div>
                      {form.originalPrice && form.price && (
                        <p style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '11px', color: '#ef4444', margin: '4px 0 0' }}>
                          {Math.round((1 - parseInt(form.price) / parseInt(form.originalPrice)) * 100)}% off
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Category */}
                <div>
                  <label style={lbl}>Category</label>
                  <select className="inp-focus" value={form.category} onChange={e => setField('category', e.target.value)} style={{ ...inp, cursor: 'pointer' }}>
                    {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>

                {/* Badges */}
                <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', paddingBottom: '2px', gap: 10 }}>
                  {[['isNew', '✨ Mark as New Arrival'], ['isBestSeller', '⭐ Mark as Best Seller']].map(([key, text]) => (
                    <label key={key} style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', fontFamily: 'Montserrat, sans-serif', fontSize: '12px', color: C.charcoal, fontWeight: 500 }}>
                      <input type="checkbox" checked={form[key]} onChange={e => setField(key, e.target.checked)}
                        style={{ width: 16, height: 16, accentColor: C.charcoal, cursor: 'pointer' }} />
                      {text}
                    </label>
                  ))}
                </div>

                {/* Sizes */}
                <div style={{ gridColumn: '1 / -1' }}>
                  <label style={lbl}>Sizes Available</label>
                  <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                    {ALL_SIZES.map(size => {
                      const on = form.sizes.includes(size)
                      return (
                        <button key={size} type="button" onClick={() => toggleSize(size)}
                          style={{ padding: '8px 16px', border: `1.5px solid ${on ? C.charcoal : C.border}`, backgroundColor: on ? C.charcoal : '#fff', color: on ? '#fff' : C.charcoal, cursor: 'pointer', fontFamily: 'Montserrat, sans-serif', fontSize: '11px', fontWeight: 600, transition: 'all 0.12s' }}>
                          {size}
                        </button>
                      )
                    })}
                  </div>
                </div>

                {/* Colors */}
                <div style={{ gridColumn: '1 / -1' }}>
                  <label style={lbl}>Available Colors</label>
                  <ColorList colors={form.colors} onChange={v => setField('colors', v)} />
                  <p style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '10px', color: C.warmGray, margin: '6px 0 0' }}>Click a swatch to change color, + to add, × to remove.</p>
                </div>

                {/* Images */}
                <div>
                  <ImageUploader
                    label="Main Image"
                    value={form.img}
                    onChange={v => setField('img', v)}
                  />
                </div>
                <div>
                  <ImageUploader
                    label="Hover Image"
                    value={form.imgHover}
                    onChange={v => setField('imgHover', v)}
                  />
                </div>
              </div>

              {/* Action buttons */}
              <div style={{ display: 'flex', gap: '12px', alignItems: 'center', marginTop: '28px', paddingTop: '20px', borderTop: `1px solid ${C.border}` }}>
                <Btn onClick={handleSave} disabled={saving || !form.name.trim() || !form.price}>
                  {saving ? <><Spinner />Saving…</> : editingId === 'new' ? '+ Add Product' : 'Save Changes'}
                </Btn>
                <Btn onClick={cancelEdit} variant="ghost">Cancel</Btn>
                {editingId !== 'new' && (
                  <Btn onClick={() => setDeleteConfirm(editingId)} variant="ghost" style={{ color: '#ef4444', borderColor: '#fca5a5', marginLeft: 'auto' }}>
                    Delete Product
                  </Btn>
                )}
              </div>
            </div>
          )}

          {/* ── Toolbar (search + filter + add) ── */}
          <div style={{ display: 'flex', gap: 10, marginBottom: 16, flexWrap: 'wrap', alignItems: 'center' }}>
            {/* Search */}
            <div style={{ position: 'relative', flex: '1 1 220px' }}>
              <svg width="14" height="14" fill="none" stroke={C.warmGray} viewBox="0 0 24 24"
                style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }}>
                <circle cx="11" cy="11" r="8"/><path strokeLinecap="round" d="m21 21-4.35-4.35"/>
              </svg>
              <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search products…"
                style={{ ...inp, paddingLeft: 34, fontSize: 13 }} />
            </div>
            {/* Category filter */}
            <select value={filterCat} onChange={e => setFilterCat(e.target.value)}
              style={{ ...inp, width: 'auto', cursor: 'pointer', fontSize: 13, paddingRight: 32 }}>
              <option value="All">All Categories</option>
              {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
            {/* Sort */}
            <select value={sortBy} onChange={e => setSortBy(e.target.value)}
              style={{ ...inp, width: 'auto', cursor: 'pointer', fontSize: 13, paddingRight: 32 }}>
              <option value="default">Default Order</option>
              <option value="price-asc">Price: Low → High</option>
              <option value="price-desc">Price: High → Low</option>
              <option value="name-asc">Name A–Z</option>
            </select>
            <Btn onClick={editingId === null ? startAdd : undefined} disabled={editingId !== null}
              style={{ flexShrink: 0 }}>
              <span style={{ fontSize: 16, fontWeight: 300, lineHeight: 1 }}>+</span> Add Product
            </Btn>
          </div>

          {/* ── Products table ── */}
          {prodLoading ? (
            <div style={{ backgroundColor: '#fff', border: `1px solid ${C.border}`, padding: '60px', textAlign: 'center', color: C.warmGray, fontSize: 13 }}>
              <Spinner color={C.warmGray} size={20} /><br /><br />Loading products…
            </div>
          ) : (
            <div style={{ backgroundColor: '#fff', border: `1px solid ${C.border}` }}>
              {/* Table header */}
              <div style={{ padding: '11px 20px', borderBottom: `1px solid ${C.border}`, display: 'grid', gridTemplateColumns: '64px 1fr 140px 140px 88px 80px 120px', gap: '10px', alignItems: 'center', backgroundColor: C.lightBg }}>
                {['', 'Product', 'Price', 'Was (sale)', 'Category', 'Tags', 'Actions'].map(h => (
                  <span key={h} style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '9px', letterSpacing: '0.2em', textTransform: 'uppercase', color: C.warmGray, fontWeight: 700 }}>{h}</span>
                ))}
              </div>

              {displayed.map((product, idx) => (
                <div key={product.id} className="prod-row"
                  style={{ padding: '12px 20px', borderBottom: idx < displayed.length - 1 ? `1px solid ${C.border}` : 'none', display: 'grid', gridTemplateColumns: '64px 1fr 140px 140px 88px 80px 120px', gap: '10px', alignItems: 'center', backgroundColor: editingId === product.id ? '#fdf9f6' : '#fff' }}>

                  {/* Thumbnail */}
                  <div style={{ position: 'relative' }}>
                    {product.img
                      ? <img src={product.img} alt={product.name} style={{ width: 50, height: 66, objectFit: 'cover', border: `1px solid ${C.border}`, display: 'block' }} />
                      : <div style={{ width: 50, height: 66, backgroundColor: '#f0ebe5', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20 }}>👗</div>
                    }
                  </div>

                  {/* Name & tagline */}
                  <div>
                    <p style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '12px', fontWeight: 700, color: C.charcoal, margin: '0 0 3px' }}>{product.name}</p>
                    {product.tagline && <p style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '10px', color: C.warmGray, margin: 0, lineHeight: 1.4, overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>{product.tagline}</p>}
                  </div>

                  {/* Selling Price — click to edit inline */}
                  <div>
                    <QuickPriceCell
                      value={product.price}
                      onSave={v => quickUpdatePrice(product.id, 'price', v)}
                    />
                    <p style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '9px', color: C.warmGray, margin: '2px 0 0 6px', letterSpacing: '0.1em' }}>click to edit</p>
                  </div>

                  {/* Was/sale price — click to edit inline */}
                  <div>
                    <QuickPriceCell
                      value={product.originalPrice}
                      onSave={v => quickUpdatePrice(product.id, 'originalPrice', v)}
                      placeholder="no sale"
                    />
                    {product.originalPrice && (
                      <p style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '9px', color: '#ef4444', margin: '2px 0 0 6px' }}>
                        {Math.round((1 - product.price / product.originalPrice) * 100)}% off
                      </p>
                    )}
                  </div>

                  {/* Category */}
                  <span style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '10px', color: C.warmGray, letterSpacing: '0.08em' }}>{product.category}</span>

                  {/* Tags */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                    {product.isNew && <span className="badge" style={{ backgroundColor: C.blush, color: '#fff' }}>New</span>}
                    {product.isBestSeller && <span className="badge" style={{ backgroundColor: C.charcoal, color: '#fff' }}>Top</span>}
                    {product.originalPrice && <span className="badge" style={{ backgroundColor: '#ef4444', color: '#fff' }}>Sale</span>}
                  </div>

                  {/* Actions */}
                  <div className="row-actions" style={{ display: 'flex', gap: 6, opacity: 1 }}>
                    <button onClick={() => startEdit(product)}
                      style={{ backgroundColor: C.charcoal, color: '#fff', border: 'none', cursor: 'pointer', padding: '6px 13px', fontFamily: 'Montserrat, sans-serif', fontSize: '9px', letterSpacing: '0.15em', textTransform: 'uppercase', fontWeight: 600 }}>
                      Edit
                    </button>
                    {deleteConfirm === product.id ? (
                      <button onClick={() => handleDelete(product.id)}
                        style={{ backgroundColor: '#ef4444', color: '#fff', border: 'none', cursor: 'pointer', padding: '6px 10px', fontFamily: 'Montserrat, sans-serif', fontSize: '9px', letterSpacing: '0.1em', textTransform: 'uppercase', fontWeight: 600 }}>
                        Sure?
                      </button>
                    ) : (
                      <button onClick={() => setDeleteConfirm(product.id)}
                        style={{ backgroundColor: 'transparent', color: '#ef4444', border: '1px solid #fca5a5', cursor: 'pointer', padding: '6px 10px', fontFamily: 'Montserrat, sans-serif', fontSize: '9px', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                        Del
                      </button>
                    )}
                  </div>
                </div>
              ))}

              {displayed.length === 0 && !prodLoading && (
                <div style={{ padding: '50px', textAlign: 'center', color: C.warmGray, fontFamily: 'Montserrat, sans-serif', fontSize: '13px' }}>
                  {search || filterCat !== 'All'
                    ? <>No products match your filters. <button onClick={() => { setSearch(''); setFilterCat('All') }} style={{ background: 'none', border: 'none', cursor: 'pointer', color: C.blush, textDecoration: 'underline', fontFamily: 'Montserrat, sans-serif', fontSize: 13 }}>Clear filters</button></>
                    : 'No products yet. Click "Add Product" to get started.'
                  }
                </div>
              )}
            </div>
          )}

          {/* ── Delete confirmation modal ── */}
          {deleteConfirm && deleteConfirm !== editingId && (
            <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.45)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 999 }}>
              <div style={{ backgroundColor: '#fff', padding: '36px', width: '100%', maxWidth: 360, textAlign: 'center', animation: 'fadeIn 0.15s ease' }}>
                <p style={{ fontSize: 36, margin: '0 0 12px' }}>🗑️</p>
                <h3 style={{ fontFamily: '"Cormorant Garamond", serif', fontSize: '1.4rem', fontWeight: 400, color: C.charcoal, margin: '0 0 10px' }}>Delete Product?</h3>
                <p style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '12px', color: C.warmGray, margin: '0 0 28px', lineHeight: 1.6 }}>
                  "{products.find(p => p.id === deleteConfirm)?.name}" will be permanently removed. This cannot be undone.
                </p>
                <div style={{ display: 'flex', gap: 10, justifyContent: 'center' }}>
                  <Btn onClick={() => handleDelete(deleteConfirm)} variant="danger">Yes, Delete</Btn>
                  <Btn onClick={() => setDeleteConfirm(null)} variant="ghost">Cancel</Btn>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ══════════════════════════════════════════════════
          ORDERS TAB
      ══════════════════════════════════════════════════ */}
      {tab === 'orders' && (
        <div style={{ maxWidth: '560px', margin: '0 auto', padding: '32px 1.5rem 80px' }}>

          <div style={{ backgroundColor: '#fff', border: `1px solid ${C.border}`, padding: '24px', marginBottom: '16px' }}>
            <label style={lbl}>Order Number</label>
            <input value={orderId} onChange={e => { setOrderId(e.target.value); setSuccess('') }}
              placeholder="e.g. TBL-LTM9SF" autoComplete="off" autoCorrect="off" autoCapitalize="characters" spellCheck={false}
              style={{ ...inp, letterSpacing: '0.08em' }} />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '16px' }}>
            {STEPS.map((step, i) => {
              const isSelected = selectedStep === i
              return (
                <button key={step.label} onClick={() => { setSelected(i); setSuccess('') }}
                  style={{ display: 'flex', alignItems: 'center', gap: '14px', padding: '14px 18px', textAlign: 'left', cursor: 'pointer', border: `2px solid ${isSelected ? C.charcoal : C.border}`, backgroundColor: isSelected ? C.charcoal : '#fff', transition: 'all 0.15s ease', outline: 'none' }}>
                  <span style={{ fontSize: '20px', flexShrink: 0 }}>{step.emoji}</span>
                  <div style={{ flex: 1 }}>
                    <p style={{ fontSize: '13px', fontWeight: 600, color: isSelected ? '#fff' : C.charcoal, margin: '0 0 1px' }}>{step.label}</p>
                    <p style={{ fontSize: '10px', color: isSelected ? 'rgba(255,255,255,0.6)' : C.warmGray, margin: 0, fontWeight: 300 }}>{step.desc}</p>
                  </div>
                  {isSelected && <svg width="16" height="16" fill="none" stroke="#fff" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7"/></svg>}
                </button>
              )
            })}
          </div>

          {successLabel && (
            <div style={{ backgroundColor: '#f0fdf4', border: '1px solid #bbf7d0', padding: '14px 18px', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <svg width="18" height="18" fill="none" stroke="#16a34a" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7"/></svg>
              <p style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '12px', color: '#14532d', margin: 0, fontWeight: 500 }}>
                Order <strong>{cleanId}</strong> updated to <strong>{successLabel}</strong>.
              </p>
            </div>
          )}

          {updateError && (
            <div style={{ backgroundColor: '#fef2f2', border: '1px solid #fecaca', padding: '14px 18px', marginBottom: '16px' }}>
              <p style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '12px', color: '#991b1b', margin: 0 }}>⚠️ {updateError}</p>
            </div>
          )}

          <button onClick={handleUpdate} disabled={!canUpdate || updating}
            style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', padding: '16px', border: 'none', backgroundColor: !canUpdate ? '#d1d5db' : updating ? '#a3a3a3' : C.charcoal, color: '#fff', fontFamily: 'Montserrat, sans-serif', fontSize: '11px', letterSpacing: '0.3em', textTransform: 'uppercase', fontWeight: 700, cursor: canUpdate && !updating ? 'pointer' : 'not-allowed', transition: 'background-color 0.2s ease' }}>
            {updating
              ? <><Spinner />Updating…</>
              : canUpdate ? `Update to "${STEPS[selectedStep].label}"` : 'Enter order number & select status'
            }
          </button>
        </div>
      )}
    </div>
  )
}
