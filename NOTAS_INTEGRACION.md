# Notas de integración Front ↔ Back (EntreLibros)

## 1. Integración Front ↔ Back

| Endpoint | Uso actual |
|---|---|---|
| `GET /libros/mios` + `GET /imagenes-libro/libro/{id}` | Lista las publicaciones del vendedor autenticado y carga sus imágenes |
| `GET /vendedores/{id}` | Carga el perfil público del vendedor; si no existe, muestra 404 |
| `PATCH /direcciones/{id}/principal` + `GET /direcciones` | Persiste y devuelve la dirección principal |
| `GET /categorias` + `GET /categorias/{id}/imagen` | Carga categorías con `tieneImagen` y sus imágenes |

El backend calcula el envío por **zona** (CABA / PROVINCIA_BA / RESTO_PAIS, `GET /envios`) y el checkout usa ese importe. `POST /carrito/items` siempre crea una fila nueva (no suma): el front usa `PATCH` si el libro ya está en el carrito.

## 2. Integración actual
<<<<<<< HEAD
`VITE_API=true` (archivo `.env`, ver `.env.example`) queda configurado para usar el back real.
La aplicación ya no tiene un interruptor de modo demo: las pantallas llaman a los servicios y APIs del back, y
`utils/adaptadores.js` concentra la traducción de DTOs.
=======
`VITE_API_URL` (archivo `.env`, ver `.env.example`) configura la URL del backend.
La aplicación usa una única capa de datos en `src/api/`: allí viven las
peticiones HTTP y los adaptadores de cada contrato. `utils/` queda reservado
para lógica pura de presentación, formato y validación.
>>>>>>> 726f86e (Union)

## 3. Limpieza del modo demo
La limpieza está aplicada: se eliminaron las ramas demo, las cuentas y catálogos de ejemplo, y los servicios/utilidades
que solo respaldaban localStorage. También se eliminó `verificado` del modelo `aUsuarioFront`; la verificación la exige el back.
