import { Request, Response } from "express";
import { getCategoriaReferentes } from "../../models/categoria_referentes/cateogiria_dirigentes.model";

export class CategoriaReferentesController {
  async obtener(req: Request, res: Response) {
    try {
      const data = await getCategoriaReferentes();

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
        "[CategoriaReferentesController] Error al obtener categorias:",
        error
      );
      return res
        .status(500)
        .json({ message: "Error al obtener categorias", error: error });
    }
  }
}
