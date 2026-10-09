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

// Nombre o apellido (UsuarioRequest: NotBlank). El back no limita el largo ni los caracteres: acá, básico — letras, espacios, ' y -, hasta 50.
const RE_NOMBRE = /^[\p{L}][\p{L}\s'’.-]*$/u
export const validarNombrePersona = (que = 'el nombre') => (v) => {
  const t = texto(v)
  if (!t) return `Ingresá ${que}.`
  if (t.length < 2) return 'Debe tener al menos 2 letras.'
  if (t.length > 50) return 'Máximo 50 caracteres.'
  return RE_NOMBRE.test(t) ? '' : 'Usá solo letras, espacios, apóstrofe o guion.'
}

export const validarCodigo = (v) => (/^\d{6}$/.test(texto(v)) ? '' : 'Ingresá los 6 dígitos del código.')

export const validadoresLoginApi = {
  ident: validarEmail,
  pw: validarLongitudPassword,
}

// Registro y edición de perfil. `pwObligatoria` = false al editar (vacía = no cambia).
export const validadoresCuenta = ({ pwObligatoria = true } = {}) => ({
  nombre: validarNombrePersona('tu nombre'),
  apellido: validarNombrePersona('tu apellido'),
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

const conLargo = (mensaje, max) => (v) => (!texto(v) ? mensaje : texto(v).length > max ? `Máximo ${max} caracteres.` : '')

// Los validadores se aplican en orden: el primer campo con error recibe el foco al enviar
export const validadoresLibro = {
  t: conLargo('Ingresá el título.', 150),
  a: conLargo('Ingresá el autor.', 100),
  ed: conLargo('Ingresá la editorial.', 100),
  cats: (v) => (Array.isArray(v) && v.length ? '' : 'Elegí al menos una categoría.'),
  idioma: obligatorio('Elegí un idioma.'),
  anio: validarAnio,
  base: validarPrecio,
  d: validarDescuento,
  stock: (v, valores) => (valores.estado === 'Usado' ? '' : validarStock(v)), // los usados siempre tienen 1 unidad
}

// "1500,5" -> 1500.5 (redondeado a 2 decimales)
export const aDecimal = (v) => Math.round(parseFloat(texto(v).replace(',', '.')) * 100) / 100

/* ---------------- Contacto (ContactoRequest: nombre, email y mensaje NotBlank, email con formato) ---------------- */

const RE_TEL = /^[\d\s()+-]{6,20}$/
export const validarTelefono = (v) => {
  const t = texto(v)
  if (!t) return 'Ingresá tu teléfono.'
  if (!RE_TEL.test(t) || t.replace(/\D/g, '').length < 6) return 'Ingresá un teléfono válido (solo números, espacios, + - o paréntesis).'
  return t.replace(/\D/g, '').length > 15 ? 'El teléfono es demasiado largo.' : ''
}
// Teléfono opcional: vacío vale, pero si lo escribió tiene que ser válido
export const validarTelefonoOpcional = (v) => (texto(v) ? validarTelefono(v) : '')

export const MENSAJE_MIN = 10
export const MENSAJE_MAX = 1000
export const validarMensajeContacto = (v) => {
  const t = texto(v)
  if (!t) return 'Escribí tu mensaje.'
  if (t.length < MENSAJE_MIN) return `Contanos un poco más (mínimo ${MENSAJE_MIN} caracteres).`
  return t.length > MENSAJE_MAX ? `Máximo ${MENSAJE_MAX} caracteres.` : ''
}

export const validadoresContacto = {
  nombre: validarNombrePersona('tu nombre'),
  apellido: validarNombrePersona('tu apellido'),
  email: validarEmail,
  area: (v) => (!texto(v) || /^\+?\d{1,5}$/.test(texto(v)) ? '' : 'Ej.: +54 o 11 (solo números).'),
  tel: validarTelefonoOpcional,
  msg: validarMensajeContacto,
}

/* ---------------- Solicitud de vendedor (SolicitudVendedorRequest: todos los campos obligatorios) ---------------- */

export const validadoresSolicitudVendedor = {
  tienda: (v) => {
    const t = texto(v)
    if (!t) return 'Ingresá el nombre de tu tienda.'
    if (t.length < 2) return 'El nombre debe tener al menos 2 caracteres.'
    return t.length > 60 ? 'Máximo 60 caracteres.' : ''
  },
  prov: obligatorio('Elegí tu provincia.'),
  tel: validarTelefono,
  desc: (v) => {
    const t = texto(v)
    if (!t) return 'Contanos qué libros vendés.'
    if (t.length < 10) return 'Contanos un poco más (mínimo 10 caracteres).'
    return t.length > 500 ? 'Máximo 500 caracteres.' : ''
  },
}

/* ---------------- Direcciones ---------------- */

export const validadoresDireccion = {
  alias: (v) => {
    const t = texto(v)
    if (!t) return 'Ponele un nombre (Casa, Trabajo…).'
    if (t.length < 2) return 'Debe tener al menos 2 caracteres.'
    return t.length > 30 ? 'Máximo 30 caracteres.' : ''
  },
  calle: (v) => {
    const t = texto(v)
    if (!t) return 'Ingresá la calle y el número.'
    if (t.length < 4) return 'Ingresá la calle completa.'
    if (t.length > 100) return 'Máximo 100 caracteres.'
    return /\d|\bs\/?n\b/i.test(t) ? '' : 'Agregá el número de la calle (o "S/N").'
  },
  ciudad: (v) => {
    const t = texto(v)
    if (!t) return 'Ingresá la ciudad o localidad.'
    if (t.length < 2) return 'Debe tener al menos 2 caracteres.'
    return t.length > 60 ? 'Máximo 60 caracteres.' : ''
  },
  cp: (v) => {
    if (!texto(v)) return 'Ingresá el código postal.'
    return /^([A-Za-z]\d{4}[A-Za-z]{3}|\d{4})$/.test(texto(v)) ? '' : 'Ingresá 4 dígitos (ej.: 1425) o el formato C1425ABC.'
  },
  prov: obligatorio('Elegí la provincia.'),
}

/* ---------------- Categorías (CategoriaRequest: nombre; único en la base) ---------------- */

export const CATEGORIA_MAX = 40
export const validarNombreCategoria = (v) => {
  const t = texto(v).replace(/\s+/g, ' ')
  if (!t) return 'Escribí el nombre de la categoría.'
  if (t.length < 2) return 'Debe tener al menos 2 caracteres.'
  if (t.length > CATEGORIA_MAX) return `Máximo ${CATEGORIA_MAX} caracteres.`
  return /^[\p{L}\p{N}][\p{L}\p{N}\s&,.'’/-]*$/u.test(t) ? '' : 'Usá letras, números, espacios o & , . - / solamente.'
}

/* ---------------- Tarifas de envío (EnvioRequest.costoFijo es Double) ---------------- */

export const COSTO_ENVIO_MAX = 1000000
export const validarCostoEnvio = (v) => {
  const falta = validarPrecio(v)
  if (falta) return falta.replace('el precio', 'el costo').replace('El precio', 'El costo').replace('Ingresá el precio.', 'Ingresá el costo del envío.')
  return aDecimal(v) > COSTO_ENVIO_MAX ? `El costo no puede superar $${COSTO_ENVIO_MAX.toLocaleString('es-AR')}.` : ''
}
