// Documentos legales: una sola fuente para el footer y el contenido de cada pop-up.
// `corto` es el texto del botón del footer.
export const TERMINOS = {
  corto: 'Términos',
  label: 'Términos y condiciones',
  sub: 'Las condiciones para usar Entrelibros',
  secciones: [
    { titulo: '1. Uso del sitio', texto: 'Entrelibros es un espacio para comprar y vender libros nuevos y usados. Al usarlo aceptás estas condiciones.' },
    { titulo: '2. Tu cuenta', texto: 'Sos responsable de mantener la confidencialidad de tus datos de acceso y de la actividad de tu cuenta.' },
    { titulo: '3. Compras y ventas', texto: 'Los precios, el stock y el estado de cada libro los publica cada vendedor. El costo y el plazo de envío se calculan al finalizar la compra.' },
    { titulo: '4. Opiniones', texto: 'Las opiniones deben ser respetuosas y basarse en tu experiencia real con el libro.' },
    { titulo: '5. Cambios', texto: 'Podemos actualizar estos términos y te avisaremos cuando haya cambios importantes.' },
  ],
}

export const PRIVACIDAD = {
  corto: 'Privacidad',
  label: 'Política de privacidad',
  sub: 'Cómo cuidamos tus datos',
  secciones: [
    { titulo: '1. Qué datos guardamos', texto: 'Nombre, e-mail, direcciones de envío e historial de compras, para poder gestionar tus pedidos.' },
    { titulo: '2. Para qué los usamos', texto: 'Para procesar compras, coordinar envíos con los vendedores y mejorar tu experiencia en Entrelibros.' },
    { titulo: '3. Con quién los compartimos', texto: 'Solo con el vendedor y el servicio de envío involucrados en tu compra. No vendemos tus datos.' },
    { titulo: '4. Tus derechos', texto: 'Podés ver, corregir o eliminar tu información desde Mi Entrelibros o escribiéndonos por Contáctanos.' },
    { titulo: '5. Seguridad', texto: 'Tomamos medidas razonables para proteger tu información y tu contraseña.' },
  ],
}

// Orden en que aparecen en el footer
export const LEGALES_LINKS = [TERMINOS, PRIVACIDAD]
