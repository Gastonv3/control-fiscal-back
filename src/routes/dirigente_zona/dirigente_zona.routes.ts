import { Router } from "express";
import { DirigenteZonaController } from "../../controllers/dirigente_zona/dirigente_zona.controller";
import DirigenteZonaValidator from "./dirigente_zona.validator";
import { validarRequest } from "../../middlewares/validate-field.middlewares";

export class DirigenteZonaRoutes {
  public router: Router;

  constructor() {
    this.router = Router();
    this.routes();
  }

  private routes() {
    this.router.get(
      "/",
      DirigenteZonaValidator.listar(),
      validarRequest,
      new DirigenteZonaController().listar
    );

    this.router.post(
      "/",
      DirigenteZonaValidator.crear(),
      validarRequest,
      new DirigenteZonaController().crearDirigenteZona
    );

    this.router.put(
      "/desactivar",
      DirigenteZonaValidator.desactivar(),
      validarRequest,
      new DirigenteZonaController().desactivarDirigenteZona
    );
  }
}
