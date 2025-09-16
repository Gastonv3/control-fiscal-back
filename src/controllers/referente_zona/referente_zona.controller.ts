import { Request, Response } from "express";
import { ListarReferenteZonaService } from "../../models/referente_zona/applications/listar-referente-zona.service";
import { InsertarReferenteZonaService } from "../../models/referente_zona/applications/insertar-referente-zona.service";
import {
  IReferenteZonaBaja,
  IReferenteZonaInsert,
} from "../../models/referente_zona/referente_zona.type";
import { BajaReferenteZonaService } from "../../models/referente_zona/applications/actualizar-referente-zona.service";

const listarService = new ListarReferenteZonaService();
const insertarService = new InsertarReferenteZonaService();
const bajaService = new BajaReferenteZonaService();

export class ReferenteZonaController {
  async listar(req: Request, res: Response) {
    try {
      const result = await listarService.listar(req.query);
      return res.status(result.status).json(result);
    } catch (error) {
      console.error("[ReferenteZonaController] Error al listar:", error);
      return res.status(500).json({ message: "Error al listar", error });
    }
  }

  async crear(req: Request, res: Response) {
    try {
      const data: IReferenteZonaInsert = req.body;
      const result = await insertarService.crear(data);
      return res.status(result.status).json(result);
    } catch (error) {
      console.error("[ReferenteZonaController] Error al crear:", error);
      return res.status(500).json({ message: "Error al crear", error });
    }
  }

  async desactivar(req: Request, res: Response) {
    try {
      const data: IReferenteZonaBaja = req.body;
      const result = await bajaService.desactivar(data);
      return res.status(result.status).json(result);
    } catch (error) {
      console.error("[ReferenteZonaController] Error al desactivar:", error);
      return res.status(500).json({ message: "Error al desactivar", error });
    }
  }
}
