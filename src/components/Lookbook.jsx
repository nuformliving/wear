import React from 'react'

const lookbookItems = [
  {
    img: '/uploads/lookbook-breezy-maxi.jpg',
    title: 'The Breezy Maxi Skirt',
    desc: 'Ready to wear',
    tag: 'Editorial',
    size: 'large',
  },
  {
    img: 'https://images.unsplash.com/photo-1512436991641-6745cdb1723f?w=600&q=80',
    title: 'Evening Glamour',
    desc: 'Where elegance meets night',
    tag: 'Campaign',
    size: 'small',
  },
  {
    img: 'https://images.unsplash.com/photo-1588117305388-c2631a279f82?w=600&q=80',
    title: 'Summer Ease',
    desc: 'Effortless days, beautiful nights',
    tag: 'SS25',
    size: 'small',
  },
]

export default function Lookbook() {
  return (
    <section id="lookbook" className="py-16 md:py-24 bg-cream">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-10 gap-4">
          <div>
            <p className="font-sans text-xs tracking-ultra uppercase text-blush mb-3">SS25 Campaign</p>
            <h2 className="section-title">The Lookbook</h2>
          </div>
          <p className="font-sans text-sm text-warm-gray font-light max-w-xs">
            Explore our latest editorial campaign — where fashion meets artistry.
          </p>
        </div>

        {/* Mosaic Layout */}
        <div className="grid grid-cols-1 md:grid-cols-3 md:grid-rows-2 gap-3 md:gap-4 h-auto md:h-[680px]">
          {/* Large item */}
          <div className="md:col-span-2 md:row-span-2 group relative overflow-hidden">
            <img
              src={lookbookItems[0].img}
              alt={lookbookItems[0].title}
              className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-103 aspect-[4/3] md:aspect-auto"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-charcoal/70 via-transparent to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-8">
              <span className="inline-block bg-blush text-white text-[9px] tracking-widest uppercase px-3 py-1 mb-3 font-sans">
                {lookbookItems[0].tag}
              </span>
              <h3 className="font-serif text-3xl text-white font-light mb-2">{lookbookItems[0].title}</h3>
              <p className="font-sans text-sm text-white/70 mb-5">{lookbookItems[0].desc}</p>
              <a href="#" className="inline-flex items-center gap-2 text-white font-sans text-xs tracking-widest uppercase border-b border-white/50 pb-0.5 hover:border-white transition-colors">
                View Lookbook
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </a>
            </div>
          </div>

          {/* Small items */}
          {lookbookItems.slice(1).map((item, i) => (
            <div key={i} className="group relative overflow-hidden aspect-[3/2] md:aspect-auto">
              <img
                src={item.img}
                alt={item.title}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-charcoal/60 via-transparent to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-5">
                <span className="inline-block bg-white bg-opacity-20 backdrop-blur-sm text-white text-[9px] tracking-widest uppercase px-2.5 py-1 mb-2 font-sans">
                  {item.tag}
                </span>
                <h3 className="font-serif text-xl text-white font-light">{item.title}</h3>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
