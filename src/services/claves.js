// Claves de localStorage por cuenta. Todas cambian si la persona cambia su nombre de usuario.
export const claveMarks = (u) => `entrelibros_marcapaginas_${u.nombreUsuario}`
export const claveCart = (u) => `entrelibros_cart_${u.nombreUsuario}`
export const clavePerfil = (u) => `entrelibros_perfil_${u.nombreUsuario}` // SOLO DEMO: { avatar, foto }. Con el back sale del usuario (avatar + tieneFoto)
export const claveDir = (u) => `entrelibros_direcciones_${u.nombreUsuario}` // SOLO DEMO: [{ alias, calle, ciudad, cp, prov }]
// Con el back: solo se recuerda QUÉ dirección es la principal (el back todavía no lo guarda). Va por id, no por nombre de usuario.
export const claveDirPrincipal = (idUsuario) => `entrelibros_dir_principal_${idUsuario}`
export const clavePedidos = (u) => `entrelibros_pedidos_${u.nombreUsuario}`
export const claveVendedor = (u) => `entrelibros_vendedor_${u.nombreUsuario}` // { estado, tienda, prov, tel, desc, pub: [] }
export const claveNotifs = (u) => `entrelibros_notifs_${u.nombreUsuario}` // SOLO DEMO: [{ id, texto, fecha, leida }]
