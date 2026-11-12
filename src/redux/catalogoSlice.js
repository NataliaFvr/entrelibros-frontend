import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { getCatalogoApi, getFiltrosDisponiblesApi } from "../api/librosApi";
import { editarCategoria, cambiarEstadoCategoria } from "./categoriasSlice";
import { moderar } from "./moderacionSlice";
import { crearPedido, cancelarPedido } from "./pedidosSlice";
import { cambiarRol, darDeBajaUsuario, reactivarUsuario } from "./usuariosSlice";
import { cambiarEstadoLibro, editarLibro } from "./vendedorSlice";
import { cancelarVenta } from "./ventasSlice";

// Cada búsqueda (filtros + página + provincia) se guarda con su clave: volver a una ya vista no la pide de nuevo
export const claveBusqueda = (f, provinciaComprador) => JSON.stringify({ f, provinciaComprador });

export const fetchFiltrosDisponibles = createAsyncThunk("catalogo/fetchfiltrosdisponibles", async () => getFiltrosDisponiblesApi(), {
  condition: (_, { getState }) => !getState().catalogo.cargandoFiltros,
});

export const fetchPagina = createAsyncThunk(
  "catalogo/fetchpagina",
  async ({ f, provinciaComprador }, { getState }) => {
    const { categorias, catalogo } = getState();
    return getCatalogoApi(f, { categorias: categorias.items, filtros: catalogo.filtros || {}, provinciaComprador });
  },
  {
    condition: ({ clave }, { getState }) => {
      const { paginas, pendientes } = getState().catalogo;
      return !paginas[clave] && !pendientes[clave];
    },
  },
);

// Si cambia un libro (stock, baja, aprobación…), las búsquedas guardadas pueden haber quedado viejas
const olvidarBusquedas = (state) => {
  state.paginas = {};
};

const catalogoSlice = createSlice({
  name: "catalogo",
  initialState: {
    filtros: null,
    cargandoFiltros: false,
    paginas: {}, // clave -> { libros, total, pages }
    pendientes: {}, // clave -> true mientras se pide
    errores: {}, // clave -> mensaje
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchFiltrosDisponibles.pending, (state) => {
        state.cargandoFiltros = true;
      })
      .addCase(fetchFiltrosDisponibles.fulfilled, (state, action) => {
        state.cargandoFiltros = false;
        state.filtros = action.payload;
      })
      .addCase(fetchFiltrosDisponibles.rejected, (state) => {
        state.cargandoFiltros = false;
        state.filtros = {};
      })
      .addCase(fetchPagina.pending, (state, action) => {
        const { clave } = action.meta.arg;
        state.pendientes[clave] = true;
        delete state.errores[clave];
      })
      .addCase(fetchPagina.fulfilled, (state, action) => {
        const { clave } = action.meta.arg;
        delete state.pendientes[clave];
        state.paginas[clave] = action.payload;
      })
      .addCase(fetchPagina.rejected, (state, action) => {
        const { clave } = action.meta.arg;
        delete state.pendientes[clave];
        state.errores[clave] = action.error.message;
      })
      .addCase(cambiarEstadoLibro.fulfilled, olvidarBusquedas)
      .addCase(editarLibro.fulfilled, olvidarBusquedas)
      .addCase(moderar.fulfilled, olvidarBusquedas)
      .addCase(darDeBajaUsuario.fulfilled, olvidarBusquedas)
      .addCase(reactivarUsuario.fulfilled, olvidarBusquedas)
      .addCase(cambiarRol.fulfilled, olvidarBusquedas)
      .addCase(editarCategoria.fulfilled, olvidarBusquedas)
      .addCase(cambiarEstadoCategoria.fulfilled, olvidarBusquedas)
      .addCase(crearPedido.fulfilled, olvidarBusquedas)
      .addCase(cancelarPedido.fulfilled, olvidarBusquedas)
      .addCase(cancelarVenta.fulfilled, olvidarBusquedas);
  },
});

export default catalogoSlice.reducer;
