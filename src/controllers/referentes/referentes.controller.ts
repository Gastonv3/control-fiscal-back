import { Request, Response } from "express";
import {
  IReferentesInsert,
  IReferentesUpdate,
  IReferenteteParamInsertar,
} from "../../models/referentes/referentes.type";
import { ActualizarReferenteService } from "../../models/referentes/applications/actualizar-referentes.service";
import { InsertarReferenteService } from "../../models/referentes/applications/insertar-referentes.service";
import { ListarReferentesService } from "../../models/referentes/applications/listar-referentes.service";
import { ListarReferentesEstadoVotosService } from "../../models/referentes/applications/listar-referentes-estado-votos.service";

const listarReferentesService = new ListarReferentesService();
const insertarReferenteService = new InsertarReferenteService();
const actualizarReferenteService = new ActualizarReferenteService();
const listarReferentesEstadoVotosService =
  new ListarReferentesEstadoVotosService();

export class ReferentesController {
  async listarReferentes(req: Request, res: Response) {
    try {
      const filter = req.query;
      const result = await listarReferentesService.listar(filter);
      return res.status(result.status).json(result);
    } catch (error) {
      console.error(
        "[ReferentesController] Error al listar referentes:",
        error
      );
      return res.status(500).json({
        status: 500,
        message: "Error interno al listar referentes",
        error,
      });
    }
  }

  async insertarReferente(req: Request, res: Response) {
    try {
      const param: IReferenteteParamInsertar = req.body;
      const result = await insertarReferenteService.crearReferente(param);
      return res.status(result.status).json(result);
    } catch (error) {
      console.error("[ReferentesController] Error al crear referente:", error);
      return res.status(500).json({
        status: 500,
        message: "Error interno al crear referente",
        error,
      });
    }
  }

  async actualizarReferente(req: Request, res: Response) {
    try {
      const param: IReferentesUpdate = req.body;
      const result = await actualizarReferenteService.actualizarReferente(
        param
      );
      return res.status(result.status).json(result);
    } catch (error) {
      console.error(
        "[ReferentesController] Error al actualizar referente:",
        error
      );
      return res.status(500).json({
        status: 500,
        message: "Error interno al actualizar referente",
        error,
      });
    }
  }
  async listarReferentesEstadoVotos(req: Request, res: Response) {
    try {
      const filter = req.query;
      const result = await listarReferentesEstadoVotosService.listar(filter);
      return res.status(result.status).json(result);
    } catch (error) {
      console.error(
        "[ReferentesController] Error al listar referentes:",
        error
      );
      return res.status(500).json({
        status: 500,
        message: "Error interno al listar referentes",
        error,
      });
    }
  }
}
