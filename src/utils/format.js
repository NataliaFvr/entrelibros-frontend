export const fmt = (n) => '$' + n.toLocaleString('es-AR')

// Normaliza para búsquedas sin tildes ni mayúsculas
export const norm = (s) =>
  String(s).normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase()

export const plural = (n, uno, varios) => (n === 1 ? uno : varios)
