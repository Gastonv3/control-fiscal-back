import { Request, Response } from "express";
import { BajaDirigenteZonaService } from "../../models/dirigente_zona/applications/baja-dirigente-zona.service";
import { InsertarDirigenteZonaService } from "../../models/dirigente_zona/applications/insertar-dirigente-zona.service";
import { ListarDirigenteZonaService } from "../../models/dirigente_zona/applications/listar-dirigente-zona.service";
import {
  IDirigenteZonaBaja,
  IDirigenteZonaInput,
} from "../../models/dirigente_zona/dirigente_zona.type";

const insertarDirigenteZonaService = new InsertarDirigenteZonaService();
const bajaDirigenteZonaService = new BajaDirigenteZonaService();
const listarDirigenteZonaService = new ListarDirigenteZonaService();

export class DirigenteZonaController {
  async listar(req: Request, res: Response) {
    try {
      const filter = req.query;

      const result = await listarDirigenteZonaService.listar(filter);

      return res.status(result.status).json(result);
    } catch (error) {
      console.error(
        "[DirigenteZonaController] Error al obtener relaciones:",
        error
      );
      return res
        .status(500)
        .json({ message: "Error al obtener relaciones", error: error });
    }
  }

  async crearDirigenteZona(req: Request, res: Response) {
    try {
      const { body } = req;
      const param: IDirigenteZonaInput = body;

      const result = await insertarDirigenteZonaService.crearDirigenteZona(
        param
      );

      return res.status(result.status).json(result);
    } catch (error) {
      console.error(
        "[DirigenteZonaController] Error al crear relaciones:",
        error
      );
      return res
        .status(500)
        .json({ message: "Error al crear relaciones", error: error });
    }
  }

  async desactivarDirigenteZona(req: Request, res: Response) {
    try {
      const { body } = req;
      const param: IDirigenteZonaBaja = body;

      const result = await bajaDirigenteZonaService.desactivarDirigenteZona(
        param
      );

      return res.status(result.status).json(result);
    } catch (error) {
      console.error(
        "[DirigenteZonaController] Error al desactivar relaciones:",
        error
      );
      return res
        .status(500)
        .json({ message: "Error al desactivar relaciones", error: error });
    }
  }
}
