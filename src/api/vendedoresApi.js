import api from './axiosConfig'
import { aVendedorPublicoFront } from './adaptadores'

// VendedoresController: GET /vendedores/{id} -> datos públicos del vendedor (el id numérico es el de /vendedor/:id en la URL).
// Devuelve null si el vendedor no existe o si el back todavía no tiene este endpoint (hoy solo existe /vendedores/estadisticas):
// quien llama usa entonces lo que sabe del catálogo.
export const getVendedorPublicoApi = async (id) => {
  try {
    return aVendedorPublicoFront((await api.get(`/vendedores/${id}`)).data)
  } catch (err) {
    if (err.response) return null
    throw err
  }
}
