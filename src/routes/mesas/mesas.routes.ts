import { Router } from "express";
import { MesasController } from "../../controllers/mesas/mesas.controller";
import MesasValidator from "./mesas.validator";
import { validarRequest } from "../../middlewares/validate-field.middlewares";

export class MesasRoutes {
  public router: Router;

  constructor() {
    this.router = Router();
    this.routes();
  }

  private routes() {
    this.router.get(
      "/",
      MesasValidator.listar(),
      validarRequest,
      new MesasController().listarMesas
    );
  }
}
