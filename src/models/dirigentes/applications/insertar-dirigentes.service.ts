import { PoolConnection } from "mysql2";
import { pool } from "../../../config/database.config";
import { IResponse } from "../../../utils/response.type";
import { IDirigenteZonaInput } from "../../dirigente_zona/dirigente_zona.type";
import { getDirigentesByFilter, insertDirigente } from "../dirigentes.model";
import { IDirigentes, IDirigenteParamInsertar } from "../dirigentes.type";
import { insertDirigenteZona } from "../../dirigente_zona/dirigente_zona_model";

export class InsertarDirigenteService {
  public async crear(
    data: IDirigenteParamInsertar
  ): Promise<IResponse<{ dirigente: IDirigentes | null }>> {
    const connection = await pool.getConnection();

    try {
      await connection.beginTransaction();

      const insertId = await insertDirigente(data.dirigente, connection);

      if (!insertId) {
        await connection.rollback();

        return {
          status: 422,
          message: "No se pudo insertar el Referente",
          error: "Sin filas afectadas",
        };
      }

      // const zonas = this.parseZona(data.zona_dirigente, insertId);

      // if (zonas.length == 0) {
      //   return {
      //     status: 422,
      //     message: "No se pudo insertar las zonas del Referente",
      //     error: "Sin filas afectadas",
      //   };
      // }
      // for (const zona of zonas) {
      //   const result = await insertDirigenteZona(zona, connection);
      //   if (!result) {
      //     await connection.rollback();
      //     return {
      //       status: 422,
      //       message: "No se pudo insertar la zona del Referente",
      //       error: "Sin filas afectadas",
      //     };
      //   }
      // }

      if (!insertId) {
        await connection.rollback();
        return {
          status: 422,
          message: "No se pudo insertar el Referente",
          error: "Sin filas afectadas",
        };
      }
      await connection.commit();

      const result = await getDirigentesByFilter({ id_dirigente: insertId });

      return {
        status: 200,
        message: "Referente insertado correctamente",
        data: {
          dirigente: result?.[0] || null,
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
        message: "Error al insertar Referente",
        error: error.message,
      };
    } finally {
      connection.release();
    }
  }

  // public parseZona(
  //   zona: IDirigenteParamInsertar["zona_dirigente"],
  //   id_dirigente: number
  // ): IDirigenteZonaInput[] {
  //   const listado: IDirigenteZonaInput[] = [];
  //   if (zona && zona.length > 0) {
  //     zona.forEach((item) => {
  //       listado.push({
  //         id_zona: item.id_zona,
  //         id_usuario: item.id_usuario,
  //         id_dirigente: id_dirigente,
  //       });
  //     });
  //   }
  //   return listado;
  // }
}
