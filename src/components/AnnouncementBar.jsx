import React from 'react'

export default function AnnouncementBar() {
  return (
    <div className="bg-charcoal text-white text-center py-2.5 overflow-hidden">
      <div className="flex whitespace-nowrap">
        <div className="animate-marquee flex items-center gap-12 text-xs tracking-widest uppercase font-sans font-light">
          {[...Array(6)].map((_, i) => (
            <React.Fragment key={i}>
              <span>Designed in Lagos — Ready To Wear for Confident Women</span>
              <span style={{ color: '#c4a28a' }}>🐝</span>
              <span>Shop the Collection – Work · Everyday · Luxe</span>
              <span style={{ color: '#c4a28a' }}>🐝</span>
              <span>Designed in Lagos — Ready To Wear for Confident Women</span>
              <span style={{ color: '#c4a28a' }}>🐝</span>
            </React.Fragment>
          ))}
        </div>
      </div>
    </div>
  )
}
