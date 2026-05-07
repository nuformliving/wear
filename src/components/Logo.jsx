import React from 'react'

export default function Logo({ size = 'md', dark = false }) {
  const heights = { sm: 56, md: 72, lg: 96 }
  const mobileHeights = { sm: 72, md: 88, lg: 108 }
  const h = heights[size]
  const mh = mobileHeights[size]

  return (
    <a
      href="/"
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        textDecoration: 'none',
        userSelect: 'none',
      }}
    >
      <img
        src="/logo.jpg"
        alt="The Beehive Label – Ready To Wear"
        className="logo-img"
        style={{
          height: h + 'px',
          width: 'auto',
          objectFit: 'contain',
          display: 'block',
        }}
      />
      <style>{`
        @media (max-width: 768px) {
          .logo-img { height: ${mh}px !important; }
        }
      `}</style>
    </a>
  )
}
