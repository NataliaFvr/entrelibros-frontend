import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { dataUrlAFile } from "../api/adaptadores";
import { cerrarSesionApi, getSesionApi, loginApi, reenviarCodigoApi, registrarApi, traerUsuarioApi, verificarEmailApi } from "../api/authApi";
import { agregarMarcapaginaApi, listarMarcapaginasApi, quitarMarcapaginaApi } from "../api/cuentaApi";
import {
  crearDireccionApi, eliminarDireccionApi, listarDireccionesApi, marcarPrincipalApi, resolverPrincipal,
} from "../api/direccionesApi";
import { actualizarUsuarioApi, quitarFotoUsuarioApi, subirFotoUsuarioApi } from "../api/usuariosApi";
import { solicitarVendedor } from "./vendedorSlice";

// Los errores ya llegan con el mensaje claro (lo arma el interceptor de api/axiosConfig.js), así que las acciones no
// necesitan try/catch: si la llamada falla, createAsyncThunk despacha el `rejected` solo.
// En los formularios de sesión además hace falta saber qué pasó (tipo) y qué campo está mal (campos): se agregan al error.
const conDetalle = {
  serializeError: (err) => ({
    message: err.message,
    tipo: err.info ? err.info.tipo : undefined,
    campos: err.info ? err.info.campos : {},
  }),
};

export const NOTA_SIN_CONFIRMAR = "Tu cuenta todavía no está confirmada. Te mandamos un código nuevo.";

// --- Datos de la cuenta (los pide App.jsx al tener sesión) ---
export const fetchUsuario = createAsyncThunk("auth/fetchusuario", async (id) => traerUsuarioApi(id));

export const fetchMarks = createAsyncThunk("auth/fetchmarks", async (idUsuario) => ({
  idUsuario,
  ids: await listarMarcapaginasApi(),
}));

export const fetchDirecciones = createAsyncThunk("auth/fetchdirecciones", async (idUsuario) => ({
  idUsuario,
  lista: await listarDireccionesApi(),
}));

// --- Sesión ---
export const login = createAsyncThunk("auth/login", async ({ ident, contrasena }) => loginApi(ident, contrasena), conDetalle);

export const registrar = createAsyncThunk("auth/registrar", async (valores) => registrarApi(valores), conDetalle);

export const logout = createAsyncThunk("auth/logout", async () => {
  cerrarSesionApi();
});

// --- Confirmación del e-mail ---
export const confirmarEmail = createAsyncThunk(
  "auth/confirmaremail",
  async ({ email, codigo }) => verificarEmailApi(email, codigo),
  conDetalle,
);

// `nota` (opcional) = el texto que queda arriba del formulario una vez enviado el código
export const reenviarCodigo = createAsyncThunk("auth/reenviarcodigo", async ({ email }) => reenviarCodigoApi(email), conDetalle);

// --- Perfil ---
export const guardarPerfil = createAsyncThunk("auth/guardarperfil", async ({ valores: v, nuevoPerfil, user }) => {
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
export const crearDireccion = createAsyncThunk("auth/creardireccion", async (direccion) => crearDireccionApi(direccion));

export const eliminarDireccion = createAsyncThunk("auth/eliminardireccion", async (id) => {
  await eliminarDireccionApi(id);
  return id;
});

// El back devuelve la lista entera: cambia la nueva principal y también la que lo era antes
export const marcarPrincipal = createAsyncThunk("auth/marcarprincipal", async (id) => marcarPrincipalApi(id));

// --- Marcapáginas: el slice actualiza la lista al instante (pending) y la revierte si el back falla (rejected) ---
export const toggleMark = createAsyncThunk("auth/togglemark", async ({ id, estaba }) =>
  (estaba ? quitarMarcapaginaApi(id) : agregarMarcapaginaApi(id)));

export const quitarMarks = createAsyncThunk("auth/quitarmarks", async (ids) => {
  await Promise.allSettled(ids.map((id) => quitarMarcapaginaApi(id)));
});

const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: getSesionApi(),
    marks: [],
    direcciones: [],
    gate: null,
    gateDestino: null,
    pendiente: null, // acción que quedó esperando el login: { tipo: 'cart' | 'buy' | 'fav', idLibro }
    verif: null, // { id, nota, cuenta: { email, nombre } } mientras se confirma el e-mail
    error: null,
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
      .addCase(fetchMarks.fulfilled, (state, action) => {
        if (state.user && state.user.id === action.payload.idUsuario) state.marks = action.payload.ids;
      })
      .addCase(fetchDirecciones.fulfilled, (state, action) => {
        if (state.user && state.user.id === action.payload.idUsuario) state.direcciones = action.payload.lista;
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
        if (action.payload.sesionCerrada) salir(state);
        else state.user = action.payload.user;
      })
      // La solicitud para vender cambia el estado de la cuenta (queda PENDIENTE hasta que el admin la resuelva)
      .addCase(solicitarVendedor.fulfilled, (state, action) => {
        if (state.user && state.user.id === action.payload.id) state.user = { ...state.user, ...action.payload };
      })
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

export const { abrirGate, cerrarGate, limpiarPendiente, cancelarVerificacion } = authSlice.actions;

export default authSlice.reducer;
