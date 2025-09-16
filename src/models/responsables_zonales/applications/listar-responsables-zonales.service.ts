import { IResponse } from "../../../utils/response.type";
import {
  getResponsablesZonalesByFilter,
  getResponsablesZonalesTotalRegistro,
} from "../responsables_zonales.model";
import {
  IResponsablesZonalesFilter,
  IResponsablesZonales,
} from "../responsables_zonales.type";

export class ListarResponsableZonalesService {
  public async listar(
    filter: IResponsablesZonalesFilter
  ): Promise<
    IResponse<{ responsables: IResponsablesZonales[]; total_registros: number }>
  > {
    try {
      const [responsables, total] = await Promise.all([
        getResponsablesZonalesByFilter(filter),
        getResponsablesZonalesTotalRegistro(filter),
      ]);

      return {
        status: 200,
        message: "Lista de responsables zonales obtenida correctamente",
        data: {
          responsables: responsables || [],
          total_registros: total?.total_registros || 0,
        },
      };
    } catch (error: any) {
      return {
        status: 500,
        message: "Error al listar responsables zonales",
        error: error.message,
      };
    }
  }
}
