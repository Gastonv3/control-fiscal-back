import { ValidationChain, check, body } from "express-validator";

export default class ReferentesValidator {
  public static listar(): ValidationChain[] {
    return [
      check([
        "id_referente",
        "id_zona",
        "id_barrio",
        "id_dirigente",
        "id_responsable",
        "id_categoria",
        "id_cargo",
        "dni",
        "offset",
        "limit",
      ])
        .optional()
        .isInt()
        .withMessage("Debe ser un número entero")
        .toInt(),
      check("codigo")
        .optional()
        .isString()
        .withMessage("Debe ser una cadena")
        .trim(),
      check(["nombre", "apellido", "nombreLike", "habilitada"])
        .optional()
        .isString()
        .withMessage("Debe ser una cadena de texto")
        .trim(),
      check("habilitada")
        .optional()
        .isIn(["S", "N"])
        .withMessage("Debe ser 'S' o 'N'"),
    ];
  }

  public static listarReferentesEstadosVotos(): ValidationChain[] {
    return [
      check("id_referente")
        .optional()
        .isInt()
        .withMessage("El ID del referente debe ser un número entero")
        .toInt(),
      check("id_dirigente")
        .optional()
        .isInt()
        .withMessage("El ID del dirigente debe ser un número entero")
        .toInt(),
      check("nombre_referente_like")
        .optional()
        .isString()
        .withMessage("Debe ser una cadena de texto")
        .trim(),
      check("nombre_dirigente_like")
        .optional()
        .isString()
        .withMessage("Debe ser una cadena de texto")
        .trim(),
      check("dni_referente")
        .optional()
        .isInt()
        .withMessage("El DNI del referente debe ser un número entero")
        .toInt(),
      check("dni_dirigente")
        .optional()
        .isInt()
        .withMessage("El DNI del dirigente debe ser un número entero")
        .toInt(),
      check("id_zona")
        .optional()
        .isInt()
        .withMessage("El ID de la zona debe ser un número entero")
        .toInt(),
      check("pendientes")
        .optional()
        .isIn(["S", "N"])
        .withMessage("Debe ser 'S' o 'N'"),
      check("offset", "limit")
        .optional()
        .isInt()
        .withMessage("Debe ser un número entero")
        .toInt(),
    ];
  }

  public static crear(): ValidationChain[] {
    return [
      body("id_dirigente")
        .notEmpty()
        .withMessage("El ID del dirigente es requerido")
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
      body("dni")
        .notEmpty()
        .withMessage("El DNI es requerido")
        .isInt()
        .withMessage("Debe ser un número entero")
        .toInt(),
      body("codigo")
        .notEmpty()
        .withMessage("El código es requerido")
        .isString()
        .withMessage("Debe ser una cadena")
        .trim(),
      body("telefono")
        .notEmpty()
        .withMessage("El teléfono es requerido")
        .isString()
        .withMessage("Debe ser una cadena")
        .trim(),
      body("id_categoria")
        .optional()
        .isInt()
        .withMessage("El ID de categoría debe ser un número entero")
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
      body("id_referente")
        .notEmpty()
        .withMessage("El ID del referente es requerido")
        .isInt()
        .withMessage("Debe ser un número entero")
        .toInt(),
      body("id_dirigente")
        .optional()
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
      body("codigo")
        .optional({ nullable: true })
        .isString()
        .withMessage("Debe ser una cadena")
        .trim(),
      body("telefono")
        .optional()
        .isString()
        .withMessage("Debe ser una cadena")
        .trim(),
      body("id_categoria")
        .optional()
        .isInt()
        .withMessage("Debe ser un número entero")
        .toInt(),
      body("id_cargo")
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
    ];
  }

  public static ParamInsertar(): ValidationChain[] {
    return [
      body("referente.nombre")
        .notEmpty()
        .withMessage("El nombre es requerido")
        .isString()
        .withMessage("El nombre debe ser una cadena")
        .trim(),
      body("referente.apellido")
        .notEmpty()
        .withMessage("El apellido es requerido")
        .isString()
        .withMessage("El apellido debe ser una cadena")
        .trim(),
      body("referente.dni")
        .notEmpty()
        .isInt()
        .withMessage("El DNI debe ser un número entero")
        .toInt(),
      body("referente.codigo")
        .optional()
        .isString()
        .withMessage("El código debe ser una cadena")
        .trim(),
      body("referente.telefono")
        .optional()
        .isString()
        .withMessage("El teléfono debe ser una cadena")
        .trim(),
      body("referente.id_categoria")
        .optional()
        .isInt()
        .withMessage("El ID de categoría debe ser un número entero")
        .toInt(),
      body("referente.id_cargo")
        .optional()
        .isInt()
        .withMessage("El ID de cargo debe ser un número entero")
        .toInt(),
      body("referente.id_usuario_carga")
        .notEmpty()
        .withMessage("El ID del usuario de carga es requerido")
        .isInt()
        .withMessage("Debe ser un número entero")
        .toInt(),
      // body("zona_referente")
      //   .isArray({ min: 1 })
      //   .withMessage("Debe proporcionar al menos una zona referente"),
      // body("zona_referente.*.id_zona")
      //   .notEmpty()
      //   .isInt()
      //   .withMessage("El ID de zona es requerido y debe ser un número entero")
      //   .toInt(),
      // body("zona_referente.*.nombre")
      //   .notEmpty()
      //   .isString()
      //   .withMessage("El nombre de la zona es requerido y debe ser una cadena")
      //   .trim(),
      // body("zona_referente.*.id_usuario")
      //   .notEmpty()
      //   .isInt()
      //   .withMessage(
      //     "El ID de usuario es requerido y debe ser un número entero"
      //   )
      //   .toInt(),
      body("barrio_referente")
        .optional({ nullable: true })
        .isArray()
        .withMessage("Debe proporcionar al menos un barrio referente"),
      body("barrio_referente.*.id_barrio")
        .notEmpty()
        .isInt()
        .withMessage("El ID de barrio es requerido y debe ser un número entero")
        .toInt(),
      body("barrio_referente.*.nombre")
        .notEmpty()
        .isString()
        .withMessage(
          "El nombre de la barrio es requerido y debe ser una cadena"
        )
        .trim(),
      body("barrio_referente.*.id_usuario")
        .notEmpty()
        .isInt()
        .withMessage(
          "El ID de usuario es requerido y debe ser un número entero"
        )
        .toInt(),
    ];
  }
}
