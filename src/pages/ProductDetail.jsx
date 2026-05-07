import React, { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { products as staticProducts, formatPrice } from '../data/products'

const C = {
  charcoal: '#2c2c2c', blush: '#c4a28a', blushDark: '#a88070',
  cream: '#faf7f4', warmGray: '#8a7f7a', border: '#e0d8d0', bg: '#f5f0eb',
}

const COLOR_NAMES = {
  '#2c2c2c': 'Charcoal', '#c4a28a': 'Blush', '#8a7f7a': 'Warm Stone',
  '#f5f0eb': 'Ivory', '#ffffff': 'White', '#000000': 'Black',
}

/* Extra detail copy for original products */
const DETAILS = {
  1: { material: 'Premium Akwete Fabric', care: 'Hand wash cold · Do not tumble dry · Iron on low', description: 'Crafted from premium Akwete fabric, this piece embodies quiet elegance and timeless style. The Adaeze Wrap Dress is designed for the woman who moves through the world with intention — cinched at the waist, fluid through the hem, and effortless in every setting.', features: ['Adjustable wrap tie', 'V-neckline', 'Flowy midi length', 'Premium Akwete fabric'], fit: 'True to size. Model is 5\'8" wearing size S.' },
  2: { material: '100% Cotton Ankara', care: 'Machine wash cold · Hang dry · Iron on medium', description: 'Bold, elegant, and made for women who own every room they walk into. The Amara Power Set is crafted from 100% cotton Ankara — lightweight, breathable, and designed for effortless elegance.', features: ['100% cotton Ankara', 'Lightweight and breathable', 'Structured tailored fit', 'Wear as co-ord or separates'], fit: 'Slightly fitted through the shoulders. Size up if between sizes.' },
  3: { material: 'Rich Akwete Fabric', care: 'Hand wash cold · Lay flat to dry · Steam to remove wrinkles', description: 'Crafted from rich Akwete fabric, this piece is designed to stand out effortlessly. The Chioma Luxe Maxi drapes from the shoulder in a fluid column that elongates the figure beautifully.', features: ['Floor-length maxi cut', 'Adjustable shoulder straps', 'Hidden side zip', 'Rich Akwete fabric'], fit: 'True to size. Fits beautifully on all frames.' },
  4: { material: '100% Cotton Ankara', care: 'Machine wash cold · Hang dry · Do not bleach', description: 'Lightweight, breathable, and designed for effortless elegance. The Zara Work Jumpsuit is the ultimate one-piece solution for the woman who refuses to compromise on style or ease.', features: ['100% cotton Ankara', 'Lightweight and breathable', 'Straight-leg trouser', 'Belt loops — wear with or without'], fit: 'Slim through the torso. Size up one for a relaxed fit.' },
  5: { material: 'Premium Akwete Fabric', care: 'Hand wash cold · Reshape and lay flat to dry', description: 'Crafted from premium Akwete fabric, the Nneka Everyday Midi embodies quiet elegance and timeless style. This is your everyday anchor — the piece you reach for when you want to look put-together without trying.', features: ['Premium Akwete fabric', 'A-line midi skirt', 'Side pockets', 'Smocked elastic waistband'], fit: 'Relaxed fit. Model is 5\'7" wearing size M.' },
  6: { material: 'Rich Akwete Fabric', care: 'Dry clean recommended · Steam to press', description: 'Crafted from rich Akwete fabric, this piece is designed to stand out effortlessly. The Ogechi Blazer Co-ord is for the woman who leads — a sharp longline blazer paired with wide-cut tailored trousers.', features: ['Rich Akwete fabric', 'Longline oversized blazer', 'Matching wide-leg trouser', 'Wear as co-ord or separates'], fit: 'Oversized blazer — true to size. Trousers are high-waist.' },
  7: { material: '100% Cotton Ankara', care: 'Hand wash cold · Drip dry · Iron on low', description: 'Bold, elegant, and made for women who own every room they walk into. The Lara Evening Dress is crafted from 100% cotton Ankara — a fluid silhouette that moves like a second skin.', features: ['100% cotton Ankara', 'Lightweight and breathable', 'Bias-cut for body-skimming drape', 'Hidden back zip'], fit: 'Fitted through the body — true to size.' },
  8: { material: 'Premium Akwete Fabric', care: 'Machine wash cold · Hang dry · Iron on low', description: 'Crafted from premium Akwete fabric, The Sade Slit Gown is quiet confidence made wearable — a column silhouette with a high neckline and a dramatic front slit.', features: ['Premium Akwete fabric', 'High mock neckline', 'Column silhouette', 'Dramatic front slit'], fit: 'Slim fit — size up one for a more relaxed silhouette.' },
}

function StarRating() {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
      {[1,2,3,4,5].map(i => (
        <svg key={i} width="13" height="13" fill={C.blush} stroke={C.blush} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
        </svg>
      ))}
      <span style={{ fontFamily: 'Montserrat, sans-serif', fontSize: 11, color: C.warmGray }}>(24 reviews)</span>
    </div>
  )
}

