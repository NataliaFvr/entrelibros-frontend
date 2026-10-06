import zorro from '../assets/avatares/zorro.webp'
import conejo from '../assets/avatares/conejo.webp'
import buho from '../assets/avatares/buho.webp'
import gato from '../assets/avatares/gato.webp'
import parque from '../assets/avatares/parque.webp'
import cafe from '../assets/avatares/cafe.webp'
import escritor from '../assets/avatares/escritor.webp'
import pelirroja from '../assets/avatares/pelirroja.webp'
import tren from '../assets/avatares/tren.webp'
import sudadera from '../assets/avatares/sudadera.webp'

// Avatares por defecto de Entrelibros: ilustraciones 2D flat en la paleta oficial
// (Evergreen #042A2B, Pacific Blue #5EB1BF, Light Cyan #CDEDF6, Atomic Tangerine #EF7B45,
// Burnt Tangerine #D84727, Cream #FBFAF6). `clave` es lo que se guarda en el perfil.
export const AVATARES = [
  { clave: 'zorro', nombre: 'Zorro con café en un día de lluvia', src: zorro },
  { clave: 'conejo', nombre: 'Conejo leyendo entre estantes', src: conejo },
  { clave: 'buho', nombre: 'Búho dormido sobre un libro', src: buho },
  { clave: 'gato', nombre: 'Gato negro leyendo en el sillón', src: gato },
  { clave: 'parque', nombre: 'Lector en el parque', src: parque },
  { clave: 'cafe', nombre: 'Lectora con café y auriculares', src: cafe },
  { clave: 'escritor', nombre: 'Escritor con laptop y gato', src: escritor },
  { clave: 'pelirroja', nombre: 'Lectora pelirroja con auriculares', src: pelirroja },
  { clave: 'tren', nombre: 'Lectora viajando en tren', src: tren },
  { clave: 'sudadera', nombre: 'Lector con sudadera celeste', src: sudadera },
]

// Claves de los 10 avatares anteriores (íconos) -> avatar nuevo equivalente,
// para que los perfiles ya guardados en localStorage no pierdan su avatar.
const LEGACY = {
  libro: 'escritor', marca: 'tren', luna: 'buho', estrella: 'sudadera', taza: 'zorro',
  pluma: 'pelirroja', hoja: 'parque', corazon: 'cafe', chat: 'gato', rayo: 'conejo',
}

export const buscarAvatar = (clave) => {
  const k = LEGACY[clave] || clave
  return AVATARES.find((a) => a.clave === k) || null
}
