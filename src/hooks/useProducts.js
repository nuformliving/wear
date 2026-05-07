import { useState, useEffect } from 'react'
import { products as staticProducts } from '../data/products'

/**
 * Returns the live product list.
 * Fetches from the API first; falls back to the static list if unreachable.
 */
export function useProducts() {
  const [products, setProducts] = useState([])
  const [loading, setLoading]   = useState(true)

  useEffect(() => {
    fetch('/api/products')
      .then(r => r.json())
      .then(d => {
        if (d.products && d.products.length) {
          setProducts(d.products)
        } else {
          setProducts(staticProducts)
        }
      })
      .catch(() => setProducts(staticProducts))
      .finally(() => setLoading(false))
  }, [])

  return { products, loading }
}
