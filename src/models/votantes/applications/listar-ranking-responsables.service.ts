import {
  getRankingResponsables,
  getRankingResponsablesTotalRegistros,
} from "../votantes.model";
import { IRankingResponsablesFilter } from "../votantes.type";

export class ListarRankingResponsablesService {
  public async obtener(filter: IRankingResponsablesFilter) {
    try {
      const [ranking, total] = await Promise.all([
        getRankingResponsables(filter),
        getRankingResponsablesTotalRegistros(filter),
      ]);

      return {
        status: 200,
        message: "Ranking de responsables encontrados",
        data: {
          ranking: ranking || [],
          total_registros: total?.total_registros || 0,
        },
      };
    } catch (error) {
      console.error("[ListarRankingResponsablesService] Error:", error);
      return {
        status: 500,
        message: "Error interno al obtener ranking de responsables",
        data: [],
        total_registros: 0,
      };
    }
  }
}
