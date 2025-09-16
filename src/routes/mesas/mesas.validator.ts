import { body, check, ValidationChain } from "express-validator";

export default class MesasValidator {
  public static listar(): ValidationChain[] {
    return [
      check(["id_mesa", "id_escuela", "mesa_numero", "offset", "limit"])
        .optional()
        .isInt()
        .withMessage("Debe ser un número entero")
        .toInt(),
      check("not_exista")
        .optional()
        .isString()
        .withMessage("Debe ser una cadena")
        .trim(),
    ];
  }
}
