# Notas de integración Front ↔ Back (EntreLibros)

## 1. Integración Front ↔ Back

| Endpoint | Uso actual |
|---|---|---|
| `GET /libros/mios` + `GET /imagenes-libro/libro/{id}` | Lista las publicaciones del vendedor autenticado y carga sus imágenes |
| `GET /vendedores/{id}` | Carga el perfil público del vendedor; si no existe, muestra 404 |
| `GET /usuarios/{id}/foto` + `PATCH /usuarios/{id}` | La foto y el avatar pertenecen al usuario; el perfil vendedor reutiliza los mismos datos que se editan en Mi cuenta |
| `GET /marcapaginas` + `POST /marcapaginas` + `DELETE /marcapaginas/{idLibro}` | Persiste la lista Marcapáginas, accesible desde `/cuenta/marcapaginas` |
| `GET /resenas-libro` + `GET /resenas-vendedor` | Carga las reseñas para la pestaña de moderación administrativa |
| `DELETE /resenas-libro/{id}` + `DELETE /resenas-vendedor/{id}` | El autor puede borrar su reseña y ADMIN puede eliminar reseñas inadecuadas; solo se borra, no se edita desde moderación |
| `PATCH /direcciones/{id}/principal` + `GET /direcciones` | Persiste y devuelve la dirección principal |
| `GET /categorias` + `GET /categorias/{id}/imagen` | Carga categorías con `tieneImagen` y sus imágenes |

El backend ofrece tarifas por **misma provincia / distinta provincia** (`GET /envios`). En el checkout calcula un costo por vendedor y devuelve el importe definitivo en la orden. La web no ofrece seguimiento ni estados de envío: los estados visibles de una compra corresponden al pago (pendiente, aprobado, cancelado, rechazado o vencido). `POST /carrito/items` siempre crea una fila nueva (no suma): el front usa `PATCH` si el libro ya está en el carrito.

## 2. Integración actual
`VITE_API_URL` (archivo `.env`, ver `.env.example`) configura la URL del backend.
La aplicación usa una única capa de datos en `src/api/`: allí viven las
peticiones HTTP y los adaptadores de cada contrato. Los importes, descuentos,
totales, stock, límites y vencimientos son informados por el backend; `utils/`
queda reservado para lógica pura de presentación, formato y validación.

## 3. Limpieza del modo demo
La limpieza está aplicada: se eliminaron las ramas demo, las cuentas y catálogos de ejemplo, y los servicios/utilidades
que solo respaldaban localStorage. También se eliminó `verificado` del modelo `aUsuarioFront`; la verificación la exige el back.
