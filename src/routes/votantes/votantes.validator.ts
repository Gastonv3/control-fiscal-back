import { ValidationChain, check, body } from "express-validator";

export default class VotantesValidator {
  public static listar(): ValidationChain[] {
    return [
      check([
        "id_votante",
        "dni",
        "id_referente",
        "id_dirigente",
        "id_responsable",
        "numero_mesa",
        "numero_orden",
        "id_cargo_referente",
        "id_categoria_referente",
        "offset",
        "limit",
      ])
        .optional()
        .isInt()
        .withMessage("Debe ser un número entero")
        .toInt(),
      check("estado_voto")
        .optional()
        .isIn(["S", "N"])
        .withMessage("Debe ser 'S' o 'N'"),
    ];
  }

  public static obtenerEstadoVotantes(): ValidationChain[] {
    return [
      check([
        "id_referente",
        "id_dirigente",
        "id_responsable",
        "id_escuela",
        "is_not_null_referente",
        "id_zona",
      ])
        .optional()
        .isInt()
        .withMessage("Debe ser un número entero")
        .toInt(),
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
      body("dni")
        .notEmpty()
        .withMessage("El DNI es requerido")
        .isInt()
        .withMessage("Debe ser un número entero")
        .toInt(),
      body("nombre")
        .notEmpty()
        .withMessage("El nombre es requerido")
        .isString()
        .withMessage("Debe ser una cadena")
        .trim(),
      body("apellido")
        .notEmpty()
        .withMessage("El apellido es requerido")
        .isString()
        .withMessage("Debe ser una cadena")
        .trim(),
      body("telefono")
        .notEmpty()
        .withMessage("El teléfono es requerido")
        .isString()
        .withMessage("Debe ser una cadena")
        .trim(),
      body("numero_mesa")
        .notEmpty()
        .withMessage("El número de mesa es requerido")
        .isInt()
        .withMessage("Debe ser un número entero")
        .toInt(),
      body("numero_orden")
        .notEmpty()
        .withMessage("El número de orden es requerido")
        .isInt()
        .withMessage("Debe ser un número entero")
        .toInt(),
      body("id_usuario_carga")
        .notEmpty()
        .withMessage("El ID del usuario de carga es requerido")
        .isInt()
        .withMessage("Debe ser un número entero")
        .toInt(),
    ];
  }

  public static actualizar(): ValidationChain[] {
    return [
      body("id_votante")
        .notEmpty()
        .withMessage("El ID del votante es requerido")
        .isInt()
        .withMessage("Debe ser un número entero")
        .toInt(),
      body("nombre")
        .optional()
        .isString()
        .withMessage("Debe ser una cadena")
        .trim(),
      body("apellido")
        .optional()
        .isString()
        .withMessage("Debe ser una cadena")
        .trim(),
      body("dni")
        .optional()
        .isInt()
        .withMessage("Debe ser un número entero")
        .toInt(),
      body("telefono")
        .optional({ nullable: true })
        .isString()
        .withMessage("Debe ser una cadena")
        .trim(),
      body("numero_mesa")
        .optional()
        .isInt()
        .withMessage("Debe ser un número entero")
        .toInt(),
      body("numero_orden")
        .optional()
        .isInt()
        .withMessage("Debe ser un número entero")
        .toInt(),
      body("id_usuario_modifica")
        .notEmpty()
        .withMessage("El ID del usuario que modifica es requerido")
        .isInt()
        .withMessage("Debe ser un número entero")
        .toInt(),
      body("id_referente")
        .notEmpty()
        .withMessage("El ID del referente es requerido")
        .isInt()
        .withMessage("Debe ser un número entero")
        .toInt(),
    ];
  }

  public static votar(): ValidationChain[] {
    return [
      body("dni")
        .notEmpty()
        .withMessage("El DNI es requerido")
        .isInt()
        .withMessage("Debe ser un número entero")
        .toInt(),
      body("id_usuario")
        .notEmpty()
        .withMessage("El ID del usuario de votación es requerido")
        .isInt()
        .withMessage("Debe ser un número entero")
        .toInt(),
    ];
  }

  public static anular(): ValidationChain[] {
    return [
      body("dni")
        .notEmpty()
        .withMessage("El DNI es requerido")
        .isInt()
        .withMessage("Debe ser un número entero")
        .toInt(),
      body("id_usuario")
        .notEmpty()
        .withMessage("El ID del usuario de votación es requerido")
        .isInt()
        .withMessage("Debe ser un número entero")
        .toInt(),
    ];
  }

  public static listarRankingResponsables(): ValidationChain[] {
    return [
      check(["id_responsable", "offset", "limit"])
        .optional()
        .isInt()
        .withMessage("Debe ser un número entero")
        .toInt(),
      check("nombreLikeResponsable")
        .optional()
        .isString()
        .withMessage("Debe ser una cadena de texto")
        .trim(),
    ];
  }

  public static listarRankingDirigentes(): ValidationChain[] {
    return [
      check(["id_dirigente", "offset", "limit"])
        .optional()
        .isInt()
        .withMessage("Debe ser un número entero")
        .toInt(),
      check("nombreLikeDirigente")
        .optional()
        .isString()
        .withMessage("Debe ser una cadena de texto")
        .trim(),
    ];
  }

  public static listarRankingReferentes(): ValidationChain[] {
    return [
      check(["id_referente", "offset", "limit"])
        .optional()
        .isInt()
        .withMessage("Debe ser un número entero")
        .toInt(),
      check("nombreLikeReferente")
        .optional()
        .isString()
        .withMessage("Debe ser una cadena de texto")
        .trim(),
    ];
  }
}
