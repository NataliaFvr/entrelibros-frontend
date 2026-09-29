export const TONES = ['#5EB1BF', '#042A2B', '#8fd0da', '#EF7B45', '#CDEDF6', '#D84727', '#0a4344', '#f3a276', '#a13a1f', '#2f7d89']

const DARK_TEXT = new Set(['#5EB1BF', '#8fd0da', '#CDEDF6', '#EF7B45', '#f3a276'])

// Color de texto legible sobre el color de tapa
export const textOn = (c) => (DARK_TEXT.has(c) ? '#042A2B' : '#fff')

// Fondo de la tapa: primera imagen si existe, si no el color
export const coverBg = (l) => (l.imgs && l.imgs[0] ? `url(${l.imgs[0]}) center/cover` : l.c)

export const initials = (name, max = 3) =>
  name.split(' ').map((x) => x[0]).slice(0, max).join('')
