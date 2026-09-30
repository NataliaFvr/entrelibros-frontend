export const fmt = (n) => '$' + n.toLocaleString('es-AR')

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

// 65 min en ms -> "65:00"
export const mmss = (ms) => {
  const s = Math.max(0, Math.ceil(ms / 1000))
  return `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`
}
