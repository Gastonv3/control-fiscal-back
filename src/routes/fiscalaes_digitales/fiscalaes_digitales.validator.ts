import { ValidationChain, check, body } from "express-validator";

export default class FiscalesDigitalesValidator {
  public static listar(): ValidationChain[] {
    return [
      check([
        "id_fiscal_digital",
        "id_fiscal_general",
        "id_usuario",
        "dni",
        "offset",
        "limit",
      ])
        .optional()
        .isInt()
        .withMessage("Debe ser un número entero")
        .toInt(),
      check("nombre_fiscal_digital")
        .optional()
        .isString()
        .withMessage("Debe ser una cadena")
        .trim(),
      check("habilitado", "estado_asistencia")
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
      body("id_fiscal_general")
        .notEmpty()
        .withMessage("El ID del fiscal general es requerido")
        .isInt()
        .withMessage("Debe ser un número entero")
        .toInt(),
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
      body("mesa_numero")
        .optional({ nullable: true })
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
      body("id_fiscal_digital")
        .notEmpty()
        .withMessage("El ID del fiscal digital es requerido")
        .isInt()
        .withMessage("Debe ser un número entero")
        .toInt(),
      body("id_fiscal_general")
        .optional()
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
      body("mesa_numero")
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
    ];
  }

  public static estadoAsistencia(): ValidationChain[] {
    return [
      body("id_fiscal_digital")
        .notEmpty()
        .withMessage("El ID del fiscal digital es requerido")
        .isInt()
        .withMessage("Debe ser un número entero")
        .toInt(),
      body("id_usuario_asistencia")
        .notEmpty()
        .isInt()
        .withMessage("Debe ser un número entero")
        .toInt(),
      body("id_usuario_asignado")
        .notEmpty()
        .isInt()
        .withMessage("Debe ser un número entero")
        .toInt(),
      body("estado_asistencia")
        .optional()
        .isIn(["S", "N"])
        .withMessage("Debe ser 'S' o 'N'"),
    ];
  }
}
