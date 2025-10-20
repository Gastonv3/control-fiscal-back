import { pool } from "../../../config/database.config";
import { updateEscuelaZona } from "../escuelas.model";
import { IEscuelasUpdateZona } from "../escuelas.type";

export class ActualizarEscuelaZonaService {
  async actualizarZonaEscuela(data: IEscuelasUpdateZona) {
    const connection = await pool.getConnection();
    try {
      await connection.beginTransaction();

      const escuela = await updateEscuelaZona(data, connection);

      if (!escuela) {
        await connection.rollback();

        return {
          status: 422,
          message: "No se pudo actualizar la zona de la escuela",
        };
      }
      await connection.commit();

      return {
        status: 200,
        message: "Zona de la escuela actualizada correctamente",
        data: escuela,
      };
    } catch (error: any) {
      await connection.rollback();

      console.error("[ActualizarEscuelaZonaService] Error:", error);
      if (error.message === "ESCULA_NO_ENCONTRADA") {
        return {
          status: 404,
          message: "La escuela no fue encontrada",
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
        message: "Error al actualizar la escuela",
        error,
      };
    } finally {
      connection.release();
    }
  }
}
