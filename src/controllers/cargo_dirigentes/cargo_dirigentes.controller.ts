import { Request, Response } from "express";
import { getCargoDirigente } from "../../models/cargo_dirigentes/cargo_dirigentes.model";

export class CargoDirigentesController {
  async obtener(req: Request, res: Response) {
    try {
      const filter = req.query;
      const data = await getCargoDirigente(filter);

      if (!data) {
        return res.status(500).json({
          message: "Error al obtener cargos",
          error: "No se pudieron recuperar los cargos",
        });
      }

      return res.status(200).json({
        message: "Cargos obtenidos correctamente",
        data: data,
      });
    } catch (error) {
      console.error(
        "[CargoDirigentesController] Error al obtener cargos:",
        error
      );
      return res
        .status(500)
        .json({ message: "Error al obtener cargos", error: error });
    }
  }
}
