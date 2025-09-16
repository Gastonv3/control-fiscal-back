import { Router } from "express";
import { validarRequest } from "../../middlewares/validate-field.middlewares";
import { CargoUsuariosController } from "../../controllers/cargo_usuarios/cargo_usuarios.controller";
import CargoUsuariosValidator from "./cargo_usuarios.validator";
export class CargoUsuariosRoutes {
  public router: Router;

  constructor() {
    this.router = Router();
    this.routes();
  }

  private routes() {
    this.router.get(
      "/",
      CargoUsuariosValidator.listar(),
      validarRequest,
      new CargoUsuariosController().obtener
    );
  }
}
