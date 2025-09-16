import { Router } from "express";
import { ReferentesController } from "../../controllers/referentes/referentes.controller";
import ReferentesValidator from "./referentes.validator";
import { validarRequest } from "../../middlewares/validate-field.middlewares";

export class ReferentesRoutes {
  public router: Router;

  constructor() {
    this.router = Router();
    this.routes();
  }

  private routes() {
    this.router.get(
      "/",
      ReferentesValidator.listar(),
      validarRequest,
      new ReferentesController().listarReferentes
    );

    this.router.post(
      "/",
      ReferentesValidator.ParamInsertar(),
      validarRequest,
      new ReferentesController().insertarReferente
    );

    this.router.put(
      "/",
      ReferentesValidator.actualizar(),
      validarRequest,
      new ReferentesController().actualizarReferente
    );

    this.router.get(
      "/estados-votos",
      ReferentesValidator.listarReferentesEstadosVotos(),
      validarRequest,
      new ReferentesController().listarReferentesEstadoVotos
    );
  }
}
