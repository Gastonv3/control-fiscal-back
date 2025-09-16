import { Request, Response } from "express";
import {
  IVotantesInsert,
  IVotantesUpdate,
  IVotoEstadoUpdate,
} from "../../models/votantes/votantes.type";
import { ActualizarVotanteService } from "../../models/votantes/applications/actualizar-votante.service";
import { AnularVotoVotanteService } from "../../models/votantes/applications/anular-voto-votante.service";
import { ListarVotantesService } from "../../models/votantes/applications/listar-votantes.service";
import { ProcesarVotoVotanteService } from "../../models/votantes/applications/procesar-voto-votante.service";
import { InsertarVotanteService } from "../../models/votantes/applications/insertar-votante.service";
import { ObtenerEstadoVotantesService } from "../../models/votantes/applications/obtener-estado-votantes.service";
import { ListarRankingDirigentesService } from "../../models/votantes/applications/listar-ranking-dirigentes.service";
import { ListarRankingReferentesService } from "../../models/votantes/applications/listar-ranking-referentes.service";
import { ListarRankingResponsablesService } from "../../models/votantes/applications/listar-ranking-responsables.service";

const listarVotantesService = new ListarVotantesService();
const obtenerEstadoVotantesService = new ObtenerEstadoVotantesService();
const actualizarVotanteService = new ActualizarVotanteService();
const anularVotoVotanteService = new AnularVotoVotanteService();
const insertarVotanteService = new InsertarVotanteService();
const procesarVotoVotanteService = new ProcesarVotoVotanteService();
const listarRankingDirigentesService = new ListarRankingDirigentesService();
const listarRankingReferentesService = new ListarRankingReferentesService();
const listarRankingResponsablesService = new ListarRankingResponsablesService();

export class VotantesController {
  async listarVotantes(req: Request, res: Response) {
    try {
      const filter = req.query;
      const result = await listarVotantesService.obtener(filter);
      return res.status(result.status).json(result);
    } catch (error) {
      console.error("[VotantesController] Error al listar votantes:", error);
      return res.status(500).json({
        status: 500,
        message: "Error interno al listar votantes",
        error,
      });
    }
  }

  async obtenerEstadoVotantes(req: Request, res: Response) {
    try {
      const filter = req.query;
      const result = await obtenerEstadoVotantesService.obtener(filter);
      return res.status(result.status).json(result);
    } catch (error) {
      console.error(
        "[VotantesController] Error al obtener estado de votantes:",
        error
      );
      return res.status(500).json({
        status: 500,
        message: "Error interno al obtener estado de votantes",
        error,
      });
    }
  }

  async insertarVotante(req: Request, res: Response) {
    try {
      const param: IVotantesInsert = req.body;
      const result = await insertarVotanteService.procesar(param);
      return res.status(result.status).json(result);
    } catch (error) {
      console.error("[VotantesController] Error al insertar votante:", error);
      return res.status(500).json({
        status: 500,
        message: "Error interno al insertar votante",
        error,
      });
    }
  }

  async actualizarVotante(req: Request, res: Response) {
    try {
      const param: IVotantesUpdate = req.body;
      const result = await actualizarVotanteService.actualizarVotante(param);
      return res.status(result.status).json(result);
    } catch (error) {
      console.error("[VotantesController] Error al actualizar votante:", error);
      return res.status(500).json({
        status: 500,
        message: "Error interno al actualizar votante",
        error,
      });
    }
  }

  async votar(req: Request, res: Response) {
    try {
      const param: IVotoEstadoUpdate = req.body;
      const result = await procesarVotoVotanteService.procesar(param);
      return res.status(result.status).json(result);
    } catch (error) {
      console.error("[VotantesController] Error al registrar voto:", error);
      return res.status(500).json({
        status: 500,
        message: "Error interno al registrar voto",
        error,
      });
    }
  }

  async anularVoto(req: Request, res: Response) {
    try {
      const param: IVotoEstadoUpdate = req.body;
      const result = await anularVotoVotanteService.procesar(param);
      return res.status(result.status).json(result);
    } catch (error) {
      console.error("[VotantesController] Error al anular voto:", error);
      return res.status(500).json({
        status: 500,
        message: "Error interno al anular voto",
        error,
      });
    }
  }

  async listarRankingResponsables(req: Request, res: Response) {
    try {
      const filter = req.query;
      const result = await listarRankingResponsablesService.obtener(filter);
      return res.status(result.status).json(result);
    } catch (error) {
      console.error(
        "[VotantesController] Error al listar ranking responsables:",
        error
      );
      return res.status(500).json({
        status: 500,
        message: "Error interno al listar ranking responsables",
        error,
      });
    }
  }

  async listarRankingDirigentes(req: Request, res: Response) {
    try {
      const filter = req.query;
      const result = await listarRankingDirigentesService.obtener(filter);
      return res.status(result.status).json(result);
    } catch (error) {
      console.error(
        "[VotantesController] Error al listar ranking dirigentes:",
        error
      );
      return res.status(500).json({
        status: 500,
        message: "Error interno al listar ranking dirigentes",
        error,
      });
    }
  }

  async listarRankingReferentes(req: Request, res: Response) {
    try {
      const filter = req.query;
      const result = await listarRankingReferentesService.obtener(filter);
      return res.status(result.status).json(result);
    } catch (error) {
      console.error(
        "[VotantesController] Error al listar ranking referentes:",
        error
      );
      return res.status(500).json({
        status: 500,
        message: "Error interno al listar ranking referentes",
        error,
      });
    }
  }
}
