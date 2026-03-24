import { useState, useEffect, useRef } from 'react'
import CryptoTicker from './CryptoTicker.jsx'
import WalletModal from './WalletModal.jsx'

/*
  Exact color variables from rpc-monitor.app/media/css/index.css:
  body background  = bg-accent2 = rgb(2,5,10)   = #02050a
  section bg       = bg-accent5 = rgb(9,19,29)   = #09131d
  accent4          = rgb(30,35,41)  = #1e2329
  accent6          = rgb(15,30,46)  = #0f1e2e
  primary          = rgb(58,150,255) = #3a96ff
  accent1 (teal)   = rgb(18,255,184) = #12ffb8
  neutral1 (white) = rgb(255,255,255)
  neutral4         = rgb(218,218,218)
  secondary (gold) = rgb(240,185,11)
  Font: "Outfit", sans-serif (from body { font-family: "Outfit", sans-serif; })
  h2 sizes: 20px base → 24px (768px) → 30px (992px) → 40px (1200px+)
  pt-120/pb-120: 3.5rem base → 100px (1200px) → 120px (1400px)
  container: max-width 1400px at 1400px+
*/

const F = '"Outfit", sans-serif'

/* ── Wallet carousel items (exact from original HTML) ─────────────────────── */
const WALLET_ITEMS = [
  { title: 'Migration Issues',       desc: 'Click here for migration related issues' },
  { title: 'Validate Wallet',        desc: 'Click here for wallet validation related issues' },
  { title: 'Assets Recovery',        desc: 'Click here for assets recovery related issues' },
  { title: 'Rectification',          desc: 'Click here for rectification related issues' },
  { title: 'Gas Fees',               desc: 'Click here for Gas Fees related issues' },
  { title: 'Claim Reward',           desc: 'Click here for Claim Reward issues' },
  { title: 'Deposits & Withdrawals', desc: 'Click here for Deposits & Withdrawals issues' },
  { title: 'Slippage Error',         desc: 'Click here for Slippage Error related issues' },
  { title: 'Transaction Error',      desc: 'Click here for Transaction Error related issues' },
  { title: 'Cross Chain Transfer',   desc: 'Click here for Cross Chain Transfer related issues' },
  { title: 'Staking Issues',         desc: 'Click here for Staking Issues related issues' },
  { title: 'Swap / Exchange',        desc: 'Click here for Swap/Exchange related issues' },
]

/* SVG icons matching original stm icons (lightblue, 72px) */
const ICONS = [
  <svg viewBox="0 0 24 24" fill="none" stroke="#5ecfef" strokeWidth="1.5" strokeLinecap="round"><path d="M21 2v6h-6"/><path d="M3 12a9 9 0 0115-6.7L21 8"/><path d="M3 22v-6h6"/><path d="M21 12a9 9 0 01-15 6.7L3 16"/></svg>,
  <svg viewBox="0 0 24 24" fill="none" stroke="#5ecfef" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6L9 17l-5-5"/></svg>,
  <svg viewBox="0 0 24 24" fill="none" stroke="#5ecfef" strokeWidth="1.5" strokeLinecap="round"><path d="M21 2v6h-6"/><path d="M3 12a9 9 0 0115-6.7L21 8"/><path d="M3 22v-6h6"/><path d="M21 12a9 9 0 01-15 6.7L3 16"/></svg>,
  <svg viewBox="0 0 24 24" fill="none" stroke="#5ecfef" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18M9 21V9"/></svg>,
  <svg viewBox="0 0 24 24" fill="none" stroke="#5ecfef" strokeWidth="1.5" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>,
  <svg viewBox="0 0 24 24" fill="none" stroke="#5ecfef" strokeWidth="1.5" strokeLinecap="round"><path d="M12 2l7 10a7 7 0 11-14 0z"/></svg>,
  <svg viewBox="0 0 24 24" fill="none" stroke="#5ecfef" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M7 16V4m0 0L3 8m4-4l4 4M17 8v12m0 0l4-4m-4 4l-4-4"/></svg>,
  <svg viewBox="0 0 24 24" fill="none" stroke="#5ecfef" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/><path d="M12 9v4M12 17h.01"/></svg>,
  <svg viewBox="0 0 24 24" fill="none" stroke="#5ecfef" strokeWidth="1.5" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><path d="M15 9l-6 6M9 9l6 6"/></svg>,
  <svg viewBox="0 0 24 24" fill="none" stroke="#5ecfef" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M16 3h5v5M4 20L21 3M21 16v5h-5M15 15l6 6M4 4l5 5"/></svg>,
  <svg viewBox="0 0 24 24" fill="none" stroke="#5ecfef" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>,
  <svg viewBox="0 0 24 24" fill="none" stroke="#5ecfef" strokeWidth="1.5" strokeLinecap="round"><path d="M1 4v6h6M23 20v-6h-6"/><path d="M20.49 9A9 9 0 005.64 5.64L1 10m22 4l-4.64 4.36A9 9 0 013.51 15"/></svg>,
]

