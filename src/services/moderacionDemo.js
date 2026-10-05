import { getUsuarios } from './authService'
import { enRevision, getVendedor, guardarVendedor } from './vendedorService'

// Cola de moderación de DEMOSTRACIÓN: lee las publicaciones en revisión que los vendedores de ejemplo tienen
// guardadas en este navegador. Devuelve la misma forma que services/moderacionService (SolicitudModeracion),
// con tipo MODIFICACION y las dos versiones cuando el libro ya estaba aceptado. Se usa cuando VITE_API_LIBROS no está activo.

const aDatos = (p) => ({
  titulo: p.t, autor: p.a, editorial: p.ed, anio: p.anio, idioma: p.idioma, estadoLibro: p.usado ? 'USADO' : 'NUEVO',
  precio: p.base, descuentoPct: p.d, stock: p.stock, descripcion: p.descripcion || '', imagenUrl: (p.imgs || [])[0] || null,
})

const vendedoresAprobados = () =>
  getUsuarios().map((u) => ({ u, v: getVendedor(u) })).filter(({ v }) => v.estado === 'aprobado')

export async function obtenerSolicitudes() {
  return vendedoresAprobados().flatMap(({ v }) =>
    v.pub.filter(enRevision).map((p) => ({
      id: p.id, libroId: p.id, nombreVendedor: v.tienda, fechaSolicitud: null,
      tipoModeracion: p.revision ? 'MODIFICACION' : 'NUEVO',
      datosActuales: p.revision ? aDatos(p) : null,
      datosPropuestos: aDatos(p.revision || p),
    })))
}

// Mismo efecto que el back: aprobar publica los datos propuestos; rechazar guarda el motivo para el vendedor
export async function moderarSolicitud(id, { aprobado, motivoRechazo }) {
  const dueno = vendedoresAprobados().find(({ v }) => v.pub.some((p) => p.id === id))
  if (!dueno) throw new Error('No encontramos esa solicitud. Puede que ya se haya resuelto.')
  const pub = dueno.v.pub.map((p) => {
    if (p.id !== id) return p
    const { revision, ...resto } = p
    if (aprobado) return { ...resto, ...(revision || {}), mod: 'ACEPTADO', modC: '' }
    return revision ? { ...resto, modC: motivoRechazo } : { ...resto, mod: 'RECHAZADO', modC: motivoRechazo }
  })
  if (!guardarVendedor(dueno.u, { ...dueno.v, pub })) throw new Error('No pudimos guardar la decisión: sin espacio en el navegador.')
}
