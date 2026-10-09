# Notas de integración Front ↔ Back (EntreLibros)

## 1. Endpoints que el front usa y el back NO tiene todavía (en el ZIP del back que me pasaste)
El front ya está preparado: si no existen, usa un respaldo y no se rompe.

| Endpoint | Qué hace el front hoy | Qué espera cuando exista |
|---|---|---|
| `GET /libros/mios` | Respaldo: lista guardada en el navegador + `GET /libros/{id}` | Lista o `Page<LibroResponse>` de TODAS las publicaciones del vendedor logueado (cualquier estado). Ojo: hoy `/libros/mios` cae en `/libros/{libroId}` y responde 400. |
| `GET /vendedores/{id}` | Respaldo: arma el vendedor con el catálogo (`vId`) | `{ id, nombreTienda, nombre, nombreUsuario, provincia, fechaRegistro }` |
| `PATCH /direcciones/{id}/principal` + campo `principal` en `DireccionResponse` | La principal se recuerda en el navegador (solo un id) | Poner `PRINCIPAL_EN_BACK = true` en `src/api/direccionesApi.js` |
| `GET /categorias` con `tieneImagen` | Se prueba `GET /categorias/{id}/imagen` y, si da 404, se muestra la inicial | Devolver `CategoriaResponse` (ya existe la clase) para evitar los 404 |

Además: el back calcula el envío por **zona** (CABA / PROVINCIA_BA / RESTO_PAIS, `GET /envios`), pero la pantalla de admin "Tarifas de envío" sigue con el modelo viejo (misma/distinta provincia, guardado en el navegador).
`POST /carrito/items` siempre crea una fila nueva (no suma): el front usa `PATCH` si el libro ya está en el carrito.

## 2. Integración actual
`VITE_API=true` (archivo `.env`, ver `.env.example`) queda configurado para usar el back real.
La aplicación ya no tiene un interruptor de modo demo: las pantallas llaman a los servicios y APIs del back, y
`utils/adaptadores.js` concentra la traducción de DTOs.

## 3. Limpieza del modo demo
La limpieza está aplicada: se eliminaron las ramas demo, las cuentas y catálogos de ejemplo, y los servicios/utilidades
que solo respaldaban localStorage. También se eliminó `verificado` del modelo `aUsuarioFront`; la verificación la exige el back.
