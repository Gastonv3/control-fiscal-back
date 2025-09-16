import { pool } from "../../../config/database.config";
import { IResponse } from "../../../utils/response.type";
import { IDirigentesFilter } from "../../dirigentes/dirigentes.type";
import {
  IDirigenteZonaInput,
  IDirigenteZonaDetalle,
} from "../dirigente_zona.type";
import {
  insertDirigenteZona,
  getDirigenteZonaByFilter,
  bajaDirigenteZona,
} from "../dirigente_zona_model";

export class InsertarDirigenteZonaService {
  public async crearDirigenteZona(
    data: IDirigenteZonaInput
  ): Promise<IResponse<{ dirigente_zona: IDirigenteZonaDetalle[] }>> {
    const connection = await pool.getConnection();

    try {
      await connection.beginTransaction();

      const search = await getDirigenteZonaByFilter({
        id_dirigente: data.id_dirigente,
        id_zona: data.id_zona,
      });
      let resultProcess: boolean = false;
      if (search) {
        resultProcess = await bajaDirigenteZona(
          {
            id_dirigente: data.id_dirigente,
            id_zona: data.id_zona,
            id_usuario: data.id_usuario,
            habilitada: "S",
          },
          connection
        );
      } else {
        resultProcess = await insertDirigenteZona(data, connection);
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

      const filter: IDirigentesFilter = {
        id_dirigente: data.id_dirigente,
      };

      const result = await getDirigenteZonaByFilter(filter);
      await connection.commit();

      return {
        status: 200,
        message: "Relación dirigente-zona insertada correctamente",
        data: {
          dirigente_zona: result || [],
        },
      };
    } catch (error: any) {
      await connection.rollback();

      return {
        status: 500,
        message: "Error al insertar la relación dirigente-zona",
        error: error.message,
      };
    } finally {
      connection.release();
    }
  }
}
