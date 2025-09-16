import { Router } from "express";
import { ReferenteZonaController } from "../../controllers/referente_zona/referente_zona.controller";
import ReferenteZonaValidator from "./referente_zona.validator";
import { validarRequest } from "../../middlewares/validate-field.middlewares";

export class ReferenteZonaRoutes {
  public router: Router;

  constructor() {
    this.router = Router();
    this.routes();
  }

  private routes() {
    this.router.get(
      "/",
      ReferenteZonaValidator.listar(),
      validarRequest,
      new ReferenteZonaController().listar
    );

    this.router.post(
      "/",
      ReferenteZonaValidator.crear(),
      validarRequest,
      new ReferenteZonaController().crear
    );

    this.router.put(
      "/desactivar",
      ReferenteZonaValidator.desactivar(),
      validarRequest,
      new ReferenteZonaController().desactivar
    );
  }
}
