// Manejo centralizado de errores de la API. Convierte cualquier error (axios o común) en un objeto simple
// que los formularios saben mostrar:
//   { tipo, status, mensaje, campos }
// - tipo: qué pasó (ver MENSAJES). Sale de la excepción que devolvió el back o, si no la identificamos, del status HTTP.
// - mensaje: texto claro, en español, para la persona.
// - campos: errores por campo { nombreDelCampoEnElBack: mensaje } (Bean Validation), para pintarlos en cada input.
// El `contexto` ('login' | 'registro' | 'verificacion' | 'libro' | ...) desambigua códigos HTTP que significan
// cosas distintas según la pantalla (un 401 en el login son credenciales incorrectas; en cualquier otro lado, sesión vencida).

// Excepciones del back (nombre de la clase o código) -> tipo. Se busca en cualquier campo del cuerpo de la respuesta.
// El orden importa: lo más específico va primero.
const FIRMAS = [
  // El back responde 403 { error, codigo: "email_no_verificado" } al login de una cuenta sin verificar (GlobalExceptionHandler)
  ['CUENTA_NO_CONFIRMADA', /CuentaNoConfirmada|CuentaNoVerificada|CUENTA_NO_(CONFIRMADA|VERIFICADA)|PENDIENTE_CONFIRMACION|DisabledException|email_no_verificado/i],
  ['CODIGO_VENCIDO', /CodigoVerificacion(Expirad|Venc)|CODIGO(_VERIFICACION)?_(EXPIRADO|VENCIDO)/i],
  // Texto del back (CodigoVerificacionInvalidoException): "Código inválido o vencido"
  ['CODIGO_INVALIDO', /CodigoVerificacionInvalido|CODIGO(_VERIFICACION)?_INVALIDO|C[oó]digo inv[aá]lido/i],
  ['USUARIO_NO_ENCONTRADO', /UsuarioNoEncontrado|USUARIO_NO_ENCONTRADO|No existe el usuario/i],
  ['CREDENCIALES', /BadCredentials|CredencialesInvalidas|CREDENCIALES_INVALIDAS|Bad credentials|contrase[ñn]a incorrectos/i],
  // Texto del back (UsuarioDuplicadoException): "Ya existe un usuario con ese email o nombre de usuario"
  ['DUPLICADO', /UsuarioYaExiste|EmailYaRegistrado|EmailDuplicado|UsuarioDuplicado|YaExiste|YA_EXISTE|DUPLICAD|already exists|Ya existe un usuario/i],
  ['DEMASIADOS_INTENTOS', /DemasiadosIntentos|TooManyAttempts|DEMASIADOS_INTENTOS/i],
]

export const MENSAJES = {
  CUENTA_NO_CONFIRMADA: 'Tu cuenta todavía no está confirmada. Revisá tu e-mail y confirmala con el código que te enviamos.',
  CODIGO_VENCIDO: 'El código venció. Pedí uno nuevo.',
  CODIGO_INVALIDO: 'El código ingresado no es correcto. Revisalo e intentá de nuevo.',
  USUARIO_NO_ENCONTRADO: 'No encontramos una cuenta con ese usuario o e-mail.',
  CREDENCIALES: 'Usuario o contraseña incorrectos.',
  DUPLICADO: 'Ese usuario o e-mail ya tiene una cuenta.',
  DEMASIADOS_INTENTOS: 'Demasiados intentos. Esperá un momento o pedí un código nuevo.',
  SESION_EXPIRADA: 'Tu sesión venció. Volvé a ingresar para continuar.',
  PERMISO: 'No tenés permiso para realizar esta acción.',
  NO_ENCONTRADO: 'No encontramos lo que buscabas. Puede que ya no exista.',
  CONFLICTO: 'No se pudo completar la acción porque hay un conflicto con el estado actual. Actualizá la página e intentá de nuevo.',
  VALIDACION: 'Revisá los datos ingresados: hay información inválida.',
  RED: 'No pudimos conectarnos con el servidor. Revisá tu conexión e intentá de nuevo.',
  TIMEOUT: 'El servidor tardó demasiado en responder. Intentá de nuevo en un momento.',
  SERVIDOR: 'El servidor tuvo un problema. Intentá de nuevo en unos minutos.',
  DESCONOCIDO: 'Ocurrió un error inesperado. Intentá de nuevo.',
}

