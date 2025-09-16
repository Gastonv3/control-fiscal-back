import {
  getVotantesByFilter,
  getVotantesTotalRegistro,
} from "../votantes.model";
import { IVotantesFilter } from "../votantes.type";

export class ListarVotantesService {
  public async obtener(filter: IVotantesFilter) {
    try {
      const [votantes, total] = await Promise.all([
        getVotantesByFilter(filter),
        getVotantesTotalRegistro(filter),
      ]);

      return {
        status: 200,
        message: "Votantes encontrados",
        data: {
          votantes: votantes || [],
          total_registros: total?.total_registros || 0,
        },
      };
    } catch (error) {
      console.error("[ListarVotantesService] Error:", error);
      return {
        status: 500,
        message: "Error interno al obtener votantes",
        data: [],
        total_registros: 0,
      };
    }
  }
}
