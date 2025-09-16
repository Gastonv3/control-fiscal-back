export const logValidationError = (path: string, errors: any[]) => {
  console.warn(`[VALIDATION ERROR] Ruta: ${path}`);
  errors.forEach((err) => {
    console.warn(` - Campo: ${err.path}, Mensaje: ${err.msg}`);
  });
};
