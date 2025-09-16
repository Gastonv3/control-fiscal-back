import { Router } from "express";
import { VotantesController } from "../../controllers/votantes/votantes.controller";
import VotantesValidator from "./votantes.validator";
import { validarRequest } from "../../middlewares/validate-field.middlewares";

export class VotantesRoutes {
  public router: Router;

  constructor() {
    this.router = Router();
    this.routes();
  }

  private routes() {
    this.router.get(
      "/",
      VotantesValidator.listar(),
      validarRequest,
      new VotantesController().listarVotantes
    );

    this.router.get(
      "/estado-votantes",
      VotantesValidator.obtenerEstadoVotantes(),
      validarRequest,
      new VotantesController().obtenerEstadoVotantes
    );

    this.router.post(
      "/",
      VotantesValidator.crear(),
      validarRequest,
      new VotantesController().insertarVotante
    );

    this.router.put(
      "/",
      VotantesValidator.actualizar(),
      validarRequest,
      new VotantesController().actualizarVotante
    );

    this.router.put(
      "/procesar-voto",
      VotantesValidator.votar(),
      validarRequest,
      new VotantesController().votar
    );

    this.router.put(
      "/anular-voto",
      VotantesValidator.anular(),
      validarRequest,
      new VotantesController().anularVoto
    );

    this.router.get(
      "/ranking-responsables",
      VotantesValidator.listarRankingResponsables(),
      validarRequest,
      new VotantesController().listarRankingResponsables
    );

    this.router.get(
      "/ranking-dirigentes",
      VotantesValidator.listarRankingDirigentes(),
      validarRequest,
      new VotantesController().listarRankingDirigentes
    );

    this.router.get(
      "/ranking-referentes",
      VotantesValidator.listarRankingReferentes(),
      validarRequest,
      new VotantesController().listarRankingReferentes
    );
  }
}
