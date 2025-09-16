import { ValidationChain, body, check } from "express-validator";

export default class CargoUsuariosValidator {
  public static listar(): ValidationChain[] {
    return [
      check(["id_categoria_usuario"])
        .optional()
        .notEmpty()
        .withMessage("No puede estar vacío")
        .isInt()
        .withMessage("Debe ser un número entero")
        .toInt(),
    ];
  }
}
