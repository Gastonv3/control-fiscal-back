import { Router } from "express";
import { CategoriaUsuariosController } from "../../controllers/categoria_usuarios/categoria_usuarios.controller";
export class CategoriaUsuariosRoutes {
  public router: Router;

  constructor() {
    this.router = Router();
    this.routes();
  }

  private routes() {
    this.router.get("/", new CategoriaUsuariosController().obtener);
  }
}
