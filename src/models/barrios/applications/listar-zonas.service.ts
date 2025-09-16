import { IResponse } from "../../../utils/response.type";
import { getBarriosByFilter, getBarriosTotalRegistro } from "../barrios.model";
import { IBarrioFilter, IBarrio } from "../barrios.type";

export class ListarBarrioService {
  public async listar(
    filter: IBarrioFilter
  ): Promise<IResponse<{ barrios: IBarrio[]; total_registros: number }>> {
    try {
      const [barrios, total] = await Promise.all([
        getBarriosByFilter(filter),
        getBarriosTotalRegistro(filter),
      ]);

      return {
        status: 200,
        message: "Lista de barrios obtenida correctamente",
        data: {
          barrios: barrios || [],
          total_registros: total?.total_registros || 0,
        },
      };
    } catch (error: any) {
      return {
        status: 500,
        message: "Error al listar barrios",
        error: error.message,
      };
    }
  }
}
