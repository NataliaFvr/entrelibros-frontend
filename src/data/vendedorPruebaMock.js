import { TONES } from '../utils/colors'

// Datos ficticios del vendedor de prueba que ve cualquier comprador en /vendedor/libreria-el-resplandor.
// Back: GET /vendedores/{id}, GET /vendedores/{id}/resenias y GET /libros?vendedor={id}

export const VENDEDOR_PRUEBA = {
  tienda: 'Librería El Resplandor',
  ubicacion: 'Rosario, Santa Fe',
  prov: 'Santa Fe',
  desde: 2023,
  verificado: true,
  foto: '', // URL o base64; si está vacía se muestran las iniciales
  descripcion: 'Misterio, terror y ciencia ficción, nuevos y de segunda mano. Cada libro sale revisado y bien embalado.',
}

// Reseñas de compradores: { id, st (1-5), nc (nombre del comprador), t (comentario), libro (libro comprado), date }
// Promedio: (5 + 5 + 5 + 4) / 4 = 4,75 -> 4,8
export const RESENIAS_PRUEBA = [
  { id: 'rp-1', st: 5, nc: 'Camila R.', t: 'Llegó en tres días y perfectamente embalado. El libro estaba tal cual la descripción.', libro: 'Noche de vidrio', date: '2026-09-18' },
  { id: 'rp-2', st: 5, nc: 'Martín P.', t: 'Muy buena atención: me avisaron cuando lo despacharon y respondieron todas mis dudas.', libro: 'El relojero', date: '2026-08-30' },
  { id: 'rp-3', st: 4, nc: 'Sofía L.', t: 'El usado tenía un poco más de uso del que esperaba, pero está bien cuidado y el precio es justo.', libro: 'Sombras del río', date: '2026-07-21' },
  { id: 'rp-4', st: 5, nc: 'Diego F.', t: 'Ya les compré dos veces. Siempre impecable, los recomiendo.', libro: 'Noche de vidrio', date: '2026-06-09' },
]

const libro = (id, datos) => {
  const p = Math.round(datos.base * (1 - datos.d / 100))
  return {
    id, idioma: 'Español', cat: 'Misterio', v: VENDEDOR_PRUEBA.tienda, envio: 'distinta', ventas: 0.01,
    ...datos, p, c: TONES[id % TONES.length],
  }
}

// Catálogo del vendedor. Entran también al catálogo general (librosService), para poder comprarlos.
export const LIBROS_PRUEBA = [
  libro(9001, { t: 'Noche de vidrio', a: 'Marta Soler', ed: 'Alfaguara', anio: 2021, base: 280, d: 15, usado: false, stock: 8, cat: 'Misterio' }),
  libro(9002, { t: 'El relojero', a: 'Hugo Salas', ed: 'Tusquets', anio: 2009, base: 150, d: 0, usado: true, stock: 1, cat: 'Terror' }),
  libro(9003, { t: 'Sombras del río', a: 'Lucía Ferro', ed: 'Planeta', anio: 2014, base: 120, d: 0, usado: true, stock: 1, cat: 'Thriller' }),
]
