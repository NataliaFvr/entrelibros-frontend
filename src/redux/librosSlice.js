import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { aLibroFront, dataUrlAFile } from "../api/adaptadores";
import { moderar } from "./moderacionSlice";
import { cambiarRol, darDeBajaUsuario, reactivarUsuario } from "./userSlice";
import { cambiarEstadoLibro, editarLibro } from "./vendedorSlice";
import { cancelarVenta } from "./ventasSlice";
import { crearPedido, cancelarPedido } from "./pedidosSlice";
import api from "../api/axiosConfig";
import {
  crearCategoriaApi, darDeBajaCategoriaApi, listarCategoriasApi, listarCategoriasTodasApi, quitarImagenCategoriaApi,
  reactivarCategoriaApi, renombrarCategoriaApi, subirImagenCategoriaApi,
} from "../api/categoriasApi";
import { getCatalogoApi, getFiltrosDisponiblesApi, getImagenesApi, getLibroApi } from "../api/librosApi";
import { FILTROS_INICIALES } from "../utils/filtrarLibros";
import { norm } from "../utils/format";

const URL = "/libros";

const limpiar = (nombre) => nombre.trim().replace(/\s+/g, " ");
const esFotoNueva = (imagen) => typeof imagen === "string" && imagen.startsWith("data:");
const existe = (todas, nombre, excepto = "") => todas.some((c) => c.nombre !== excepto && norm(c.nombre) === norm(nombre));

export const fetchLibros = createAsyncThunk("libros/fetchLibros", async () => {
  const { data } = await api.get(URL, { params: { sort: "bestsellers", page: 0, size: 100 } });
  return data.content.map(aLibroFront);
});

// Un libro que no está en el catálogo (por ejemplo, agotado): null si no existe
export const fetchLibro = createAsyncThunk("libros/fetchLibro", async (id) => getLibroApi(id));

// Todas las fotos de un libro, para la galería de la ficha (el catálogo solo trae la portada)
export const fetchFotos = createAsyncThunk("libros/fetchFotos", async (id) => getImagenesApi(id));

export const fetchCategorias = createAsyncThunk("libros/fetchCategorias", async () => listarCategoriasApi());

export const fetchCategoriasAdmin = createAsyncThunk("libros/fetchCategoriasAdmin", async () => listarCategoriasTodasApi(), {
  condition: (_, { getState }) => !getState().libros.categorias.cargandoTodas,
});

export const crearCategoria = createAsyncThunk("libros/crearCategoria", async ({ nombre, imagen = "" }, { getState }) => {
  const limpio = limpiar(nombre);
  if (existe(getState().libros.categorias.todas, limpio)) throw new Error("Esa categoría ya existe.");
  const creada = await crearCategoriaApi(limpio);
  if (!esFotoNueva(imagen)) return { categoria: creada, aviso: "" };
  const aviso = await subirImagenCategoriaApi(creada.id, await dataUrlAFile(imagen, "categoria"))
    .then(() => "")
    .catch((err) => `La categoría se creó, pero no pudimos subir la imagen: ${err.message} Editala para volver a intentarlo.`);
  return { categoria: { ...creada, tieneImagen: !aviso }, aviso };
});

export const editarCategoria = createAsyncThunk("libros/editarCategoria", async ({ actual, nombre, imagen }, { getState }) => {
  const { todas } = getState().libros.categorias;
  const limpio = limpiar(nombre);
  if (existe(todas, limpio, actual)) throw new Error("Ya hay otra categoría con ese nombre.");
  const cat = todas.find((c) => c.nombre === actual);
  if (!cat) throw new Error("No encontramos esa categoría.");
  let tieneImagen = cat.tieneImagen;
  if (limpio !== actual) await renombrarCategoriaApi(cat.id, limpio);
  if (esFotoNueva(imagen)) {
    await subirImagenCategoriaApi(cat.id, await dataUrlAFile(imagen, "categoria"));
    tieneImagen = true;
  } else if (!imagen && cat.tieneImagen) {
    await quitarImagenCategoriaApi(cat.id);
    tieneImagen = false;
  }
  return { ...cat, nombre: limpio, tieneImagen };
});

export const cambiarEstadoCategoria = createAsyncThunk("libros/cambiarEstadoCategoria", async ({ nombre, activa }, { getState }) => {
  const cat = getState().libros.categorias.todas.find((c) => c.nombre === nombre);
  if (!cat) throw new Error("No encontramos esa categoría.");
  return activa ? reactivarCategoriaApi(cat.id) : darDeBajaCategoriaApi(cat.id);
});

