// Operaciones genéricas para colecciones cuyos elementos tienen un `id`.
// Los reducers de Redux Toolkit pueden mutar sus borradores de Immer con ellas.
export const replaceById = (items, item) => {
  const index = items.findIndex((actual) => actual.id === item.id)
  if (index !== -1) items[index] = item
  return index
}

export const upsertById = (items, item, { prepend = false } = {}) => {
  const index = replaceById(items, item)
  if (index === -1) {
    if (prepend) items.unshift(item)
    else items.push(item)
  }
}

export const removeById = (items, id) => items.filter((item) => item.id !== id)
