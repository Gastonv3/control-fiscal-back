import { IResponse } from "../../../utils/response.type";
import {
  getUsuariosByFilter,
  getUsuariosTotalRegistro,
} from "../usuarios.model";
import { IUsuario, IUsuarioFilter } from "../usuarios.type";

export default class ListarUsuariosService {
  async obtener(
    filter: IUsuarioFilter
  ): Promise<IResponse<{ usuarios: IUsuario[]; total_registros: number }>> {
    try {
      const listado = await getUsuariosByFilter(filter);
      const totalRegistros = await getUsuariosTotalRegistro(filter);

      return {
        status: 200,
        message: "Usuarios obtenidos correctamente",
        data: {
          usuarios: listado || [],
          total_registros: totalRegistros?.total_registros || 0,
        },
      };
    } catch (error) {
      console.log(error);

      return {
        status: 500,
        message: "Error interno del servidor",
        error: error instanceof Error ? error.message : "Error desconocido",
      };
    }
  }
}
