import { pool } from "../../../config/database.config";
import { anularVotoVotante } from "../votantes.model";
import { IVotoEstadoUpdate } from "../votantes.type";

export class AnularVotoVotanteService {
  public async procesar(data: IVotoEstadoUpdate) {
    const connection = await pool.getConnection();

    try {
      await connection.beginTransaction();

      const updated = await anularVotoVotante(data, connection);
      if (!updated) {
        await connection.rollback();
        return {
          status: 422,
          message: "No se pudo anular el voto",
        };
      }
      await connection.commit();

      return {
        status: 200,
        message: "Voto anulado correctamente",
        data: updated,
      };
    } catch (error) {
      await connection.rollback();
      console.error("[AnularVotoService] Error:", error);
      return {
        status: 500,
        message: "Error interno al anular voto",
      };
    } finally {
      connection.release();
    }
  }
}
