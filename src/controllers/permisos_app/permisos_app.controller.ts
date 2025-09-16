import { Request, Response } from "express";
import { IPermisosAppFilter } from "../../models/permisos_app/permisos_app.type";
import ObtenerPermisosAppService from "../../models/permisos_app/applications/obtener-permisos-app.service";

const obtenerPermisosAppService = new ObtenerPermisosAppService();

export class permisosAppController {
  async listarPermisosApp(req: Request, res: Response) {
    try {
      const filter: IPermisosAppFilter = req.query;
      const result = await obtenerPermisosAppService.listar(filter);

      return res.status(result.status).json(result);
    } catch (error) {
      console.error("[permisosAppController] Error al listar:", error);
      return res.status(500).json({
        status: 500,
        message: "Error interno al listar permisos",
        error,
      });
    }
  }
}
