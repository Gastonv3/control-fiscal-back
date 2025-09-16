import { Router } from "express";
import { validarRequest } from "../../middlewares/validate-field.middlewares";
import ResponsablesZonalesValidator from "./responsables_zonales.validator";
import { ResponsablesZonalesController } from "../../controllers/responsables_zonales/responsables_zonales.controller";

export class ResponsablesZonalesRoutes {
  public router: Router;

  constructor() {
    this.router = Router();
    this.routes();
  }

  private routes() {
    this.router.get(
      "/",
      ResponsablesZonalesValidator.listar(),
      validarRequest,
      new ResponsablesZonalesController().listar
    );

    this.router.post(
      "/",
      ResponsablesZonalesValidator.ParamInsertar(),
      validarRequest,
      new ResponsablesZonalesController().crear
    );

    this.router.put(
      "/",
      ResponsablesZonalesValidator.actualizar(),
      validarRequest,
      new ResponsablesZonalesController().actualizar
    );
  }
}
