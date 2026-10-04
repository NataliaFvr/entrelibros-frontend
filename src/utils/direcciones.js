// Garantiza que, si hay direcciones, exactamente una sea la principal.
// Si ninguna está marcada (datos viejos) o se borró la principal, pasa a serlo la primera.
export const conPrincipal = (lista) => {
  if (!lista.length) return lista
  const i = Math.max(0, lista.findIndex((d) => d.principal))
  return lista.map((d, j) => ({ ...d, principal: j === i }))
}
