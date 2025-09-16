import { Request, Response } from "express";
import { ListarResponsableZonalesService } from "../../models/responsables_zonales/applications/listar-responsables-zonales.service";
import { InsertarResponsablesZonalesService } from "../../models/responsables_zonales/applications/insertar-responsables-zonales.service";
import { ActualizarResponsablesZonalesService } from "../../models/responsables_zonales/applications/actualizar-responsables-zonales.service";
import {
  IResponsablesZonalesFilter,
  IResponsablesZonalesParamInsertar,
  IResponsablesZonalesUpdate,
} from "../../models/responsables_zonales/responsables_zonales.type";

const listarResponsableZonalesService = new ListarResponsableZonalesService();
const insertarResponsablesZonalesService =
  new InsertarResponsablesZonalesService();
const actualizarResponsablesZonalesService =
  new ActualizarResponsablesZonalesService();

export class ResponsablesZonalesController {
  async listar(req: Request, res: Response) {
    try {
      const { query } = req;
      const filter: IResponsablesZonalesFilter = query;
      const result = await listarResponsableZonalesService.listar(filter);
      return res.status(result.status).json(result);
    } catch (error) {
      console.error("[DirigentesController] Error al listar:", error);
      return res.status(500).json({
        status: 500,
        message: "Error al listar dirigentes",
        error,
      });
    }
  }

  async crear(req: Request, res: Response) {
    try {
      const data: IResponsablesZonalesParamInsertar = req.body;
      const result = await insertarResponsablesZonalesService.crear(data);
      return res.status(result.status).json(result);
    } catch (error) {
      console.error("[DirigentesController] Error al crear:", error);
      return res.status(500).json({
        status: 500,
        message: "Error al crear dirigente",
        error,
      });
    }
  }

  async actualizar(req: Request, res: Response) {
    try {
      const data: IResponsablesZonalesUpdate = req.body;
      const result = await actualizarResponsablesZonalesService.actualizar(
        data
      );
      return res.status(result.status).json(result);
    } catch (error) {
      console.error("[DirigentesController] Error al actualizar:", error);
      return res.status(500).json({
        status: 500,
        message: "Error al actualizar dirigente",
        error,
      });
    }
  }
}
