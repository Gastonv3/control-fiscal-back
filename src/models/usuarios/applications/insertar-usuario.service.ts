import { IUsuarioInsert } from "../usuarios.type";
import { pool } from "../../../config/database.config";
import { insertarUsuario } from "../usuarios.model";

export class InsertarUsuarioService {
  async crearUsuario(data: IUsuarioInsert) {
    const connection = await pool.getConnection();
    try {
      await connection.beginTransaction();

      const usuario = await insertarUsuario(data, connection);

      if (!usuario) {
        await connection.rollback();

        return {
          status: 422,
          message: "No se pudo insertar el usuario",
        };
      }
      await connection.commit();

      return {
        status: 200,
        message: "Usuario insertado correctamente",
        data: usuario,
      };
    } catch (error: any) {
      await connection.rollback();

      console.error("[InsertarUsuarioService] Error:", error);
      if (error.message === "USUARIO_DUPLICADO") {
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
        message: "Error al insertar fiscal general",
        error,
      };
    }
  }
}
