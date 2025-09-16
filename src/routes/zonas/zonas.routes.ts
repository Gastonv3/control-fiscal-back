import { Router } from "express";
import { verificarToken } from "../../middlewares/auth.middlewares";
import { ZonasController } from "../../controllers/zonas/zonas.controller";

export class ZonasRoutes {
  public router: Router;

  constructor() {
    this.router = Router();
    this.routes();
  }

  private routes() {
    this.router.get("/", new ZonasController().obtener);
  }
}
