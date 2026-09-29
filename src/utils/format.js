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
