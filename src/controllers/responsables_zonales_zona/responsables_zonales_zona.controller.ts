import { Request, Response } from "express";
import {
  IResponsableZonalZonaBaja,
  IResponsableZonalZonaInput,
} from "../../models/responsables_zonales_zona/responsables_zonales_zona.type";
import { InsertarResponsableZonalZonaService } from "../../models/responsables_zonales_zona/applications/insertar-responsables-zonales-zona.service";
import { ListarResponsableZonalZonaService } from "../../models/responsables_zonales_zona/applications/listar-responsables-zonales-zona.service";
import { BajaResponsablesZonalesZonaService } from "../../models/responsables_zonales_zona/applications/baja-responsables-zonales-zona.service";

const listarService = new ListarResponsableZonalZonaService();
const insertarService = new InsertarResponsableZonalZonaService();
const bajaService = new BajaResponsablesZonalesZonaService();

export class ResponsablesZonalesZonaController {
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
      const data: IResponsableZonalZonaInput = req.body;
      const result = await insertarService.crearResponsableZonalZona(data);
      return res.status(result.status).json(result);
    } catch (error) {
      console.error("[ReferenteZonaController] Error al crear:", error);
      return res.status(500).json({ message: "Error al crear", error });
    }
  }

  async desactivar(req: Request, res: Response) {
    try {
      const data: IResponsableZonalZonaBaja = req.body;
      const result = await bajaService.desactivarResponsableZonalZona(data);
      return res.status(result.status).json(result);
    } catch (error) {
      console.error("[ReferenteZonaController] Error al desactivar:", error);
      return res.status(500).json({ message: "Error al desactivar", error });
    }
  }
}
