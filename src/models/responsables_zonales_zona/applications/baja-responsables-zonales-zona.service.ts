import { pool } from "../../../config/database.config";
import { IResponse } from "../../../utils/response.type";
import {
  bajaResponsableZonalZona,
  getResponsableZonalZonaByFilter,
} from "../responsables_zonales_zona.model";
import {
  IResponsableZonalZonaBaja,
  IResponsableZonalZonaDetalle,
  IResponsableZonalZonaFilter,
} from "../responsables_zonales_zona.type";

export class BajaResponsablesZonalesZonaService {
  public async desactivarResponsableZonalZona(
    data: IResponsableZonalZonaBaja
  ): Promise<IResponse<{ responsable_zona: IResponsableZonalZonaDetalle[] }>> {
    const connection = await pool.getConnection();

    try {
      await connection.beginTransaction();

      const ok = await bajaResponsableZonalZona(data, connection);

      if (!ok) {
        await connection.rollback();
        return {
          status: 422,
          message: "No se pudo desactivar la relación dirigente-zona",
          error: "Sin filas afectadas",
        };
      }

      const filter: IResponsableZonalZonaFilter = {
        id_responsable: data.id_responsable,
      };

      const result = await getResponsableZonalZonaByFilter(filter);

      await connection.commit();
      return {
        status: 200,
        message: "Relación responsable-zona desactivada correctamente",
        data: {
          responsable_zona: result || [],
        },
      };
    } catch (error: any) {
      await connection.rollback();
      return {
        status: 500,
        message: "Error al desactivar la relación responsable-zona",
        error: error.message,
      };
    } finally {
      connection.release();
    }
  }
}
