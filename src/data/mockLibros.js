import { TONES } from '../utils/colors'

// Datos de ejemplo del prototipo (semilla fija => siempre los mismos libros).
// Se usan mientras librosService no apunte al back.
export const CATEGORIAS = ['Fantasía', 'Ciencia ficción', 'Novela romántica', 'Misterio', 'Thriller', 'Novela histórica', 'Terror', 'Aventuras', 'Biografía', 'Autocuidado']

const AUTORES = ['Ana Ríos', 'Julián Paz', 'Marta Soler', 'Tomás Vega', 'Lucía Ferro', 'Nico Bravo', 'Elena Cruz', 'Hugo Salas']
const TITULOS = ['La casa del mar', 'Hilos de ceniza', 'El último faro', 'Noche de vidrio', 'Cartas al sur', 'Ecos del bosque', 'Tierra roja', 'La biblioteca oculta', 'Sombras del río', 'Un verano largo', 'Cielo partido', 'El cartógrafo', 'Puerto de niebla', 'La hora azul', 'Memoria de sal', 'El jardín de hierro', 'Bajo otra luna', 'Las voces del norte', 'Camino de arena', 'El relojero']
const EDITORIALES = ['Planeta', 'Penguin', 'Alfaguara', 'Sudamericana', 'Anagrama', 'Tusquets']
const VENDEDORES = ['Librería El Aleph', 'Casa Tomada', 'Libros del Sur', 'Usados Palermo', 'Rincón Literario']

export function generarLibros(cantidad = 64) {
  let seed = 7
  const rnd = () => (seed = (seed * 16807) % 2147483647) / 2147483647
  const pick = (a) => a[Math.floor(rnd() * a.length)]

  return Array.from({ length: cantidad }, (_, i) => {
    const usado = rnd() < 0.4
    const base = (Math.floor(rnd() * 40) * 10 + 90) * (usado ? 0.6 : 1)
    const d = !usado && rnd() < 0.35 ? pick([10, 15, 20, 25, 30]) : 0
    const b = Math.round(base / 10) * 10
    return {
      id: i, t: TITULOS[i % TITULOS.length], a: pick(AUTORES), ed: pick(EDITORIALES),
      idioma: rnd() < 0.8 ? 'Español' : pick(['Inglés', 'Portugués']),
      anio: 1998 + Math.floor(rnd() * 28), base: b, d, p: Math.round(b * (1 - d / 100)), usado,
      cat: pick(CATEGORIAS), v: pick(VENDEDORES), envio: rnd() < 0.5 ? 'misma' : 'distinta',
      ventas: rnd(), c: TONES[i % TONES.length],
    }
  })
}
