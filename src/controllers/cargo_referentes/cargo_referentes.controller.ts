import { Request, Response } from "express";
import { getCargoReferente } from "../../models/cargo_referentes/cargo_referentes.model";

export class CargoReferentesController {
  async obtener(req: Request, res: Response) {
    try {
      const filter = req.query;
      const data = await getCargoReferente(filter);

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
        "[CargoReferentesController] Error al obtener cargos:",
        error
      );
      return res
        .status(500)
        .json({ message: "Error al obtener cargos", error: error });
    }
  }
}
