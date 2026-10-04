// Lectura/escritura segura de localStorage (si falla, devuelve el valor por defecto)
export const leer = (clave, defecto) => {
  try {
    const v = localStorage.getItem(clave)
    return v ? JSON.parse(v) : defecto
  } catch {
    return defecto
  }
}

export const guardar = (clave, valor) => {
  try {
    localStorage.setItem(clave, JSON.stringify(valor))
    return true
  } catch {
    return false // sin espacio o bloqueado: quien necesite avisar puede revisar el resultado
  }
}

// Mueve un valor de una clave a otra (por ejemplo, si cambia el nombre de usuario)
export const mover = (desde, hasta) => {
  try {
    const v = localStorage.getItem(desde)
    if (v !== null) localStorage.setItem(hasta, v)
    localStorage.removeItem(desde)
  } catch {
    /* sin acceso a localStorage: se ignora */
  }
}
