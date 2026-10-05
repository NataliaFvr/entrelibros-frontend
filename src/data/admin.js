// Datos fijos del panel de administración: secciones de la barra, roles y estados de usuario.
// Las secciones coinciden con las del prototipo HTML. Hoy están hechas Resumen, Moderación y Usuarios.

export const SECCIONES_ADMIN = [
  { to: '/admin', label: 'Resumen', end: true },
  { to: '/admin/moderacion', label: 'Moderación' },
  { to: '/admin/usuarios', label: 'Usuarios' },
  { to: '/admin/categorias', label: 'Categorías' },
  { to: '/admin/envios', label: 'Tarifas de envío' },
  { to: '/admin/ordenes', label: 'Órdenes' },
  { to: '/admin/pagos', label: 'Pagos' },
]

// [valor del back (enum Rol), etiqueta]
export const ROLES = [['ADMIN', 'Admin'], ['COMPRADOR', 'Comprador'], ['VENDEDOR', 'Vendedor']]
export const ETIQUETA_ROL = Object.fromEntries(ROLES)

// [valor del back (enum EstadoUsuario), etiqueta del filtro]
export const ESTADOS_USUARIO = [['ACTIVO', 'Activos'], ['DADO_DE_BAJA', 'Dados de baja']]
