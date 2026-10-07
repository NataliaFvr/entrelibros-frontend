// Interruptor único entre el modo demostración (datos de ejemplo en este navegador) y el back real.
//
//   VITE_API=true  (en .env)  -> TODA la app habla con el back: auth, libros, carrito, direcciones, pagos, reseñas,
//                                notificaciones, estadísticas, imágenes, admin…
//   VITE_API=false / sin definir -> modo demostración: mocks y localStorage, sin tocar la red.
//
// Los componentes y las pantallas NO consultan este valor: hablan con un servicio/hook "pasarela" (services/*Service.js,
// hooks/use*.js) que elige entre `api/*Api.js` (back) y los mocks. Así, al quitar el modo demo solo se borra la rama
// demo de cada pasarela (ver NOTAS_INTEGRACION.md).
//
// VITE_API_LIBROS=true se mantiene por compatibilidad: es un sinónimo de VITE_API.
const activo = (valor) => String(valor ?? '').trim().toLowerCase() === 'true'

export const USAR_API = activo(import.meta.env.VITE_API) || activo(import.meta.env.VITE_API_LIBROS)
export const USAR_API_LIBROS = USAR_API

// Elige la implementación una sola vez por build (el modo no cambia mientras la app está abierta).
// Uso: const servicio = elegirFuente(apiImpl, demoImpl)
export const elegirFuente = (api, demo) => (USAR_API ? api : demo)
