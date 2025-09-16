import { Request, Response } from "express";
import { getZonas } from "../../models/zonas/zonas.model";

export class ZonasController {
  async obtener(req: Request, res: Response) {
    try {
      const data = await getZonas();

      if (!data) {
        return res.status(500).json({
          message: "Error al obtener zonas",
          error: "No se pudieron recuperar las zonas",
        });
      }

      return res.status(200).json({
        message: "Zonas obtenidas correctamente",
        data: data,
      });
    } catch (error) {
      console.error("[ZonasController] Error al obtener zonas:", error);
      return res
        .status(500)
        .json({ message: "Error al obtener zonas", error: error });
    }
  }
}
