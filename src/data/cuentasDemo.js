// Cuentas de prueba de la pantalla de ingreso (panel "Probá la demo").
// Back: estas cuentas no existen; son solo para probar el front sin registrarse.

// Cuenta de vendedor: misma tienda que el perfil público /vendedor/libreria-el-resplandor
export const CUENTA_VENDEDOR_DEMO = {
  nombreUsuario: 'libreria_el_resplandor',
  email: 'vendedor@entrelibros.com',
  contrasena: 'Clave123!',
  nombre: 'Librería',
  apellido: 'El Resplandor',
  verificado: true,
  rol: 'VENDEDOR',
  estado: 'ACTIVO',
  tienda: 'Librería El Resplandor',
  prov: 'Santa Fe',
}

// Botones del panel: `destino` es la ruta a la que va cada uno al entrar (null = la de siempre)
export const INGRESOS_DEMO = [
  { id: 'comprador', texto: 'Entrar como comprador de prueba', ident: 'usuario_prueba', contrasena: 'Clave123!', destino: null },
  { id: 'vendedor', texto: 'Entrar como vendedor de prueba', ident: 'vendedor_prueba', contrasena: 'Clave123!', destino: '/vender' },
]
