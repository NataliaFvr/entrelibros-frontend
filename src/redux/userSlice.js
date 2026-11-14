import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { aUsuarioFront, dataUrlAFile } from "../api/adaptadores";
import {
  cambiarContraseniaApi, cerrarSesionApi, getSesionApi, loginApi, recuperarContraseniaApi,
  reenviarCodigoApi, registrarApi, traerUsuarioApi, verificarEmailApi,
} from "../api/authApi";
import { agregarMarcapaginaApi, listarMarcapaginasApi, quitarMarcapaginaApi } from "../api/cuentaApi";
import {
  crearDireccionApi, eliminarDireccionApi, listarDireccionesApi, marcarPrincipalApi, resolverPrincipal,
} from "../api/direccionesApi";
import { actualizarUsuarioApi, quitarFotoUsuarioApi, subirFotoUsuarioApi } from "../api/usuariosApi";
import {
  cambiarRolApi, crearUsuarioApi, darDeBajaUsuarioApi, listarUsuariosApi, reactivarUsuarioApi, resolverSolicitudApi,
} from "../api/usuariosApi";
import { solicitarVendedor } from "./vendedorSlice";
import { conDetalle } from "./conDetalle";

export const NOTA_SIN_CONFIRMAR = "Tu cuenta todavía no está confirmada. Te mandamos un código nuevo.";

// --- Datos de la cuenta (los pide App.jsx al tener sesión) ---
export const fetchUsuario = createAsyncThunk("user/fetchUsuario", async (id) => traerUsuarioApi(id));

export const fetchMarks = createAsyncThunk("user/fetchMarks", async (idUsuario) => ({
  idUsuario,
  ids: await listarMarcapaginasApi(),
}));

export const fetchDirecciones = createAsyncThunk("user/fetchDirecciones", async (idUsuario) => ({
  idUsuario,
  lista: await listarDireccionesApi(),
}));

// --- Sesión ---
export const login = createAsyncThunk("user/login", async ({ ident, contrasena }) => loginApi(ident, contrasena), conDetalle);

export const registrar = createAsyncThunk("user/registrar", async (valores) => registrarApi(valores), conDetalle);

export const logout = createAsyncThunk("user/logout", async () => {
  cerrarSesionApi();
});

// --- Confirmación del e-mail ---
export const confirmarEmail = createAsyncThunk(
  "user/confirmarEmail",
  async ({ email, codigo }) => verificarEmailApi(email, codigo),
  conDetalle,
);

// `nota` (opcional) = el texto que queda arriba del formulario una vez enviado el código
export const reenviarCodigo = createAsyncThunk("user/reenviarCodigo", async ({ email }) => reenviarCodigoApi(email), conDetalle);

export const recuperarContrasenia = createAsyncThunk(
  "user/recuperarContrasenia",
  async (email) => recuperarContraseniaApi(email),
  conDetalle,
);

export const cambiarContrasenia = createAsyncThunk(
  "user/cambiarContrasenia",
  async ({ email, codigo, nuevaContrasenia, repetirNuevaContrasenia }) =>
    cambiarContraseniaApi({ email, codigo, nuevaContrasenia, repetirNuevaContrasenia }),
  conDetalle,
);

// --- Perfil ---
export const guardarPerfil = createAsyncThunk("user/guardarPerfil", async ({ valores: v, nuevoPerfil, user }) => {
  const cambios = { nombre: v.nombre.trim(), apellido: v.apellido.trim(), nombreUsuario: v.nombreUsuario, email: v.email.trim() };
  if (v.contrasena) { cambios.contrasena = v.contrasena; cambios.contrasenaActual = v.contrasenaActual; }
  const fotoNueva = typeof nuevoPerfil.foto === "string" && nuevoPerfil.foto.startsWith("data:");
  const avatar = nuevoPerfil.foto ? "" : nuevoPerfil.avatar || "";
  if (avatar !== (user.avatar || "")) cambios.avatar = avatar;
  if (fotoNueva) await subirFotoUsuarioApi(user.id, await dataUrlAFile(nuevoPerfil.foto, "perfil"));
  else if (!nuevoPerfil.foto && user.tieneFoto) await quitarFotoUsuarioApi(user.id);
  const nuevo = await actualizarUsuarioApi(user.id, cambios);
  if (nuevo.email !== user.email) cerrarSesionApi(); // cambió el e-mail: tiene que volver a ingresar
  return { user: nuevo, sesionCerrada: nuevo.email !== user.email };
});

