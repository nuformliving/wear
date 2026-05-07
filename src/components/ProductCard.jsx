import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { formatPrice } from '../data/products'

export default function ProductCard({ product, addToCart, isWishlisted, toggleWishlist }) {
  const [hovered, setHovered]         = useState(false)
  const [selectedSize, setSelectedSize] = useState('')
  const [showSizes, setShowSizes]     = useState(false)
  const [added, setAdded]             = useState(false)

  function handleAddToCart(e) {
    e.preventDefault()
    e.stopPropagation()
    if (!showSizes) { setShowSizes(true); return }
    if (!selectedSize) return
    addToCart({ ...product, selectedSize })
    setAdded(true)
    setTimeout(() => { setAdded(false); setShowSizes(false); setSelectedSize('') }, 1500)
  }

  return (
    <div
      className="product-card"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => { setHovered(false); setShowSizes(false) }}
    >
      {/* ── Image — clicking navigates to product detail page ── */}
      <Link to={`/product/${product.id}`} style={{ display: 'block', textDecoration: 'none' }}>
        <div className="relative overflow-hidden aspect-[3/4] bg-[#f0ebe5]">

          <img
            src={hovered ? (product.imgHover || product.img) : product.img}
            alt={product.name}
            className="w-full h-full object-cover"
            style={{ transform: hovered ? 'scale(1.04)' : 'scale(1)', transition: 'transform 0.5s ease' }}
          />

          {/* "View Product" hover overlay */}
          <div style={{
            position: 'absolute', inset: 0,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            opacity: hovered ? 1 : 0,
            transition: 'opacity 0.25s ease',
            pointerEvents: 'none',
          }}>
            <span style={{
              fontFamily: 'Montserrat, sans-serif', fontSize: '10px',
              letterSpacing: '0.28em', textTransform: 'uppercase',
              color: '#fff', fontWeight: 600,
              backgroundColor: 'rgba(44,44,44,0.72)',
              padding: '10px 22px',
              backdropFilter: 'blur(4px)',
            }}>
              View Product
            </span>
          </div>

          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-1.5" style={{ pointerEvents: 'none' }}>
            {product.isNew && (
              <span className="bg-charcoal text-white text-[9px] tracking-widest uppercase px-2.5 py-1 font-sans font-medium">New</span>
            )}
            {product.originalPrice && (
              <span className="bg-blush text-white text-[9px] tracking-widest uppercase px-2.5 py-1 font-sans font-medium">Sale</span>
            )}
          </div>

          {/* Wishlist */}
          <button
            className="absolute top-3 right-3 w-8 h-8 bg-white bg-opacity-80 hover:bg-opacity-100 rounded-full flex items-center justify-center shadow-sm transition-all"
            onClick={e => { e.preventDefault(); e.stopPropagation(); toggleWishlist(product.id) }}
            aria-label="Wishlist"
            style={{ zIndex: 2 }}
          >
            <svg
              className={`w-3.5 h-3.5 transition-colors ${isWishlisted ? 'fill-blush stroke-blush' : 'stroke-charcoal fill-none'}`}
              viewBox="0 0 24 24" strokeWidth={1.5}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
            </svg>
          </button>

          {/* Quick-add overlay (slides up on hover) */}
          <div
            className={`absolute bottom-0 left-0 right-0 bg-white transition-transform duration-300 ${hovered ? 'translate-y-0' : 'translate-y-full'}`}
            onClick={e => e.stopPropagation()}
            style={{ zIndex: 2 }}
          >
            {showSizes ? (
              <div className="p-3">
                <p className="font-sans text-[9px] tracking-widest uppercase text-warm-gray mb-2 text-center">Select Size</p>
                <div className="flex items-center justify-center gap-1.5 flex-wrap mb-2">
                  {product.sizes.map(size => (
                    <button
                      key={size}
                      onClick={e => { e.preventDefault(); e.stopPropagation(); setSelectedSize(size) }}
                      className={`w-8 h-8 text-[10px] font-sans uppercase transition-colors border
                        ${selectedSize === size
                          ? 'bg-charcoal text-white border-charcoal'
                          : 'border-border-light text-charcoal hover:border-charcoal'}`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
                <button
                  onClick={handleAddToCart}
                  disabled={!selectedSize}
                  className={`w-full py-2.5 text-[10px] tracking-widest uppercase font-sans font-medium transition-colors
                    ${selectedSize
                      ? 'bg-charcoal text-white hover:bg-blush-dark'
                      : 'bg-gray-100 text-gray-400 cursor-not-allowed'}`}
                >
                  {added ? 'Added ✓' : 'Add to Cart'}
                </button>
              </div>
            ) : (
              <button
                onClick={handleAddToCart}
                className="w-full py-3 bg-charcoal text-white text-[10px] tracking-widest uppercase font-sans font-medium hover:bg-blush-dark transition-colors"
              >
                Quick Add
              </button>
            )}
          </div>
        </div>
      </Link>

      {/* ── Product info ── */}
      <Link to={`/product/${product.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
        <div className="mt-3 px-0.5">
          <p className="font-sans text-[10px] tracking-widest uppercase text-warm-gray mb-1">{product.category}</p>
          <h3 className="font-serif text-base text-charcoal font-light leading-snug hover:text-blush transition-colors">{product.name}</h3>
          {product.tagline && (
            <p className="font-sans text-[10px] text-warm-gray mt-1 leading-relaxed font-light line-clamp-2">{product.tagline}</p>
          )}

          {/* Colours */}
          <div className="flex items-center gap-1.5 mt-2">
            {product.colors?.map(color => (
              <span
                key={color}
                className="w-3 h-3 rounded-full border border-white ring-1 ring-border-light"
                style={{ backgroundColor: color, display: 'inline-block' }}
              />
            ))}
          </div>

          {/* Price */}
          <div className="flex items-center gap-2 mt-2">
            <span className="font-sans text-sm font-medium text-charcoal">{formatPrice(product.price)}</span>
            {product.originalPrice && (
              <span className="font-sans text-xs text-warm-gray line-through">{formatPrice(product.originalPrice)}</span>
            )}
          </div>
        </div>
      </Link>
    </div>
  )
}
