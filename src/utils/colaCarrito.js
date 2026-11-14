let cola = Promise.resolve()

export function enCola(fn) {
  const turno = cola.then(fn)
  cola = turno.catch(() => {})
  return turno
}