// --- Direcciones: el estado se actualiza con lo que responde el back, sin volver a pedir la lista ---
export const crearDireccion = createAsyncThunk("user/crearDireccion", async (direccion) => crearDireccionApi(direccion));

export const eliminarDireccion = createAsyncThunk("user/eliminarDireccion", async (id) => {
  await eliminarDireccionApi(id);
  return id;
});

// El back devuelve la lista entera: cambia la nueva principal y también la que lo era antes
export const marcarPrincipal = createAsyncThunk("user/marcarPrincipal", async (id) => marcarPrincipalApi(id));

// --- Marcapáginas: el slice actualiza la lista al instante (pending) y la revierte si el back falla (rejected) ---
export const toggleMark = createAsyncThunk("user/toggleMark", async ({ id, estaba }) =>
  (estaba ? quitarMarcapaginaApi(id) : agregarMarcapaginaApi(id)));

export const quitarMarks = createAsyncThunk("user/quitarMarks", async (ids) => {
  await Promise.allSettled(ids.map((id) => quitarMarcapaginaApi(id)));
});

const aFila = (u) => ({ ...u, quiereVender: u.estadoSolicitud === "PENDIENTE" });

export const fetchUsuarios = createAsyncThunk("user/fetchUsuarios", async () => listarUsuariosApi(), {
  condition: (_, { getState }) => !getState().user.todos.loading,
});

export const crearUsuario = createAsyncThunk("user/crearUsuario", async (v) => {
  if (!["COMPRADOR", "VENDEDOR"].includes(v.rol)) throw new Error("Desde el panel solo se pueden crear compradores o vendedores.");
  return crearUsuarioApi(v);
});

export const editarUsuario = createAsyncThunk("user/editarUsuario", async ({ id, cambios }) => actualizarUsuarioApi(id, cambios));

export const cambiarRol = createAsyncThunk("user/cambiarRol", async ({ id, rol, datosVendedor }) =>
  aUsuarioFront(await cambiarRolApi(id, rol, datosVendedor)));

export const darDeBajaUsuario = createAsyncThunk("user/darDeBajaUsuario", async (id) =>
  aUsuarioFront(await darDeBajaUsuarioApi(id)));

export const reactivarUsuario = createAsyncThunk("user/reactivarUsuario", async (id) =>
  aUsuarioFront(await reactivarUsuarioApi(id)));

export const resolverSolicitud = createAsyncThunk("user/resolverSolicitud", async ({ id, aprobada, comentario }) =>
  aUsuarioFront(await resolverSolicitudApi(id, aprobada, comentario)));

const reemplazar = (state, action) => {
  const index = state.todos.items.findIndex((u) => u.id === action.payload.id);
  if (index !== -1) state.todos.items[index] = aFila(action.payload);
};

