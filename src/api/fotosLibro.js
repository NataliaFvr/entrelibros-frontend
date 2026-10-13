import { descargarImagenApi, eliminarImagenApi, getImagenesApi, getImagenesConIdApi, subirImagenApi } from './librosApi'
import { dataUrlAFile } from './adaptadores'

// El formulario trabaja con una lista de fotos: URL de una foto ya guardada (/imagenes-libro/{id}/contenido) o base64 si es nueva
// (o recortada de nuevo). El back solo sabe crear (con `orden`) y borrar fotos: no hay "reordenar". Entonces, para que el servidor
// quede igual que el formulario (fotos quitadas, nuevas y orden):
//   1. las primeras fotos que ya están en el orden correcto no se tocan;
//   2. el resto (nuevas, o ya guardadas pero movidas) se sube de nuevo con `orden` creciente;
//   3. recién cuando todo se subió bien se borran las anteriores. Si algo falla antes, se deshace y el libro conserva sus fotos.
export class FotosError extends Error {}

const esNueva = (foto) => typeof foto === 'string' && foto.startsWith('data:')

// Devuelve las URLs finales, en orden. Lanza FotosError con un mensaje para mostrar.
export const sincronizarFotosApi = async (idLibro, fotos = []) => {
  const guardadas = await getImagenesConIdApi(idLibro)
  const porUrl = new Map(guardadas.map((g) => [g.url, g]))
  const pedidas = fotos.map((f) => (esNueva(f) ? null : porUrl.get(f) ?? null))
  const conservadas = guardadas.filter((g) => fotos.includes(g.url)) // en el orden del servidor

  let intactas = 0
  while (intactas < fotos.length && pedidas[intactas] && pedidas[intactas] === conservadas[intactas]) intactas += 1
  const aBorrar = guardadas.filter((g) => !conservadas.slice(0, intactas).includes(g))
  const aSubir = fotos.slice(intactas)
  if (!aBorrar.length && !aSubir.length) return fotos

  // Primero se prepara todo (bajar las fotos movidas): si falla acá, el servidor no se tocó
  let archivos
  try {
    archivos = await Promise.all(aSubir.map((f, k) => {
      const nombre = `foto-${intactas + k + 1}`
      return esNueva(f) ? dataUrlAFile(f, nombre) : descargarImagenApi(porUrl.get(f).id, nombre)
    }))
  } catch {
    throw new FotosError('No pudimos preparar las fotos. Revisá tu conexión e intentá de nuevo.')
  }

  const primerOrden = intactas ? Math.max(...conservadas.slice(0, intactas).map((g) => g.orden)) + 1 : 0
  const subidas = []
  try {
    for (let k = 0; k < archivos.length; k++) subidas.push(await subirImagenApi(idLibro, archivos[k], primerOrden + k))
  } catch (err) {
    // deshacer lo subido en esta pasada; las fotos anteriores siguen intactas
    await Promise.allSettled(subidas.map((s) => eliminarImagenApi(s.id)))
    const motivo = err?.response?.status === 413 || /demasiado|grande/i.test(err?.response?.data?.error || '')
      ? 'Una de las fotos es demasiado pesada (máximo 10 MB).'
      : err?.response?.status === 400 ? 'Una de las fotos no tiene un formato válido (JPG o PNG).' : 'No pudimos subir las fotos.'
    throw new FotosError(`${motivo} Las fotos anteriores del libro quedaron como estaban.`)
  }

  const fallos = (await Promise.allSettled(aBorrar.map((g) => eliminarImagenApi(g.id)))).filter((r) => r.status === 'rejected').length
  if (fallos) throw new FotosError(`Se subieron las fotos nuevas, pero no pudimos quitar ${fallos === 1 ? 'una foto anterior' : `${fallos} fotos anteriores`}. Abrí el libro y guardalo de nuevo para terminar de limpiarlas.`)

  return getImagenesApi(idLibro)
}
