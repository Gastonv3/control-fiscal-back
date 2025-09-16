import {
  getRankingDirigentes,
  getRankingDirigentesTotalRegistros,
} from "../votantes.model";
import { IRankingDirigentesFilter } from "../votantes.type";

export class ListarRankingDirigentesService {
  public async obtener(filter: IRankingDirigentesFilter) {
    try {
      const [ranking, total] = await Promise.all([
        getRankingDirigentes(filter),
        getRankingDirigentesTotalRegistros(filter),
      ]);

      return {
        status: 200,
        message: "Ranking de dirigentes encontrados",
        data: {
          ranking: ranking || [],
          total_registros: total?.total_registros || 0,
        },
      };
    } catch (error) {
      console.error("[ListarRankingDirigentesService] Error:", error);
      return {
        status: 500,
        message: "Error interno al obtener ranking de dirigentes",
        data: [],
        total_registros: 0,
      };
    }
  }
}
