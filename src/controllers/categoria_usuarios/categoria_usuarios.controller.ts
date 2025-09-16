import { Request, Response } from "express";
import { getCategoriaUsuarios } from "../../models/categoria_usuarios/cateogiria_dirigentes.model";

export class CategoriaUsuariosController {
  async obtener(req: Request, res: Response) {
    try {
      const data = await getCategoriaUsuarios();

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
        "[CategoriaUsuariosController] Error al obtener categorias:",
        error
      );
      return res
        .status(500)
        .json({ message: "Error al obtener categorias", error: error });
    }
  }
}
