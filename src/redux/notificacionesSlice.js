import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  cantidadNoLeidasApi, eliminarNotificacionApi, listarNotificacionesApi, marcarLeidaApi, marcarTodasLeidasApi,
} from "../api/cuentaApi";
import { logout } from "./userSlice";
import { removeById, replaceById } from "./helpers";

export const POR_PAGINA = 20;

// Las 20 más nuevas y la cantidad de no leídas. `idUsuario` = de qué cuenta son.
export const fetchNotificaciones = createAsyncThunk(
  "notificaciones/fetchNotificaciones",
  async () => {
    const [pagina, noLeidas] = await Promise.all([listarNotificacionesApi(POR_PAGINA), cantidadNoLeidasApi()]);
    return { ...pagina, noLeidas };
  },
  { condition: (_, { getState }) => !getState().notificaciones.loading },
);

// "Ver más": las que ya se ven + 20 más, y el número del globito actualizado.
export const cargarMasNotificaciones = createAsyncThunk(
  "notificaciones/cargarMasNotificaciones",
  async (_, { getState }) => {
    const tamanio = getState().notificaciones.items.length + POR_PAGINA;
    const [pagina, noLeidas] = await Promise.all([listarNotificacionesApi(tamanio), cantidadNoLeidasApi()]);
    return { ...pagina, noLeidas };
  },
  {
    condition: (_, { getState }) => {
      const { hayMas, cargandoMas, loading } = getState().notificaciones;
      return hayMas && !cargandoMas && !loading;
    },
  },
);

export const marcarLeida = createAsyncThunk("notificaciones/marcarLeida", async (id) => marcarLeidaApi(id));

export const descartarNotificacion = createAsyncThunk("notificaciones/descartarNotificacion", async (id) => {
  await eliminarNotificacionApi(id);
  return id;
});

export const marcarTodasLeidas = createAsyncThunk("notificaciones/marcarTodasLeidas", async () => marcarTodasLeidasApi());

const initialState = {
  idUsuario: null,
  items: [],
  noLeidas: 0,
  hayMas: false, // quedan notificaciones más viejas sin cargar
  cargandoMas: false,
  loading: false,
  error: null,
};

const notificacionesSlice = createSlice({
  name: "notificaciones",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(logout.fulfilled, () => initialState)
      .addCase(fetchNotificaciones.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchNotificaciones.fulfilled, (state, action) => {
        state.loading = false;
        state.idUsuario = action.meta.arg;
        state.items = action.payload.items;
        state.hayMas = action.payload.hayMas;
        state.noLeidas = action.payload.noLeidas;
      })
      .addCase(fetchNotificaciones.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(cargarMasNotificaciones.pending, (state) => {
        state.cargandoMas = true;
      })
      .addCase(cargarMasNotificaciones.fulfilled, (state, action) => {
        state.cargandoMas = false;
        state.items = action.payload.items;
        state.hayMas = action.payload.hayMas;
        state.noLeidas = action.payload.noLeidas;
      })
      .addCase(cargarMasNotificaciones.rejected, (state) => {
        state.cargandoMas = false;
      })
      .addCase(marcarLeida.fulfilled, (state, action) => {
        const index = state.items.findIndex((n) => n.id === action.meta.arg);
        if (index === -1) return;
        if (!state.items[index].leida) state.noLeidas = Math.max(0, state.noLeidas - 1);
        replaceById(state.items, action.payload);
      })
      .addCase(descartarNotificacion.fulfilled, (state, action) => {
        const notificacion = state.items.find((n) => n.id === action.payload);
        if (notificacion && !notificacion.leida) state.noLeidas = Math.max(0, state.noLeidas - 1);
        state.items = removeById(state.items, action.payload);
      })
      .addCase(marcarTodasLeidas.fulfilled, (state) => {
        state.items.forEach((n) => {
          n.leida = true;
        });
        state.noLeidas = 0;
      });
  },
});

export default notificacionesSlice.reducer;
