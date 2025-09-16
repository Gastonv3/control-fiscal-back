import { Request, Response } from "express";

import { getCategoria } from "../../models/cateogiria_dirigentes/cateogiria_dirigentes.model";

export class CategoriaDirigentesController {
  async obtener(req: Request, res: Response) {
    try {
      const data = await getCategoria();

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
        "[CategoriaDirigentesController] Error al obtener categorias:",
        error
      );
      return res
        .status(500)
        .json({ message: "Error al obtener categorias", error: error });
    }
  }
}
