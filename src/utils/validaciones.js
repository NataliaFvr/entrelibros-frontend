// Validaciones del cliente. Espejan las restricciones del back (AuthenticationRequest, UsuarioRequest, LibroRequest)
// para avisar al instante; el back sigue siendo quien decide. Cada validador recibe (valor, todosLosValores)
// y devuelve el mensaje de error o '' si el valor es válido.
export const RE_MAIL = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9-]+(\.[A-Za-z0-9-]+)*\.[A-Za-z]{2,}$/
const RE_USUARIO = /^[A-Za-z0-9_.]{3,20}$/
const RE_ENTERO = /^\d+$/

export const PASSWORD_MIN = 8
export const ANIO_MIN = 1900
export const anioActual = () => new Date().getFullYear()

const texto = (v) => String(v ?? '').trim()
const obligatorio = (mensaje) => (v) => (texto(v) ? '' : mensaje)

/* ---------------- Cuenta ---------------- */

export const passwordValida = (p) =>
  p.length >= PASSWORD_MIN && /[A-Z]/.test(p) && /\d/.test(p) && /[^A-Za-z0-9]/.test(p)

export const validarEmail = (v) => {
  const e = texto(v)
  if (!e) return 'Ingresá tu e-mail.'
  return RE_MAIL.test(e) ? '' : 'Ingresá un e-mail válido (por ejemplo: nombre@dominio.com).'
}

// Solo la longitud mínima: sirve para el login, donde no hay que revelar las reglas de complejidad
export const validarLongitudPassword = (p) => {
  if (!p) return 'Ingresá tu contraseña.'
  return p.length >= PASSWORD_MIN ? '' : `Faltan ${PASSWORD_MIN - p.length} caracteres (mínimo ${PASSWORD_MIN}).`
}

// Contraseña nueva (registro / cambio): longitud + mayúscula + número + símbolo
export const validarPasswordNueva = (p) => {
  const largo = validarLongitudPassword(p)
  if (largo) return largo
  const falta = [
    !/[A-Z]/.test(p) && 'una mayúscula',
    !/\d/.test(p) && 'un número',
    !/[^A-Za-z0-9]/.test(p) && 'un símbolo',
  ].filter(Boolean)
  return falta.length ? `Agregá ${falta.join(', ').replace(/, ([^,]*)$/, ' y $1')}.` : ''
}

export const validarRepetida = (v, valores) => {
  if (!v) return 'Repetí la contraseña.'
  return v === valores.pw ? '' : 'Las contraseñas no coinciden.'
}

export const validarUsuario = (v) =>
  RE_USUARIO.test(v) ? '' : 'Entre 3 y 20 caracteres: letras, números, punto o guion bajo.'

export const validarCodigo = (v) => (/^\d{6}$/.test(texto(v)) ? '' : 'Ingresá los 6 dígitos del código.')

// Login: el campo acepta usuario o e-mail; si trae "@" se valida como e-mail
export const validadoresLogin = {
  ident: (v) => {
    const t = texto(v)
    if (!t) return 'Ingresá tu usuario o e-mail.'
    return t.includes('@') ? validarEmail(t) : ''
  },
  pw: validarLongitudPassword,
}

// Registro y edición de perfil. `pwObligatoria` = false al editar (vacía = no cambia).
export const validadoresCuenta = ({ pwObligatoria = true } = {}) => ({
  nombre: obligatorio('Ingresá tu nombre.'),
  apellido: obligatorio('Ingresá tu apellido.'),
  nombreUsuario: validarUsuario,
  email: validarEmail,
  pw: (v) => (!pwObligatoria && !v ? '' : validarPasswordNueva(v)),
  ...(pwObligatoria ? { pw2: validarRepetida } : {}),
})

// Nombres de campo del back (UsuarioRequest / AuthenticationRequest) -> campos de los formularios
export const CAMPOS_CUENTA = {
  nombre: 'nombre', apellido: 'apellido', nombreUsuario: 'nombreUsuario', username: 'nombreUsuario',
  email: 'email', contrasena: 'pw', password: 'pw', codigo: 'codigo',
}

