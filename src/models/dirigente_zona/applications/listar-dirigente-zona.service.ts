import { IResponse } from "../../../utils/response.type";
import { IDirigentesFilter } from "../../dirigentes/dirigentes.type";
import { IDirigenteZonaDetalle } from "../dirigente_zona.type";
import {
  getDirigenteZonaByFilter,
  getDirigenteZonaTotalRegistro,
} from "../dirigente_zona_model";

export class ListarDirigenteZonaService {
  public async listar(filter: IDirigentesFilter): Promise<
    IResponse<{
      dirigente_zona: IDirigenteZonaDetalle[];
      total_registros: number;
    }>
  > {
    try {
      const [zonas, total] = await Promise.all([
        getDirigenteZonaByFilter(filter),
        getDirigenteZonaTotalRegistro(filter),
      ]);

      return {
        status: 200,
        message: "Relaciones dirigente-zona obtenidas correctamente",
        data: {
          dirigente_zona: zonas || [],
          total_registros: total?.total_registros || 0,
        },
      };
    } catch (error: any) {
      return {
        status: 500,
        message: "Error al obtener relaciones dirigente-zona",
        error: error.message,
      };
    }
  }
}
