import {
  IReferenteZonaInsert,
  IReferenteZona,
  IReferenteZonaBaja,
} from "../referente_zona.type";
import { IResponse } from "../../../utils/response.type";
import {
  getReferenteZonaByFilter,
  insertReferenteZona,
  updateReferenteZona,
} from "../referente_zona.model";
import { pool } from "../../../config/database.config";

export class InsertarReferenteZonaService {
  public async crear(
    data: IReferenteZonaInsert
  ): Promise<IResponse<{ referente_zona: IReferenteZona | null }>> {
    const connection = await pool.getConnection();
    try {
      await connection.beginTransaction();

      const search = await getReferenteZonaByFilter({
        id_referente: data.id_referente,
        id_zona: data.id_zona,
      });

      let resultProcess: IReferenteZona | null = null;
      if (search) {
        resultProcess = await updateReferenteZona(
          {
            id_referente: data.id_referente,
            id_zona: data.id_zona,
            id_usuario: data.id_usuario,
            habilitada: "S",
          },
          connection
        );
      } else {
        resultProcess = await insertReferenteZona(data, connection);
      }

      if (!resultProcess) {
        await connection.rollback();
        return {
          status: 422,
          message: "No se pudo crear la relación referente-zona",
          error: "Sin filas afectadas",
        };
      }

      await connection.commit();
      return {
        status: 200,
        message: "Relación referente-zona creada correctamente",
        data: { referente_zona: resultProcess },
      };
    } catch (error: any) {
      await connection.rollback();
      console.error("[InsertarReferenteZonaService] Error:", error);
      return {
        status: 500,
        message: "Error al crear la relación referente-zona",
        error: error.message,
      };
    } finally {
      connection.release();
    }
  }
}
