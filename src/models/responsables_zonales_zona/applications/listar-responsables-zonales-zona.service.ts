import { IResponse } from "../../../utils/response.type";
import {
  getResponsableZonalZonaByFilter,
  getResponsableZonalZonaTotalRegistro,
} from "../responsables_zonales_zona.model";
import {
  IResponsableZonalZonaDetalle,
  IResponsableZonalZonaFilter,
} from "../responsables_zonales_zona.type";

export class ListarResponsableZonalZonaService {
  public async listar(filter: IResponsableZonalZonaFilter): Promise<
    IResponse<{
      responsables_zonales_zona: IResponsableZonalZonaDetalle[];
      total_registros: number;
    }>
  > {
    try {
      const [zonas, total] = await Promise.all([
        getResponsableZonalZonaByFilter(filter),
        getResponsableZonalZonaTotalRegistro(filter),
      ]);

      return {
        status: 200,
        message: "Relaciones responsable-zona obtenidas correctamente",
        data: {
          responsables_zonales_zona: zonas || [],
          total_registros: total?.total_registros || 0,
        },
      };
    } catch (error: any) {
      return {
        status: 500,
        message: "Error al obtener relaciones responsable-zona",
        error: error.message,
      };
    }
  }
}
