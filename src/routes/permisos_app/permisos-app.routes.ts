import { Router } from "express";
import { MesasController } from "../../controllers/mesas/mesas.controller";
import { permisosAppController } from "../../controllers/permisos_app/permisos_app.controller";

export class PermisosRoutes {
  public router: Router;

  constructor() {
    this.router = Router();
    this.routes();
  }

  private routes() {
    this.router.get("/", new permisosAppController().listarPermisosApp);
  }
}
