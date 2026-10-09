import api from './axiosConfig'
import { aItemCarritoFront } from './adaptadores'
import { esListaVacia } from '../utils/errorApi'

// CarritoController. Todas las rutas son del usuario logueado: el back lo saca del token JWT, por eso NINGUNA petición
// manda idUsuario.
//   GET    /carrito              -> [{ id, cantidad, idLibro, tituloLibro, precioUnitario, subtotal }] (404 si está vacío)
//   POST   /carrito/items        { idLibro, cantidad } -> ítem. OJO: siempre crea una fila nueva, NO suma a una existente:
//                                  si el libro ya está en el carrito hay que usar PATCH.
//   PATCH  /carrito/items/{id}   { cantidad } -> ítem con la cantidad nueva (reemplaza, no suma)
//   DELETE /carrito/items/{id}   -> { mensaje }
// El checkout vive en comprasApi.js (crea la orden y vacía el carrito).

export const listarCarritoApi = async () => {
  try {
    return (await api.get('/carrito')).data.map(aItemCarritoFront)
  } catch (err) {
    if (esListaVacia(err)) return [] // ListaVaciaException: carrito vacío no es un error
    throw err
  }
}

export const agregarItemApi = async (idLibro, cantidad) =>
  aItemCarritoFront((await api.post('/carrito/items', { idLibro, cantidad })).data)

export const cambiarCantidadItemApi = async (idItem, cantidad) =>
  aItemCarritoFront((await api.patch(`/carrito/items/${idItem}`, { cantidad })).data)

export const quitarItemApi = async (idItem) => (await api.delete(`/carrito/items/${idItem}`)).data
