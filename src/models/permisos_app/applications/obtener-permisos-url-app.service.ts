import { getPermisosUrlAppByFilter } from "../permisos_app.model";
import { IPermisosUrlAppFilter } from "../permisos_app.type";

export default class ObtenerPermisosUrlAppService {
  async listar(filter: IPermisosUrlAppFilter) {
    try {
      const url = await getPermisosUrlAppByFilter(filter);
      const isValidUrl: boolean = url !== null ? true : false;

      if (!isValidUrl) {
        return {
          status: 403,
          message: "No tiene permisos para acceder a esta url",
          data: isValidUrl,
        };
      }

      return {
        status: 200,
        message: "Permisos encontrados",
        data: isValidUrl,
      };
    } catch (error) {
      console.error("[obtenerPermisosUrlAppService] Error:", error);
      return {
        status: 500,
        message: "Error al encontrar url",
        error,
      };
    }
  }
}
