import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { getEstadisticasVendedorApi } from "../api/estadisticasApi";
import { cancelarVentaApi, listarVentasApi } from "../api/ventasApi";
import { logout } from "./userSlice";
import { replaceById } from "./helpers";

// Ventas del vendedor (OrdenVendedorResponse tal cual llega del back; useVentas las adapta para la pantalla)
// y sus estadísticas. `idUsuario` = de qué cuenta son (si se cambia de cuenta, se vuelven a pedir).

export const fetchVentas = createAsyncThunk("ventas/fetchVentas", async () => listarVentasApi(), {
  condition: (_, { getState }) => !getState().ventas.loading,
});

// PATCH /ordenes/vendedor/{id}/cancelar: devuelve la venta completa ya cancelada
export const cancelarVenta = createAsyncThunk("ventas/cancelarVenta", async (idOrdenVendedor) => cancelarVentaApi(idOrdenVendedor));

export const fetchEstadisticas = createAsyncThunk("ventas/fetchEstadisticas", async () => getEstadisticasVendedorApi());

const initialState = {
  idUsuario: null,
  items: [],
  loading: false,
  error: null,
  estadisticas: null,
  errorEstadisticas: null,
};

const ventasSlice = createSlice({
  name: "ventas",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(logout.fulfilled, () => initialState)
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
        replaceById(state.items, action.payload);
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
