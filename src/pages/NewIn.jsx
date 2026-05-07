import React, { useState, useEffect } from 'react'
import ProductCard from '../components/ProductCard'
import { products as staticProducts } from '../data/products'

const CHARCOAL = '#2c2c2c'
const BLUSH = '#c4a28a'
const WARM_GRAY = '#8a7f7a'

const sortOptions = [
  { label: 'Newest First', value: 'new' },
  { label: 'Price: Low to High', value: 'price_asc' },
  { label: 'Price: High to Low', value: 'price_desc' },
  { label: 'Name A–Z', value: 'name' },
]

export default function NewIn({ addToCart, wishlist = [], toggleWishlist }) {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeCategory, setActiveCategory] = useState('All')
  const [sort, setSort] = useState('new')

  useEffect(() => {
    fetch('/api/products')
      .then(r => r.json())
      .then(data => {
        const list = data.products?.length ? data.products : staticProducts
        setProducts(list)
      })
      .catch(() => setProducts(staticProducts))
      .finally(() => setLoading(false))
  }, [])

  // All unique categories from the product list
  const categories = ['All', ...Array.from(new Set(products.map(p => p.category).filter(Boolean)))]

  const filtered = products
    .filter(p => activeCategory === 'All' || p.category === activeCategory)
    .sort((a, b) => {
      if (sort === 'price_asc') return a.price - b.price
      if (sort === 'price_desc') return b.price - a.price
      if (sort === 'name') return a.name.localeCompare(b.name)
      // newest: items with isNew first, then by id descending
      if (a.isNew && !b.isNew) return -1
      if (!a.isNew && b.isNew) return 1
      return b.id - a.id
    })

  return (
    <div style={{ backgroundColor: '#faf7f4', minHeight: '100vh' }}>
      {/* Hero banner */}
      <div style={{
        backgroundColor: '#f0ebe5',
        padding: '72px 32px 56px',
        textAlign: 'center',
      }}>
        <p style={{
          fontFamily: 'Montserrat, sans-serif',
          fontSize: '10px',
          letterSpacing: '0.3em',
          textTransform: 'uppercase',
          color: BLUSH,
          marginBottom: '12px',
        }}>
          The Collection
        </p>
        <h1 style={{
          fontFamily: 'Cormorant Garamond, Georgia, serif',
          fontSize: 'clamp(2.2rem, 5vw, 3.4rem)',
          fontWeight: 300,
          color: CHARCOAL,
          letterSpacing: '0.04em',
          marginBottom: '16px',
          lineHeight: 1.15,
        }}>
          Featured Pieces
        </h1>
        <p style={{
          fontFamily: 'Montserrat, sans-serif',
          fontSize: '13px',
          color: WARM_GRAY,
          fontWeight: 300,
          letterSpacing: '0.05em',
          maxWidth: '420px',
          margin: '0 auto',
        }}>
          Ready-to-wear pieces curated for confident women
        </p>
      </div>

      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 24px 80px' }}>
        {/* Filters bar */}
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '16px',
          padding: '28px 0 24px',
          borderBottom: '1px solid #e8e0d8',
          marginBottom: '36px',
        }}>
          {/* Category pills */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                style={{
                  fontFamily: 'Montserrat, sans-serif',
                  fontSize: '10px',
                  letterSpacing: '0.2em',
                  textTransform: 'uppercase',
                  fontWeight: 500,
                  padding: '8px 18px',
                  border: '1px solid',
                  borderColor: activeCategory === cat ? CHARCOAL : '#d8d0c8',
                  backgroundColor: activeCategory === cat ? CHARCOAL : 'transparent',
                  color: activeCategory === cat ? '#fff' : WARM_GRAY,
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                }}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Sort + count */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <span style={{
              fontFamily: 'Montserrat, sans-serif',
              fontSize: '10px',
              letterSpacing: '0.15em',
              color: WARM_GRAY,
            }}>
              {filtered.length} {filtered.length === 1 ? 'piece' : 'pieces'}
            </span>
            <select
              value={sort}
              onChange={e => setSort(e.target.value)}
              style={{
                fontFamily: 'Montserrat, sans-serif',
                fontSize: '10px',
                letterSpacing: '0.15em',
                textTransform: 'uppercase',
                color: CHARCOAL,
                border: '1px solid #d8d0c8',
                backgroundColor: 'transparent',
                padding: '8px 14px',
                cursor: 'pointer',
                outline: 'none',
              }}
            >
              {sortOptions.map(o => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Grid */}
        {loading ? (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
            gap: '20px',
          }}>
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} style={{ animation: 'pulse 1.5s ease-in-out infinite' }}>
                <div style={{ aspectRatio: '3/4', backgroundColor: '#e8e0d8' }} />
                <div style={{ marginTop: '12px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <div style={{ height: '8px', backgroundColor: '#e8e0d8', borderRadius: '4px', width: '40%' }} />
                  <div style={{ height: '12px', backgroundColor: '#e8e0d8', borderRadius: '4px', width: '75%' }} />
                  <div style={{ height: '8px', backgroundColor: '#e8e0d8', borderRadius: '4px', width: '55%' }} />
                </div>
              </div>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '80px 24px', color: WARM_GRAY }}>
            <p style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '2rem', fontWeight: 300, marginBottom: '12px' }}>
              No pieces found
            </p>
            <p style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '12px', letterSpacing: '0.1em' }}>
              Try a different category filter
            </p>
          </div>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
            gap: '20px',
          }}>
            {filtered.map(product => (
              <ProductCard
                key={product.id}
                product={product}
                addToCart={addToCart}
                isWishlisted={wishlist.includes(product.id)}
                toggleWishlist={toggleWishlist}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