/* ── Skeleton loader ──────────────────────────────────────────────── */
function Skeleton() {
  return (
    <div style={{ backgroundColor: C.cream, minHeight: '80vh' }}>
      <style>{`@keyframes shimmer { 0%{background-position:-400px 0} 100%{background-position:400px 0} }
        .sk { background: linear-gradient(90deg,#f0ebe5 25%,#e8e0d8 50%,#f0ebe5 75%); background-size:800px 100%; animation:shimmer 1.4s infinite; }`}
      </style>
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '48px 2rem', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 56, alignItems: 'start' }}>
        <div>
          <div className="sk" style={{ aspectRatio: '3/4', borderRadius: 2 }} />
          <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
            {[1,2,3].map(i => <div key={i} className="sk" style={{ width: 72, height: 88 }} />)}
          </div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16, paddingTop: 8 }}>
          <div className="sk" style={{ height: 12, width: '30%', borderRadius: 2 }} />
          <div className="sk" style={{ height: 40, width: '80%', borderRadius: 2 }} />
          <div className="sk" style={{ height: 18, width: '40%', borderRadius: 2 }} />
          <div className="sk" style={{ height: 28, width: '50%', borderRadius: 2 }} />
          <div className="sk" style={{ height: 1, width: '100%' }} />
          <div className="sk" style={{ height: 14, width: '25%', borderRadius: 2 }} />
          <div style={{ display: 'flex', gap: 8 }}>
            {[1,2,3].map(i => <div key={i} className="sk" style={{ width: 28, height: 28, borderRadius: '50%' }} />)}
          </div>
          <div className="sk" style={{ height: 14, width: '20%', borderRadius: 2, marginTop: 4 }} />
          <div style={{ display: 'flex', gap: 8 }}>
            {[1,2,3,4].map(i => <div key={i} className="sk" style={{ width: 48, height: 48 }} />)}
          </div>
          <div className="sk" style={{ height: 52, width: '100%', borderRadius: 2, marginTop: 8 }} />
          <div className="sk" style={{ height: 52, width: '100%', borderRadius: 2 }} />
        </div>
      </div>
    </div>
  )
}

