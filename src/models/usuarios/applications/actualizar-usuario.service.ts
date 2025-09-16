import { pool } from "../../../config/database.config";
import { updateUsuario } from "../usuarios.model";
import { IUsuarioUpdate } from "../usuarios.type";

export class ActualizarUsuarioService {
  async actualizarUsuario(data: IUsuarioUpdate) {
    const connection = await pool.getConnection();
    try {
      await connection.beginTransaction();

      const usuario = await updateUsuario(data, connection);

      if (!usuario) {
        await connection.rollback();

        return {
          status: 422,
          message: "No se pudo actualizar el usuario",
        };
      }
      await connection.commit();

      return {
        status: 200,
        message: "Usuario actualizado correctamente",
        data: usuario,
      };
    } catch (error: any) {
      await connection.rollback();

      console.error("[ActualizarUsuarioService] Error:", error);
      if (error.message === "USUARIO_NO_ENCONTRADO") {
        return {
          status: 404,
          message: "El usuario no fue encontrado",
        };
      } else if (error.message === "USUARIO_DUPLICADO") {
        return {
          status: 422,
          message: "El usuario ya se encuentra registrado",
        };
      } else if (error.message === "DNI_DUPLICADO") {
        return {
          status: 422,
          message: "El DNI ya se encuentra registrado",
        };
      }
      return {
        status: 500,
        message: "Error al actualizar usuario",
        error,
      };
    }
  }
}
