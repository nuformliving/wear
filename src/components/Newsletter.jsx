import React, { useState } from 'react'

export default function Newsletter() {
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    if (email) {
      setSubmitted(true)
      setEmail('')
    }
  }

  return (
    <section className="py-16 md:py-24 bg-[#ede5de] relative overflow-hidden">
      {/* Decorative */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="w-[600px] h-[600px] rounded-full border border-blush/20 absolute" />
        <div className="w-[400px] h-[400px] rounded-full border border-blush/15 absolute" />
      </div>

      <div className="max-w-2xl mx-auto px-4 md:px-8 text-center relative z-10">
        {/* Monogram — faithful to actual logo */}
        <div className="flex justify-center mb-6">
          <svg width="72" height="80" viewBox="0 0 200 220" fill="none">
            <rect x="28" y="18" width="100" height="5" rx="0.5" fill="#c8a99a"/>
            <rect x="28" y="18" width="5" height="114" rx="0.5" fill="#c8a99a"/>
            <rect x="123" y="18" width="5" height="32" rx="0.5" fill="#c8a99a"/>
            <rect x="75" y="18" width="5" height="108" rx="0.5" fill="#c8a99a"/>
            <path d="M77.5 34 C77.5 24 85 20 91 22 C97 24 97 31 94 34" stroke="#c8a99a" strokeWidth="2.2" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M77.5 80 Q60 65 33 85" stroke="#c8a99a" strokeWidth="2.2" fill="none" strokeLinecap="round"/>
            <line x1="33" y1="85" x2="77.5" y2="85" stroke="#c8a99a" strokeWidth="2.2" strokeLinecap="round"/>
            <line x1="33" y1="85" x2="33" y2="91" stroke="#c8a99a" strokeWidth="2.2" strokeLinecap="round"/>
            <path d="M82 22 L82 140" stroke="#2a2a2a" strokeWidth="6" strokeLinecap="round"/>
            <path d="M82 22 C120 22 140 35 140 55 C140 75 120 82 82 82" stroke="#2a2a2a" strokeWidth="4.5" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M82 82 C128 82 152 96 152 116 C152 136 128 140 82 140" stroke="#2a2a2a" strokeWidth="4.5" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
            <line x1="60" y1="170" x2="150" y2="28" stroke="#c8a99a" strokeWidth="1.5" strokeLinecap="round"/>
            <ellipse cx="148" cy="30" rx="3.5" ry="1.8" stroke="#c8a99a" strokeWidth="1.5" fill="none" transform="rotate(-55 148 30)"/>
          </svg>
        </div>

        <p className="font-sans text-xs tracking-ultra uppercase text-blush mb-4">Stay in the Loop</p>
        <h2 className="font-serif text-3xl md:text-4xl font-light text-charcoal mb-4">
          Join the <em>Inner Circle</em>
        </h2>
        <p className="font-sans text-sm text-warm-gray font-light mb-10 leading-relaxed">
          Be the first to know about new arrivals, exclusive offers, and behind-the-scenes moments from The Beeive Label. Designed in Lagos 🐝
        </p>

        {submitted ? (
          <div className="text-center">
            <p className="font-serif text-xl text-charcoal font-light">Thank you for joining us.</p>
            <p className="font-sans text-sm text-warm-gray mt-2">A warm welcome from The Beeive Label family 🐝</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-0 max-w-md mx-auto">
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="Your email address"
              required
              className="flex-1 px-5 py-4 bg-white border border-border-light outline-none font-sans text-sm text-charcoal placeholder-warm-gray focus:border-charcoal transition-colors"
              style={{ fontSize: '16px', WebkitAppearance: 'none', borderRadius: 0 }}
            />
            <button
              type="submit"
              className="bg-charcoal text-white px-8 py-4 font-sans text-xs tracking-widest uppercase font-medium hover:bg-blush-dark transition-colors whitespace-nowrap"
            >
              Subscribe
            </button>
          </form>
        )}

        <p className="font-sans text-[11px] text-warm-gray mt-4">
          No spam, ever. Unsubscribe at any time.
        </p>
      </div>
    </section>
  )
}