/* ── Review data (exact from original site HTML) ─────────────────────────── */
const REVIEWS = [
  { img: 'reviewer-alex.png',           name: 'Alex Martinez',    title: 'Blockchain Analyst, CoinDesk',              text: '"Outstanding wallet recovery service! They helped me regain access to my MetaMask wallet containing over $50K in assets. The process was secure, professional, and surprisingly fast. Highly recommended for anyone facing wallet issues."' },
  { img: 'reviewer-sarah.png',          name: 'Sarah Chen',       title: 'Crypto Trader & Influencer',                text: '"After losing access to my Trust Wallet, I was devastated. This protocol connected me directly with the right support team and resolved my migration issues within 24 hours. Absolutely incredible service!"' },
  { img: 'reviewer-james.png',          name: 'James Wilson',     title: 'DeFi Researcher, MIT',                      text: '"I\'ve been in crypto since 2016 and this is the most professional wallet support protocol I\'ve encountered. They handled my cross-chain transfer issue with expertise and transparency. A must-have for serious crypto holders."' },
  { img: 'reviewer-maria.png',          name: 'Maria Petrova',    title: 'Cryptocurrency Analyst, Bloomberg',          text: '"When my Ledger wallet showed transaction errors, I thought my funds were gone forever. This service provided expert validation and recovery. The 24/7 support and secure protocol gave me complete peace of mind."' },
  { img: 'reviewer-robert.png',         name: 'Robert Kumar',     title: 'Blockchain Developer, Ethereum Foundation',  text: '"Exceptional service for wallet recovery! They resolved my staking issues and helped me reclaim rewards I thought were lost. The team\'s knowledge of blockchain protocols is unmatched. Five stars!"' },
  { img: 'reviewer-lisa.png',           name: 'Lisa Chambers',    title: 'NFT Collector & Web3 Educator',             text: '"After dealing with gas fee errors for weeks, this protocol finally solved my problem. The direct connection to wallet representatives made all the difference. Professional, secure, and highly effective!"' },
  { img: 'reviewer-david-thompson.png', name: 'David Thompson',   title: 'Crypto Fund Manager, Grayscale',            text: '"I recovered $120K worth of tokens thanks to this service. Their validation process is thorough and the security measures are top-notch. Every crypto investor should know about this protocol."' },
  { img: 'reviewer-emily.png',          name: 'Emily Johnson',    title: 'Senior Analyst, Binance Research',          text: '"When my Coinbase Wallet had synchronization issues, this protocol provided expert assistance that my regular support couldn\'t. Fast, secure, and incredibly knowledgeable team. Absolutely recommend!"' },
  { img: 'reviewer-michael.png',        name: 'Michael Harper',   title: 'DeFi Portfolio Manager',                    text: '"This platform saved my portfolio! Lost my 2FA and couldn\'t access my wallet for weeks. The recovery process was smooth and the team walked me through every step with patience and professionalism."' },
  { img: 'reviewer-nina.png',           name: 'Nina Kowalski',    title: 'Crypto Journalist, Forbes',                 text: '"As a journalist covering DeFi, I\'ve seen many wallet recovery services. This one stands out for its transparency and genuine expertise. My readers have reported 100% success rates."' },
  { img: 'reviewer-thomas.png',         name: 'Thomas Brooks',    title: 'Smart Contract Auditor',                    text: '"From a technical standpoint, the security protocols here are impressive. When I tested this service for an audit, it met every standard I\'d expect from an enterprise-grade solution."' },
  { img: 'reviewer-aisha.png',          name: 'Aisha Rahman',     title: 'NFT Artist & Collector',                    text: '"Lost access to my wallet with $80K in NFTs. This service restored everything within 24 hours. The team was professional, discreet and incredibly efficient. Forever grateful!"' },
]

