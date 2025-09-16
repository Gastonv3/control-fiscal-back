import { ValidationChain, check, body } from "express-validator";

export default class ResponsablesZonalesValidator {
  public static listar(): ValidationChain[] {
    return [
      check([
        "id_responsable",
        "id_cargo",
        "id_categoria",
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

  public static crear(): ValidationChain[] {
    return [
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
      body("id")
        .notEmpty()
        .withMessage("El ID del referente es requerido")
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
        .optional({ nullable: true })
        .isInt()
        .withMessage("Debe ser un número entero")
        .toInt(),
      body("id_cargo")
        .optional({ nullable: true })
        .isInt()
        .withMessage("Debe ser un número entero")
        .toInt(),
      body("id_usuario_carga")
        .notEmpty()
        .withMessage("El ID del usuario que cargar es requerido")
        .isInt()
        .withMessage("Debe ser un número entero")
        .toInt(),
    ];
  }

  public static ParamInsertar(): ValidationChain[] {
    return [
      body("responsable.nombre")
        .notEmpty()
        .withMessage("El nombre es requerido")
        .isString()
        .withMessage("El nombre debe ser una cadena")
        .trim(),
      body("responsable.apellido")
        .notEmpty()
        .withMessage("El apellido es requerido")
        .isString()
        .withMessage("El apellido debe ser una cadena")
        .trim(),
      body("responsable.dni")
        .notEmpty()
        .isInt()
        .withMessage("El DNI debe ser un número entero")
        .toInt(),
      body("responsable.codigo")
        .optional()
        .isString()
        .withMessage("El código debe ser una cadena")
        .trim(),
      body("responsable.telefono")
        .optional()
        .isString()
        .withMessage("El teléfono debe ser una cadena")
        .trim(),
      body("responsable.id_categoria")
        .optional()
        .isInt()
        .withMessage("El ID de categoría debe ser un número entero")
        .toInt(),
      body("responsable.id_cargo")
        .optional()
        .isInt()
        .withMessage("El ID de cargo debe ser un número entero")
        .toInt(),
      body("responsable.id_usuario_carga")
        .notEmpty()
        .withMessage("El ID del usuario de carga es requerido")
        .isInt()
        .withMessage("Debe ser un número entero")
        .toInt(),
      // body("zona_responsable")
      //   .isArray({ min: 1 })
      //   .withMessage("Debe proporcionar al menos una zona responsable"),
      // body("zona_responsable.*.id_zona")
      //   .notEmpty()
      //   .isInt()
      //   .withMessage("El ID de zona es requerido y debe ser un número entero")
      //   .toInt(),
      // body("zona_responsable.*.nombre")
      //   .notEmpty()
      //   .isString()
      //   .withMessage("El nombre de la zona es requerido y debe ser una cadena")
      //   .trim(),
      // body("zona_responsable.*.id_usuario")
      //   .notEmpty()
      //   .isInt()
      //   .withMessage(
      //     "El ID de usuario es requerido y debe ser un número entero"
      //   )
      //   .toInt(),
    ];
  }
}
