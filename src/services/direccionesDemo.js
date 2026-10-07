import { guardar, leer } from './almacen'
import { claveDir } from './claves'

// Modo demostración (sin back): hace de "servidor" de direcciones sobre localStorage, con el mismo contrato que el back:
// cada dirección tiene `id` y, si hay alguna, exactamente una es la principal. Cada función devuelve la lista resultante.
// AuthContext no calcula nada de esto: con USAR_API llama a api/direccionesApi.js y sin USAR_API llama a este archivo.

const nuevoId = () => `dir-${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`

const normalizar = (lista) => {
  if (!lista.length) return lista
  const conId = lista.map((d) => (d.id ? d : { ...d, id: nuevoId() })) // datos viejos guardados sin id
  const i = Math.max(0, conId.findIndex((d) => d.principal))
  return conId.map((d, j) => ({ ...d, principal: j === i }))
}

const guardarLista = (user, lista) => {
  const final = normalizar(lista)
  guardar(claveDir(user), final)
  return final
}

export const listarDireccionesDemo = (user) => guardarLista(user, leer(claveDir(user), []))
export const crearDireccionDemo = (user, d) => guardarLista(user, [...leer(claveDir(user), []), { ...d, id: nuevoId(), principal: false }])
export const eliminarDireccionDemo = (user, id) => guardarLista(user, leer(claveDir(user), []).filter((d) => d.id !== id))
export const marcarPrincipalDemo = (user, id) => guardarLista(user, leer(claveDir(user), []).map((d) => ({ ...d, principal: d.id === id })))
