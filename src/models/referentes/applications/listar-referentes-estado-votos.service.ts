import {
  getReferentesEstadoVotos,
  getReferentesEstadoVotosTotalRegistro,
} from "../referentes.model";
import { IReferenteEstadoVotosFilter } from "../referentes.type";

export class ListarReferentesEstadoVotosService {
  async listar(filter: IReferenteEstadoVotosFilter) {
    try {
      const [referentes, total] = await Promise.all([
        getReferentesEstadoVotos(filter),
        getReferentesEstadoVotosTotalRegistro(filter),
      ]);

      return {
        status: 200,
        message: "Dirigentes encontrados",
        data: {
          referentes: referentes || [],
          total_registros: total?.total_registros || 0,
        },
      };
    } catch (error) {
      console.error("[ListarReferentesEstadoVotosService] Error:", error);
      return {
        status: 500,
        message: "Error al listar Dirigentes ",
        error,
      };
    }
  }
}
