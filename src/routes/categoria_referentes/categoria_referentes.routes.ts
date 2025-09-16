import { Router } from "express";
import { CategoriaReferentesController } from "../../controllers/categoria_referentes/categoria_referentes.controller";
export class CategoriaReferentesRoutes {
  public router: Router;

  constructor() {
    this.router = Router();
    this.routes();
  }

  private routes() {
    this.router.get("/", new CategoriaReferentesController().obtener);
  }
}
