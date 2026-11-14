// En los formularios hace falta conservar el tipo y los errores por campo además del mensaje.
export const conDetalle = {
  serializeError: (err) => ({
    message: err.message,
    tipo: err.info ? err.info.tipo : undefined,
    campos: err.info ? err.info.campos : {},
  }),
};
