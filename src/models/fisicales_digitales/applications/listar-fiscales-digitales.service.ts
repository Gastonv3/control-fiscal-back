import {
  getFiscalesDigitalesByFilter,
  getFiscalesDigitalesTotalRegistro,
} from "../fiscales_digitales.model";
import { IFiscalesDigitalesFilter } from "../fisicales_digitales.type";

export class ListarFiscalesDigitalesService {
  async listar(filter: IFiscalesDigitalesFilter) {
    try {
      const [fiscales, total] = await Promise.all([
        getFiscalesDigitalesByFilter(filter),
        getFiscalesDigitalesTotalRegistro(filter),
      ]);

      return {
        status: 200,
        message: "Fiscales digitales encontrados",
        data: {
          fiscales_digitales: fiscales || [],
          total_registros: total?.total_registros || 0,
        },
      };
    } catch (error) {
      console.error("[ListarFiscalesDigitalesService] Error:", error);
      return {
        status: 500,
        message: "Error al listar fiscales digitales",
        error,
      };
    }
  }
}
