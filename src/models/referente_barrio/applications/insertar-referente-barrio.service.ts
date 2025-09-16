import { IResponse } from "../../../utils/response.type";
import { pool } from "../../../config/database.config";
import {
  IReferenteBarrio,
  IReferenteBarrioInsert,
} from "../referente_barrio.type";
import {
  getReferenteBarrioByFilter,
  insertReferenteBarrio,
  updateReferenteBarrio,
} from "../referente_barrio.model";

export class InsertarReferenteBarrioService {
  public async crear(
    data: IReferenteBarrioInsert
  ): Promise<IResponse<{ referente_barrio: IReferenteBarrio | null }>> {
    const connection = await pool.getConnection();
    try {
      await connection.beginTransaction();

      const search = await getReferenteBarrioByFilter({
        id_referente: data.id_referente,
        id_barrio: data.id_barrio,
      });

      let resultProcess: IReferenteBarrio | null = null;
      if (search) {
        resultProcess = await updateReferenteBarrio(
          {
            id_referente: data.id_referente,
            id_barrio: data.id_barrio,
            id_usuario: data.id_usuario,
            habilitada: "S",
          },
          connection
        );
      } else {
        resultProcess = await insertReferenteBarrio(data, connection);
      }

      if (!resultProcess) {
        await connection.rollback();
        return {
          status: 422,
          message: "No se pudo crear la relación referente-barrio",
          error: "Sin filas afectadas",
        };
      }

      await connection.commit();
      return {
        status: 200,
        message: "Relación referente-barrio creada correctamente",
        data: { referente_barrio: resultProcess },
      };
    } catch (error: any) {
      await connection.rollback();
      console.error("[InsertarReferenteBarrioService] Error:", error);
      return {
        status: 500,
        message: "Error al crear la relación referente-barrio",
        error: error.message,
      };
    } finally {
      connection.release();
    }
  }
}
