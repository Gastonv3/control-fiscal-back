import { pool } from "../../../config/database.config";
import { insertVotante } from "../votantes.model";
import { IVotantesInsert } from "../votantes.type";

export class InsertarVotanteService {
  public async procesar(data: IVotantesInsert) {
    const connection = await pool.getConnection();

    try {
      await connection.beginTransaction();

      const inserted = await insertVotante(data, connection);
      if (!inserted) {
        await connection.rollback();

        return {
          status: 422,
          message: "No se pudo insertar el votante",
        };
      }

      await connection.commit();

      return {
        status: 200,
        message: "Votante insertado correctamente",
        data: inserted,
      };
    } catch (error: any) {
      console.error("[insertarVotanteService] Error:", error);
      await connection.rollback();

      if (error.message === "DNI_DUPLICADO") {
        return {
          status: 422,
          message: "El DNI ya se encuentra registrado",
        };
      }
      return {
        status: 500,
        message: "Error interno al insertar votante",
      };
    } finally {
      connection.release();
    }
  }
}
