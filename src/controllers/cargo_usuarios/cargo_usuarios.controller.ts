import { Request, Response } from "express";
import { getCargoUsuarios } from "../../models/cargo_usuarios/cargo_usuarios.model";

export class CargoUsuariosController {
  async obtener(req: Request, res: Response) {
    try {
      const filter = req.query;
      const data = await getCargoUsuarios(filter);

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
        "[CargoUsuariosController] Error al obtener cargos:",
        error
      );
      return res
        .status(500)
        .json({ message: "Error al obtener cargos", error: error });
    }
  }
}
