import {
  getReferentesByFilter,
  getReferentesTotalRegistro,
} from "../referentes.model";
import { IReferentesFilter } from "../referentes.type";

export class ListarReferentesService {
  async listar(filter: IReferentesFilter) {
    try {
      const [referentes, total] = await Promise.all([
        getReferentesByFilter(filter),
        getReferentesTotalRegistro(filter),
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
      console.error("[ListarReferentesService] Error:", error);
      return {
        status: 500,
        message: "Error al listar Dirigentes ",
        error,
      };
    }
  }
}
