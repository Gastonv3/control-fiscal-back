import { Router } from "express";
import { validarRequest } from "../../middlewares/validate-field.middlewares";
import CargoDirigentesValidator from "./cargo_dirigentes.validator";
import { CargoDirigentesController } from "../../controllers/cargo_dirigentes/cargo_dirigentes.controller";
export class CargoDirigentesRoutes {
  public router: Router;

  constructor() {
    this.router = Router();
    this.routes();
  }

  private routes() {
    this.router.get(
      "/",
      CargoDirigentesValidator.listar(),
      validarRequest,
      new CargoDirigentesController().obtener
    );
  }
}
