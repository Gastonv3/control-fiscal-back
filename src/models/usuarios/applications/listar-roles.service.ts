import { IResponse } from "../../../utils/response.type";
import { getRoles } from "../usuarios.model";
import { IUsuarioRoles } from "../usuarios.type";

export default class ListarRolesService {
  async obtener(): Promise<IResponse<{ roles: IUsuarioRoles[] }>> {
    try {
      const listado = await getRoles();

      return {
        status: 200,
        message: "Roles obtenidos correctamente",
        data: {
          roles: listado || [],
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
