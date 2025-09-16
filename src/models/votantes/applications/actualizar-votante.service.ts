import { pool } from "../../../config/database.config";
import { updateVotante } from "../votantes.model";
import { IVotantesUpdate } from "../votantes.type";

export class ActualizarVotanteService {
  async actualizarVotante(data: IVotantesUpdate) {
    const connection = await pool.getConnection();

    try {
      await connection.beginTransaction();

      const votante = await updateVotante(data, connection);

      if (!votante) {
        await connection.rollback();
        return {
          status: 422,
          message: "No se pudo actualizar el votante",
        };
      }

      await connection.commit();

      return {
        status: 200,
        message: "Votante actualizado correctamente",
        data: votante,
      };
    } catch (error: any) {
      await connection.rollback();
      console.error("[ActualizarVotanteService] Error:", error);
      if (error.message === "DNI_DUPLICADO") {
        return {
          status: 422,
          message: "El DNI ya se encuentra registrado",
        };
      }
      return {
        status: 500,
        message: "Error al actualizar votante",
        error,
      };
    } finally {
      connection.release();
    }
  }
}
