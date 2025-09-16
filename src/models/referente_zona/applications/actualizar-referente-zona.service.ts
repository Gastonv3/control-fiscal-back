import { IReferenteZonaBaja, IReferenteZona } from "../referente_zona.type";
import { IResponse } from "../../../utils/response.type";
import { updateReferenteZona } from "../referente_zona.model";
import { pool } from "../../../config/database.config";

export class BajaReferenteZonaService {
  public async desactivar(
    data: IReferenteZonaBaja
  ): Promise<IResponse<{ referente_zona: IReferenteZona | null }>> {
    const connection = await pool.getConnection();

    try {
      await connection.beginTransaction();

      const referente_zona = await updateReferenteZona(data, connection);

      if (!referente_zona) {
        await connection.rollback();
        return {
          status: 422,
          message: "No se pudo desactivar la relación referente-zona",
          error: "Sin filas afectadas",
        };
      }

      await connection.commit();
      return {
        status: 200,
        message: "Relación referente-zona desactivada correctamente",
        data: { referente_zona },
      };
    } catch (error: any) {
      await connection.rollback();
      console.error("[BajaReferenteZonaService] Error:", error);
      return {
        status: 500,
        message: "Error al desactivar la relación referente-zona",
        error: error.message,
      };
    } finally {
      connection.release();
    }
  }
}
