import { Router } from "express";
import { CategoriaResponsablesZonalesController } from "../../controllers/categoria_resposables_zonales/categoria_resposables_zonales.controller";
export class CategoriaResponsablesZonalesRoutes {
  public router: Router;

  constructor() {
    this.router = Router();
    this.routes();
  }

  private routes() {
    this.router.get("/", new CategoriaResponsablesZonalesController().obtener);
  }
}
