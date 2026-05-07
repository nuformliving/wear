import React, { useState } from 'react'
import ProductCard from './ProductCard'

const tabs = ['All', 'New In', 'Best Sellers', 'Work', 'Everyday', 'Luxe']

export default function FeaturedProducts({ products = [], addToCart, wishlist, toggleWishlist, onQuickView }) {
  const [activeTab, setActiveTab] = useState('All')

  const filtered = products.filter(p => {
    if (activeTab === 'All') return true
    if (activeTab === 'New In') return p.isNew
    if (activeTab === 'Best Sellers') return p.isBestSeller
    return p.category === activeTab
  })

  return (
    <section className="py-16 md:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        {/* Header */}
        <div className="text-center mb-10">
          <p className="font-sans text-xs tracking-ultra uppercase text-blush mb-3">The Collection</p>
          <h2 className="section-title mb-2">Featured Pieces</h2>
          <p className="font-sans text-sm text-warm-gray font-light">Ready-to-wear pieces curated for confident women</p>
        </div>

        {/* Tabs */}
        <div className="flex items-center justify-center gap-1 mb-10 overflow-x-auto pb-2">
          {tabs.map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-5 py-2.5 text-xs tracking-widest uppercase font-sans font-medium transition-all whitespace-nowrap
                ${activeTab === tab
                  ? 'bg-charcoal text-white'
                  : 'text-warm-gray hover:text-charcoal'
                }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-5">
          {products.length === 0
            ? Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="aspect-[3/4] bg-gray-100" />
                  <div className="mt-3 space-y-2">
                    <div className="h-2 bg-gray-100 rounded w-1/3" />
                    <div className="h-3 bg-gray-100 rounded w-3/4" />
                    <div className="h-2 bg-gray-100 rounded w-1/2" />
                  </div>
                </div>
              ))
            : filtered.map(product => (
                <ProductCard
                  key={product.id}
                  product={product}
                  addToCart={addToCart}
                  isWishlisted={wishlist.includes(product.id)}
                  toggleWishlist={toggleWishlist}
                  onQuickView={onQuickView}
                />
              ))
          }
        </div>

        {/* CTA */}
        <div className="text-center mt-14">
          <a href="#" className="btn-outline inline-block">
            View All Pieces
          </a>
        </div>
      </div>
    </section>
  )
}
