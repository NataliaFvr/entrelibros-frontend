// Preguntas frecuentes agrupadas por tema. Cada respuesta es una lista de partes:
// un string es texto y { to, label } es un link interno a otra página.
import { AYUDA } from './ayuda'

export const PREGUNTAS_FRECUENTES = [
  {
    titulo: 'Comprar',
    items: [
      {
        id: 'como-compro',
        q: '¿Cómo compro un libro?',
        a: ['Buscá el libro en el catálogo, abrí su ficha y tocá "Agregar al carrito". Cuando estés listo, entrá a tu carrito, elegí la dirección de envío, finalizá la compra y elegí cómo pagar. Para comprar necesitás una cuenta confirmada por e-mail.'],
      },
      {
        id: 'nuevos-usados',
        q: '¿Cuál es la diferencia entre libros nuevos y usados?',
        a: ['Los libros nuevos están sin uso. Los usados ya tuvieron otro lector: cada ficha indica su estado y, por lo general, hay una sola unidad disponible.'],
      },
      {
        id: 'devoluciones',
        q: '¿Tienen devoluciones?',
        a: [
          'No. En Entrelibros no tenemos devoluciones, por eso te pedimos que revises con atención la descripción, el estado y el precio de cada libro antes de comprar. Si te queda alguna duda, escribinos desde ',
          { to: AYUDA.contacto.to, label: AYUDA.contacto.label },
          ' antes de finalizar tu compra.',
        ],
      },
    ],
  },
  {
    titulo: 'Envíos y pagos',
    items: [
      {
        id: 'envio',
        q: '¿Cómo se calcula el envío?',
        a: [
          'Depende de la provincia del vendedor y de la tuya. Si comprás varios libros de una misma provincia, el envío se cobra una sola vez. Mirá el detalle en ',
          { to: AYUDA.envios.to, label: AYUDA.envios.label },
          '.',
        ],
      },
      {
        id: 'tiempo-pago',
        q: '¿Cuánto tiempo tengo para pagar?',
        a: ['Cuando finalizás la compra reservamos tus libros por 1 hora. Si en ese tiempo no pagás, la reserva vence y los libros vuelven al catálogo. Mientras tanto podés pagar o cancelar desde Mi Entrelibros › Historial de Compras.'],
      },
    ],
  },
  {
    titulo: 'Vender',
    items: [
      {
        id: 'como-vendo',
        q: '¿Cómo vendo mis libros?',
        a: ['Desde la opción "Vender" del menú podés publicar tus libros indicando el título, el estado y el precio. Los compradores de todo el país van a poder encontrarlos.'],
      },
    ],
  },
  {
    titulo: 'Mi cuenta',
    items: [
      {
        id: 'marcapaginas',
        q: '¿Para qué sirve el Marcapáginas?',
        a: ['Es tu lista de libros guardados. Tocá el marcapáginas en la ficha de un libro para guardarlo y encontrarlo más tarde desde Mi Entrelibros.'],
      },
      {
        id: 'cambiar-datos',
        q: '¿Puedo cambiar mis datos o mi dirección?',
        a: ['Sí. Desde Mi Entrelibros podés editar tu perfil y administrar tus direcciones de envío.'],
      },
      {
        id: 'confirmar-cuenta',
        q: '¿Por qué tengo que confirmar mi cuenta por mail?',
        a: ['Para asegurarnos de que el e-mail es tuyo y proteger tu cuenta. Al registrarte te enviamos un código de 6 dígitos que vence en 15 minutos. Si no lo ves, revisá la carpeta de spam o pedí un código nuevo.'],
      },
    ],
  },
]
