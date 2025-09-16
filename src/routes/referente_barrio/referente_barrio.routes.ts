import { Router } from "express";
import { validarRequest } from "../../middlewares/validate-field.middlewares";
import { ReferenteBarrioController } from "../../controllers/referente_barrio/referente_barrio.controller";
import ReferenteBarrioValidator from "./referente_barrio.validator";

export class ReferenteBarrioRoutes {
  public router: Router;

  constructor() {
    this.router = Router();
    this.routes();
  }

  private routes() {
    this.router.get(
      "/",
      ReferenteBarrioValidator.listar(),
      validarRequest,
      new ReferenteBarrioController().listar
    );

    this.router.post(
      "/",
      ReferenteBarrioValidator.crear(),
      validarRequest,
      new ReferenteBarrioController().crear
    );

    this.router.put(
      "/desactivar",
      ReferenteBarrioValidator.desactivar(),
      validarRequest,
      new ReferenteBarrioController().desactivar
    );
  }
}
