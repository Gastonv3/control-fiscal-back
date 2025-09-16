import { pool } from "../../../config/database.config";
import { IResponse } from "../../../utils/response.type";
import {
  getResponsableZonalZonaByFilter,
  bajaResponsableZonalZona,
  insertResponsableZonalZona,
} from "../responsables_zonales_zona.model";
import {
  IResponsableZonalZonaDetalle,
  IResponsableZonalZonaFilter,
  IResponsableZonalZonaInput,
} from "../responsables_zonales_zona.type";

export class InsertarResponsableZonalZonaService {
  public async crearResponsableZonalZona(
    data: IResponsableZonalZonaInput
  ): Promise<IResponse<{ responsable_zona: IResponsableZonalZonaDetalle[] }>> {
    const connection = await pool.getConnection();

    try {
      await connection.beginTransaction();

      const search = await getResponsableZonalZonaByFilter({
        id_responsable: data.id_responsable,
        id_zona: data.id_zona,
      });
      let resultProcess: boolean = false;
      if (search) {
        resultProcess = await bajaResponsableZonalZona(
          {
            id_responsable: data.id_responsable,
            id_zona: data.id_zona,
            id_usuario: data.id_usuario,
            habilitada: "S",
          },
          connection
        );
      } else {
        resultProcess = await insertResponsableZonalZona(data, connection);
      }

      // const ok = await insertDirigenteZona(data, connection);

      if (!resultProcess) {
        await connection.rollback();

        return {
          status: 422,
          message: "No se pudo insertar la relación dirigente-zona",
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
        message: "Relación responsable-zona insertada correctamente",
        data: {
          responsable_zona: result || [],
        },
      };
    } catch (error: any) {
      await connection.rollback();

      return {
        status: 500,
        message: "Error al insertar la relación responsable-zona",
        error: error.message,
      };
    } finally {
      connection.release();
    }
  }
}
