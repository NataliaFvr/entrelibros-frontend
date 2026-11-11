import { listarOrdenesAdminApi, listarPagosAdminApi } from './comprasApi'

const aOrdenAdmin = (o) => ({
  n: o.n, fecha: o.date, comprador: o.comprador, provincia: o.dest.prov || o.addr, destino: o.addr,
  subtotal: o.sub, envio: o.env, total: o.total, estadoPago: o.pago,
  proveedor: o.proveedor || 'tarjeta', items: o.its,
})

const aPagoAdmin = (p) => ({ id: p.id, n: p.idOrden, proveedor: p.proveedor, monto: p.totalOrden, resultado: p.resultado })

export const cargarOrdenes = async () => (await listarOrdenesAdminApi()).map(aOrdenAdmin)

export const cargarPagos = async () => (await listarPagosAdminApi()).map(aPagoAdmin)
