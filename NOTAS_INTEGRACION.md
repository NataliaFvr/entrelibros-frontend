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

## 2. Cómo está armado el cambio mock ↔ API
`VITE_API=true` (archivo `.env`, ver `.env.example`) activa el back; sin definir o `false` = demo con mocks.
Las pantallas no miran `VITE_API`: hablan con una "pasarela" que elige la fuente (`elegirFuente` en `utils/modoApi.js`):

- `services/direccionesService.js` · `hooks/useCarrito.js` · `hooks/useCostoEnvio.js` · `services/estadisticasService.js`
- `hooks/useNotificaciones.js` · `hooks/useVendedorPublico.js` · `services/categoriasService.js` · `context/AuthContext.jsx` (perfil)
- Los nombres del back viven solo en `utils/adaptadores.js` y `api/*Api.js`.

## 3. Checklist para quitar el modo demo (cuando el back esté validado)
1. Borrar las ramas marcadas `DEMO-ONLY` / `Demo` en las pasarelas de arriba y reemplazar `elegirFuente(api, demo)` por `api`.
2. Borrar: `services/direccionesDemo.js`, `services/authService.js`, `services/ventasService.js`, `services/notificacionesService.js`, `services/enviosService.js`, `utils/estadisticas.js`, `utils/envio.js`, `data/` (mocks) y lo que quede sin usar (`npx oxlint`).
3. Borrar `USAR_API`, `USAR_API_LIBROS` y `elegirFuente` de `utils/modoApi.js` y los `if (USAR_API)` restantes.
4. `verificado: true` ya no está en `aUsuarioFront` (el back no deja entrar a una cuenta sin verificar).
