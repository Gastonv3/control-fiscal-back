import { Router } from "express";
import { LoginController } from "../../controllers/usuarios/login.controller";
import { UsuariosController } from "../../controllers/usuarios/usuarios.controller";
import { verificarToken } from "../../middlewares/auth.middlewares";
import UsuariosValidator from "./usuarios.validator";
import { validarRequest } from "../../middlewares/validate-field.middlewares";

export class UsuariosRoutes {
  public router: Router;

  constructor() {
    this.router = Router();
    this.routes();
  }

  private routes() {
    this.router.post(
      "/auth",
      UsuariosValidator.login(),
      validarRequest,
      new LoginController().login
    );

    this.router.get(
      "/renew",
      verificarToken,
      new LoginController().renovarToken
    );

    this.router.get(
      "/listar",
      verificarToken,
      UsuariosValidator.obtenerUsuarios(),
      validarRequest,
      new UsuariosController().obtenerUsuarios
    );

    this.router.get(
      "/listar-roles",
      verificarToken,
      new UsuariosController().listarRoles
    );

    this.router.post(
      "/insertar",
      verificarToken,
      UsuariosValidator.insertarUsuario(),
      validarRequest,
      new UsuariosController().insertarUsuario
    );

    this.router.put(
      "/actualizar",
      verificarToken,
      UsuariosValidator.actualizarUsuario(),
      validarRequest,
      new UsuariosController().actualizarUsuario
    );
  }
}