// Título corto del aviso visual
export const TITULOS = {
  CUENTA_NO_CONFIRMADA: 'Cuenta sin confirmar',
  CODIGO_VENCIDO: 'El código venció',
  CODIGO_INVALIDO: 'Código incorrecto',
  USUARIO_NO_ENCONTRADO: 'Cuenta no encontrada',
  CREDENCIALES: 'No pudimos iniciar sesión',
  DUPLICADO: 'Datos ya registrados',
  DEMASIADOS_INTENTOS: 'Demasiados intentos',
  SESION_EXPIRADA: 'Sesión vencida',
  PERMISO: 'Sin permiso',
  NO_ENCONTRADO: 'No encontrado',
  CONFLICTO: 'Hay un conflicto',
  VALIDACION: 'Revisá los datos',
  RED: 'Sin conexión',
  TIMEOUT: 'El servidor no responde',
  SERVIDOR: 'Problema en el servidor',
  DESCONOCIDO: 'Algo salió mal',
}

// 'warning' = hay un paso que completar; 'info' = aviso neutro; el resto, 'error'
export const severidad = (tipo) => {
  if (['CUENTA_NO_CONFIRMADA', 'CODIGO_VENCIDO', 'DEMASIADOS_INTENTOS'].includes(tipo)) return 'warning'
  return 'error'
}

const esTextoUtil = (t) => typeof t === 'string' && t.trim() && !/Exception|^\s*at\s|\bnull\b/.test(t)

// Cuerpo de validación del back (MethodArgumentNotValidException): un mapa plano { campo: mensaje }, sin clave "error"
const esMapaPlano = (d, status) =>
  status === 400 && Object.keys(d).length > 0 && Object.values(d).every((v) => typeof v === 'string') &&
  !['error', 'mensaje', 'message', 'status', 'codigo', 'detail'].some((k) => k in d)

// Errores por campo: { campo: mensaje } desde el mapa plano del back, { errors: {…} } o { errors: [{ field, defaultMessage }] }
const camposDe = (d, status) => {
  if (esMapaPlano(d, status)) return { ...d }
  const crudo = d.errors || d.errores || d.fieldErrors || d.campos
  if (!crudo || typeof crudo !== 'object') return {}
  const pares = Array.isArray(crudo)
    ? crudo.map((c) => (typeof c === 'string' ? [null, c] : [c.field || c.campo, c.defaultMessage || c.message || c.mensaje]))
    : Object.entries(crudo).map(([k, v]) => [k, Array.isArray(v) ? v.join(' ') : String(v)])
  const campos = {}
  pares.forEach(([campo, mensaje]) => { if (campo && mensaje) campos[campo] = mensaje })
  return campos
}

// Mensajes sueltos (sin campo) que vengan en la lista de errores
const mensajesSueltos = (d) => {
  const crudo = d.errors || d.errores
  return Array.isArray(crudo) ? crudo.map((c) => (typeof c === 'string' ? c : c.defaultMessage || c.message)).filter(Boolean) : []
}

