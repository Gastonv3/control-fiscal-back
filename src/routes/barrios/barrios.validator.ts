import { ValidationChain, body, check, query } from "express-validator";

export default class BarrioValidator {
  public static listar(): ValidationChain[] {
    return [
      check(["id_barrio", "offset", "limit"])
        .optional()
        .isInt()
        .withMessage("Debe ser un número entero")
        .toInt(),
      check(["nombre"])
        .optional()
        .isString()
        .withMessage("Debe ser una cadena de texto")
        .trim(),
      check("order")
        .optional()
        .isIn(["asc", "desc"])
        .withMessage("El orden debe ser 'asc' o 'desc'"),
      check("sort")
        .optional()
        .isString()
        .withMessage("Debe ser una cadena de texto")
        .trim(),
    ];
  }
}