/* ── Carousel hook — slides ONE card at a time, pauses when off-screen ────── */
function useCarousel(items, interval = 5000, initialDelay = 0) {
  const ref = useRef(null)
  const containerRef = useRef(null)
  const [idx, setIdx] = useState(0)
  const [ipv, setIpv] = useState(3)
  const ipvRef = useRef(3)
  const idxRef = useRef(0)
  const timer = useRef(null)
  const delayTimer = useRef(null)
  const visibleRef = useRef(false)

  const calcIpv = () => {
    let v = 3
    if (window.innerWidth < 640) v = 1
    else if (window.innerWidth < 1024) v = 2
    setIpv(v)
    ipvRef.current = v
  }

  const applyTransform = (i) => {
    if (!ref.current) return
    const gap = 30
    const item = ref.current.firstElementChild
    if (!item) return
    ref.current.style.transform = `translateX(${-(i * (item.offsetWidth + gap))}px)`
  }

  const stopTimer = () => clearInterval(timer.current)

  const startTimer = () => {
    stopTimer()
    timer.current = setInterval(() => {
      if (!visibleRef.current) return   // paused — section not in view
      const max = Math.max(0, items.length - ipvRef.current)
      const next = idxRef.current + 1 > max ? 0 : idxRef.current + 1
      idxRef.current = next
      setIdx(next)
      applyTransform(next)
    }, interval)
  }

  useEffect(() => {
    calcIpv()
    window.addEventListener('resize', calcIpv)
    return () => window.removeEventListener('resize', calcIpv)
  }, [])

  // recalculate transform on resize
  useEffect(() => { applyTransform(idx) }, [ipv])

  // IntersectionObserver — start/stop based on visibility
  useEffect(() => {
    const el = containerRef.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([entry]) => { visibleRef.current = entry.isIntersecting },
      { threshold: 0.2 }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [])

  useEffect(() => {
    if (initialDelay > 0) {
      delayTimer.current = setTimeout(() => startTimer(), initialDelay)
    } else {
      startTimer()
    }
    return () => { stopTimer(); clearTimeout(delayTimer.current) }
  }, [items.length, interval])

  useEffect(() => { applyTransform(idx) }, [idx])

  const goTo = (page) => {
    const target = Math.min(page * ipvRef.current, Math.max(0, items.length - ipvRef.current))
    idxRef.current = target
    setIdx(target)
    applyTransform(target)
    startTimer()
  }

  const pages = Math.ceil(items.length / ipv)
  const currentPage = Math.floor(idx / ipv)

  return { ref, containerRef, idx, ipv, pages, currentPage, goTo }
}

/* ── Wallet Carousel ─────────────────────────────────────────────────────── */
function WalletCarousel({ onOpenWallet }) {
  const c = useCarousel(WALLET_ITEMS)
  return (
    <>
      <div className="wallet-carousel-container" ref={c.containerRef}>
        <div className="wallet-carousel" ref={c.ref}>
          {WALLET_ITEMS.map((item, i) => (
            <div className="wallet-carousel-item" key={i}>
              <div className="features-item" style={{ cursor: 'pointer' }} onClick={onOpenWallet}>
                <div className="features-content">
                  <h2 className="title">{item.title}</h2>
                  <p>{item.desc}</p>
                </div>
                <div className="features-img">
                  <div style={{ width: 110, height: 110 }}>{ICONS[i]}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="carousel-dots">
        {Array.from({ length: c.pages }).map((_, i) => (
          <button key={i} className={`carousel-dot${i === c.currentPage ? ' active' : ''}`} onClick={() => c.goTo(i)} />
        ))}
      </div>
    </>
  )
}

/* ── Reviews Carousel ────────────────────────────────────────────────────── */
function ReviewsCarousel() {
  const c = useCarousel(REVIEWS, 5000, 3000)
  return (
    <>
      <div className="reviews-carousel-container" ref={c.containerRef}>
        <div className="reviews-carousel" ref={c.ref}>
          {REVIEWS.map((r, i) => (
            <div className="review-card" key={i}>
              <div className="stars">★★★★★</div>
              <p className="review-text">{r.text}</p>
              <div className="reviewer">
                <img src={`/media/images/${r.img}`} alt={r.name} className="avatar" />
                <div>
                  <h4 className="reviewer-name">{r.name}</h4>
                  <p className="reviewer-title">{r.title}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="review-carousel-dots">
        {Array.from({ length: c.pages }).map((_, i) => (
          <button key={i} className={`carousel-dot${i === c.currentPage ? ' active' : ''}`} onClick={() => c.goTo(i)} />
        ))}
      </div>
    </>
  )
}

/* ── Infinite brand row ──────────────────────────────────────────────────── */
function BrandRow({ imgs, reverse }) {
  const d = [...imgs, ...imgs]
  return (
    <div style={{ overflow: 'hidden', marginBottom: 16 }}>
      <div style={{
        display: 'flex', alignItems: 'center',
        animation: `ticker ${reverse ? '22s' : '18s'} linear infinite ${reverse ? 'reverse' : 'normal'}`,
      }}>
        {d.map((src, i) => (
          <div key={i} style={{ flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', height: 80, padding: '0 24px' }}>
            <img src={src} alt="" style={{ maxHeight: 60, maxWidth: 120, objectFit: 'contain' }} />
          </div>
        ))}
      </div>
    </div>
  )
}

/* ── Mobile responsive styles ────────────────────────────────────────────── */
const MOBILE_CSS = `
  @media (max-width: 768px) {
    .cp-hero-grid {
      grid-template-columns: 1fr !important;
      padding: 80px 5% 60px !important;
      text-align: center;
    }
    .cp-hero-left { order: 1; }
    .cp-hero-left p { margin: 0 auto 2.5rem !important; }
    .cp-hero-right { order: 2; margin-top: 32px; }
    .cp-hero-right img { width: min(340px, 100%) !important; }

    .cp-rocket { display: none !important; }
    .cp-bitcoin { display: none !important; }
    .cp-coin1 { display: none !important; }

    .cp-started-grid {
      grid-template-columns: 1fr !important;
      gap: 16px !important;
    }
    .cp-started-section { padding: 60px 5% !important; }

    .cp-selection-header {
      flex-direction: column !important;
      align-items: flex-start !important;
      margin-bottom: 32px !important;
    }
    .cp-selection-section { padding: 60px 5% !important; }

    .cp-experts-section { padding: 60px 5% 100px !important; }
    .cp-experts-header { margin-bottom: 40px !important; }

    .cp-trusted-section { padding: 60px 0 !important; }
    .cp-trusted-section h2 { margin-bottom: 32px !important; }
  }
`

/* ── MAIN PAGE ───────────────────────────────────────────────────────────── */
export default function ConnectPage() {
  const [scrollY, setScrollY] = useState(0)
  const [showBack, setShowBack] = useState(false)
  const [ready, setReady] = useState(false)
  const [walletOpen, setWalletOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => {
      const y = window.pageYOffset
      setScrollY(y)
      setShowBack(y > 300)
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => { setTimeout(() => setReady(true), 80) }, [])

  /* rocket parallax — moves upward on scroll (original has .parallax-slow data-speed) */
  const rocketTranslate = scrollY * 0.12

  const brandRow1 = [
    '/media/images/item-1.png', '/media/images/item-2.png', '/media/images/item-4.png',
    '/media/images/item-6.png', '/media/images/item-7.png', '/media/images/item-8.png',
    '/media/images/item-9.png', '/media/images/item-10.png',
  ]
  const brandRow2 = [
    '/media/images/item-11.png', '/media/images/item-12.png', '/media/images/item-13.png',
    '/media/images/item-1.png', '/media/images/item-7.png', '/media/images/item-2.png',
    '/media/images/item-9.png', '/media/images/item-8.png', '/media/images/item-10.png',
  ]

  /* section glow blobs (shared pattern across all sections) */
  const GlowBlue = ({ pos }) => (
    <div style={{ position: 'absolute', ...pos, width: 250, height: 250, background: 'rgb(58 150 255 / 0.5)', filter: 'blur(85px)', pointerEvents: 'none' }} />
  )
  const GlowTeal = ({ pos }) => (
    <div style={{ position: 'absolute', ...pos, width: 250, height: 250, background: 'rgb(18 255 184 / 0.5)', filter: 'blur(85px)', pointerEvents: 'none' }} />
  )
  const GlowGold = ({ pos }) => (
    <div style={{ position: 'absolute', ...pos, width: 250, height: 204, background: 'rgba(240,185,11,0.5)', filter: 'blur(85px)', pointerEvents: 'none' }} />
  )

  return (
    <div style={{ background: '#02050a', fontFamily: F, overflowX: 'hidden', color: 'rgb(218,218,218)' }}>
      <style>{MOBILE_CSS}</style>

      {/* ── TICKER ─────────────────────────────────────────────────────────── */}
      <div style={{ position: 'sticky', top: 0, zIndex: 20 }}>
        <CryptoTicker />
      </div>

      {/* ════════════════════════════════════════════════════════════════════ */}
      {/* HERO SECTION — bg-accent5, min-h-screen                            */}
      {/* ════════════════════════════════════════════════════════════════════ */}
      <section style={{ position: 'relative', background: '#09131d', overflow: 'hidden', minHeight: '100vh', display: 'flex', alignItems: 'center' }}>
        {/* glows */}
        <GlowGold pos={{ bottom: '-15%', left: '-12%' }} />
        <GlowBlue pos={{ top: '6%', left: '-12%' }} />
        <GlowTeal pos={{ bottom: '6%', right: '-8%' }} />

        {/* ellipse-1 top-left (121×250 natural) */}
        <img src="/media/images/ellipse-1.png" alt="" style={{ position: 'absolute', left: 0, top: 32, pointerEvents: 'none', zIndex: 0, maxWidth: '28vw' }} />
        {/* ellipse-2 bottom-right (127×250 natural) */}
        <img src="/media/images/ellipse-2.png" alt="" style={{ position: 'absolute', right: 0, bottom: 64, pointerEvents: 'none', zIndex: 0, maxWidth: '28vw' }} />

        {/* globe — right-5 top-12 — 80px, animate-slow-rotate */}
        <img src="/media/images/globe.png" alt="" style={{ position: 'absolute', right: '1.25rem', top: '3rem', width: 80, pointerEvents: 'none', zIndex: 3, animation: 'slow-rotate 25s linear infinite' }} />

        {/* rocket — left-10 bottom-8 — natural size 190px, parallax scroll */}
        <img className="cp-rocket" src="/media/images/rocket.png" alt="" style={{
          position: 'absolute', left: '2.5rem', bottom: '2rem',
          width: 190, pointerEvents: 'none', zIndex: 3,
          transform: `translateY(${-rocketTranslate}px)`,
          transition: 'transform 0.1s linear',
        }} />

        {/* bitcoin — left-[5%] bottom-[30%] — animate-slow-rotate-reverse */}
        <img className="cp-bitcoin" src="/media/images/bitcoin.png" alt="" style={{ position: 'absolute', left: '5%', bottom: '30%', pointerEvents: 'none', zIndex: 3, animation: 'slow-rotate-reverse 25s linear infinite' }} />

        {/* coin-1 — right-[12%] top-[40%] — animate-slow-rotate */}
        <img className="cp-coin1" src="/media/images/coin-1.png" alt="" style={{ position: 'absolute', right: '12%', top: '40%', pointerEvents: 'none', zIndex: 3, animation: 'slow-rotate 25s linear infinite' }} />

        {/* grid container */}
        <div className="cp-hero-grid" style={{ width: '100%', maxWidth: 1400, margin: '0 auto', padding: '120px 5%', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, alignItems: 'center' }}>

          {/* LEFT */}
          <div className="cp-hero-left" style={{ position: 'relative', zIndex: 4, opacity: ready ? 1 : 0, transform: ready ? 'translateY(0)' : 'translateY(30px)', transition: 'opacity 0.8s ease, transform 0.8s ease' }}>
            <h2 style={{ fontFamily: F, fontWeight: 700, lineHeight: 1.2, letterSpacing: '-0.01em', margin: '0 0 1rem', fontSize: 'clamp(1.75rem, 5vw, 2.5rem)' }}>
              <span style={{ color: '#ffffff' }}>Wallet Issues? </span>
              <span style={{ color: '#3a96ff', textDecoration: 'underline', textDecorationColor: '#3a96ff', textDecorationThickness: '2.5px', textUnderlineOffset: '6px' }}>You're</span>
              {' '}
              <span style={{ color: '#ffd700', textDecoration: 'underline', textDecorationColor: '#ffd700', textDecorationThickness: '2.5px', textUnderlineOffset: '6px' }}>Covered!</span>
            </h2>
            <p style={{ fontFamily: F, fontSize: 'clamp(0.95rem, 2.5vw, 1.125rem)', lineHeight: 1.7, color: 'rgb(218,218,218)', maxWidth: 448, margin: '0 0 2.5rem' }}>
              From Wallet Recovery to Blockchain Troubleshooting, This Browser Provides Reliable Solutions For All Your Crypto Wallet Needs.
            </p>
            <button className="btn-primary" onClick={() => setWalletOpen(true)}>Connect Wallet</button>
          </div>

          {/* RIGHT — hero.png natural 526×446 */}
          <div className="cp-hero-right" style={{ position: 'relative', zIndex: 4, display: 'flex', justifyContent: 'center', opacity: ready ? 1 : 0, transform: ready ? 'translateY(0)' : 'translateY(30px)', transition: 'opacity 0.8s ease 0.2s, transform 0.8s ease 0.2s' }}>
            {/* blue glow behind card */}
            <div style={{ position: 'absolute', top: '6%', left: 0, width: 350, height: 350, background: 'rgb(58 150 255 / 0.5)', filter: 'blur(85px)', pointerEvents: 'none', zIndex: 1 }} />
            <img src="/media/images/hero.png" alt="" style={{ position: 'relative', zIndex: 3, width: 'min(526px, 100%)' }} />
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════════════ */}
      {/* HOW TO GET STARTED — bg-accent5                                    */}
      {/* ════════════════════════════════════════════════════════════════════ */}
      <section style={{ position: 'relative', background: '#09131d', overflowX: 'hidden' }}>
        <GlowTeal pos={{ bottom: 0, left: '-12%' }} />
        <GlowBlue pos={{ top: '-6%', right: '-8%' }} />

        {/* how-start-el-1 bottom-left — natural 276×262 */}
        <img src="/media/images/how-start-el-1.png" alt="" style={{ position: 'absolute', left: 0, bottom: 12, pointerEvents: 'none', zIndex: 1 }} />
        {/* how-start-el-2 top-right — natural 172×206 — animate-skew */}
        <img src="/media/images/how-start-el-2.png" alt="" style={{ position: 'absolute', right: '5%', top: '4%', pointerEvents: 'none', zIndex: 1, animation: 'skew 5s linear infinite alternate' }} />

        <div className="cp-started-section" style={{ maxWidth: 1400, margin: '0 auto', padding: '120px 5%' }}>
          {/* h2: exact from original — text-center, mb-10 xl:mb-[60px] */}
          <h2 style={{ fontFamily: F, textAlign: 'center', color: '#fff', fontSize: 'clamp(20px,3vw,40px)', fontWeight: 700, lineHeight: '125%', margin: '0 0 40px' }}>
            How To Get <span style={{ color: '#3a96ff', textDecoration: 'underline', textDecorationColor: '#3a96ff', textDecorationThickness: 2, textUnderlineOffset: 6 }}>Started</span>
          </h2>

          <div className="cp-started-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 12, position: 'relative', zIndex: 2, textAlign: 'center', alignItems: 'stretch' }}>

            {/* Card 1 — bg-primary blue */}
            <div style={{ borderRadius: 16, padding: '40px 24px 40px', background: 'rgb(58,150,255)', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
              <div style={{ width: 64, height: 64, borderRadius: '50%', background: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 20, flexShrink: 0 }}>
                <svg viewBox="0 0 24 24" fill="none" stroke="rgb(58,150,255)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: 28, height: 28 }}>
                  <path d="M16 21v-2a4 4 0 00-4-4H6a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><line x1="19" y1="8" x2="19" y2="14"/><line x1="16" y1="11" x2="22" y2="11"/>
                </svg>
              </div>
              <h4 style={{ fontFamily: F, color: '#fff', fontSize: 20, fontWeight: 700, lineHeight: 1.25, margin: '0 0 14px' }}>Connect Wallet</h4>
              <p style={{ fontFamily: F, color: 'rgba(255,255,255,0.95)', fontSize: 16, lineHeight: 1.7, margin: 0, flex: 1 }}>
                Ensure your wallet is connected to the platform to initiate troubleshooting.
              </p>
              <button style={{
                fontFamily: F, display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                marginTop: 28, borderRadius: 9999, padding: '10px 28px', fontSize: 15, fontWeight: 600,
                color: 'rgb(58,150,255)', background: '#ffffff', cursor: 'pointer',
                border: 'none', transition: 'all 300ms ease', flexShrink: 0,
              }}
                onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.9)' }}
                onMouseLeave={e => { e.currentTarget.style.background = '#ffffff' }}
                onClick={() => setWalletOpen(true)}
              >Connect Wallet</button>
            </div>

            {/* Cards 2-4 — each with own solid dark card background */}
            {[
              { num: '02', title: 'Identify the Issue',  body: 'Pinpoint the specific wallet problem for targeted solutions.',                    foot: 'Connect your wallet first' },
              { num: '03', title: 'Validate the Wallet', body: 'Check and verify wallet settings and blockchain configurations.',                 foot: 'Identify your wallet first' },
              { num: '04', title: 'Auto Fixing',         body: 'Take actionable steps to fix your wallet issues and restore full functionality.', foot: 'Validate your wallet first' },
            ].map((s, i) => (
              <div key={i} style={{ borderRadius: 16, padding: '40px 24px 40px', background: '#0f1e2e', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
                {/* number — dark circle, centered top */}
                <div style={{ width: 64, height: 64, borderRadius: '50%', background: '#1a2535', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 20, flexShrink: 0 }}>
                  <span style={{ fontFamily: F, color: '#fff', fontSize: 20, fontWeight: 700, lineHeight: 1 }}>{s.num}</span>
                </div>
                <h4 style={{ fontFamily: F, color: '#fff', fontSize: 20, fontWeight: 700, lineHeight: 1.25, margin: '0 0 14px' }}>{s.title}</h4>
                <p style={{ fontFamily: F, color: 'rgba(255,255,255,0.75)', fontSize: 16, lineHeight: 1.7, margin: 0, flex: 1 }}>{s.body}</p>
                {/* footer step prerequisite — white bold, sits at same level as card 1 button */}
                <p style={{ fontFamily: F, color: '#ffffff', fontSize: 16, fontWeight: 700, lineHeight: 1.5, marginTop: 28, flexShrink: 0 }}>{s.foot}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════════════ */}
      {/* MAKE YOUR SELECTION — bg-accent5                                   */}
      {/* ════════════════════════════════════════════════════════════════════ */}
      <section style={{ position: 'relative', background: '#09131d', overflow: 'hidden' }}>
        <GlowBlue pos={{ bottom: '-6%', left: '-12%' }} />
        <GlowTeal pos={{ top: '-6%', right: '-8%' }} />

        {/* globe right-5 top-12 */}
        <img src="/media/images/globe.png" alt="" style={{ position: 'absolute', right: '1.25rem', top: '3rem', width: 80, pointerEvents: 'none', zIndex: 3, animation: 'slow-rotate 25s linear infinite' }} />
        {/* bitcoin-3 left-[5%] bottom — sits below the cards */}
        <img src="/media/images/bitcoin-3.png" alt="" style={{ position: 'absolute', left: '5%', bottom: '6%', pointerEvents: 'none', zIndex: 3, animation: 'slow-rotate-reverse 25s linear infinite' }} />
        {/* element-1 right-0 bottom-0 natural 329×374 */}
        <img src="/media/images/element-1.png" alt="" style={{ position: 'absolute', right: 0, bottom: 0, pointerEvents: 'none', zIndex: 1 }} />

        <div className="cp-selection-section" style={{ maxWidth: 1400, margin: '0 auto', padding: '120px 5%', position: 'relative', zIndex: 2 }}>
          <div className="cp-selection-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 20, marginBottom: 60 }}>
            <div style={{ maxWidth: 512 }}>
              <h2 style={{ fontFamily: F, color: '#fff', fontSize: 'clamp(20px,2.5vw,40px)', fontWeight: 700, lineHeight: '125%', margin: '0 0 8px' }}>
                Make Your <span style={{ color: '#3a96ff', textDecoration: 'underline', textDecorationColor: '#3a96ff', textDecorationThickness: 2, textUnderlineOffset: 6 }}>Selection</span> Below:
              </h2>
              <p style={{ fontFamily: F, color: 'rgb(218,218,218)', fontSize: 16, lineHeight: 1.7, margin: 0 }}>
                Choose the Issue Affecting Your Wallet for Quick Assistance!
              </p>
            </div>
          </div>
          <WalletCarousel onOpenWallet={() => setWalletOpen(true)} />
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════════════ */}
      {/* WHAT CRYPTO EXPERTS SAY — bg-accent5                               */}
      {/* ════════════════════════════════════════════════════════════════════ */}
      <section style={{ position: 'relative', background: '#09131d', overflow: 'hidden' }}>
        <GlowBlue pos={{ bottom: '-6%', left: '-12%' }} />
        <GlowTeal pos={{ top: '-6%', right: '-8%' }} />

        {/* globe right-5 top-12 */}
        <img src="/media/images/globe.png" alt="" style={{ position: 'absolute', right: '1.25rem', top: '3rem', width: 80, pointerEvents: 'none', zIndex: 3, animation: 'slow-rotate 25s linear infinite' }} />
        {/* try-el-1 — green 3D box: top portion peeks behind card bottoms, body below */}
        <img src="/media/images/try-el-1.png" alt="" style={{ position: 'absolute', left: '3%', bottom: '20%', pointerEvents: 'none', zIndex: 1, animation: 'updown 5s linear infinite' }} />
        {/* try-el-2 — 3D ring: top portion peeks behind card bottoms, body below */}
        <img src="/media/images/try-el-2.png" alt="" style={{ position: 'absolute', right: '3%', bottom: '18%', pointerEvents: 'none', zIndex: 1, animation: 'slow-rotate-reverse 25s linear infinite' }} />

        <div className="cp-experts-section" style={{ maxWidth: 1400, margin: '0 auto', padding: '120px 5% 180px', position: 'relative', zIndex: 2 }}>
          <div className="cp-experts-header" style={{ textAlign: 'center', marginBottom: 64 }}>
            <h2 style={{ fontFamily: F, color: '#fff', fontSize: 'clamp(20px,2.5vw,40px)', fontWeight: 700, lineHeight: '125%', margin: '0 0 16px' }}>
              What Crypto <span style={{ color: '#3a96ff', textDecoration: 'underline', textDecorationColor: '#3a96ff', textDecorationThickness: 2, textUnderlineOffset: 6 }}>Experts</span> Say
            </h2>
            <p style={{ fontFamily: F, color: 'rgb(218,218,218)', fontSize: 16, lineHeight: 1.7, margin: '0 auto', maxWidth: 768 }}>
              Trusted by leading voices in the cryptocurrency industry
            </p>
          </div>
          <ReviewsCarousel />
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════════════ */}
      {/* TRUSTED BY — bg-accent5                                            */}
      {/* ════════════════════════════════════════════════════════════════════ */}
      <section style={{ position: 'relative', background: '#09131d', overflow: 'hidden' }}>
        <GlowBlue pos={{ bottom: '-6%', left: '-9%' }} />
        <GlowBlue pos={{ top: '-6%', right: '-8%' }} />

        <div className="cp-trusted-section" style={{ padding: '120px 0', position: 'relative', zIndex: 2 }}>
          <h2 style={{ fontFamily: F, textAlign: 'center', color: '#fff', fontSize: 'clamp(20px,2.5vw,40px)', fontWeight: 700, lineHeight: '125%', margin: '0 0 60px' }}>
            Trusted by
          </h2>
          <BrandRow imgs={brandRow1} />
          <BrandRow imgs={brandRow2} reverse />
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════════════ */}
      {/* FOOTER — bg-accent5                                                */}
      {/* ════════════════════════════════════════════════════════════════════ */}
      <footer style={{ position: 'relative', background: '#09131d', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', bottom: '-6%', left: '-9%', width: 150, height: 150, background: 'rgb(58 150 255 / 0.5)', filter: 'blur(85px)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', top: '-6%', right: '-8%', width: 150, height: 150, background: 'rgb(18 255 184 / 0.5)', filter: 'blur(85px)', pointerEvents: 'none' }} />
        {/* footer-el-2 right-1 bottom-0 — natural 328×240 */}
        <img src="/media/images/footer-el-2.png" alt="" style={{ position: 'absolute', right: 4, bottom: 0, pointerEvents: 'none' }} />
        {/* how-start-el-2 right-0 top-2 — animate-skew */}
        <img src="/media/images/how-start-el-2.png" alt="" style={{ position: 'absolute', right: 0, top: 8, pointerEvents: 'none', animation: 'skew 5s linear infinite alternate' }} />

        <div style={{ padding: '20px 5% 32px', borderTop: '1px solid #1e2329', position: 'relative', zIndex: 2, textAlign: 'center' }}>
          <p style={{ fontFamily: F, color: 'rgba(255,255,255,0.5)', fontSize: 14, margin: 0 }}>
            Copyright @ 2026 All Rights Reserved.
          </p>
        </div>
      </footer>

      {/* ── BACK TO TOP ─────────────────────────────────────────────────── */}
      <div id="backToTop" className={`back-to-top${showBack ? ' visible' : ''}`}
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      />

      {/* ── WALLET MODAL ─────────────────────────────────────────────────── */}
      <WalletModal open={walletOpen} onClose={() => setWalletOpen(false)} />
    </div>
  )
}
