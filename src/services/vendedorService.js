import { leer, guardar } from './almacen'
import { claveVendedor } from './claves'
import { getUsuarios } from './authService'
import { TONES } from '../utils/colors'

// Datos de vendedor por cuenta, guardados en este navegador.
// estado: 'ninguno' | 'pendiente' | 'aprobado'. Cada libro: { id, t, a, ed, cat, idioma, anio, usado, base, d, stock,
// estado: 'activo' | 'baja', mod: 'EN_REVISION' | 'ACEPTADO' | 'RECHAZADO' }.
// Back: la solicitud y la moderación de libros las resuelve un administrador.
export const precioFinal = (p) => Math.round(p.base * (1 - p.d / 100))

// La cuenta con rol VENDEDOR ya viene aprobada; el resto empieza sin solicitud
const inicial = (u) => (u.rol === 'VENDEDOR'
  ? { estado: 'aprobado', tienda: `${u.nombre} ${u.apellido}`, prov: 'Buenos Aires', pub: [] }
  : { estado: 'ninguno', pub: [] })

export const getVendedor = (u) => leer(claveVendedor(u), null) || inicial(u)
export const guardarVendedor = (u, v) => guardar(claveVendedor(u), v)

const aLibro = (p, v) => ({
  id: p.id, t: p.t, a: p.a, ed: p.ed, idioma: p.idioma, anio: p.anio, base: p.base, d: p.d, p: precioFinal(p),
  usado: p.usado, cat: p.cat, v: v.tienda, envio: v.prov === 'Buenos Aires' ? 'misma' : 'distinta',
  ventas: 0.5, stock: p.stock, c: TONES[(p.t.length + p.a.length) % TONES.length],
})

// Libros de todos los vendedores que están activos y aceptados: entran al catálogo
export const librosPublicados = () =>
  getUsuarios().flatMap((u) => {
    const v = leer(claveVendedor(u), null)
    if (!v || v.estado !== 'aprobado') return []
    return v.pub.filter((p) => p.estado === 'activo' && p.mod === 'ACEPTADO').map((p) => aLibro(p, v))
  })
