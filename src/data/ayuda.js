// Páginas del Centro de Ayuda: una sola fuente para el desplegable del header, el footer,
// las tarjetas del Centro de ayuda y los títulos de cada página.
export const AYUDA = {
  contacto: {
    to: '/ayuda/contacto',
    label: 'Contáctanos',
    sub: 'Escribinos con el siguiente formulario y te respondemos por e-mail',
  },
  faq: {
    to: '/ayuda/preguntas-frecuentes',
    label: 'Preguntas frecuentes',
    sub: 'Lo que más nos preguntan, en un solo lugar',
  },
  envios: {
    to: '/ayuda/envios',
    label: 'Políticas de envío',
    sub: 'Cuánto cuesta que tus libros lleguen a casa',
  },
}

export const AYUDA_RAIZ = '/ayuda'

// Orden en que aparecen en el menú y en el footer
export const AYUDA_LINKS = [AYUDA.contacto, AYUDA.faq, AYUDA.envios]