const userSlice = createSlice({
  name: "user",
  initialState: {
    user: getSesionApi(),
    marks: [],
    direcciones: [],
    gate: null,
    gateDestino: null,
    pendiente: null, // acción que quedó esperando el login: { tipo: 'cart' | 'buy' | 'fav', idLibro }
    verif: null, // { id, nota, cuenta: { email, nombre } } mientras se confirma el e-mail
    error: null,
    todos: {
      items: [],
      cargados: false,
      loading: false,
      error: null,
    },
  },
  reducers: {
    abrirGate: (state, action) => {
      const { tipo, destino = null, accion = null } = action.payload;
      state.gate = tipo;
      state.gateDestino = destino;
      state.pendiente = accion;
    },
    // Al ir a ingresar se conserva la acción pendiente; si cierra el cartel, se descarta
    cerrarGate: (state, action) => {
      state.gate = null;
      state.gateDestino = null;
      if (!action.payload.conservarAccion) state.pendiente = null;
    },
    limpiarPendiente: (state) => {
      state.pendiente = null;
    },
    cancelarVerificacion: (state) => {
      state.verif = null;
    },
  },
  extraReducers: (builder) => {
    const abrirVerificacion = (state, email, nombre, nota) => {
      state.verif = { id: email, nota, cuenta: { email, nombre } };
    };
    const entrar = (state, user) => {
      state.user = user;
      state.marks = []; // los pide App.jsx al cambiar de usuario
      state.direcciones = [];
    };
    const salir = (state) => {
      state.user = null;
      state.marks = [];
      state.direcciones = [];
    };
    builder
      .addCase(fetchUsuario.fulfilled, (state, action) => {
        if (state.user && state.user.id === action.payload.id) state.user = action.payload; // si ya cambió de cuenta, se descarta
      })
      .addCase(fetchUsuario.rejected, (state, action) => {
        state.error = action.error.message;
      })
      .addCase(fetchMarks.fulfilled, (state, action) => {
        if (state.user && state.user.id === action.payload.idUsuario) state.marks = action.payload.ids;
      })
      .addCase(fetchMarks.rejected, (state, action) => {
        state.error = action.error.message;
      })
      .addCase(fetchDirecciones.fulfilled, (state, action) => {
        if (state.user && state.user.id === action.payload.idUsuario) state.direcciones = action.payload.lista;
      })
      .addCase(fetchDirecciones.rejected, (state, action) => {
        state.error = action.error.message;
      })
      .addCase(login.fulfilled, (state, action) => {
        entrar(state, action.payload);
      })
      // Cuenta sin confirmar: en lugar de un error se abre la confirmación del e-mail (se pide un código nuevo)
      .addCase(login.rejected, (state, action) => {
        if (action.error.tipo === "CUENTA_NO_CONFIRMADA") abrirVerificacion(state, action.meta.arg.ident.trim(), "", NOTA_SIN_CONFIRMAR);
      })
      .addCase(registrar.fulfilled, (state, action) => {
        const { email, nombre } = action.payload;
        abrirVerificacion(state, email, nombre || "", "Te creamos la cuenta. Falta un paso: confirmá tu e-mail.");
      })
      .addCase(logout.fulfilled, (state) => {
        salir(state);
      })
      .addCase(confirmarEmail.fulfilled, (state, action) => {
        state.verif = null;
        entrar(state, action.payload);
      })
      .addCase(reenviarCodigo.fulfilled, (state, action) => {
        if (state.verif) state.verif.nota = action.meta.arg.nota || "Te enviamos un código nuevo.";
      })
      .addCase(guardarPerfil.fulfilled, (state, action) => {
        reemplazar(state, { payload: action.payload.user });
        if (action.payload.sesionCerrada) salir(state);
        else state.user = action.payload.user;
      })
      // La solicitud para vender cambia el estado de la cuenta (queda PENDIENTE hasta que el admin la resuelva)
      .addCase(solicitarVendedor.fulfilled, (state, action) => {
        if (state.user && state.user.id === action.payload.id) state.user = { ...state.user, ...action.payload };
      })
      .addCase(fetchUsuarios.pending, (state) => {
        state.todos.loading = true;
        state.todos.error = null;
      })
      .addCase(fetchUsuarios.fulfilled, (state, action) => {
        state.todos.loading = false;
        state.todos.cargados = true;
        state.todos.items = action.payload.map(aFila);
      })
      .addCase(fetchUsuarios.rejected, (state, action) => {
        state.todos.loading = false;
        state.todos.error = action.error.message;
      })
      .addCase(crearUsuario.fulfilled, (state, action) => {
        state.todos.items.push(aFila(action.payload));
      })
      .addCase(editarUsuario.fulfilled, reemplazar)
      .addCase(cambiarRol.fulfilled, reemplazar)
      .addCase(darDeBajaUsuario.fulfilled, reemplazar)
      .addCase(reactivarUsuario.fulfilled, reemplazar)
      .addCase(resolverSolicitud.fulfilled, reemplazar)
      .addCase(crearDireccion.fulfilled, (state, action) => {
        state.direcciones.push(action.payload);
      })
      // Si se borra la principal, el back marca otra (la primera): acá se hace lo mismo
      .addCase(eliminarDireccion.fulfilled, (state, action) => {
        state.direcciones = resolverPrincipal(state.direcciones.filter((d) => d.id !== action.payload));
      })
      .addCase(marcarPrincipal.fulfilled, (state, action) => {
        state.direcciones = action.payload;
      })
      .addCase(toggleMark.pending, (state, action) => {
        const { id, estaba } = action.meta.arg;
        state.marks = estaba ? state.marks.filter((x) => x !== id) : [...state.marks, id];
      })
      .addCase(toggleMark.rejected, (state, action) => {
        const { id, estaba } = action.meta.arg;
        state.marks = estaba ? [...state.marks, id] : state.marks.filter((x) => x !== id);
        state.error = action.error.message;
      })
      .addCase(quitarMarks.pending, (state, action) => {
        state.marks = state.marks.filter((x) => !action.meta.arg.includes(x));
      });
  },
});

export const { abrirGate, cerrarGate, limpiarPendiente, cancelarVerificacion } = userSlice.actions;

export default userSlice.reducer;
