import { Router } from "express";

import { validarRequest } from "../../middlewares/validate-field.middlewares";
import { FiscalesDigitalesController } from "../../controllers/fiscales_digitales/fiscales_digitales.controller";
import FiscalesDigitalesValidator from "./fiscalaes_digitales.validator";

export class FiscalesDigitalesRoutes {
  public router: Router;

  constructor() {
    this.router = Router();
    this.routes();
  }

  private routes() {
    this.router.get(
      "/",
      FiscalesDigitalesValidator.listar(),
      validarRequest,
      new FiscalesDigitalesController().listarFiscalesDigitales
    );

    this.router.post(
      "/",
      FiscalesDigitalesValidator.crear(),
      validarRequest,
      new FiscalesDigitalesController().insertarFiscalDigital
    );

    this.router.put(
      "/",
      FiscalesDigitalesValidator.actualizar(),
      validarRequest,
      new FiscalesDigitalesController().actualizarFiscalDigital
    );

    this.router.put(
      "/estado-asistencia",
      FiscalesDigitalesValidator.estadoAsistencia(),
      validarRequest,
      new FiscalesDigitalesController().estadoAsistenciaFiscalesDigitales
    );
  }
}
