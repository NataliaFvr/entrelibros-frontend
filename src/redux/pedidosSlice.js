import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { cancelarOrdenApi, checkoutApi, crearPagoApi, listarPedidosApi } from "../api/comprasApi";
import { logout } from "./userSlice";

// Cada orden ya incluye sus ítems. El número de pedido (`n`) es el id de la orden.
export const fetchPedidos = createAsyncThunk("pedidos/fetchPedidos", async (idUsuario) => {
  if (idUsuario == null) return []; // sin sesión (o admin): sin pedidos
  return listarPedidosApi();
}, {
  condition: (idUsuario, { getState }) => !getState().pedidos.solicitudes[idUsuario],
});

// POST /carrito/checkout: convierte el carrito en un pedido PENDIENTE (reserva 1 h) y devuelve la orden
export const crearPedido = createAsyncThunk("pedidos/crearPedido", async (direccion) => {
  return checkoutApi({ idDireccion: direccion.id, provincia: direccion.prov });
});

// POST /pagos {idOrden, proveedor}: devuelve { resultado, orden, … } (el back hoy aprueba siempre: SIMULADO_APROBADO)
export const pagarPedido = createAsyncThunk("pedidos/pagarPedido", async ({ n, proveedor }) => {
  return crearPagoApi(Number(n), proveedor);
});

export const cancelarPedido = createAsyncThunk("pedidos/cancelarPedido", async (n) => {
  return cancelarOrdenApi(Number(n));
});

const initialState = {
  items: [],
  solicitudes: {},
  usuarioSolicitado: null,
  loading: false,
  error: null,
};

const pedidosSlice = createSlice({
  name: "pedidos",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(logout.fulfilled, () => initialState)
      .addCase(fetchPedidos.pending, (state, action) => {
        state.solicitudes[action.meta.arg] = true;
        state.usuarioSolicitado = action.meta.arg;
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPedidos.fulfilled, (state, action) => {
        delete state.solicitudes[action.meta.arg];
        if (state.usuarioSolicitado === action.meta.arg) {
          state.loading = false;
          state.items = action.payload;
        }
      })
      .addCase(fetchPedidos.rejected, (state, action) => {
        delete state.solicitudes[action.meta.arg];
        if (state.usuarioSolicitado === action.meta.arg) {
          state.loading = false;
          state.error = action.error.message;
        }
      })
      .addCase(crearPedido.fulfilled, (state, action) => {
        state.items = [action.payload, ...state.items]; // la orden nueva va primero
      })
      .addCase(crearPedido.rejected, (state, action) => {
        state.error = action.error.message;
      })
      .addCase(pagarPedido.fulfilled, (state, action) => {
        state.items = state.items.map((p) => (p.n === action.payload.orden.n ? action.payload.orden : p));
      })
      .addCase(pagarPedido.rejected, (state, action) => {
        state.error = action.error.message;
      })
      .addCase(cancelarPedido.fulfilled, (state, action) => {
        state.items = state.items.map((p) => (p.n === action.payload.n ? action.payload : p));
      })
      .addCase(cancelarPedido.rejected, (state, action) => {
        state.error = action.error.message;
      });
  },
});

export default pedidosSlice.reducer;
