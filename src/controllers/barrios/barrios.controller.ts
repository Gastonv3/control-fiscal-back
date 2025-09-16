import { Request, Response } from "express";
import { IBarrioFilter } from "../../models/barrios/barrios.type";
import { ListarBarrioService } from "../../models/barrios/applications/listar-zonas.service";

const listarBarrioService = new ListarBarrioService();

export class BarriosController {
  async listar(req: Request, res: Response) {
    try {
      const { query } = req;
      const filter: IBarrioFilter = query;
      const result = await listarBarrioService.listar(filter);
      return res.status(result.status).json(result);
    } catch (error) {
      console.error("[BarriosController] Error al listar:", error);
      return res.status(500).json({
        status: 500,
        message: "Error al listar barrios",
        error,
      });
    }
  }
}