const porEstado = (status, contexto, hayCampos) => {
  if (status === 401) return contexto === 'login' ? 'CREDENCIALES' : 'SESION_EXPIRADA'
  // Spring responde 403 (sin cuerpo) a una cuenta deshabilitada, que es una cuenta sin confirmar
  if (status === 403) return contexto === 'login' ? 'CUENTA_NO_CONFIRMADA' : 'PERMISO'
  if (status === 404) return ['login', 'verificacion'].includes(contexto) ? 'USUARIO_NO_ENCONTRADO' : 'NO_ENCONTRADO'
  if (status === 409) return contexto === 'registro' ? 'DUPLICADO' : 'CONFLICTO'
  if (status === 429) return 'DEMASIADOS_INTENTOS'
  if (status === 400 && contexto === 'verificacion' && !hayCampos) return 'CODIGO_INVALIDO'
  if (status === 400 || status === 422) return 'VALIDACION'
  if (status >= 500) return 'SERVIDOR'
  return 'DESCONOCIDO'
}

export const normalizarError = (err, contexto = '') => {
  const r = err && err.response

  // Sin respuesta del servidor: timeout, caída de red, o un Error común lanzado por el propio front
  if (!r) {
    if (err && (err.code === 'ECONNABORTED' || /timeout/i.test(err.message || ''))) return { tipo: 'TIMEOUT', status: 0, mensaje: MENSAJES.TIMEOUT, campos: {} }
    if (err && err.request) return { tipo: 'RED', status: 0, mensaje: MENSAJES.RED, campos: {} }
    return { tipo: 'DESCONOCIDO', status: 0, mensaje: (err && err.message) || MENSAJES.DESCONOCIDO, campos: {} }
  }

  const d = r.data && typeof r.data === 'object' ? r.data : {}
  const campos = camposDe(d, r.status)
  const hayCampos = Object.keys(campos).length > 0
  const firma = [d.exception, d.error, d.code, d.codigo, d.type, d.tipo, d.title, d.message, d.mensaje, d.detail, typeof r.data === 'string' ? r.data : '']
    .filter((x) => typeof x === 'string').join(' ')
  const encontrada = FIRMAS.find(([, re]) => re.test(firma))
  const tipo = encontrada ? encontrada[0] : porEstado(r.status, contexto, hayCampos)

  // Para los tipos que conocemos usamos nuestro texto (claro y en español); si no, el del back cuando sirve
  let mensaje = MENSAJES[tipo]
  if (tipo === 'VALIDACION' || tipo === 'DESCONOCIDO' || tipo === 'CONFLICTO') {
    const lista = [...Object.values(campos), ...mensajesSueltos(d)]
    const delBack = [d.message, d.mensaje, d.detail, d.error].find(esTextoUtil)
    const conPunto = (m) => (/[.!?]$/.test(m.trim()) ? m.trim() : `${m.trim()}.`)
    mensaje = lista.length ? [...new Set(lista)].map(conPunto).join(' ') : (delBack || mensaje)
  }
  return { tipo, status: r.status, mensaje, campos }
}

// ¿Es el 404 de un LISTADO vacío? El back responde 404 { error: "…" } con ListaVaciaException ("No hay libros", "No tenés órdenes"…),
// y también cuando se pide una página que ya no existe. Solo ese caso se trata como "no hay resultados".
// Cualquier otro error (401, 403, 500, red, timeout) NO es "vacío": tiene que propagarse y mostrarse con mensajeError().
// Un 404 sin campo `error` (proxy, HTML) o el 404 por defecto de Spring ({ timestamp, status, error: "Not Found", path }, URL inexistente)
// tampoco es una lista vacía: es un error real.
export const esListaVacia = (err) => {
  const r = err && err.response
  if (!r || r.status !== 404) return false
  const d = r.data
  if (!d || typeof d !== 'object' || Array.isArray(d)) return false
  if (typeof d.error !== 'string' || !d.error.trim()) return false
  return !('path' in d || 'timestamp' in d)
}

// Atajo: solo el texto
export const mensajeError = (err, contexto = '') => normalizarError(err, contexto).mensaje

// { anioPublicacion: '…' } + { anioPublicacion: 'anio' } -> { anio: '…' } (campos del back -> inputs del formulario)
export const mapearCampos = (campos = {}, mapa = {}) =>
  Object.fromEntries(Object.entries(campos).map(([k, v]) => [mapa[k] || k, v]))
