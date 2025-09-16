import { Request, Response } from "express";
import { ListarEscuelasService } from "../../models/escuelas/applications/listar-escuelas.service";
import { ActualizarEscuelaZonaService } from "../../models/escuelas/applications/actualizar-escuela-zona.service";

const listarEscuelasService = new ListarEscuelasService();
const actualizarEscuelaZonaService = new ActualizarEscuelaZonaService();
export class EscuelasController {
  async listarEscuelas(req: Request, res: Response) {
    try {
      const filter = req.query;
      const result = await listarEscuelasService.listar(filter);
      return res.status(result.status).json(result);
    } catch (error) {
      console.error("[EscuelasController] Error al listar escuelas:", error);
      return res.status(500).json({
        status: 500,
        message: "Error interno al listar escuelas",
        error,
      });
    }
  }

  async actualizarEscuelaZonas(req: Request, res: Response) {
    try {
      const data = req.body;
      const result = await actualizarEscuelaZonaService.actualizarZonaEscuela(
        data
      );
      return res.status(result.status).json(result);
    } catch (error) {
      console.error("[EscuelasController] Error al actualizar zonas:", error);
      return res.status(500).json({
        status: 500,
        message: "Error interno al actualizar zonas",
        error,
      });
    }
  }
}
