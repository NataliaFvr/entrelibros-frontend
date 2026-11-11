import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { aUsuarioFront } from "../api/adaptadores";
import {
  actualizarUsuarioApi, cambiarRolApi, crearUsuarioApi, darDeBajaUsuarioApi, listarUsuariosApi, reactivarUsuarioApi,
  resolverSolicitudApi,
} from "../api/usuariosApi";
import { guardarPerfil } from "./authSlice";

const aFila = (u) => ({ ...u, quiereVender: u.estadoSolicitud === "PENDIENTE" });

// `condition`: si ya hay un pedido en camino, no se hace otro
export const fetchUsuarios = createAsyncThunk("usuarios/fetchusuarios", async () => listarUsuariosApi(), {
  condition: (_, { getState }) => !getState().usuarios.loading,
});

export const crearUsuario = createAsyncThunk("usuarios/crearusuario", async (v) => {
  if (!["COMPRADOR", "VENDEDOR"].includes(v.rol)) throw new Error("Desde el panel solo se pueden crear compradores o vendedores.");
  return crearUsuarioApi(v);
});

export const editarUsuario = createAsyncThunk("usuarios/editarusuario", async ({ id, cambios }) => actualizarUsuarioApi(id, cambios));

export const cambiarRol = createAsyncThunk("usuarios/cambiarrol", async ({ id, rol, datosVendedor }) =>
  aUsuarioFront(await cambiarRolApi(id, rol, datosVendedor)));

export const darDeBajaUsuario = createAsyncThunk("usuarios/dardebajausuario", async (id) => aUsuarioFront(await darDeBajaUsuarioApi(id)));

export const reactivarUsuario = createAsyncThunk("usuarios/reactivarusuario", async (id) => aUsuarioFront(await reactivarUsuarioApi(id)));

export const resolverSolicitud = createAsyncThunk("usuarios/resolversolicitud", async ({ id, aprobada, comentario }) =>
  aUsuarioFront(await resolverSolicitudApi(id, aprobada, comentario)));

const reemplazar = (state, action) => {
  const index = state.items.findIndex((u) => u.id === action.payload.id);
  if (index !== -1) state.items[index] = aFila(action.payload);
};

const usuariosSlice = createSlice({
  name: "usuarios",
  initialState: {
    items: [],
    cargados: false,
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsuarios.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUsuarios.fulfilled, (state, action) => {
        state.loading = false;
        state.cargados = true;
        state.items = action.payload.map(aFila);
      })
      .addCase(fetchUsuarios.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(crearUsuario.fulfilled, (state, action) => {
        state.items.push(aFila(action.payload));
      })
      .addCase(editarUsuario.fulfilled, reemplazar)
      .addCase(cambiarRol.fulfilled, reemplazar)
      .addCase(darDeBajaUsuario.fulfilled, reemplazar)
      .addCase(reactivarUsuario.fulfilled, reemplazar)
      .addCase(resolverSolicitud.fulfilled, reemplazar)
      .addCase(guardarPerfil.fulfilled, (state, action) => {
        reemplazar(state, { payload: action.payload.user });
      });
  },
});

export default usuariosSlice.reducer;
