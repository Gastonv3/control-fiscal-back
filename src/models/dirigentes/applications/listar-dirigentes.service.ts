import { IResponse } from "../../../utils/response.type";
import {
  getDirigentesByFilter,
  getDirigentesTotalRegistro,
} from "../dirigentes.model";
import { IDirigentes, IDirigentesFilter } from "../dirigentes.type";

export class ListarDirigenteService {
  public async listar(
    filter: IDirigentesFilter
  ): Promise<
    IResponse<{ dirigentes: IDirigentes[]; total_registros: number }>
  > {
    try {
      const [dirigentes, total] = await Promise.all([
        getDirigentesByFilter(filter),
        getDirigentesTotalRegistro(filter),
      ]);

      return {
        status: 200,
        message: "Lista de referentes obtenida correctamente",
        data: {
          dirigentes: dirigentes || [],
          total_registros: total?.total_registros || 0,
        },
      };
    } catch (error: any) {
      return {
        status: 500,
        message: "Error al listar referentes",
        error: error.message,
      };
    }
  }
}
