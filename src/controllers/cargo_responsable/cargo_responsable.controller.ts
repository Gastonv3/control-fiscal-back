import { Request, Response } from "express";
import { getCargoResponsable } from "../../models/cargo_responsables/cargo_responsables.model";

export class CargoResponsableController {
  async obtener(req: Request, res: Response) {
    try {
      const filter = req.query;
      const data = await getCargoResponsable(filter);

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
        "[CargoResponsableController] Error al obtener cargos:",
        error
      );
      return res
        .status(500)
        .json({ message: "Error al obtener cargos", error: error });
    }
  }
}
