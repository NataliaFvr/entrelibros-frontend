// Mientras el resto de la app trabaja con datos de ejemplo (ids y sesión locales), los libros solo pueden ir
// al back si éste está activo: VITE_API_LIBROS=true en .env. Sin eso se mantiene el comportamiento de demostración.
export const USAR_API_LIBROS = import.meta.env.VITE_API_LIBROS === 'true'
