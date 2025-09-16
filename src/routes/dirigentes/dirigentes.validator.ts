import { ValidationChain, body, check, query } from "express-validator";

export default class DirigentesValidator {
  public static listar(): ValidationChain[] {
    return [
      check([
        "id_dirigente",
        "id_responsable",
        "dni",
        "id_categoria",
        "id_cargo",
        "id_zona",
        "offset",
        "limit",
      ])
        .optional()
        .isInt()
        .withMessage("Debe ser un número entero")
        .toInt(),
      check(["nombre", "apellido", "nombreLike", "habilitada"])
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

  public static crear(): ValidationChain[] {
    return [
      body("nombre")
        .notEmpty()
        .withMessage("El nombre es requerido")
        .isString()
        .withMessage("El nombre debe ser una cadena")
        .trim(),
      body("apellido")
        .notEmpty()
        .withMessage("El apellido es requerido")
        .isString()
        .withMessage("El apellido debe ser una cadena")
        .trim(),
      body("dni")
        .notEmpty()
        .isInt()
        .withMessage("El DNI debe ser un número entero")
        .toInt(),
      body("codigo")
        .optional()
        .isString()
        .withMessage("El código debe ser una cadena")
        .trim(),
      body("telefono")
        .optional()
        .isString()
        .withMessage("El teléfono debe ser una cadena")
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
      body("id")
        .notEmpty()
        .withMessage("El ID del dirigente es requerido")
        .isInt()
        .withMessage("Debe ser un número entero")
        .toInt(),
      body("id_responsable")
        .notEmpty()
        .withMessage("El ID del responsable es requerido")
        .isInt()
        .withMessage("El ID del responsable debe ser un número entero")
        .toInt(),
      body("nombre")
        .optional()
        .isString()
        .withMessage("El nombre debe ser una cadena")
        .trim(),
      body("apellido")
        .optional()
        .isString()
        .withMessage("El apellido debe ser una cadena")
        .trim(),
      body("dni")
        .optional()
        .isInt()
        .withMessage("El DNI debe ser un número entero")
        .toInt(),
      body("codigo")
        .optional({ nullable: true })
        .isString()
        .withMessage("El código debe ser una cadena")
        .trim(),
      body("telefono")
        .optional()
        .isString()
        .withMessage("El teléfono debe ser una cadena")
        .trim(),
      body("id_categoria")
        .optional({ nullable: true })
        .isInt()
        .withMessage("El ID de categoría debe ser un número entero")
        .toInt(),
      body("id_cargo")
        .optional({ nullable: true })
        .isInt()
        .withMessage("El ID de cargo debe ser un número entero")
        .toInt(),
      body("habilitada")
        .optional()
        .isIn(["S", "N"])
        .withMessage("El valor debe ser 'S' o 'N'"),
      body("id_usuario_carga")
        .notEmpty()
        .isInt()
        .withMessage("Debe ser un número entero")
        .toInt(),
    ];
  }

  public static ParamInsertar(): ValidationChain[] {
    return [
      body("dirigente.id_responsable")
        .notEmpty()
        .withMessage("El ID del responsable es requerido")
        .isInt()
        .withMessage("El ID del responsable debe ser un número entero")
        .toInt(),
      body("dirigente.nombre")
        .notEmpty()
        .withMessage("El nombre es requerido")
        .isString()
        .withMessage("El nombre debe ser una cadena")
        .trim(),
      body("dirigente.apellido")
        .notEmpty()
        .withMessage("El apellido es requerido")
        .isString()
        .withMessage("El apellido debe ser una cadena")
        .trim(),
      body("dirigente.dni")
        .notEmpty()
        .isInt()
        .withMessage("El DNI debe ser un número entero")
        .toInt(),
      body("dirigente.codigo")
        .optional()
        .isString()
        .withMessage("El código debe ser una cadena")
        .trim(),
      body("dirigente.telefono")
        .optional()
        .isString()
        .withMessage("El teléfono debe ser una cadena")
        .trim(),
      body("dirigente.id_categoria")
        .optional()
        .isInt()
        .withMessage("El ID de categoría debe ser un número entero")
        .toInt(),
      body("dirigente.id_cargo")
        .optional()
        .isInt()
        .withMessage("El ID de cargo debe ser un número entero")
        .toInt(),
      body("dirigente.id_usuario_carga")
        .notEmpty()
        .withMessage("El ID del usuario de carga es requerido")
        .isInt()
        .withMessage("Debe ser un número entero")
        .toInt(),
      // body("zona_dirigente")
      //   .isArray({ min: 1 })
      //   .withMessage("Debe proporcionar al menos una zona dirigente"),
      // body("zona_dirigente.*.id_zona")
      //   .notEmpty()
      //   .isInt()
      //   .withMessage("El ID de zona es requerido y debe ser un número entero")
      //   .toInt(),
      // body("zona_dirigente.*.nombre")
      //   .notEmpty()
      //   .isString()
      //   .withMessage("El nombre de la zona es requerido y debe ser una cadena")
      //   .trim(),
      // body("zona_dirigente.*.id_usuario")
      //   .notEmpty()
      //   .isInt()
      //   .withMessage(
      //     "El ID de usuario es requerido y debe ser un número entero"
      //   )
      //   .toInt(),
    ];
  }
}
