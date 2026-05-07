import React, { useState, useEffect } from 'react'
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import AnnouncementBar from './components/AnnouncementBar'
import CategorySection from './components/CategorySection'
import FeaturedProducts from './components/FeaturedProducts'
import Lookbook from './components/Lookbook'
import TestimonialSection from './components/TestimonialSection'
import InstagramFeed from './components/InstagramFeed'
import Newsletter from './components/Newsletter'
import Footer from './components/Footer'
import CartSidebar from './components/CartSidebar'
import WhatsAppFloat from './components/WhatsAppFloat'
import CheckoutModal from './components/CheckoutModal'
import BackToTop from './components/BackToTop'
import CookieBanner from './components/CookieBanner'
import SearchOverlay from './components/SearchOverlay'
import { useProducts } from './hooks/useProducts'

// Pages
import SizeGuide from './pages/SizeGuide'
import Shipping from './pages/Shipping'
import Returns from './pages/Returns'
import FAQ from './pages/FAQ'
import TrackOrder from './pages/TrackOrder'
import About from './pages/About'
import OurStory from './pages/OurStory'
import LookbookPage from './pages/LookbookPage'
import Press from './pages/Press'
import Sustainability from './pages/Sustainability'
import ProductDetail from './pages/ProductDetail'
import NotFound from './pages/NotFound'
import Admin from './pages/Admin'
import NewIn from './pages/NewIn'

function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => { window.scrollTo(0, 0) }, [pathname])
  return null
}

function HomePage({ products, addToCart, wishlist, toggleWishlist }) {
  return (
    <main>
      <Hero />
      <CategorySection />
      <FeaturedProducts products={products} addToCart={addToCart} wishlist={wishlist} toggleWishlist={toggleWishlist} />
      <Lookbook />
      <TestimonialSection />
      <InstagramFeed />
      <Newsletter />
    </main>
  )
}

function AppShell() {
  // Single source of truth for the product list — fetched once, shared everywhere
  const { products, loading: productsLoading } = useProducts()

  const [cartOpen, setCartOpen]               = useState(false)
  const [checkoutOpen, setCheckoutOpen]       = useState(false)
  const [searchOpen, setSearchOpen]           = useState(false)
  const [cartItems, setCartItems]             = useState([])
  const [wishlist, setWishlist]               = useState([])
  const addToCart = (product) => {
    setCartItems(prev => {
      const exists = prev.find(i => i.id === product.id && i.selectedSize === product.selectedSize)
      if (exists) return prev.map(i =>
        i.id === product.id && i.selectedSize === product.selectedSize
          ? { ...i, qty: i.qty + (product.qty || 1) }
          : i
      )
      return [...prev, { ...product, qty: product.qty || 1 }]
    })
    setCartOpen(true)
  }

  const removeFromCart = (id, size) => {
    setCartItems(prev => prev.filter(i => !(i.id === id && i.selectedSize === size)))
  }

  const toggleWishlist = (id) => {
    setWishlist(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id])
  }

  const cartCount = cartItems.reduce((sum, i) => sum + i.qty, 0)

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#faf7f4' }}>
      <ScrollToTop />
      <div style={{ position: 'sticky', top: 0, zIndex: 50 }}>
        <AnnouncementBar />
        <Navbar
          cartCount={cartCount}
          onCartOpen={() => setCartOpen(true)}
          onSearchOpen={() => setSearchOpen(true)}
        />
      </div>

      <Routes>
        <Route path="/" element={
          <HomePage
            products={products}
            addToCart={addToCart}
            wishlist={wishlist}
            toggleWishlist={toggleWishlist}
          />
        } />
        <Route path="/size-guide"    element={<SizeGuide />} />
        <Route path="/shipping"      element={<Shipping />} />
        <Route path="/returns"       element={<Returns />} />
        <Route path="/faq"           element={<FAQ />} />
        <Route path="/track-order"   element={<TrackOrder />} />
        <Route path="/about"         element={<About />} />
        <Route path="/our-story"     element={<OurStory />} />
        <Route path="/lookbook"      element={<LookbookPage />} />
        <Route path="/press"         element={<Press />} />
        <Route path="/sustainability" element={<Sustainability />} />
        <Route path="/product/:id"   element={
          <ProductDetail
            addToCart={addToCart}
            wishlist={wishlist}
            toggleWishlist={toggleWishlist}
          />
        } />
        <Route path="/new-in" element={
          <NewIn
            addToCart={addToCart}
            wishlist={wishlist}
            toggleWishlist={toggleWishlist}
          />
        } />
        <Route path="/admin"  element={<Admin />} />
        <Route path="*"       element={<NotFound />} />
      </Routes>

      <Footer />
      <CartSidebar
        open={cartOpen}
        onClose={() => setCartOpen(false)}
        items={cartItems}
        removeFromCart={removeFromCart}
        onCheckout={() => { setCartOpen(false); setCheckoutOpen(true) }}
      />
      <CheckoutModal
        open={checkoutOpen}
        onClose={() => setCheckoutOpen(false)}
        items={cartItems}
      />
      <SearchOverlay open={searchOpen} onClose={() => setSearchOpen(false)} products={products} />
      <WhatsAppFloat />
      <BackToTop />
      <CookieBanner />
    </div>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <AppShell />
    </BrowserRouter>
  )
}
