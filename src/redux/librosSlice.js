import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { aLibroFront } from "../api/adaptadores";
import { editarCategoria } from "./categoriasSlice";
import { moderar } from "./moderacionSlice";
import { cambiarRol, darDeBajaUsuario } from "./usuariosSlice";
import { reactivarUsuario } from "./usuariosSlice";
import { cambiarEstadoLibro, editarLibro } from "./vendedorSlice";
import { cancelarVenta } from "./ventasSlice";
import { crearPedido, cancelarPedido } from "./pedidosSlice";
import { cambiarEstadoCategoria } from "./categoriasSlice";
import api from "../api/axiosConfig";
import { getCatalogoApi, getFiltrosDisponiblesApi, getImagenesApi, getLibroApi } from "../api/librosApi";
import { FILTROS_INICIALES } from "../utils/filtrarLibros";

const URL = "/libros";

export const fetchLibros = createAsyncThunk("libros/fetchlibros", async () => {
  const { data } = await api.get(URL, { params: { sort: "bestsellers", page: 0, size: 100 } });
  return data.content.map(aLibroFront);
});

// Un libro que no está en el catálogo (por ejemplo, agotado): null si no existe
export const fetchLibro = createAsyncThunk("libros/fetchlibro", async (id) => getLibroApi(id));

// Todas las fotos de un libro, para la galería de la ficha (el catálogo solo trae la portada)
export const fetchFotos = createAsyncThunk("libros/fetchfotos", async (id) => getImagenesApi(id));

export const claveBusqueda = (f, provinciaComprador) => JSON.stringify({ f, provinciaComprador });

export const fetchFiltrosDisponibles = createAsyncThunk("libros/fetchfiltrosdisponibles", async () => getFiltrosDisponiblesApi(), {
  condition: (_, { getState }) => !getState().libros.cargandoFiltros,
});

export const fetchPagina = createAsyncThunk(
  "libros/fetchpagina",
  async ({ f, provinciaComprador }, { getState }) => {
    const { categorias } = getState();
    return getCatalogoApi(f, { categorias: categorias.items, filtros: getState().libros.filtros || {}, provinciaComprador });
  },
  {
    condition: ({ clave }, { getState }) => {
      const { paginas, pendientes } = getState().libros;
      return !paginas[clave] && !pendientes[clave];
    },
  },
);

const olvidarBusquedas = (state) => {
  state.paginas = {};
};

const librosSlice = createSlice({
  name: "libros",
  initialState: {
    items: [],
    sueltos: {},
    fotos: {},
    loading: true,
    error: null,
    filtrosElegidos: { ...FILTROS_INICIALES },
    filtros: null,
    cargandoFiltros: false,
    paginas: {},
    pendientes: {},
    errores: {},
  },
  reducers: {
    setFiltros: (state, action) => {
      state.filtrosElegidos = { ...state.filtrosElegidos, ...action.payload, page: 1 };
    },
    setPagina: (state, action) => {
      state.filtrosElegidos.page = action.payload;
    },
    toggleFiltro: (state, action) => {
      const { clave, valor } = action.payload;
      const actual = state.filtrosElegidos[clave];
      state.filtrosElegidos[clave] = actual.includes(valor)
        ? actual.filter((x) => x !== valor)
        : [...actual, valor];
      state.filtrosElegidos.page = 1;
    },
    limpiarFiltros: (state, action) => {
      const { min, max } = action.payload;
      state.filtrosElegidos = {
        ...FILTROS_INICIALES,
        cats: [],
        envios: [],
        min,
        max,
        sort: state.filtrosElegidos.sort,
      };
    },
    reiniciarFiltros: (state, action) => {
      state.filtrosElegidos = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchLibros.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchLibros.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchLibros.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(fetchLibro.fulfilled, (state, action) => {
        state.sueltos[action.meta.arg] = action.payload;
      })
      .addCase(fetchLibro.rejected, (state, action) => {
        state.sueltos[action.meta.arg] = null;
      })
      .addCase(fetchFotos.fulfilled, (state, action) => {
        state.fotos[action.meta.arg] = action.payload;
      })
      .addCase(fetchFotos.rejected, (state, action) => {
        state.fotos[action.meta.arg] = [];
      })
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
      // Lo que hace el vendedor se refleja en el catálogo con la respuesta del back, sin volver a pedir todos los libros
      .addCase(cambiarEstadoLibro.fulfilled, (state, action) => {
        state.items = state.items.filter((l) => l.id !== action.payload.id);
        if (action.meta.arg.activo && action.payload.estadoModeracion === "ACEPTADO") state.items.push(action.payload);
        olvidarBusquedas(state);
      })
      .addCase(editarLibro.fulfilled, (state, action) => {
        olvidarBusquedas(state);
        const { pub, enviadoARevision, libro } = action.payload;
        const index = state.items.findIndex((l) => l.id === pub.id);
        if (index === -1) return;
        if (enviadoARevision) state.items.splice(index, 1); // no se ve en el catálogo hasta que el admin lo apruebe
        else if (libro) state.items[index] = { ...libro, imgs: pub.imgs.slice(0, 1) };
      })
      .addCase(editarCategoria.fulfilled, (state, action) => {
        const { actual } = action.meta.arg;
        const nuevo = action.payload.nombre;
        state.items.forEach((l) => {
          l.cats = l.cats.map((c) => (c === actual ? nuevo : c));
          if (l.cat === actual) l.cat = nuevo;
        });
        olvidarBusquedas(state);
      })
      .addCase(cambiarEstadoCategoria.fulfilled, olvidarBusquedas)
      .addCase(crearPedido.fulfilled, olvidarBusquedas)
      .addCase(cancelarPedido.fulfilled, olvidarBusquedas)
      .addCase(reactivarUsuario.fulfilled, olvidarBusquedas)
      // Un libro aprobado aparece en el catálogo con la respuesta del back
      .addCase(moderar.fulfilled, (state, action) => {
        olvidarBusquedas(state);
        if (!action.meta.arg.accion.aprobado || action.payload.estadoPublicacion !== "ACTIVA") return;
        const index = state.items.findIndex((l) => l.id === action.payload.id);
        if (index !== -1) state.items[index] = action.payload;
        else state.items.push(action.payload);
      })
      // El back da de baja los libros del vendedor que se da de baja o deja de ser vendedor
      .addCase(darDeBajaUsuario.fulfilled, (state, action) => {
        state.items = state.items.filter((l) => l.vId !== action.payload.id);
        olvidarBusquedas(state);
      })
      .addCase(cambiarRol.fulfilled, (state, action) => {
        olvidarBusquedas(state);
        if (action.payload.rol !== "VENDEDOR") {
          state.items = state.items.filter((l) => l.vId !== action.payload.id);
        }
      })
      .addCase(cancelarVenta.fulfilled, (state, action) => {
        (action.payload.items || []).forEach((item) => {
          const libro = state.items.find((l) => l.id === item.idLibro);
          if (libro) libro.stock += item.cantidad;
        });
        olvidarBusquedas(state);
      });
  },
});

export const { setFiltros, setPagina, toggleFiltro, limpiarFiltros, reiniciarFiltros } = librosSlice.actions;
export default librosSlice.reducer;