// Claves de localStorage por cuenta. Todas cambian si la persona cambia su nombre de usuario.
export const claveMarks = (u) => `entrelibros_marcapaginas_${u.nombreUsuario}`
export const claveCart = (u) => `entrelibros_cart_${u.nombreUsuario}`
export const clavePerfil = (u) => `entrelibros_perfil_${u.nombreUsuario}` // { avatar, foto }
export const claveDir = (u) => `entrelibros_direcciones_${u.nombreUsuario}` // [{ alias, calle, ciudad, cp, prov }]
export const clavePedidos = (u) => `entrelibros_pedidos_${u.nombreUsuario}`
export const claveVendedor = (u) => `entrelibros_vendedor_${u.nombreUsuario}` // { estado, tienda, prov, tel, desc, pub: [] }
