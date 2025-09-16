import { IResponse } from "../../../utils/response.type";
import {
  getReferenteZonaByFilter,
  getReferenteZonaTotal,
} from "../referente_zona.model";
import { IReferenteZonaFilter } from "../referente_zona.type";

export class ListarReferenteZonaService {
  public async listar(filter: IReferenteZonaFilter) {
    try {
      const [data, total] = await Promise.all([
        getReferenteZonaByFilter(filter),
        getReferenteZonaTotal(filter),
      ]);

      return {
        status: 200,
        message: "Relaciones referente-zona obtenidas correctamente",
        data: {
          referente_zona: data || [],
          total_registros: total?.total_registros || 0,
        },
      };
    } catch (error: any) {
      return {
        status: 500,
        message: "Error al obtener las relaciones referente-zona",
        error: error.message,
        data: [],
        total_registros: 0,
      };
    }
  }
}
