// ── Cloud Order Store ──────────────────────────────────────────────────────
// Requests go to /api/orders which is proxied by Vite (dev) to jsonblob.com.
// This avoids browser CORS restrictions entirely — the proxy runs server-side.

const API = '/api/orders'

async function getAll() {
  const res = await fetch(API, { headers: { Accept: 'application/json' } })
  if (!res.ok) throw new Error(`Fetch failed: ${res.status}`)
  const data = await res.json()
  return data.orders || {}
}

async function putAll(orders) {
  const res = await fetch(API, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify({ orders }),
  })
  if (!res.ok) throw new Error(`PUT failed: ${res.status}`)
}

// Save or create a single order
export async function saveCloudOrder(order) {
  const orders = await getAll()
  orders[order.id.toUpperCase()] = order
  await putAll(orders)
  return order
}

// Fetch a single order by ID
export async function fetchCloudOrder(orderId) {
  const orders = await getAll()
  return orders[orderId.toUpperCase().trim()] || null
}

// Update the status/steps of an order (called by Admin)
export async function updateCloudOrderStatus(orderId, stepIndex, allStepLabels) {
  const orders = await getAll()
  const key = orderId.toUpperCase().trim()

  const now = new Date()
  const dateStr =
    now.toLocaleDateString('en-NG', { day: 'numeric', month: 'short', year: 'numeric' }) +
    ', ' +
    now.toLocaleTimeString('en-NG', { hour: '2-digit', minute: '2-digit' })

  let order = orders[key]

  if (!order) {
    // Order not yet in cloud — build a minimal record so tracking still works
    order = {
      id: key,
      customer: '',
      phone: '',
      email: '',
      address: '',
      items: [],
      total: 0,
      payMethod: '',
      placed: dateStr,
      status: allStepLabels[stepIndex],
      steps: allStepLabels.map((label, i) => ({
        label,
        done: i <= stepIndex,
        date: i <= stepIndex ? dateStr : 'Pending',
      })),
    }
  } else {
    order.steps = order.steps.map((s, i) => ({
      ...s,
      done: i <= stepIndex,
      // Only stamp a date if newly completed
      date: i <= stepIndex ? (s.done && s.date !== 'Pending' ? s.date : dateStr) : s.date,
    }))
    order.status = allStepLabels[stepIndex]
  }

  orders[key] = order
  await putAll(orders)
  return order
}
