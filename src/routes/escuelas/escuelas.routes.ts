import { Router } from "express";
import { EscuelasController } from "../../controllers/escuelas/escuelas.controller";
import EscuelasValidator from "./escuelas.validator";
import { validarRequest } from "../../middlewares/validate-field.middlewares";

export class EscuelasRoutes {
  public router: Router;

  constructor() {
    this.router = Router();
    this.routes();
  }

  private routes() {
    this.router.get(
      "/",
      EscuelasValidator.listar(),
      validarRequest,
      new EscuelasController().listarEscuelas
    );

    this.router.put(
      "/",
      EscuelasValidator.actualizarZona(),
      validarRequest,
      new EscuelasController().actualizarEscuelaZonas
    );
  }
}
