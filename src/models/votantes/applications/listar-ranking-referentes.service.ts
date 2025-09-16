import {
  getRankingReferentes,
  getRankingReferentesTotalRegistros,
} from "../votantes.model";
import { IRankingReferentesFilter } from "../votantes.type";

export class ListarRankingReferentesService {
  public async obtener(filter: IRankingReferentesFilter) {
    try {
      const [ranking, total] = await Promise.all([
        getRankingReferentes(filter),
        getRankingReferentesTotalRegistros(filter),
      ]);

      return {
        status: 200,
        message: "Ranking de referentes encontrados",
        data: {
          ranking: ranking || [],
          total_registros: total?.total_registros || 0,
        },
      };
    } catch (error) {
      console.error("[ListarRankingReferentesService] Error:", error);
      return {
        status: 500,
        message: "Error interno al obtener ranking de referentes",
        data: [],
        total_registros: 0,
      };
    }
  }
}
