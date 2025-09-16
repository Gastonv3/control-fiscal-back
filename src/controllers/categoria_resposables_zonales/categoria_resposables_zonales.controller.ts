import { Request, Response } from "express";
import { getCategoriaResponsablesZonales } from "../../models/categoria_resposables_zonales/cateogiria_resposables_zonales.model";

export class CategoriaResponsablesZonalesController {
  async obtener(req: Request, res: Response) {
    try {
      const data = await getCategoriaResponsablesZonales();

      if (!data) {
        return res.status(500).json({
          message: "Error al obtener categorias",
          error: "No se pudieron recuperar las categorias",
        });
      }

      return res.status(200).json({
        message: "Categorias obtenidas correctamente",
        data: data,
      });
    } catch (error) {
      console.error(
        "[CategoriaResponsablesZonalesController] Error al obtener categorias:",
        error
      );
      return res
        .status(500)
        .json({ message: "Error al obtener categorias", error: error });
    }
  }
}
