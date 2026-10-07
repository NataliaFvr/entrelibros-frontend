// Estadísticas del vendedor calculadas a partir de su historial de ventas [{ its: [{ q, p, cat, usado }] }].
// SOLO MODO DEMO: con el back las calcula el servidor (GET /vendedores/estadisticas, api/estadisticasApi.js).
// Devuelve el mismo modelo que aEstadisticasFront: { ingresos, unidades, ventas, promedio, categorias, estados }.
const agrupar = (items, clave) => {
  const grupos = new Map()
  items.forEach((i) => {
    const g = grupos.get(clave(i)) || { nombre: clave(i), unidades: 0, ingresos: 0 }
    g.unidades += i.q
    g.ingresos += i.p * i.q
    grupos.set(g.nombre, g)
  })
  return [...grupos.values()]
}

export const calcularEstadisticas = (ventas) => {
  const items = ventas.flatMap((v) => v.its)
  const ingresos = items.reduce((a, i) => a + i.p * i.q, 0)
  return {
    ingresos,
    unidades: items.reduce((a, i) => a + i.q, 0),
    ventas: ventas.length,
    promedio: ventas.length ? ingresos / ventas.length : 0,
    categorias: agrupar(items, (i) => i.cat || 'Otros'),
    estados: agrupar(items, (i) => (i.usado ? 'Usados' : 'Nuevos')),
  }
}
