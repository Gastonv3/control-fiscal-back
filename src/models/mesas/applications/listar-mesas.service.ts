import { getMesasByFilter, getMesasTotalRegistro } from "../mesas.model";
import { IMesasFilter } from "../mesas.type";

export class ListarMesasService {
  async listar(filter: IMesasFilter) {
    try {
      const [mesas, total] = await Promise.all([
        getMesasByFilter(filter),
        getMesasTotalRegistro(filter),
      ]);

      return {
        status: 200,
        message: "Mesas encontradas",
        data: {
          mesas: mesas || [],
          total_registros: total?.total_registros || 0,
        },
      };
    } catch (error) {
      console.error("[ListarMesasService] Error:", error);
      return {
        status: 500,
        message: "Error al listar mesas",
        error,
      };
    }
  }
}
