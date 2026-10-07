// $1.500 · $1.500,50 (los centavos solo aparecen si el precio los tiene)
export const fmt = (n) => '$' + n.toLocaleString('es-AR', { minimumFractionDigits: Number.isInteger(n) ? 0 : 2, maximumFractionDigits: 2 })

// Normaliza para búsquedas sin tildes ni mayúsculas
export const norm = (s) =>
  String(s).normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase()

export const plural = (n, uno, varios) => (n === 1 ? uno : varios)

// ana_gil@mail.com -> an••••@mail.com
export const enmascararMail = (email) => {
  const [a, b] = email.split('@')
  return a.slice(0, 2) + '•'.repeat(Math.max(2, a.length - 2)) + '@' + b
}

// Casa — Av. Rivadavia 1234, San Justo, Buenos Aires (1754)
export const direccionTexto = (a) =>
  `${a.alias} — ${a.calle}, ${a.ciudad}, ${a.prov}${a.cp ? ` (${a.cp})` : ''}`

// Dirección de entrega de un pedido (sin alias): Av. Rivadavia 1234, San Justo, Buenos Aires (1754)
// Si el pedido solo conoce la provincia (órdenes viejas, sin calle), devuelve solo la provincia.
export const destinoTexto = ({ calle, ciudad, prov, cp } = {}) =>
  calle ? `${[calle, ciudad, prov].filter(Boolean).join(', ')}${cp ? ` (${cp})` : ''}` : prov || ''

// 65 min en ms -> "65:00"
export const mmss = (ms) => {
  const s = Math.max(0, Math.ceil(ms / 1000))
  return `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`
}

// "2026-09-18" (o fecha ISO completa) -> "18/9/2026". Las fechas de solo día se leen como locales para que no se corran un día.
export const fechaCorta = (d) => new Date(d.length === 10 ? `${d}T00:00` : d).toLocaleDateString('es-AR')
