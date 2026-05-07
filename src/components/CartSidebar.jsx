import React, { useEffect } from 'react'
import { formatPrice } from '../data/products'

export default function CartSidebar({ open, onClose, items, removeFromCart, onCheckout }) {
  const subtotal = items.reduce((sum, i) => sum + i.price * i.qty, 0)

  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden'
      document.body.style.position = 'fixed'
      document.body.style.width = '100%'
    } else {
      document.body.style.overflow = ''
      document.body.style.position = ''
      document.body.style.width = ''
    }
    return () => {
      document.body.style.overflow = ''
      document.body.style.position = ''
      document.body.style.width = ''
    }
  }, [open])

  return (
    <>
      {/* Backdrop */}
      {open && (
        <div
          className="fixed inset-0 bg-charcoal/40 z-50 backdrop-blur-sm"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div className={`fixed top-0 right-0 h-full w-full max-w-sm bg-cream-light z-50 shadow-2xl flex flex-col transition-transform duration-500 ${open ? 'translate-x-0' : 'translate-x-full'}`}>
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-border-light">
          <div>
            <h3 className="font-sans text-xs tracking-widest uppercase text-charcoal font-medium">Your Bag</h3>
            {items.length > 0 && (
              <p className="font-sans text-xs text-warm-gray mt-0.5">{items.length} item{items.length !== 1 ? 's' : ''}</p>
            )}
          </div>
          <button onClick={onClose} className="text-charcoal hover:text-blush transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto px-6 py-4">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center gap-4">
              <svg className="w-12 h-12 text-blush-light" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
              <p className="font-serif text-lg text-charcoal font-light">Your bag is empty</p>
              <p className="font-sans text-xs text-warm-gray">Discover our latest pieces</p>
              <button
                onClick={onClose}
                className="btn-outline mt-2 text-xs"
              >
                Continue Shopping
              </button>
            </div>
          ) : (
            <div className="space-y-5">
              {items.map(item => (
                <div key={item.id} className="flex gap-4">
                  <div className="w-20 h-24 flex-shrink-0 overflow-hidden bg-[#f0ebe5]">
                    <img src={item.img} alt={item.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-serif text-sm text-charcoal font-light leading-snug">{item.name}</h4>
                    {item.selectedSize && (
                      <p className="font-sans text-[10px] tracking-widest uppercase text-warm-gray mt-1">
                        Size: {item.selectedSize}
                      </p>
                    )}
                    <p className="font-sans text-xs text-charcoal font-medium mt-1">{formatPrice(item.price)}</p>
                    <div className="flex items-center justify-between mt-2">
                      <span className="font-sans text-xs text-warm-gray">Qty: {item.qty}</span>
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="font-sans text-[10px] tracking-widest uppercase text-warm-gray hover:text-charcoal underline transition-colors"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="border-t border-border-light px-6 py-6">
            <div className="flex items-center justify-between mb-2">
              <span className="font-sans text-xs tracking-widest uppercase text-warm-gray">Subtotal</span>
              <span className="font-sans text-sm font-medium text-charcoal">{formatPrice(subtotal)}</span>
            </div>
            <p className="font-sans text-[11px] text-warm-gray mb-5">Shipping and taxes calculated at checkout</p>
            <button onClick={onCheckout} className="w-full btn-primary text-center block py-4 mb-3">
              Proceed to Checkout
            </button>
            <button
              onClick={onClose}
              className="w-full text-center font-sans text-xs tracking-widest uppercase text-warm-gray hover:text-charcoal transition-colors py-1"
            >
              Continue Shopping
            </button>
          </div>
        )}
      </div>
    </>
  )
}
