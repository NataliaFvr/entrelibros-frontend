const RE_MAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const RE_USUARIO = /^[A-Za-z0-9_.]{3,20}$/

export const passwordValida = (p) =>
  p.length >= 8 && /[A-Z]/.test(p) && /\d/.test(p) && /[^A-Za-z0-9]/.test(p)

// Sirve para registrarse y para editar el perfil.
// `actual` = usuario que se edita (no cuenta como repetido); `pwObligatoria` = false al editar.
// Devuelve el mensaje del primer error, o '' si está todo bien.
export const validarCuenta = (v, usuarios, { actual = '', pwObligatoria = true } = {}) => {
  if (!v.nombre.trim() || !v.apellido.trim()) return 'Completá tu nombre y apellido.'
  if (!RE_USUARIO.test(v.nombreUsuario)) return 'El usuario debe tener entre 3 y 20 caracteres: letras, números, punto o guion bajo.'
  if (!RE_MAIL.test(v.email)) return 'Ingresá un e-mail válido.'
  if ((pwObligatoria || v.pw) && !passwordValida(v.pw)) return 'La contraseña necesita al menos 8 caracteres, una mayúscula, un número y un caracter especial.'
  if (pwObligatoria && v.pw !== v.pw2) return 'Las contraseñas no coinciden.'
  const repetido = (campo) => usuarios.some((u) => u.nombreUsuario !== actual && String(u[campo]).toLowerCase() === v[campo].toLowerCase())
  if (repetido('nombreUsuario')) return 'Ese nombre de usuario ya está en uso.'
  if (repetido('email')) return 'Ese e-mail ya tiene una cuenta.'
  return ''
}