export const claveBusqueda = (f, provinciaComprador) => JSON.stringify({ f, provinciaComprador });

export const fetchFiltrosDisponibles = createAsyncThunk("libros/fetchFiltrosDisponibles", async () => getFiltrosDisponiblesApi(), {
  condition: (_, { getState }) => !getState().libros.catalogo.cargandoFiltros,
});

export const fetchPagina = createAsyncThunk(
  "libros/fetchPagina",
  async ({ f, provinciaComprador }, { getState }) => {
    const { categorias } = getState().libros;
    return getCatalogoApi(f, { categorias: categorias.items, filtros: getState().libros.catalogo.filtros || {}, provinciaComprador });
  },
  {
    condition: ({ clave }, { getState }) => {
      const { paginas, pendientes } = getState().libros.catalogo;
      return !paginas[clave] && !pendientes[clave];
    },
  },
);

const olvidarBusquedas = (state) => {
  state.catalogo.paginas = {};
};

const guardarCategoria = (state, categoria) => {
  const i = state.categorias.todas.findIndex((c) => c.id === categoria.id);
  if (i !== -1) state.categorias.todas[i] = categoria;
  else state.categorias.todas.push(categoria);
  state.categorias.items = state.categorias.items.filter((c) => c.id !== categoria.id);
  if (categoria.activa) state.categorias.items.push(categoria);
};

const librosSlice = createSlice({
  name: "libros",
  initialState: {
    items: [],
    categorias: {
      items: [],
      todas: [],
      todasCargadas: false,
      cargandoTodas: false,
      loading: true,
      error: null,
    },
    sueltos: {},
    fotos: {},
    loading: true,
    error: null,
    filtrosElegidos: { ...FILTROS_INICIALES },
    catalogo: {
      filtros: null,
      cargandoFiltros: false,
      paginas: {},
      pendientes: {},
      errores: {},
    },
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
      .addCase(fetchCategorias.pending, (state) => {
        state.categorias.loading = true;
        state.categorias.error = null;
      })
      .addCase(fetchCategorias.fulfilled, (state, action) => {
        state.categorias.loading = false;
        state.categorias.items = action.payload;
      })
      .addCase(fetchCategorias.rejected, (state, action) => {
        state.categorias.loading = false;
        state.categorias.error = action.error.message;
      })
      .addCase(fetchCategoriasAdmin.pending, (state) => {
        state.categorias.cargandoTodas = true;
      })
      .addCase(fetchCategoriasAdmin.fulfilled, (state, action) => {
        state.categorias.cargandoTodas = false;
        state.categorias.todas = action.payload;
        state.categorias.todasCargadas = true;
      })
      .addCase(fetchCategoriasAdmin.rejected, (state) => {
        state.categorias.cargandoTodas = false;
      })
      .addCase(crearCategoria.fulfilled, (state, action) => {
        guardarCategoria(state, action.payload.categoria);
      })
      .addCase(editarCategoria.fulfilled, (state, action) => {
        guardarCategoria(state, action.payload);
        const { actual } = action.meta.arg;
        const nuevo = action.payload.nombre;
        state.items.forEach((l) => {
          l.cats = l.cats.map((c) => (c === actual ? nuevo : c));
          if (l.cat === actual) l.cat = nuevo;
        });
        olvidarBusquedas(state);
      })
      .addCase(cambiarEstadoCategoria.fulfilled, (state, action) => {
        guardarCategoria(state, action.payload);
        olvidarBusquedas(state);
      })
      .addCase(fetchFiltrosDisponibles.pending, (state) => {
        state.catalogo.cargandoFiltros = true;
      })
      .addCase(fetchFiltrosDisponibles.fulfilled, (state, action) => {
        state.catalogo.cargandoFiltros = false;
        state.catalogo.filtros = action.payload;
      })
      .addCase(fetchFiltrosDisponibles.rejected, (state) => {
        state.catalogo.cargandoFiltros = false;
        state.catalogo.filtros = {};
      })
      .addCase(fetchPagina.pending, (state, action) => {
        const { clave } = action.meta.arg;
        state.catalogo.pendientes[clave] = true;
        delete state.catalogo.errores[clave];
      })
      .addCase(fetchPagina.fulfilled, (state, action) => {
        const { clave } = action.meta.arg;
        delete state.catalogo.pendientes[clave];
        state.catalogo.paginas[clave] = action.payload;
      })
      .addCase(fetchPagina.rejected, (state, action) => {
        const { clave } = action.meta.arg;
        delete state.catalogo.pendientes[clave];
        state.catalogo.errores[clave] = action.error.message;
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