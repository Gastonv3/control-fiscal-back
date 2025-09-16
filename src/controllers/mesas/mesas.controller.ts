import { Request, Response } from "express";
import { ListarMesasService } from "../../models/mesas/applications/listar-mesas.service";

const listarMesasService = new ListarMesasService();

export class MesasController {
  async listarMesas(req: Request, res: Response) {
    try {
      const filter = req.query;
      const result = await listarMesasService.listar(filter);
      return res.status(result.status).json(result);
    } catch (error) {
      console.error("[MesasController] Error al listar mesas:", error);
      return res.status(500).json({
        status: 500,
        message: "Error interno al listar mesas",
        error,
      });
    }
  }
}
