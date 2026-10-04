export const TONES = ['#5EB1BF', '#042A2B', '#8fd0da', '#EF7B45', '#CDEDF6', '#D84727', '#0a4344', '#f3a276', '#a13a1f', '#2f7d89']

const DARK_TEXT = new Set(['#5EB1BF', '#8fd0da', '#CDEDF6', '#EF7B45', '#f3a276'])

// Color de texto legible sobre el color de tapa
export const textOn = (c) => (DARK_TEXT.has(c) ? '#042A2B' : '#fff')

// Fondo de la tapa: primera imagen si existe, si no el color
export const coverBg = (l) => (l.imgs && l.imgs[0] ? `url(${l.imgs[0]}) center/cover` : l.c)

export const initials = (name, max = 3) =>
  name.split(' ').map((x) => x[0]).slice(0, max).join('')

// Colores que toman las letras al pasar el cursor (efecto del tagline)
export const COLORES_LETRA = ['#5EB1BF', '#EF7B45', '#D84727', '#2f7d89']

const luminancia = (hex) => {
  const [r, g, b] = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255)
    .map((v) => (v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4))
  return 0.2126 * r + 0.7152 * g + 0.0722 * b
}

const contraste = (a, b) => {
  const [x, y] = [luminancia(a), luminancia(b)]
  return (Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05)
}

// Colores de la paleta que se leen sobre `fondo` (evita, por ejemplo, letra turquesa sobre lomo turquesa)
export const coloresSobre = (fondo, minimo = 2.2) => {
  const candidatos = [...COLORES_LETRA, '#042A2B', '#FBFAF6']
  const legibles = candidatos.filter((c) => contraste(c, fondo) >= minimo)
  return legibles.length ? legibles : COLORES_LETRA
}
