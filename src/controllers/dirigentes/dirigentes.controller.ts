import { Request, Response } from "express";
import {
  IDirigenteParamInsertar,
  IDirigentesFilter,
  IDirigentesInsert,
  IDirigentesUpdate,
} from "../../models/dirigentes/dirigentes.type";
import { ActualizarDirigenteService } from "../../models/dirigentes/applications/actualizar-dirigentes.service";
import { InsertarDirigenteService } from "../../models/dirigentes/applications/insertar-dirigentes.service";
import { ListarDirigenteService } from "../../models/dirigentes/applications/listar-dirigentes.service";

const listarDirigenteService = new ListarDirigenteService();
const insertarDirigenteService = new InsertarDirigenteService();
const actualizarDirigenteService = new ActualizarDirigenteService();

export class DirigentesController {
  async listar(req: Request, res: Response) {
    try {
      const { query } = req;
      const filter: IDirigentesFilter = query;
      const result = await listarDirigenteService.listar(filter);
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
      const data: IDirigenteParamInsertar = req.body;
      const result = await insertarDirigenteService.crear(data);
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
      const data: IDirigentesUpdate = req.body;
      const result = await actualizarDirigenteService.actualizar(data);
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
