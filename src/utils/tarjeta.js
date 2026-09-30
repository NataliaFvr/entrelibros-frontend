// Formatea lo que se escribe: número en grupos de 4, vencimiento MM/AA, seguridad solo dígitos
export const enmascarar = (campo, valor) => {
  if (campo === 'numero') return valor.replace(/\D/g, '').slice(0, 19).replace(/(.{4})/g, '$1 ').trim()
  if (campo === 'venc') {
    const d = valor.replace(/\D/g, '').slice(0, 4)
    return d.length > 2 ? `${d.slice(0, 2)}/${d.slice(2)}` : d
  }
  if (campo === 'cvv') return valor.replace(/\D/g, '').slice(0, 4)
  return valor
}

// Devuelve el mensaje del primer error, o '' si está todo bien
export const validarTarjeta = (v) => {
  const numero = v.numero.replace(/\s/g, '')
  const venc = v.venc.match(/^(\d\d)\/(\d\d)$/)
  if (!/^\d{13,19}$/.test(numero)) return 'Completá los datos de la tarjeta (o usá la tarjeta de prueba).'
  if (!v.titular.trim()) return 'Ingresá el nombre del titular.'
  if (!venc || +venc[1] < 1 || +venc[1] > 12 || new Date(2000 + +venc[2], +venc[1], 1) <= new Date()) return 'Revisá el vencimiento de la tarjeta.'
  if (!/^\d{3,4}$/.test(v.cvv)) return 'El código de seguridad debe tener 3 o 4 dígitos.'
  return ''
}
