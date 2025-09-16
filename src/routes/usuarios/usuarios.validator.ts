import { ValidationChain, body, check } from "express-validator";

export default class UsuariosValidator {
  public static login(): ValidationChain[] {
    return [
      body("user")
        .not()
        .isEmpty()
        .withMessage("El campo 'user' es requerido")
        .isString()
        .withMessage("El campo 'user' debe ser de tipo string")
        .trim(),
      body("pass")
        .not()
        .isEmpty()
        .withMessage("El campo 'pass' es requerido")
        .isString()
        .withMessage("El campo 'pass' debe ser de tipo string")
        .trim(),
    ];
  }

  public static obtenerUsuarios(): ValidationChain[] {
    return [
      check(["id_usuario", "offset", "limit"])
        .optional()
        .not()
        .isEmpty()
        .withMessage("Es un campo requerido")
        .isInt()
        .withMessage("Debe ser tipo entero")
        .toInt(),
      check(["nombre", "pass", "user", "habilitado"])
        .optional()
        .not()
        .isEmpty()
        .withMessage("Es un campo requerido")
        .isString()
        .withMessage("Debe ser tipo string")
        .trim(),
    ];
  }

  public static insertarUsuario(): ValidationChain[] {
    return [
      body("nombre")
        .notEmpty()
        .withMessage("El nombre es requerido")
        .isString()
        .withMessage("Debe ser una cadena")
        .trim(),
      body("user")
        .notEmpty()
        .withMessage("El usuario es requerido")
        .isString()
        .withMessage("Debe ser una cadena")
        .trim(),
      body("pass")
        .notEmpty()
        .withMessage("La contraseña es requerida")
        .isString()
        .withMessage("Debe ser una cadena")
        .trim(),
      body("id_rol")
        .notEmpty()
        .withMessage("El ID del rol es requerido")
        .isInt()
        .withMessage("Debe ser un número entero")
        .toInt(),
      body("id_categoria_usuario")
        .notEmpty()
        .withMessage("El ID del cargo es requerido")
        .isInt()
        .withMessage("Debe ser un número entero")
        .toInt(),
      body("id_cargo")
        .notEmpty()
        .withMessage("El ID del cargo es requerido")
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

  public static actualizarUsuario(): ValidationChain[] {
    return [
      body("id_usuario")
        .notEmpty()
        .withMessage("El ID del usuario es requerido")
        .isInt()
        .withMessage("Debe ser un número entero")
        .toInt(),
      body("habilitado")
        .optional()
        .isIn(["S", "N"])
        .withMessage("Debe ser 'S' o 'N'"),
      body("id_rol")
        .optional({ nullable: true })
        .isInt()
        .withMessage("Debe ser un número entero")
        .toInt(),
      body("nombre")
        .optional({ nullable: true })
        .isString()
        .withMessage("El código debe ser una cadena")
        .trim(),
      body("user")
        .optional({ nullable: true })
        .isString()
        .withMessage("El código debe ser una cadena")
        .trim(),
      body("pass")
        .optional({ nullable: true })
        .isString()
        .withMessage("El código debe ser una cadena")
        .trim(),
    ];
  }
}
