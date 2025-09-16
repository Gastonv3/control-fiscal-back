import { pool } from "../../../config/database.config";
import { IResponse } from "../../../utils/response.type";
import { IDirigentesFilter } from "../../dirigentes/dirigentes.type";
import {
  IDirigenteZonaBaja,
  IDirigenteZonaDetalle,
} from "../dirigente_zona.type";
import {
  bajaDirigenteZona,
  getDirigenteZonaByFilter,
} from "../dirigente_zona_model";

export class BajaDirigenteZonaService {
  public async desactivarDirigenteZona(
    data: IDirigenteZonaBaja
  ): Promise<IResponse<{ dirigente_zona: IDirigenteZonaDetalle[] }>> {
    const connection = await pool.getConnection();

    try {
      await connection.beginTransaction();

      const ok = await bajaDirigenteZona(data, connection);

      if (!ok) {
        await connection.rollback();
        return {
          status: 422,
          message: "No se pudo desactivar la relación dirigente-zona",
          error: "Sin filas afectadas",
        };
      }

      const filter: IDirigentesFilter = {
        id_dirigente: data.id_dirigente,
      };

      const result = await getDirigenteZonaByFilter(filter);

      await connection.commit();
      return {
        status: 200,
        message: "Relación dirigente-zona desactivada correctamente",
        data: {
          dirigente_zona: result || [],
        },
      };
    } catch (error: any) {
      await connection.rollback();
      return {
        status: 500,
        message: "Error al desactivar la relación dirigente-zona",
        error: error.message,
      };
    } finally {
      connection.release();
    }
  }
}
