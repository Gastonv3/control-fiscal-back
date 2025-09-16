import { Router } from "express";
import { DirigentesController } from "../../controllers/dirigentes/dirigentes.controller";
import DirigentesValidator from "./dirigentes.validator";
import { validarRequest } from "../../middlewares/validate-field.middlewares";

export class DirigentesRoutes {
  public router: Router;

  constructor() {
    this.router = Router();
    this.routes();
  }

  private routes() {
    this.router.get(
      "/",
      DirigentesValidator.listar(),
      validarRequest,
      new DirigentesController().listar
    );

    this.router.post(
      "/",
      DirigentesValidator.ParamInsertar(),
      validarRequest,
      new DirigentesController().crear
    );

    this.router.put(
      "/",
      DirigentesValidator.actualizar(),
      validarRequest,
      new DirigentesController().actualizar
    );
  }
}
