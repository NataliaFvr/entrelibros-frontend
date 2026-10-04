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

// ─────────────────────────────────────────────────────────────────────────────
// Vendedor de prueba de la CUENTA: @vendedor_prueba · vendedor_prueba@mail.com · "Librería El Aleph"
// Es el que se ve en el panel /vender. Back: GET /vendedores/yo, GET /libros?vendedor=, GET /ventas
// Los 6 libros son los que el catálogo de ejemplo ya le asigna a "Librería El Aleph" (mismos ids), así que
// al editarlos / darlos de baja desde el panel el catálogo se actualiza sin duplicarlos.
// ─────────────────────────────────────────────────────────────────────────────
export const VENDEDOR_ALEPH = {
  nombreUsuario: 'vendedor_prueba',
  email: 'vendedor_prueba@mail.com',
  tienda: 'Librería El Aleph',
  prov: 'Buenos Aires',
}

const publicacion = (id, datos) => ({
  idioma: 'Español', estado: 'activo', mod: 'ACEPTADO', imgs: [], ...datos, id,
})

// Publicaciones activas. Las 4 primeras son las que tienen ventas; las otras 2 completan los "6 publicados".
export const PUBLICACIONES_ALEPH = [
  publicacion(3, { t: 'Noche de vidrio', a: 'Tomás Vega', ed: 'Penguin', cat: 'Biografía', idioma: 'Portugués', anio: 2018, usado: false, base: 220, d: 15, stock: 22 }),
  publicacion(7, { t: 'La biblioteca oculta', a: 'Hugo Salas', ed: 'Planeta', cat: 'Ciencia ficción', idioma: 'Inglés', anio: 2009, usado: true, base: 240, d: 0, stock: 1 }),
  publicacion(12, { t: 'Puerto de niebla', a: 'Ana Ríos', ed: 'Planeta', cat: 'Biografía', idioma: 'Inglés', anio: 2017, usado: false, base: 370, d: 0, stock: 25 }),
  publicacion(19, { t: 'El relojero', a: 'Ana Ríos', ed: 'Planeta', cat: 'Autocuidado', anio: 2014, usado: true, base: 70, d: 0, stock: 1 }),
  publicacion(21, { t: 'Hilos de ceniza', a: 'Lucía Ferro', ed: 'Planeta', cat: 'Ciencia ficción', anio: 2014, usado: false, base: 470, d: 30, stock: 28 }),
  publicacion(33, { t: 'La hora azul', a: 'Elena Cruz', ed: 'Anagrama', cat: 'Biografía', anio: 2023, usado: false, base: 410, d: 0, stock: 22 }),
]

// Estado inicial del vendedor (misma forma que guarda vendedorService)
export const SEMILLA_VENDEDOR_ALEPH = {
  estado: 'aprobado', tienda: VENDEDOR_ALEPH.tienda, prov: VENDEDOR_ALEPH.prov, pub: PUBLICACIONES_ALEPH,
}

const venta = (n, date, comprador, est, pub) => ({
  n, date, comprador, est, env: 1800,
  its: [{ t: pub.t, q: 1, p: Math.round(pub.base * (1 - pub.d / 100)), cat: pub.cat, usado: pub.usado }],
})

// Historial de ventas: $187 + $240 + $370 + $70 = $867 · 4 unidades · $217 de promedio
export const VENTAS_ALEPH = [
  venta('VT-2040', '2026-09-12', 'Camila R.', 'Enviado', PUBLICACIONES_ALEPH[0]),
  venta('VT-2033', '2026-08-30', 'Martín P.', 'Entregado', PUBLICACIONES_ALEPH[1]),
  venta('VT-2026', '2026-08-11', 'Sofía L.', 'Entregado', PUBLICACIONES_ALEPH[2]),
  venta('VT-2019', '2026-07-21', 'Diego F.', 'Entregado', PUBLICACIONES_ALEPH[3]),
]

// Reseñas de los compradores de esas 4 ventas. Promedio: (5 + 5 + 4 + 5) / 4 = 4,75 -> 4,8
export const RESENIAS_ALEPH = [
  { id: 'ra-1', st: 5, nc: 'Camila R.', t: 'Llegó rápido y bien embalado. Tal cual la descripción.', libro: 'Noche de vidrio', date: '2026-09-18' },
  { id: 'ra-2', st: 5, nc: 'Martín P.', t: 'El usado estaba en muy buen estado. Excelente atención.', libro: 'La biblioteca oculta', date: '2026-09-04' },
  { id: 'ra-3', st: 4, nc: 'Sofía L.', t: 'Buen libro y buen precio. El envío tardó un día más de lo previsto.', libro: 'Puerto de niebla', date: '2026-08-17' },
  { id: 'ra-4', st: 5, nc: 'Diego F.', t: 'Muy recomendable, ya les compré otra vez.', libro: 'El relojero', date: '2026-07-27' },
]
