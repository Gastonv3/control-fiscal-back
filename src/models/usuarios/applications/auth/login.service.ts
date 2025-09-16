import { IResponse } from "../../../../utils/response.type";
import { getUsuarioByCredenciales } from "../../usuarios.model";
import { IUsuario, IUsuarioAuth, IUsuarioFilter } from "../../usuarios.type";

export class LoginService {
  async login(filter: IUsuarioFilter): Promise<IResponse<IUsuarioAuth>> {
    try {
      // Aquí iría la lógica para autenticar al usuario
      // Por ejemplo, llamar a un método del modelo de usuario para verificar credenciales

      const usuario = await getUsuarioByCredenciales(filter);
      if (!usuario) {
        return {
          status: 422,
          message: "Usuario o contraseña incorrectos",
          error: "Credenciales inválidas",
        };
      }
      // Si las credenciales son válidas, retornar el usuario
      return {
        status: 200,
        message: "Inicio de sesión exitoso",
        data: usuario,
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
