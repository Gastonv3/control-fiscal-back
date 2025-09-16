import { Router } from "express";
import { validarRequest } from "../../middlewares/validate-field.middlewares";
import CargoReferentesValidator from "./cargo_referentes.validator";
import { CargoReferentesController } from "../../controllers/cargo_referentes/cargo_referentes.controller";
export class CargoReferentesRoutes {
  public router: Router;

  constructor() {
    this.router = Router();
    this.routes();
  }

  private routes() {
    this.router.get(
      "/",
      CargoReferentesValidator.listar(),
      validarRequest,
      new CargoReferentesController().obtener
    );
  }
}
