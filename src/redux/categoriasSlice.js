import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { dataUrlAFile } from "../api/adaptadores";
import {
  crearCategoriaApi, darDeBajaCategoriaApi, listarCategoriasApi, listarCategoriasTodasApi, quitarImagenCategoriaApi,
  reactivarCategoriaApi, renombrarCategoriaApi, subirImagenCategoriaApi,
} from "../api/categoriasApi";
import { norm } from "../utils/format";

const limpiar = (nombre) => nombre.trim().replace(/\s+/g, " ");
const esFotoNueva = (imagen) => typeof imagen === "string" && imagen.startsWith("data:");
const existe = (todas, nombre, excepto = "") => todas.some((c) => c.nombre !== excepto && norm(c.nombre) === norm(nombre));

// Activas: las que ve todo el mundo (catálogo, inicio, publicar)
export const fetchCategorias = createAsyncThunk("categorias/fetchcategorias", async () => listarCategoriasApi());

// Todas (activas y de baja): solo para el panel del admin
export const fetchCategoriasAdmin = createAsyncThunk("categorias/fetchcategoriasadmin", async () => listarCategoriasTodasApi(), {
  condition: (_, { getState }) => !getState().categorias.cargandoTodas,
});

// Si la categoría se crea pero la foto falla, no se corta: se devuelve el `aviso`
export const crearCategoria = createAsyncThunk("categorias/crearcategoria", async ({ nombre, imagen = "" }, { getState }) => {
  const limpio = limpiar(nombre);
  if (existe(getState().categorias.todas, limpio)) throw new Error("Esa categoría ya existe.");
  const creada = await crearCategoriaApi(limpio);
  if (!esFotoNueva(imagen)) return { categoria: creada, aviso: "" };
  const aviso = await subirImagenCategoriaApi(creada.id, await dataUrlAFile(imagen, "categoria"))
    .then(() => "")
    .catch((err) => `La categoría se creó, pero no pudimos subir la imagen: ${err.message} Editala para volver a intentarlo.`);
  return { categoria: { ...creada, tieneImagen: !aviso }, aviso };
});

export const editarCategoria = createAsyncThunk("categorias/editarcategoria", async ({ actual, nombre, imagen }, { getState }) => {
  const { todas } = getState().categorias;
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

export const cambiarEstadoCategoria = createAsyncThunk("categorias/cambiarestadocategoria", async ({ nombre, activa }, { getState }) => {
  const cat = getState().categorias.todas.find((c) => c.nombre === nombre);
  if (!cat) throw new Error("No encontramos esa categoría.");
  return activa ? reactivarCategoriaApi(cat.id) : darDeBajaCategoriaApi(cat.id);
});

// Deja la categoría igual en las dos listas (en la de activas, solo si está activa)
const guardar = (state, categoria) => {
  const i = state.todas.findIndex((c) => c.id === categoria.id);
  if (i !== -1) state.todas[i] = categoria;
  else state.todas.push(categoria);
  state.items = state.items.filter((c) => c.id !== categoria.id);
  if (categoria.activa) state.items.push(categoria);
};

const categoriasSlice = createSlice({
  name: "categorias",
  initialState: {
    items: [],
    todas: [],
    todasCargadas: false,
    cargandoTodas: false,
    loading: true,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCategorias.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCategorias.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchCategorias.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(fetchCategoriasAdmin.pending, (state) => {
        state.cargandoTodas = true;
      })
      .addCase(fetchCategoriasAdmin.fulfilled, (state, action) => {
        state.cargandoTodas = false;
        state.todas = action.payload;
        state.todasCargadas = true;
      })
      .addCase(fetchCategoriasAdmin.rejected, (state) => {
        state.cargandoTodas = false;
      })
      .addCase(crearCategoria.fulfilled, (state, action) => {
        guardar(state, action.payload.categoria);
      })
      .addCase(editarCategoria.fulfilled, (state, action) => {
        guardar(state, action.payload);
      })
      .addCase(cambiarEstadoCategoria.fulfilled, (state, action) => {
        guardar(state, action.payload);
      });
  },
});

export default categoriasSlice.reducer;
