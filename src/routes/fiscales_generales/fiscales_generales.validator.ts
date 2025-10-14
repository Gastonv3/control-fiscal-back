import { ValidationChain, check, body } from "express-validator";

export default class FiscalesGeneralesValidator {
  public static listar(): ValidationChain[] {
    return [
      check([
        "id_fiscal_general",
        "id_usuario",
        "id_escuela",
        "dni",
        "offset",
        "limit",
      ])
        .optional()
        .isInt()
        .withMessage("Debe ser un número entero")
        .toInt(),
      check("nombre_usuario_asignado")
        .optional()
        .isString()
        .withMessage("Debe ser una cadena")
        .trim(),
      check("habilitada")
        .optional()
        .isIn(["S", "N"])
        .withMessage("Debe ser 'S' o 'N'"),
      check("mesas_pendientes").optional().isString(),
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
      body("usuario")
        .notEmpty()
        .withMessage("El usuario es requerido")
        .isString()
        .withMessage("Debe ser una cadena")
        .trim(),
      body("password")
        .notEmpty()
        .withMessage("La contraseña es requerida")
        .isString()
        .withMessage("Debe ser una cadena")
        .trim(),
      body("dni")
        .notEmpty()
        .withMessage("El DNI es requerido")
        .isInt()
        .withMessage("Debe ser un número entero")
        .toInt(),
      body("telefono")
        .notEmpty()
        .isString()
        .withMessage("Debe ser una cadena")
        .trim(),
      body("id_escuela")
        .optional()
        .isInt()
        .withMessage("El ID de escuela debe ser un número entero")
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
      body("id_fiscal_general")
        .notEmpty()
        .withMessage("El ID del fiscal general es requerido")
        .isInt()
        .withMessage("Debe ser un número entero")
        .toInt(),
      body("id_usuario")
        .optional()
        .isInt()
        .withMessage("Debe ser un número entero")
        .toInt(),
      body("dni")
        .optional()
        .isInt()
        .withMessage("Debe ser un número entero")
        .toInt(),
      body("telefono")
        .optional()
        .isString()
        .withMessage("Debe ser una cadena")
        .trim(),
      body("id_escuela")
        .optional({ nullable: true })
        .isInt()
        .withMessage("Debe ser un número entero")
        .toInt(),
      body("habilitado")
        .optional()
        .isIn(["S", "N"])
        .withMessage("Debe ser 'S' o 'N'"),
      body("id_usuario_modifica")
        .notEmpty()
        .withMessage("El ID del usuario que modifica es requerido")
        .isInt()
        .withMessage("Debe ser un número entero")
        .toInt(),
      body("nombre")
        .optional({ nullable: true })
        .isString()
        .withMessage("El código debe ser una cadena")
        .trim(),
      body("usuario")
        .optional({ nullable: true })
        .isString()
        .withMessage("El código debe ser una cadena")
        .trim(),
      body("password")
        .optional({ nullable: true })
        .isString()
        .withMessage("El código debe ser una cadena")
        .trim(),
      body("escuela_original")
        .optional({ nullable: true })
        .isInt()
        .withMessage("Debe ser un número entero")
        .toInt(),
    ];
  }
}
