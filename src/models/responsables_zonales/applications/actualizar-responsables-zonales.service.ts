import { pool } from "../../../config/database.config";
import { IResponse } from "../../../utils/response.type";
import { getReferenteZonaByFilter } from "../../referente_zona/referente_zona.model";
import {
  getResponsablesZonalesByFilter,
  updateResponsableZonal,
} from "../responsables_zonales.model";
import {
  IResponsablesZonales,
  IResponsablesZonalesUpdate,
} from "../responsables_zonales.type";

export class ActualizarResponsablesZonalesService {
  public async actualizar(
    data: IResponsablesZonalesUpdate
  ): Promise<IResponse<{ responsable: IResponsablesZonales | null }>> {
    const connection = await pool.getConnection();

    try {
      await connection.beginTransaction();

      const ok = await updateResponsableZonal(data, connection);

      if (!ok) {
        await connection.rollback();

        return {
          status: 422,
          message: "No se pudo actualizar el responsable zonal",
          error: "Sin filas afectadas",
        };
      }

      const result = await getResponsablesZonalesByFilter({
        id_responsable: data.id,
      });

      await connection.commit();
      return {
        status: 200,
        message: "Responsable actualizado correctamente",
        data: {
          responsable: result?.[0] || null,
        },
      };
    } catch (error: any) {
      await connection.rollback();

      if (error.message === "DNI_DUPLICADO") {
        return {
          status: 422,
          message: "El DNI ya se encuentra registrado",
        };
      }
      return {
        status: 500,
        message: "Error al actualizar responsable zonal",
        error: error.message,
      };
    } finally {
      connection.release();
    }
  }
}
