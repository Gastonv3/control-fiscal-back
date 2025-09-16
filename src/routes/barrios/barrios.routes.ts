import { Router } from "express";
import { validarRequest } from "../../middlewares/validate-field.middlewares";
import { BarriosController } from "../../controllers/barrios/barrios.controller";
import BarrioValidator from "./barrios.validator";

export class BarriosRoutes {
  public router: Router;

  constructor() {
    this.router = Router();
    this.routes();
  }

  private routes() {
    this.router.get(
      "/",
      BarrioValidator.listar(),
      validarRequest,
      new BarriosController().listar
    );
  }
}
