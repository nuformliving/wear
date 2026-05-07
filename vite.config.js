import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import fs from 'fs'
import path from 'path'

const ORDERS_FILE   = path.resolve('./orders.json')
const PRODUCTS_FILE = path.resolve('./products.json')
const UPLOADS_DIR   = path.resolve('./public/uploads')

// Ensure uploads directory exists
if (!fs.existsSync(UPLOADS_DIR)) fs.mkdirSync(UPLOADS_DIR, { recursive: true })

function ordersApiPlugin() {
  return {
    name: 'orders-api',
    configureServer(server) {

      // ── /api/upload ──────────────────────────────────────────────
      server.middlewares.use('/api/upload', (req, res) => {
        res.setHeader('Access-Control-Allow-Origin', '*')
        res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
        res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

        if (req.method === 'OPTIONS') { res.statusCode = 204; res.end(); return }

        if (req.method !== 'POST') {
          res.statusCode = 405
          res.setHeader('Content-Type', 'application/json')
          res.end(JSON.stringify({ error: 'Method not allowed' }))
          return
        }

        // Parse multipart/form-data manually (no external deps)
        const chunks = []
        req.on('data', chunk => chunks.push(chunk))
        req.on('end', () => {
          try {
            const buffer = Buffer.concat(chunks)
            const contentType = req.headers['content-type'] || ''
            const boundaryMatch = contentType.match(/boundary=(.+)/)
            if (!boundaryMatch) throw new Error('No boundary')

            const boundary = Buffer.from('--' + boundaryMatch[1])
            const parts = splitBuffer(buffer, boundary)

            let savedUrl = null

            for (const part of parts) {
              if (!part.length) continue
              const separatorIdx = indexOfBuffer(part, Buffer.from('\r\n\r\n'))
              if (separatorIdx === -1) continue

              const headerSection = part.slice(0, separatorIdx).toString()
              const body = part.slice(separatorIdx + 4)

              // Strip trailing \r\n--
              const fileBody = body.slice(0, body.length - 2)

              const nameMatch = headerSection.match(/name="([^"]+)"/)
              const filenameMatch = headerSection.match(/filename="([^"]+)"/)
              const ctMatch = headerSection.match(/Content-Type:\s*(.+)/i)

              if (!nameMatch || nameMatch[1] !== 'image') continue
              if (!filenameMatch) continue

              const origName = filenameMatch[1]
              const ext = path.extname(origName).toLowerCase() || '.jpg'
              const allowed = ['.jpg', '.jpeg', '.png', '.webp', '.gif', '.avif']
              if (!allowed.includes(ext)) {
                res.statusCode = 400
                res.setHeader('Content-Type', 'application/json')
                res.end(JSON.stringify({ error: 'File type not allowed' }))
                return
              }

              const filename = `${Date.now()}-${Math.random().toString(36).slice(2)}${ext}`
              const filepath  = path.join(UPLOADS_DIR, filename)
              fs.writeFileSync(filepath, fileBody)
              savedUrl = `/uploads/${filename}`
            }

            if (!savedUrl) throw new Error('No image found in upload')

            res.setHeader('Content-Type', 'application/json')
            res.end(JSON.stringify({ url: savedUrl }))
          } catch (err) {
            res.statusCode = 400
            res.setHeader('Content-Type', 'application/json')
            res.end(JSON.stringify({ error: err.message || 'Upload failed' }))
          }
        })
        req.on('error', () => {
          res.statusCode = 500
          res.setHeader('Content-Type', 'application/json')
          res.end(JSON.stringify({ error: 'Request error' }))
        })
      })

      // ── /api/orders ─────────────────────────────────────────────
      server.middlewares.use('/api/orders', (req, res) => {
        res.setHeader('Content-Type', 'application/json')
        res.setHeader('Access-Control-Allow-Origin', '*')
        res.setHeader('Access-Control-Allow-Methods', 'GET, PUT, OPTIONS')
        res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

        if (req.method === 'OPTIONS') { res.statusCode = 204; res.end(); return }

        if (req.method === 'GET') {
          try {
            const data = fs.existsSync(ORDERS_FILE)
              ? JSON.parse(fs.readFileSync(ORDERS_FILE, 'utf8'))
              : { orders: {} }
            res.end(JSON.stringify(data))
          } catch { res.end(JSON.stringify({ orders: {} })) }
          return
        }

        if (req.method === 'PUT') {
          let body = ''
          req.on('data', chunk => { body += chunk })
          req.on('end', () => {
            try {
              const data = JSON.parse(body)
              fs.writeFileSync(ORDERS_FILE, JSON.stringify(data, null, 2))
              res.end(JSON.stringify(data))
            } catch {
              res.statusCode = 400
              res.end(JSON.stringify({ error: 'Invalid JSON' }))
            }
          })
          return
        }

        res.statusCode = 405
        res.end(JSON.stringify({ error: 'Method not allowed' }))
      })

      // ── /api/products ────────────────────────────────────────────
      server.middlewares.use('/api/products', (req, res) => {
        res.setHeader('Content-Type', 'application/json')
        res.setHeader('Access-Control-Allow-Origin', '*')
        res.setHeader('Access-Control-Allow-Methods', 'GET, PUT, POST, DELETE, OPTIONS')
        res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

        if (req.method === 'OPTIONS') { res.statusCode = 204; res.end(); return }

        if (req.method === 'GET') {
          try {
            const data = fs.existsSync(PRODUCTS_FILE)
              ? JSON.parse(fs.readFileSync(PRODUCTS_FILE, 'utf8'))
              : { products: [] }
            res.end(JSON.stringify(data))
          } catch { res.end(JSON.stringify({ products: [] })) }
          return
        }

        if (req.method === 'PUT') {
          let body = ''
          req.on('data', chunk => { body += chunk })
          req.on('end', () => {
            try {
              const data = JSON.parse(body)
              fs.writeFileSync(PRODUCTS_FILE, JSON.stringify(data, null, 2))
              res.end(JSON.stringify(data))
            } catch {
              res.statusCode = 400
              res.end(JSON.stringify({ error: 'Invalid JSON' }))
            }
          })
          return
        }

        res.statusCode = 405
        res.end(JSON.stringify({ error: 'Method not allowed' }))
      })
    },
  }
}

// ── Buffer helpers for multipart parsing ──────────────────────────
function indexOfBuffer(haystack, needle) {
  for (let i = 0; i <= haystack.length - needle.length; i++) {
    let found = true
    for (let j = 0; j < needle.length; j++) {
      if (haystack[i + j] !== needle[j]) { found = false; break }
    }
    if (found) return i
  }
  return -1
}

function splitBuffer(buffer, delimiter) {
  const parts = []
  let start = 0
  while (true) {
    const idx = indexOfBuffer(buffer.slice(start), delimiter)
    if (idx === -1) break
    parts.push(buffer.slice(start, start + idx))
    start += idx + delimiter.length
    // skip \r\n after boundary
    if (buffer[start] === 0x0d && buffer[start + 1] === 0x0a) start += 2
    if (buffer[start] === 0x2d && buffer[start + 1] === 0x2d) break // --
  }
  return parts
}

export default defineConfig({
  plugins: [react(), ordersApiPlugin()],
  server: { port: 5173 },
})