/* ═══════════════════════════════════════════════════════════════════ */
export default function ProductDetail({ addToCart, wishlist, toggleWishlist }) {
  const { id } = useParams()
  const numId  = Number(id)

  const [product, setProduct]       = useState(null)
  const [loading, setLoading]       = useState(true)
  const [allProducts, setAllProducts] = useState([])

  const [activeImg, setActiveImg]     = useState(0)
  const [selectedSize, setSelectedSize] = useState('')
  const [selectedColor, setSelectedColor] = useState('')
  const [qty, setQty]                 = useState(1)
  const [added, setAdded]             = useState(false)
  const [sizeError, setSizeError]     = useState(false)
  const [activeTab, setActiveTab]     = useState('description')

  /* ── Fetch product ─────────────────────────────────────────────── */
  useEffect(() => {
    setLoading(true)
    setProduct(null)
    setActiveImg(0)
    setSelectedSize('')
    setSizeError(false)
    setAdded(false)
    setActiveTab('description')

    fetch('/api/products')
      .then(r => r.json())
      .then(data => {
        const list = (data.products && data.products.length) ? data.products : staticProducts
        setAllProducts(list)
        const found = list.find(p => p.id === numId)
        setProduct(found || null)
        if (found) setSelectedColor(found.colors?.[0] || '')
      })
      .catch(() => {
        const found = staticProducts.find(p => p.id === numId)
        setAllProducts(staticProducts)
        setProduct(found || null)
        if (found) setSelectedColor(found.colors?.[0] || '')
      })
      .finally(() => setLoading(false))
  }, [id])

  /* ── Loading ──────────────────────────────────────────────────── */
  if (loading) return <Skeleton />

  /* ── Not found ────────────────────────────────────────────────── */
  if (!product) return (
    <div style={{ minHeight: '70vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 16, fontFamily: 'Montserrat, sans-serif', backgroundColor: C.cream }}>
      <p style={{ fontSize: 48, margin: 0 }}>🐝</p>
      <p style={{ color: C.warmGray, fontSize: 13, letterSpacing: '0.05em' }}>This product could not be found.</p>
      <Link to="/" style={{ color: C.charcoal, fontSize: '10px', letterSpacing: '0.25em', textTransform: 'uppercase', textDecoration: 'none', borderBottom: `1px solid ${C.charcoal}`, paddingBottom: 2 }}>← Back to Shop</Link>
    </div>
  )

  /* ── Derived ──────────────────────────────────────────────────── */
  const details  = DETAILS[numId] || {}
  const imgList  = [product.img, product.imgHover].filter(Boolean)
  const related  = allProducts.filter(p => p.id !== numId && p.category === product.category).slice(0, 3)
  const isWishlisted = wishlist?.includes(product.id)
  const discount = product.originalPrice
    ? Math.round((1 - product.price / product.originalPrice) * 100)
    : null

  function handleAddToCart() {
    if (!selectedSize) { setSizeError(true); return }
    setSizeError(false)
    addToCart({ ...product, selectedSize, selectedColor, qty })
    setAdded(true)
    setTimeout(() => setAdded(false), 2000)
  }

  const waLink = `https://wa.me/2349013019836?text=Hi%2C%20I%27m%20interested%20in%20ordering%20*${encodeURIComponent(product.name)}*%20%E2%80%94%20Size%3A%20${selectedSize || 'TBD'}%20%E2%80%94%20${encodeURIComponent(formatPrice(product.price))}`

  return (
    <div style={{ backgroundColor: C.cream, minHeight: '100vh' }}>
      <style>{`
        @keyframes fadeUp { from { opacity:0; transform:translateY(12px) } to { opacity:1; transform:translateY(0) } }
        .pd-size-btn { width:48px; height:48px; font-family:Montserrat,sans-serif; font-size:11px; letter-spacing:0.08em; cursor:pointer; border:1px solid; transition:all 0.12s; }
        .pd-tab-btn { font-family:Montserrat,sans-serif; font-size:10px; letter-spacing:0.22em; text-transform:uppercase; background:none; border:none; border-bottom:2px solid transparent; padding:14px 24px; cursor:pointer; transition:all 0.15s; }
        .pd-tab-btn.active { border-bottom-color:${C.charcoal}; color:${C.charcoal}; }
        .pd-tab-btn:not(.active) { color:${C.warmGray}; }
        .pd-tab-btn:not(.active):hover { color:${C.charcoal}; }
        .pd-thumb { width:68px; height:88px; overflow:hidden; cursor:pointer; border:2px solid transparent; flex-shrink:0; background:${C.bg}; transition:border-color 0.15s; }
        .pd-thumb.active { border-color:${C.charcoal}; }
        .pd-thumb:hover:not(.active) { border-color:${C.blush}; }
        .pd-related:hover img { transform:scale(1.04) !important; }
      `}</style>

      {/* ── Breadcrumb ── */}
      <div style={{ backgroundColor: '#fff', borderBottom: `1px solid ${C.border}` }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '13px 2rem', display: 'flex', alignItems: 'center', gap: 8 }}>
          {[['Home', '/'], [product.category, '/'], [product.name, null]].map(([label, to], i, arr) => (
            <React.Fragment key={i}>
              {to
                ? <Link to={to} style={{ fontFamily: 'Montserrat,sans-serif', fontSize: 10, letterSpacing: '0.18em', textTransform: 'uppercase', color: C.warmGray, textDecoration: 'none' }}>{label}</Link>
                : <span style={{ fontFamily: 'Montserrat,sans-serif', fontSize: 10, letterSpacing: '0.18em', textTransform: 'uppercase', color: C.charcoal, fontWeight: 600 }}>{label}</span>
              }
              {i < arr.length - 1 && <span style={{ color: C.border, fontSize: 14 }}>›</span>}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* ── Main layout ── */}
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '40px 2rem 80px', animation: 'fadeUp 0.35s ease' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '56px', alignItems: 'start' }}>

          {/* ── Left: Image gallery ── */}
          <div>
            {/* Main image */}
            <div style={{ position: 'relative', overflow: 'hidden', backgroundColor: C.bg, aspectRatio: '3/4', marginBottom: 12 }}>
              {imgList.length > 0
                ? <img key={activeImg} src={imgList[activeImg]} alt={product.name}
                    style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', animation: 'fadeUp 0.2s ease' }} />
                : <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 64 }}>👗</div>
              }

              {/* Badges */}
              <div style={{ position: 'absolute', top: 16, left: 16, display: 'flex', flexDirection: 'column', gap: 6 }}>
                {product.isNew && <span style={{ backgroundColor: C.charcoal, color: '#fff', fontFamily: 'Montserrat,sans-serif', fontSize: 9, letterSpacing: '0.25em', textTransform: 'uppercase', padding: '5px 12px' }}>New</span>}
                {discount && <span style={{ backgroundColor: C.blush, color: '#fff', fontFamily: 'Montserrat,sans-serif', fontSize: 9, letterSpacing: '0.25em', textTransform: 'uppercase', padding: '5px 12px' }}>{discount}% Off</span>}
              </div>

              {/* Wishlist */}
              <button onClick={() => toggleWishlist?.(product.id)}
                style={{ position: 'absolute', top: 16, right: 16, width: 36, height: 36, borderRadius: '50%', backgroundColor: 'rgba(255,255,255,0.92)', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 1px 4px rgba(0,0,0,0.1)', transition: 'transform 0.15s' }}
                onMouseEnter={e => e.currentTarget.style.transform='scale(1.1)'}
                onMouseLeave={e => e.currentTarget.style.transform='scale(1)'}
              >
                <svg width="15" height="15" fill={isWishlisted ? C.blush : 'none'} stroke={isWishlisted ? C.blush : C.charcoal} viewBox="0 0 24 24" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"/>
                </svg>
              </button>

              {/* Image arrows */}
              {imgList.length > 1 && (
                <>
                  <button onClick={() => setActiveImg(i => (i - 1 + imgList.length) % imgList.length)}
                    style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', width: 34, height: 34, borderRadius: '50%', backgroundColor: 'rgba(255,255,255,0.88)', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 1px 4px rgba(0,0,0,0.12)' }}>
                    <svg width="12" height="12" fill="none" stroke={C.charcoal} viewBox="0 0 24 24" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7"/></svg>
                  </button>
                  <button onClick={() => setActiveImg(i => (i + 1) % imgList.length)}
                    style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', width: 34, height: 34, borderRadius: '50%', backgroundColor: 'rgba(255,255,255,0.88)', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 1px 4px rgba(0,0,0,0.12)' }}>
                    <svg width="12" height="12" fill="none" stroke={C.charcoal} viewBox="0 0 24 24" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7"/></svg>
                  </button>
                </>
              )}
            </div>

            {/* Thumbnails */}
            {imgList.length > 1 && (
              <div style={{ display: 'flex', gap: 8 }}>
                {imgList.map((img, i) => (
                  <button key={i} className={`pd-thumb ${activeImg === i ? 'active' : ''}`} onClick={() => setActiveImg(i)} style={{ padding: 0 }}>
                    <img src={img} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* ── Right: Product info ── */}
          <div style={{ position: 'sticky', top: 120 }}>

            {/* Category */}
            <p style={{ fontFamily: 'Montserrat,sans-serif', fontSize: 10, letterSpacing: '0.3em', textTransform: 'uppercase', color: C.blush, margin: '0 0 8px' }}>{product.category}</p>

            {/* Name */}
            <h1 style={{ fontFamily: '"Cormorant Garamond",Georgia,serif', fontSize: 'clamp(1.9rem,3vw,2.6rem)', fontWeight: 300, color: C.charcoal, margin: '0 0 14px', lineHeight: 1.15 }}>{product.name}</h1>

            {/* Stars */}
            <div style={{ marginBottom: 18 }}><StarRating /></div>

            {/* Price */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24, paddingBottom: 24, borderBottom: `1px solid ${C.border}` }}>
              <span style={{ fontFamily: 'Montserrat,sans-serif', fontSize: '1.35rem', fontWeight: 600, color: C.charcoal }}>{formatPrice(product.price)}</span>
              {product.originalPrice && (
                <>
                  <span style={{ fontFamily: 'Montserrat,sans-serif', fontSize: '1rem', color: C.warmGray, textDecoration: 'line-through' }}>{formatPrice(product.originalPrice)}</span>
                  <span style={{ fontFamily: 'Montserrat,sans-serif', fontSize: 9, letterSpacing: '0.15em', textTransform: 'uppercase', backgroundColor: '#fde8e0', color: '#c0533a', padding: '4px 10px' }}>Save {discount}%</span>
                </>
              )}
            </div>

            {/* Tagline */}
            {product.tagline && (
              <p style={{ fontFamily: 'Montserrat,sans-serif', fontSize: 13, color: C.warmGray, lineHeight: 1.85, fontWeight: 300, margin: '0 0 22px' }}>{product.tagline}</p>
            )}

            {/* Colours */}
            {product.colors?.length > 0 && (
              <div style={{ marginBottom: 22 }}>
                <p style={{ fontFamily: 'Montserrat,sans-serif', fontSize: 10, letterSpacing: '0.18em', textTransform: 'uppercase', color: C.charcoal, margin: '0 0 10px', fontWeight: 600 }}>
                  Colour —{' '}
                  <span style={{ fontWeight: 300, textTransform: 'none', letterSpacing: 0, color: C.warmGray }}>
                    {COLOR_NAMES[selectedColor] || selectedColor}
                  </span>
                </p>
                <div style={{ display: 'flex', gap: 8 }}>
                  {product.colors.map(col => (
                    <button key={col} onClick={() => setSelectedColor(col)}
                      style={{ width: 28, height: 28, borderRadius: '50%', backgroundColor: col, border: 'none', cursor: 'pointer', outline: selectedColor === col ? `2.5px solid ${C.charcoal}` : '2.5px solid transparent', outlineOffset: 3, boxShadow: '0 0 0 1px rgba(0,0,0,0.12)', transition: 'outline 0.12s' }}
                      title={COLOR_NAMES[col] || col}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Sizes */}
            <div style={{ marginBottom: 24 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
                <p style={{ fontFamily: 'Montserrat,sans-serif', fontSize: 10, letterSpacing: '0.18em', textTransform: 'uppercase', color: C.charcoal, margin: 0, fontWeight: 600 }}>Size</p>
                <Link to="/size-guide" style={{ fontFamily: 'Montserrat,sans-serif', fontSize: 10, color: C.warmGray, textDecoration: 'underline' }}>Size Guide</Link>
              </div>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                {product.sizes?.map(size => (
                  <button key={size} className="pd-size-btn"
                    onClick={() => { setSelectedSize(size); setSizeError(false) }}
                    style={{ borderColor: selectedSize === size ? C.charcoal : C.border, backgroundColor: selectedSize === size ? C.charcoal : '#fff', color: selectedSize === size ? '#fff' : C.charcoal }}
                  >
                    {size}
                  </button>
                ))}
              </div>
              {sizeError && <p style={{ fontFamily: 'Montserrat,sans-serif', fontSize: 11, color: '#c0533a', margin: '8px 0 0' }}>Please select a size to continue.</p>}
              {details.fit && <p style={{ fontFamily: 'Montserrat,sans-serif', fontSize: 11, color: C.warmGray, margin: '8px 0 0', lineHeight: 1.6 }}>{details.fit}</p>}
            </div>

            {/* Qty + Add to cart */}
            <div style={{ display: 'flex', gap: 12, marginBottom: 14 }}>
              <div style={{ display: 'flex', border: `1px solid ${C.border}`, alignItems: 'center' }}>
                <button onClick={() => setQty(q => Math.max(1, q - 1))} style={{ width: 40, height: 52, border: 'none', background: 'none', cursor: 'pointer', fontFamily: 'Montserrat,sans-serif', fontSize: 18, color: C.charcoal }}>−</button>
                <span style={{ width: 36, textAlign: 'center', fontFamily: 'Montserrat,sans-serif', fontSize: 13, color: C.charcoal, fontWeight: 500 }}>{qty}</span>
                <button onClick={() => setQty(q => q + 1)} style={{ width: 40, height: 52, border: 'none', background: 'none', cursor: 'pointer', fontFamily: 'Montserrat,sans-serif', fontSize: 18, color: C.charcoal }}>+</button>
              </div>
              <button onClick={handleAddToCart}
                style={{ flex: 1, height: 52, backgroundColor: added ? C.blush : C.charcoal, color: '#fff', border: 'none', cursor: 'pointer', fontFamily: 'Montserrat,sans-serif', fontSize: 10, letterSpacing: '0.28em', textTransform: 'uppercase', fontWeight: 600, transition: 'background-color 0.25s ease', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}
              >
                {added
                  ? <><svg width="14" height="14" fill="none" stroke="#fff" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7"/></svg> Added to Cart</>
                  : <><svg width="14" height="14" fill="none" stroke="#fff" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"/></svg> Add to Cart</>
                }
              </button>
            </div>

            {/* WhatsApp */}
            <a href={waLink} target="_blank" rel="noopener noreferrer"
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, width: '100%', height: 50, border: `1px solid ${C.border}`, backgroundColor: '#fff', textDecoration: 'none', fontFamily: 'Montserrat,sans-serif', fontSize: 10, letterSpacing: '0.2em', textTransform: 'uppercase', color: C.charcoal, transition: 'border-color 0.15s', marginBottom: 24 }}
              onMouseEnter={e => e.currentTarget.style.borderColor='#25D366'}
              onMouseLeave={e => e.currentTarget.style.borderColor=C.border}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="#25D366"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
              Order via WhatsApp
            </a>

            {/* Trust signals */}
            <div style={{ borderTop: `1px solid ${C.border}`, paddingTop: 18, display: 'flex', flexDirection: 'column', gap: 10 }}>
              {[
                { icon: '↩', text: '14-day returns · Free exchanges on size' },
                { icon: '📦', text: 'Orders dispatched within 2 business days' },
                { icon: '🔒', text: 'Secure checkout via Paystack' },
                { icon: '🐝', text: 'Designed in Lagos · Made with intention' },
              ].map(t => (
                <div key={t.icon} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <span style={{ fontSize: 13 }}>{t.icon}</span>
                  <span style={{ fontFamily: 'Montserrat,sans-serif', fontSize: 11, color: C.warmGray, fontWeight: 300 }}>{t.text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── Detail tabs ── */}
        <div style={{ marginTop: 64, borderTop: `1px solid ${C.border}` }}>
          <div style={{ display: 'flex', borderBottom: `1px solid ${C.border}` }}>
            {['description', 'details', 'care'].map(tab => (
              <button key={tab} className={`pd-tab-btn ${activeTab === tab ? 'active' : ''}`} onClick={() => setActiveTab(tab)}>
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>
          <div style={{ padding: '32px 0', maxWidth: 680 }}>
            {activeTab === 'description' && (
              <p style={{ fontFamily: 'Montserrat,sans-serif', fontSize: 13.5, color: '#5a5550', lineHeight: 1.9, fontWeight: 300, margin: 0 }}>
                {details.description || product.tagline || 'No description available for this product.'}
              </p>
            )}
            {activeTab === 'details' && (
              <div>
                {details.features ? (
                  <>
                    <p style={{ fontFamily: 'Montserrat,sans-serif', fontSize: 10, letterSpacing: '0.2em', textTransform: 'uppercase', color: C.charcoal, margin: '0 0 16px' }}>Product Features</p>
                    {details.features.map((f, i) => (
                      <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, marginBottom: 10 }}>
                        <span style={{ color: C.blush, fontSize: 13, lineHeight: '1.9' }}>✓</span>
                        <p style={{ fontFamily: 'Montserrat,sans-serif', fontSize: 13, color: '#5a5550', fontWeight: 300, margin: 0, lineHeight: 1.8 }}>{f}</p>
                      </div>
                    ))}
                  </>
                ) : (
                  <div>
                    {product.sizes?.length > 0 && <p style={{ fontFamily: 'Montserrat,sans-serif', fontSize: 13, color: '#5a5550', fontWeight: 300, margin: '0 0 8px', lineHeight: 1.8 }}><strong style={{ fontWeight: 600 }}>Available Sizes:</strong> {product.sizes.join(', ')}</p>}
                    {product.category && <p style={{ fontFamily: 'Montserrat,sans-serif', fontSize: 13, color: '#5a5550', fontWeight: 300, margin: 0, lineHeight: 1.8 }}><strong style={{ fontWeight: 600 }}>Category:</strong> {product.category}</p>}
                  </div>
                )}
                {details.material && <p style={{ fontFamily: 'Montserrat,sans-serif', fontSize: 11, color: C.warmGray, marginTop: 16, fontWeight: 300 }}><strong style={{ fontWeight: 600 }}>Material:</strong> {details.material}</p>}
              </div>
            )}
            {activeTab === 'care' && (
              <div>
                <p style={{ fontFamily: 'Montserrat,sans-serif', fontSize: 13, color: '#5a5550', lineHeight: 1.9, fontWeight: 300, margin: '0 0 20px' }}>
                  {details.care || 'Please handle with care. Follow standard garment care guidelines.'}
                </p>
                <div style={{ backgroundColor: '#f8f4f0', padding: '16px 20px', borderLeft: `3px solid ${C.blush}` }}>
                  <p style={{ fontFamily: 'Montserrat,sans-serif', fontSize: 11, color: C.warmGray, margin: 0, lineHeight: 1.7, fontWeight: 300 }}>
                    Proper care extends the life of your garment and preserves its colour and structure. When in doubt, hand wash in cold water with a gentle detergent.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* ── Related products ── */}
        {related.length > 0 && (
          <div style={{ marginTop: 64, borderTop: `1px solid ${C.border}`, paddingTop: 48 }}>
            <p style={{ fontFamily: 'Montserrat,sans-serif', fontSize: 10, letterSpacing: '0.3em', textTransform: 'uppercase', color: C.blush, margin: '0 0 8px' }}>You May Also Love</p>
            <h2 style={{ fontFamily: '"Cormorant Garamond",Georgia,serif', fontSize: '1.8rem', fontWeight: 300, color: C.charcoal, margin: '0 0 32px' }}>More from {product.category}</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 24 }}>
              {related.map(p => (
                <Link key={p.id} to={`/product/${p.id}`} style={{ textDecoration: 'none', color: 'inherit' }} className="pd-related">
                  <div style={{ overflow: 'hidden', backgroundColor: C.bg, aspectRatio: '3/4', marginBottom: 12 }}>
                    <img src={p.img} alt={p.name} style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s ease', display: 'block' }} />
                  </div>
                  <p style={{ fontFamily: 'Montserrat,sans-serif', fontSize: 10, letterSpacing: '0.2em', textTransform: 'uppercase', color: C.warmGray, margin: '0 0 4px' }}>{p.category}</p>
                  <p style={{ fontFamily: '"Cormorant Garamond",Georgia,serif', fontSize: '1.05rem', color: C.charcoal, margin: '0 0 6px', fontWeight: 300 }}>{p.name}</p>
                  <p style={{ fontFamily: 'Montserrat,sans-serif', fontSize: 12, color: C.charcoal, fontWeight: 500, margin: 0 }}>{formatPrice(p.price)}</p>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
