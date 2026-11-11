import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { aLibroFront, publicacionAFront } from "../api/adaptadores";
import { idsDeCategorias } from "../api/categoriasApi";
import { guardarFotosApi } from "../api/fotosLibro";
import { crearLibroApi, darDeBajaApi, getImagenesApi, reactivarApi } from "../api/librosApi";
import { modificarLibro } from "../api/moderacionApiExtra";
import { traerPublicaciones } from "../api/publicacionesApi";
import { solicitarVendedorApi } from "../api/usuariosApi";
import { categoriasDe } from "../utils/libro";
import { aLibroRequest } from "../utils/libroRequest";
import { cancelarVenta } from "./ventasSlice";

// Libros del vendedor ("Mis libros") en el formato del panel: { id, t, a, …, imgs, estado: 'activo' | 'baja',
// mod: 'EN_REVISION' | 'ACEPTADO' | 'RECHAZADO', revision? }. Cada acción devuelve el libro como quedó en el back
// y el slice lo reemplaza en la lista: después de guardar no se vuelve a pedir nada.

// `idUsuario` queda guardado para saber de qué cuenta son los libros (si se cambia de cuenta, se vuelven a pedir)
export const fetchMisLibros = createAsyncThunk("vendedor/fetchmislibros", async () => traerPublicaciones(), {
  condition: (_, { getState }) => !getState().vendedor.loading,
});

// GET /imagenes-libro/libro/{id}: todas las fotos de un libro, en orden (solo hacen falta para editarlo)
export const fetchFotosLibro = createAsyncThunk("vendedor/fetchfotoslibro", async (id) => getImagenesApi(id));

// POST /libros (queda EN_REVISION) y después las fotos. Si las fotos fallan, el libro igual quedó creado: se avisa aparte.
export const publicarLibro = createAsyncThunk("vendedor/publicarlibro", async (datos) => {
  const creado = await crearLibroApi(aLibroRequest(datos, await idsDeCategorias(categoriasDe(datos))));
  const { imgs, aviso } = await guardarFotosApi(creado.id, datos.imgs);
  // La fila nueva sale de lo que devolvió el back (precio final incluido), no del formulario
  return { pub: { ...datos, ...aLibroFront(creado), imgs, fotosCompletas: true, estado: "activo", mod: creado.estadoModeracion || "EN_REVISION" }, aviso };
});

// PATCH /libros/{id} con SOLO los datos que cambiaron (lo que no viaja, el back lo deja como estaba)
const soloCambios = (datos, actual) => {
  const nuevo = aLibroRequest(datos);
  const antes = aLibroRequest(actual);
  return Object.fromEntries(Object.entries(nuevo).filter(([campo, valor]) => String(valor ?? "") !== String(antes[campo] ?? "")));
};

export const editarLibro = createAsyncThunk("vendedor/editarlibro", async ({ datos, actual }) => {
  const pedido = soloCambios(datos, actual);
  // Las categorías viajan si cambiaron, o si el libro quedó de baja (por ejemplo, su categoría se dio de baja y elige otra)
  const nombres = categoriasDe(datos);
  if (nombres.join("|") !== categoriasDe(actual).join("|") || actual.estado === "baja") {
    const ids = await idsDeCategorias(nombres);
    if (ids.length) pedido.idCategorias = ids;
  }
  // Si solo cambiaron las fotos, no hace falta el PATCH
  const libro = Object.keys(pedido).length ? await modificarLibro(actual.id, pedido) : null;
  // Cambiar las fotos también manda el libro a revisión (lo decide el back al subirlas). Si son las mismas, no se pide nada.
  const mismasFotos = datos.imgs.join("|") === actual.imgs.join("|");
  const fotos = mismasFotos
    ? { imgs: actual.imgs, cambiaron: false, aviso: "" }
    : await guardarFotosApi(actual.id, datos.imgs, actual.imgs);
  const enviadoARevision = (libro ? libro.estadoModeracion === "EN_REVISION" : false) || fotos.cambiaron;
  // El back vuelve a publicar el libro si estaba de baja por quedarse sin categoría
  const estado = libro && libro.estadoPublicacion ? publicacionAFront(libro.estadoPublicacion) : actual.estado;
  const nuevos = { ...datos, imgs: fotos.imgs, fotosCompletas: true };
  let pub;
  if (!enviadoARevision) pub = { ...actual, ...nuevos, estado, modC: "" }; // el back ya aplicó los cambios
  else if ((actual.mod || "ACEPTADO") === "ACEPTADO") pub = { ...actual, revision: nuevos, estado, modC: "" }; // se conserva la versión aprobada
  else pub = { ...actual, ...nuevos, mod: "EN_REVISION", estado, modC: "" };
  return { pub, enviadoARevision, aviso: fotos.aviso, libro: libro ? aLibroFront(libro) : null };
});

// PATCH /libros/{id}/baja o /reactivar: devuelve el libro como quedó
export const cambiarEstadoLibro = createAsyncThunk("vendedor/cambiarestadolibro", async ({ id, activo }) =>
  aLibroFront(await (activo ? reactivarApi(id) : darDeBajaApi(id))));

// POST /usuarios/solicitud-vendedor: devuelve el usuario con la solicitud PENDIENTE (authSlice lo guarda en la sesión)
export const solicitarVendedor = createAsyncThunk("vendedor/solicitarvendedor", async (datos) => solicitarVendedorApi(datos));

const vendedorSlice = createSlice({
  name: "vendedor",
  initialState: {
    idUsuario: null,
    items: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchMisLibros.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMisLibros.fulfilled, (state, action) => {
        state.loading = false;
        state.idUsuario = action.meta.arg;
        state.items = action.payload;
      })
      .addCase(fetchMisLibros.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(fetchFotosLibro.fulfilled, (state, action) => {
        const libro = state.items.find((p) => p.id === action.meta.arg);
        if (libro) {
          libro.imgs = action.payload;
          libro.fotosCompletas = true;
        }
      })
      // Si no se pudieron traer, se edita con la portada (el formulario no queda esperando)
      .addCase(fetchFotosLibro.rejected, (state, action) => {
        const libro = state.items.find((p) => p.id === action.meta.arg);
        if (libro) libro.fotosCompletas = true;
      })
      .addCase(publicarLibro.fulfilled, (state, action) => {
        state.items.unshift(action.payload.pub); // el más nuevo, primero
      })
      .addCase(editarLibro.fulfilled, (state, action) => {
        const index = state.items.findIndex((p) => p.id === action.payload.pub.id);
        if (index !== -1) state.items[index] = action.payload.pub;
      })
      .addCase(cambiarEstadoLibro.fulfilled, (state, action) => {
        const index = state.items.findIndex((p) => p.id === action.meta.arg.id);
        if (index !== -1) state.items[index].estado = action.meta.arg.activo ? "activo" : "baja";
      })
      // Cancelar una venta devuelve esos libros al stock (la venta cancelada trae qué libros y cuántos)
      .addCase(cancelarVenta.fulfilled, (state, action) => {
        (action.payload.items || []).forEach((item) => {
          const libro = state.items.find((p) => p.id === item.idLibro);
          if (libro) libro.stock += item.cantidad;
        });
      });
  },
});

export default vendedorSlice.reducer;
