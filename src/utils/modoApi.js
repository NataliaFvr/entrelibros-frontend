// Interruptor único entre el modo demostración (datos de ejemplo en este navegador) y el back real.
// VITE_API=true en .env activa el back en TODA la app (auth, libros, carrito, pagos, reseñas, notificaciones, admin…).
// VITE_API_LIBROS=true se mantiene por compatibilidad: ahora es un sinónimo de VITE_API.
export const USAR_API = import.meta.env.VITE_API === 'true' || import.meta.env.VITE_API_LIBROS === 'true'
export const USAR_API_LIBROS = USAR_API
