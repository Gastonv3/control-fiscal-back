import { pool } from "../../../config/database.config";
import { marcarVotanteComoVotado } from "../votantes.model";
import { IVotoEstadoUpdate } from "../votantes.type";

export class ProcesarVotoVotanteService {
  public async procesar(data: IVotoEstadoUpdate) {
    const connection = await pool.getConnection();

    try {
      await connection.beginTransaction();

      const updated = await marcarVotanteComoVotado(data, connection);
      if (!updated) {
        await connection.rollback();
        return {
          status: 422,
          message: "No se pudo registrar el voto",
        };
      }
      await connection.commit();

      return {
        status: 200,
        message: "Voto registrado correctamente",
        data: updated,
      };
    } catch (error) {
      await connection.rollback();

      console.error("[VotarService] Error:", error);
      return {
        status: 500,
        message: "Error interno al registrar voto",
      };
    } finally {
      connection.release();
    }
  }
}
