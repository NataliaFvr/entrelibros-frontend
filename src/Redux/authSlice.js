import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { dataUrlAFile } from "../api/adaptadores";
import { cerrarSesionApi, getSesionApi, loginApi, reenviarCodigoApi, registrarApi, traerUsuarioApi, verificarEmailApi } from "../api/authApi";
import { agregarMarcapaginaApi, listarMarcapaginasApi, quitarMarcapaginaApi } from "../api/cuentaApi";
import { direcciones as servicioDirecciones } from "../api/direccionesApiExtra";
import { actualizarUsuarioApi, quitarFotoUsuarioApi, subirFotoUsuarioApi } from "../api/usuariosApi";
import { mensajeError, normalizarError } from "../utils/errorApi";

// --- Datos de la cuenta (los pide App.jsx al tener sesión) ---
export const fetchUsuario = createAsyncThunk("auth/fetchusuario", async (id) => traerUsuarioApi(id));

export const fetchMarks = createAsyncThunk("auth/fetchmarks", async (idUsuario) => ({
  idUsuario,
  ids: await listarMarcapaginasApi(),
}));

export const fetchDirecciones = createAsyncThunk("auth/fetchdirecciones", async (user) => ({
  idUsuario: user.id,
  lista: await servicioDirecciones.listar(user),
}));

// --- Sesión. Los thunks devuelven { user }, { verif } o { error, tipo, campos } para que el formulario muestre el error ---
export const login = createAsyncThunk("auth/login", async ({ ident, contrasena }) => {
  try {
    return { user: await loginApi(ident, contrasena) };
  } catch (err) {
    const info = normalizarError(err, "login");
    if (info.tipo !== "CUENTA_NO_CONFIRMADA") return { error: info.mensaje, tipo: info.tipo, campos: info.campos };
    await reenviarCodigoApi(ident.trim()).catch(() => {});
    return { verif: { email: ident.trim(), nombre: "", nota: "Tu cuenta todavía no está confirmada. Te mandamos un código nuevo." } };
  }
});

export const registrar = createAsyncThunk("auth/registrar", async (valores) => {
  try {
    const cuenta = await registrarApi(valores);
    return { verif: { email: cuenta.email, nombre: cuenta.nombre || "", nota: "Te creamos la cuenta. Falta un paso: confirmá tu e-mail." } };
  } catch (err) {
    const info = normalizarError(err, "registro");
    return { error: info.mensaje, tipo: info.tipo, campos: info.campos };
  }
});

export const logout = createAsyncThunk("auth/logout", async () => {
  cerrarSesionApi();
});

// --- Confirmación del e-mail ---
export const confirmarEmail = createAsyncThunk("auth/confirmaremail", async ({ id, codigo }) => {
  try {
    return { user: await verificarEmailApi(id, codigo) };
  } catch (err) {
    const info = normalizarError(err, "verificacion");
    return { error: info.mensaje, tipo: info.tipo, campos: info.campos };
  }
});

export const reenviarCodigo = createAsyncThunk("auth/reenviarcodigo", async (id) => {
  try {
    await reenviarCodigoApi(id);
    return {};
  } catch (err) {
    const info = normalizarError(err, "verificacion");
    return { error: info.mensaje, tipo: info.tipo };
  }
});

// --- Perfil ---
export const guardarPerfil = createAsyncThunk("auth/guardarperfil", async ({ valores: v, nuevoPerfil, user }) => {
  const cambios = { nombre: v.nombre.trim(), apellido: v.apellido.trim(), nombreUsuario: v.nombreUsuario, email: v.email.trim() };
  if (v.contrasena) { cambios.contrasena = v.contrasena; cambios.contrasenaActual = v.contrasenaActual; }
  const fotoNueva = typeof nuevoPerfil.foto === "string" && nuevoPerfil.foto.startsWith("data:");
  const avatar = nuevoPerfil.foto ? "" : nuevoPerfil.avatar || "";
  if (avatar !== (user.avatar || "")) cambios.avatar = avatar;
  try {
    if (fotoNueva) await subirFotoUsuarioApi(user.id, await dataUrlAFile(nuevoPerfil.foto, "perfil"));
    else if (!nuevoPerfil.foto && user.tieneFoto) await quitarFotoUsuarioApi(user.id);
    const nuevo = await actualizarUsuarioApi(user.id, cambios);
    if (nuevo.email !== user.email) cerrarSesionApi(); // cambió el e-mail: tiene que volver a ingresar
    return { user: nuevo, sesionCerrada: nuevo.email !== user.email };
  } catch (err) {
    throw new Error(mensajeError(err, "registro"));
  }
});

// --- Direcciones: el servicio devuelve la lista que queda ---
export const crearDireccion = createAsyncThunk("auth/creardireccion", async ({ user, direccion }) => {
  try {
    return await servicioDirecciones.crear(user, direccion);
  } catch (err) {
    throw new Error(mensajeError(err));
  }
});

export const eliminarDireccion = createAsyncThunk("auth/eliminardireccion", async ({ user, id }) => {
  try {
    return await servicioDirecciones.eliminar(user, id);
  } catch (err) {
    throw new Error(mensajeError(err));
  }
});

export const marcarPrincipal = createAsyncThunk("auth/marcarprincipal", async ({ user, id }) => {
  try {
    return await servicioDirecciones.marcarPrincipal(user, id);
  } catch (err) {
    throw new Error(mensajeError(err));
  }
});

// --- Marcapáginas: el slice actualiza la lista al instante (pending) y la revierte si el back falla (rejected) ---
export const toggleMark = createAsyncThunk("auth/togglemark", async ({ id, estaba }) => {
  try {
    await (estaba ? quitarMarcapaginaApi(id) : agregarMarcapaginaApi(id));
  } catch (err) {
    throw new Error(mensajeError(err));
  }
});

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
    const abrirVerificacion = (state, verif) => {
      state.verif = { id: verif.email, nota: verif.nota, cuenta: { email: verif.email, nombre: verif.nombre } };
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
        if (action.payload.user) entrar(state, action.payload.user);
        if (action.payload.verif) abrirVerificacion(state, action.payload.verif);
      })
      .addCase(registrar.fulfilled, (state, action) => {
        if (action.payload.verif) abrirVerificacion(state, action.payload.verif);
      })
      .addCase(logout.fulfilled, (state) => {
        salir(state);
      })
      .addCase(confirmarEmail.fulfilled, (state, action) => {
        if (action.payload.user) {
          state.verif = null;
          entrar(state, action.payload.user);
        }
      })
      .addCase(reenviarCodigo.fulfilled, (state, action) => {
        if (!action.payload.error && state.verif) state.verif.nota = "Te enviamos un código nuevo.";
      })
      .addCase(guardarPerfil.fulfilled, (state, action) => {
        if (action.payload.sesionCerrada) salir(state);
        else state.user = action.payload.user;
      })
      .addCase(crearDireccion.fulfilled, (state, action) => {
        state.direcciones = action.payload;
      })
      .addCase(crearDireccion.rejected, (state, action) => {
        state.error = action.error.message;
      })
      .addCase(eliminarDireccion.fulfilled, (state, action) => {
        state.direcciones = action.payload;
      })
      .addCase(eliminarDireccion.rejected, (state, action) => {
        state.error = action.error.message;
      })
      .addCase(marcarPrincipal.fulfilled, (state, action) => {
        state.direcciones = action.payload;
      })
      .addCase(marcarPrincipal.rejected, (state, action) => {
        state.error = action.error.message;
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