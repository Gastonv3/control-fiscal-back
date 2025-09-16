import { Router } from "express";

import { validarRequest } from "../../middlewares/validate-field.middlewares";
import { FiscalesGeneralesController } from "../../controllers/fiscales_generales/fiscales_generales.controller";
import FiscalesGeneralesValidator from "./fiscales_generales.validator";

export class FiscalesGeneralesRoutes {
  public router: Router;

  constructor() {
    this.router = Router();
    this.routes();
  }

  private routes() {
    this.router.get(
      "/",
      FiscalesGeneralesValidator.listar(),
      validarRequest,
      new FiscalesGeneralesController().listarFiscalesGenerales
    );

    this.router.post(
      "/",
      FiscalesGeneralesValidator.crear(),
      validarRequest,
      new FiscalesGeneralesController().insertarFiscalGeneral
    );

    this.router.put(
      "/",
      FiscalesGeneralesValidator.actualizar(),
      validarRequest,
      new FiscalesGeneralesController().actualizarFiscalGeneral
    );
  }
}
