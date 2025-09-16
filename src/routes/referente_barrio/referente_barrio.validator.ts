import { ValidationChain, check, body } from "express-validator";

export default class ReferenteBarrioValidator {
  public static listar(): ValidationChain[] {
    return [
      check(["id_referente", "id_barrio", "offset", "limit"])
        .optional()
        .isInt()
        .withMessage("Debe ser un número entero")
        .toInt(),
      check("habilitada")
        .optional()
        .isIn(["S", "N"])
        .withMessage("Debe ser 'S' o 'N'"),
      check("order")
        .optional()
        .isIn(["asc", "desc"])
        .withMessage("El orden debe ser 'asc' o 'desc'"),
      check("sort")
        .optional()
        .isString()
        .withMessage("Debe ser una cadena")
        .trim(),
    ];
  }

  public static crear(): ValidationChain[] {
    return [
      body("id_referente")
        .notEmpty()
        .withMessage("El ID del referente es requerido")
        .isInt()
        .withMessage("Debe ser un número entero")
        .toInt(),
      body("id_barrio")
        .notEmpty()
        .withMessage("El ID de barrio es requerido")
        .isInt()
        .withMessage("Debe ser un número entero")
        .toInt(),
      body("id_usuario")
        .notEmpty()
        .withMessage("El ID del usuario de carga es requerido")
        .isInt()
        .withMessage("Debe ser un número entero")
        .toInt(),
    ];
  }

  public static desactivar(): ValidationChain[] {
    return [
      body("id_referente")
        .notEmpty()
        .withMessage("El ID del referente es requerido")
        .isInt()
        .withMessage("Debe ser un número entero")
        .toInt(),
      body("id_barrio")
        .notEmpty()
        .withMessage("El ID de barrio es requerido")
        .isInt()
        .withMessage("Debe ser un número entero")
        .toInt(),
      body("habilitada")
        .notEmpty()
        .withMessage("El estado de habilitación es requerido")
        .isIn(["S", "N"])
        .withMessage("Debe ser 'S' o 'N'"),
      body("id_usuario")
        .notEmpty()
        .withMessage("El ID del usuario que da de baja es requerido")
        .isInt()
        .withMessage("Debe ser un número entero")
        .toInt(),
    ];
  }
}
