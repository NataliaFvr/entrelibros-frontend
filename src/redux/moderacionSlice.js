import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { aLibroFront } from "../api/adaptadores";
import { fuenteModeracion } from "../api/moderacionApi";

export const POR_PAGINA_HISTORIAL = 10;

export const fetchSolicitudes = createAsyncThunk("moderacion/fetchSolicitudes", async () => fuenteModeracion.obtenerSolicitudes(), {
  condition: (_, { getState }) => !getState().moderacion.loading,
});

// `accion` = { aprobado: true } o { aprobado: false, motivoRechazo }. Devuelve el libro como quedó.
export const moderar = createAsyncThunk("moderacion/moderar", async ({ id, accion }) =>
  aLibroFront(await fuenteModeracion.moderarSolicitud(id, accion)));

export const fetchHistorial = createAsyncThunk(
  "moderacion/fetchHistorial",
  async ({ idLibro, pagina }) => {
    const datos = idLibro == null
      ? await fuenteModeracion.obtenerHistorial(pagina - 1, POR_PAGINA_HISTORIAL)
      : await fuenteModeracion.obtenerHistorialDeLibro(idLibro, pagina - 1, POR_PAGINA_HISTORIAL);
    return {
      registros: datos.content || [],
      total: datos.totalElements || 0,
      paginas: Math.max(1, datos.totalPages || 1),
    };
  },
  {
    condition: ({ idLibro, pagina }, { getState }) => {
      const state = getState().moderacion;
      const key = `${idLibro ?? "todo"}:${pagina}`;
      return !state.pendientesHistorial[key] && !state.historial[key] && !state.erroresHistorial[key];
    },
  },
);

const moderacionSlice = createSlice({
  name: "moderacion",
  initialState: {
    items: [],
    cargadas: false,
    loading: false,
    error: null,
    historial: {},
    pendientesHistorial: {},
    erroresHistorial: {},
  },
  reducers: {
    limpiarErrorHistorial: (state, action) => {
      delete state.erroresHistorial[action.payload];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchSolicitudes.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSolicitudes.fulfilled, (state, action) => {
        state.loading = false;
        state.cargadas = true;
        state.items = action.payload;
      })
      .addCase(fetchSolicitudes.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(moderar.fulfilled, (state, action) => {
        state.items = state.items.filter((s) => s.id !== action.meta.arg.id);
        state.historial = {};
      })
      .addCase(fetchHistorial.pending, (state, action) => {
        const { idLibro, pagina } = action.meta.arg;
        state.pendientesHistorial[`${idLibro ?? "todo"}:${pagina}`] = true;
      })
      .addCase(fetchHistorial.fulfilled, (state, action) => {
        const { idLibro, pagina } = action.meta.arg;
        const key = `${idLibro ?? "todo"}:${pagina}`;
        state.historial[key] = action.payload;
        delete state.pendientesHistorial[key];
        delete state.erroresHistorial[key];
      })
      .addCase(fetchHistorial.rejected, (state, action) => {
        if (action.meta.condition) return;
        const { idLibro, pagina } = action.meta.arg;
        const key = `${idLibro ?? "todo"}:${pagina}`;
        delete state.pendientesHistorial[key];
        state.erroresHistorial[key] = action.error.message;
      });
  },
});

export const { limpiarErrorHistorial } = moderacionSlice.actions;
export default moderacionSlice.reducer;
