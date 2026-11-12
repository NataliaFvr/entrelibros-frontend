const ALIAS = { CABA: 'CIUDAD AUTONOMA DE BUENOS AIRES', 'CAPITAL FEDERAL': 'CIUDAD AUTONOMA DE BUENOS AIRES' }

// Igual que EnvioPolicy.normalizar del back: sin tildes, sin espacios de más, en mayúsculas y con CABA unificada
const normalizar = (provincia) => {
  const limpia = String(provincia || '').normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/\s+/g, ' ').trim().toUpperCase()
  return limpia ? ALIAS[limpia] || limpia : null
}

// 'misma' | 'distinta', con la misma regla que el back (EnvioPolicy.determinarTipo)
export const zonaEnvio = (provinciaVendedor, provinciaComprador) => {
  const vendedor = normalizar(provinciaVendedor)
  return vendedor && vendedor === normalizar(provinciaComprador) ? 'misma' : 'distinta'
}
