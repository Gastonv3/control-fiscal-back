import { Router } from "express";
import { validarRequest } from "../../middlewares/validate-field.middlewares";
import ResponsablesZonalesZonaValidator from "./responsables_zonales_zona.validator";
import { ResponsablesZonalesZonaController } from "../../controllers/responsables_zonales_zona/responsables_zonales_zona.controller";

export class ResponsablesZonalesZonaRoutes {
  public router: Router;

  constructor() {
    this.router = Router();
    this.routes();
  }

  private routes() {
    this.router.get(
      "/",
      ResponsablesZonalesZonaValidator.listar(),
      validarRequest,
      new ResponsablesZonalesZonaController().listar
    );

    this.router.post(
      "/",
      ResponsablesZonalesZonaValidator.crear(),
      validarRequest,
      new ResponsablesZonalesZonaController().crear
    );

    this.router.put(
      "/desactivar",
      ResponsablesZonalesZonaValidator.desactivar(),
      validarRequest,
      new ResponsablesZonalesZonaController().desactivar
    );
  }
}
