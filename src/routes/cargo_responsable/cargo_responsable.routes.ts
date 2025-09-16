import { Router } from "express";
import { CargoResponsableController } from "../../controllers/cargo_responsable/cargo_responsable.controller";
import { validarRequest } from "../../middlewares/validate-field.middlewares";
import CargoResponsableValidator from "./cargo_responsable.validator";
export class CargoResponsableRoutes {
  public router: Router;

  constructor() {
    this.router = Router();
    this.routes();
  }

  private routes() {
    this.router.get(
      "/",
      CargoResponsableValidator.listar(),
      validarRequest,
      new CargoResponsableController().obtener
    );
  }
}
