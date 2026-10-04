import { useState } from 'react'
import { useLibros } from './useLibros'
import { useToast } from './useToast'
import { getVendedor, guardarVendedor } from '../services/vendedorService'

// Estado y acciones del vendedor de la cuenta `user`. Cada cambio se guarda y refresca el catálogo.
const useVendedor = (user) => {
  const toast = useToast()
  const { recargar } = useLibros()
  const [vendedor, setVendedor] = useState(() => getVendedor(user))

  const cambiar = (nuevo, mensaje) => {
    setVendedor(nuevo)
    const guardado = guardarVendedor(user, nuevo)
    recargar()
    // Las fotos viajan en base64 dentro de localStorage (~5 MB): si no entran, avisamos en vez de perderlas en silencio
    const texto = guardado ? mensaje : 'No pudimos guardar: sin espacio en el navegador. Probá con menos fotos.'
    if (texto) toast(texto)
  }
  const cambiarLibros = (fn, mensaje) => cambiar({ ...vendedor, pub: fn(vendedor.pub) }, mensaje)

  const solicitar = (datos) => cambiar({ ...vendedor, ...datos, estado: 'pendiente' }, 'Solicitud enviada')
  const aprobarSolicitud = () => cambiar({ ...vendedor, estado: 'aprobado', pub: [] }, '¡Solicitud aprobada!')

  // Sin `idEditado` publica uno nuevo; con `idEditado` lo modifica. En ambos casos queda en revisión.
  const guardarLibro = (datos, idEditado) => cambiarLibros(
    (pub) => (idEditado
      ? pub.map((p) => (p.id === idEditado ? { ...p, ...datos, mod: 'EN_REVISION', modC: '' } : p))
      : [{ id: Date.now(), ...datos, estado: 'activo', mod: 'EN_REVISION' }, ...pub]),
    idEditado ? 'Cambios guardados: vuelve a revisión del administrador' : 'Libro enviado a revisión del administrador',
  )

  const alternarBaja = (id) => {
    const p = vendedor.pub.find((x) => x.id === id)
    cambiarLibros((pub) => pub.map((x) => (x.id === id ? { ...x, estado: x.estado === 'activo' ? 'baja' : 'activo' } : x)),
      p.estado === 'activo' ? 'Libro dado de baja' : 'Libro reactivado')
  }

  const aprobarLibro = (id) => cambiarLibros((pub) => pub.map((x) => (x.id === id ? { ...x, mod: 'ACEPTADO' } : x)), 'Libro aprobado (simulado)')

  return { vendedor, solicitar, aprobarSolicitud, guardarLibro, alternarBaja, aprobarLibro }
}

export default useVendedor
