import { Router } from "express";
import { CategoriaDirigentesController } from "../../controllers/cateogiria_dirigentes/cateogiria_dirigentes.controller";
export class CategoriaDirigentesRoutes {
  public router: Router;

  constructor() {
    this.router = Router();
    this.routes();
  }

  private routes() {
    this.router.get("/", new CategoriaDirigentesController().obtener);
  }
}
