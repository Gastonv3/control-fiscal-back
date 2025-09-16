import { getPermisosAppByFilter } from "../permisos_app.model";
import { IPermisosAppFilter } from "../permisos_app.type";

export default class ObtenerPermisosAppService {
  async listar(filter: IPermisosAppFilter) {
    try {
      const permisosApp = await getPermisosAppByFilter(filter);
      const isValidUrl: boolean = permisosApp !== null ? true : false;

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
      console.error("[obtenerPermisosAppService] Error:", error);
      return {
        status: 500,
        message: "Error al listar permisos",
        error,
      };
    }
  }
}
