import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { getEstadisticasVendedorApi } from "../api/estadisticasApi";
import { cancelarVentaApi, listarVentasApi } from "../api/ventasApi";

// Ventas del vendedor (OrdenVendedorResponse tal cual llega del back; useVentas las adapta para la pantalla)
// y sus estadísticas. `idUsuario` = de qué cuenta son (si se cambia de cuenta, se vuelven a pedir).

export const fetchVentas = createAsyncThunk("ventas/fetchventas", async () => listarVentasApi());

// PATCH /ordenes/vendedor/{id}/cancelar: devuelve la venta completa ya cancelada
export const cancelarVenta = createAsyncThunk("ventas/cancelarventa", async (idOrdenVendedor) => cancelarVentaApi(idOrdenVendedor));

export const fetchEstadisticas = createAsyncThunk("ventas/fetchestadisticas", async () => getEstadisticasVendedorApi());

const ventasSlice = createSlice({
  name: "ventas",
  initialState: {
    idUsuario: null,
    items: [],
    loading: false,
    error: null,
    estadisticas: null,
    errorEstadisticas: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchVentas.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchVentas.fulfilled, (state, action) => {
        state.loading = false;
        state.idUsuario = action.meta.arg;
        state.items = action.payload;
        state.estadisticas = null; // las de otra cuenta no sirven: se piden al abrir la pestaña
      })
      .addCase(fetchVentas.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(cancelarVenta.fulfilled, (state, action) => {
        const index = state.items.findIndex((v) => v.id === action.payload.id);
        if (index !== -1) state.items[index] = action.payload;
      })
      .addCase(fetchEstadisticas.pending, (state) => {
        state.errorEstadisticas = null;
      })
      .addCase(fetchEstadisticas.fulfilled, (state, action) => {
        state.estadisticas = action.payload;
      })
      .addCase(fetchEstadisticas.rejected, (state, action) => {
        state.errorEstadisticas = action.error.message;
      });
  },
});

export default ventasSlice.reducer;
