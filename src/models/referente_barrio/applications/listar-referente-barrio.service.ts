import { IResponse } from "../../../utils/response.type";
import {
  getReferenteBarrioByFilter,
  getReferenteBarrioTotal,
} from "../referente_barrio.model";
import { IReferenteBarrioFilter } from "../referente_barrio.type";

export class ListarReferenteBarrioService {
  public async listar(filter: IReferenteBarrioFilter) {
    try {
      const [data, total] = await Promise.all([
        getReferenteBarrioByFilter(filter),
        getReferenteBarrioTotal(filter),
      ]);

      return {
        status: 200,
        message: "Relaciones referente-barrio obtenidas correctamente",
        data: {
          referente_barrio: data || [],
          total_registros: total?.total_registros || 0,
        },
      };
    } catch (error: any) {
      return {
        status: 500,
        message: "Error al obtener las relaciones referente-barrio",
        error: error.message,
        data: [],
        total_registros: 0,
      };
    }
  }
}
