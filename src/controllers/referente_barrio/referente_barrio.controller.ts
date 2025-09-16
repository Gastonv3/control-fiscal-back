import { Request, Response } from "express";
import { BajaReferenteBarrioService } from "../../models/referente_barrio/applications/actualizar-referente-barrio.service";
import { InsertarReferenteBarrioService } from "../../models/referente_barrio/applications/insertar-referente-barrio.service";
import { ListarReferenteBarrioService } from "../../models/referente_barrio/applications/listar-referente-barrio.service";
import {
  IReferenteBarrioBaja,
  IReferenteBarrioInsert,
} from "../../models/referente_barrio/referente_barrio.type";

const listarService = new ListarReferenteBarrioService();
const insertarService = new InsertarReferenteBarrioService();
const bajaService = new BajaReferenteBarrioService();

export class ReferenteBarrioController {
  async listar(req: Request, res: Response) {
    try {
      const result = await listarService.listar(req.query);
      return res.status(result.status).json(result);
    } catch (error) {
      console.error("[ReferenteBarrioController] Error al listar:", error);
      return res.status(500).json({ message: "Error al listar", error });
    }
  }

  async crear(req: Request, res: Response) {
    try {
      const data: IReferenteBarrioInsert = req.body;
      const result = await insertarService.crear(data);
      return res.status(result.status).json(result);
    } catch (error) {
      console.error("[ReferenteBarrioController] Error al crear:", error);
      return res.status(500).json({ message: "Error al crear", error });
    }
  }

  async desactivar(req: Request, res: Response) {
    try {
      const data: IReferenteBarrioBaja = req.body;
      const result = await bajaService.desactivar(data);
      return res.status(result.status).json(result);
    } catch (error) {
      console.error("[ReferenteBarrioController] Error al desactivar:", error);
      return res.status(500).json({ message: "Error al desactivar", error });
    }
  }
}
