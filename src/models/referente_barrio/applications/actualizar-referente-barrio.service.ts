import {
  IReferenteBarrio,
  IReferenteBarrioBaja,
} from "../referente_barrio.type";
import { IResponse } from "../../../utils/response.type";
import { pool } from "../../../config/database.config";
import { updateReferenteBarrio } from "../referente_barrio.model";

export class BajaReferenteBarrioService {
  public async desactivar(
    data: IReferenteBarrioBaja
  ): Promise<IResponse<{ referente_barrio: IReferenteBarrio | null }>> {
    const connection = await pool.getConnection();

    try {
      await connection.beginTransaction();

      const referente_barrio = await updateReferenteBarrio(data, connection);

      if (!referente_barrio) {
        await connection.rollback();
        return {
          status: 422,
          message: "No se pudo desactivar la relación referente-barrio",
          error: "Sin filas afectadas",
        };
      }

      await connection.commit();
      return {
        status: 200,
        message: "Relación referente-barrio desactivada correctamente",
        data: { referente_barrio },
      };
    } catch (error: any) {
      await connection.rollback();
      console.error("[BajaReferenteBarrioService] Error:", error);
      return {
        status: 500,
        message: "Error al desactivar la relación referente-barrio",
        error: error.message,
      };
    } finally {
      connection.release();
    }
  }
}