// Chequeo final del registro/edición contra las cuentas guardadas en el navegador (modo demo).
// `actual` = usuario que se edita (no cuenta como repetido). Con el back, los duplicados los devuelve la API (409).
// Devuelve el mensaje del primer error, o '' si está todo bien.
export const validarCuenta = (v, usuarios, { actual = '', pwObligatoria = true } = {}) => {
  const malos = Object.entries(validadoresCuenta({ pwObligatoria })).map(([c, f]) => f(v[c], v)).filter(Boolean)
  if (malos.length) return malos[0]
  const repetido = (campo) => usuarios.some((u) => u.nombreUsuario !== actual && String(u[campo]).toLowerCase() === v[campo].toLowerCase())
  if (repetido('nombreUsuario')) return 'Ese nombre de usuario ya está en uso.'
  if (repetido('email')) return 'Ese e-mail ya tiene una cuenta.'
  return ''
}

// Formulario de Contáctanos: nombre, apellido, e-mail válido y mensaje son obligatorios.
// Devuelve el mensaje del primer error, o '' si está todo bien.
export const validarContacto = (v) => {
  if (!v.nombre.trim() || !v.apellido.trim()) return 'Completá tu nombre y apellido.'
  if (!RE_MAIL.test(v.email.trim())) return 'Ingresá un e-mail válido.'
  if (!v.msg.trim()) return 'Escribí tu mensaje.'
  return ''
}

/* ---------------- Libro (LibroRequest) ---------------- */

// anioPublicacion: entero entre 1900 y el año actual
export const validarAnio = (v) => {
  const s = texto(v)
  if (!s) return 'Ingresá el año de edición.'
  if (!RE_ENTERO.test(s)) return 'El año debe ser un número entero (por ejemplo: 2015).'
  return +s >= ANIO_MIN && +s <= anioActual() ? '' : `El año debe estar entre ${ANIO_MIN} y ${anioActual()}.`
}

// precio: decimal > 0 con hasta 2 decimales (acepta coma o punto)
export const validarPrecio = (v) => {
  const s = texto(v)
  if (!s) return 'Ingresá el precio.'
  if (!/^\d+([.,]\d+)?$/.test(s)) return 'Ingresá un número válido (por ejemplo: 1500 o 1500.50).'
  if (!/^\d+([.,]\d{1,2})?$/.test(s)) return 'El precio admite hasta 2 decimales.'
  return parseFloat(s.replace(',', '.')) > 0 ? '' : 'El precio debe ser mayor a 0.'
}

// descuento: porcentaje entero entre 0 y 100
export const validarDescuento = (v) => {
  const s = texto(v)
  if (!s) return 'Ingresá el descuento (0 si no tiene).'
  if (!RE_ENTERO.test(s)) return 'El descuento debe ser un entero entre 0 y 100, sin decimales.'
  return +s <= 100 ? '' : 'El descuento debe estar entre 0 y 100.'
}

export const validarStock = (v) => {
  const s = texto(v)
  if (!s) return 'Ingresá el stock.'
  if (!RE_ENTERO.test(s)) return 'El stock debe ser un número entero.'
  return +s >= 1 ? '' : 'El stock debe ser al menos 1.'
}

// Los validadores se aplican en orden: el primer campo con error recibe el foco al enviar
export const validadoresLibro = {
  t: obligatorio('Ingresá el título.'),
  a: obligatorio('Ingresá el autor.'),
  ed: obligatorio('Ingresá la editorial.'),
  cat: obligatorio('Elegí una categoría.'),
  idioma: obligatorio('Elegí un idioma.'),
  anio: validarAnio,
  base: validarPrecio,
  d: validarDescuento,
  stock: (v, valores) => (valores.estado === 'Usado' ? '' : validarStock(v)), // los usados siempre tienen 1 unidad
}

// "1500,5" -> 1500.5 (redondeado a 2 decimales)
export const aDecimal = (v) => Math.round(parseFloat(texto(v).replace(',', '.')) * 100) / 100
