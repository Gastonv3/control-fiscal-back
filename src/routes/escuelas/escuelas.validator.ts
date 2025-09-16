import { body, check, ValidationChain } from "express-validator";

export default class EscuelasValidator {
  public static listar(): ValidationChain[] {
    return [
      check(["id_escuela", "numero", "offset", "limit"])
        .optional()
        .isInt()
        .withMessage("Debe ser un número entero")
        .toInt(),
      check("nombre_escuela", "not_exista")
        .optional()
        .isString()
        .withMessage("Debe ser una cadena")
        .trim(),
    ];
  }

  public static actualizarZona(): ValidationChain[] {
    return [
      body("id_zona")
        .notEmpty()
        .withMessage("El ID de la zona es requerido")
        .isInt()
        .withMessage("Debe ser un número entero")
        .toInt(),
      body("id_escuela")
        .notEmpty()
        .withMessage("El ID de la escuela es requerido")
        .isInt()
        .withMessage("Debe ser un número entero")
        .toInt(),
    ];
  }
}
