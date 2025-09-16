import { ValidationChain, body, check } from "express-validator";

export default class DirigenteZonaValidator {
  // Validación para /listar (query params)
  public static listar(): ValidationChain[] {
    return [
      check(["id_dirigente", "offset", "limit"])
        .optional()
        .notEmpty()
        .withMessage("No puede estar vacío")
        .isInt()
        .withMessage("Debe ser un número entero")
        .toInt(),
    ];
  }

  // Validación para /crear (body)
  public static crear(): ValidationChain[] {
    return [
      body("id_dirigente")
        .notEmpty()
        .withMessage("El id_dirigente es requerido")
        .isInt()
        .withMessage("Debe ser un número entero")
        .toInt(),

      body("id_zona")
        .notEmpty()
        .withMessage("El id_zona es requerido")
        .isInt()
        .withMessage("Debe ser un número entero")
        .toInt(),

      body("id_usuario")
        .notEmpty()
        .withMessage("El id_usuario_carga es requerido")
        .isInt()
        .withMessage("Debe ser un número entero")
        .toInt(),
    ];
  }

  // Validación para /desactivar (body)
  public static desactivar(): ValidationChain[] {
    return [
      body("id_dirigente")
        .notEmpty()
        .withMessage("El id_dirigente es requerido")
        .isInt()
        .withMessage("Debe ser un número entero")
        .toInt(),

      body("id_zona")
        .notEmpty()
        .withMessage("El id_zona es requerido")
        .isInt()
        .withMessage("Debe ser un número entero")
        .toInt(),

      body("id_usuario")
        .notEmpty()
        .withMessage("El id_usuario_baja es requerido")
        .isInt()
        .withMessage("Debe ser un número entero")
        .toInt(),

      body("habilitada")
        .notEmpty()
        .withMessage("El campo habilitada es requerido")
        .isIn(["S", "N"])
        .withMessage("Debe ser 'S' o 'N'"),
    ];
  }
}
