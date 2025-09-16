import {
  getFiscalesGeneralesByFilter,
  getFiscalesGeneralesTotalRegistro,
} from "../fiscales_generales.model";
import { IFiscalesGeneralesFilter } from "../fiscales_generales.type";

export class ListarFiscalesGeneralesService {
  async listar(filter: IFiscalesGeneralesFilter) {
    try {
      const [fiscales, total] = await Promise.all([
        getFiscalesGeneralesByFilter(filter),
        getFiscalesGeneralesTotalRegistro(filter),
      ]);

      return {
        status: 200,
        message: "Fiscales generales encontrados",
        data: {
          fiscales_generales: fiscales || [],
          total_registros: total?.total_registros || 0,
        },
      };
    } catch (error) {
      console.error("[ListarFiscalesGeneralesService] Error:", error);
      return {
        status: 500,
        message: "Error al listar fiscales generales",
        error,
      };
    }
  }
}
