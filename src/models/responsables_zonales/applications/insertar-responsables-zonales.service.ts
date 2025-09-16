import { pool } from "../../../config/database.config";
import { IResponse } from "../../../utils/response.type";
import {
  IResponsablesZonales,
  IResponsablesZonalesParamInsertar,
} from "../responsables_zonales.type";
import {
  getResponsablesZonalesByFilter,
  insertResponsableZonal,
} from "../responsables_zonales.model";
import { IResponsableZonalZonaInput } from "../../responsables_zonales_zona/responsables_zonales_zona.type";
import { insertResponsableZonalZona } from "../../responsables_zonales_zona/responsables_zonales_zona.model";

export class InsertarResponsablesZonalesService {
  public async crear(
    data: IResponsablesZonalesParamInsertar
  ): Promise<IResponse<{ responsable: IResponsablesZonales | null }>> {
    const connection = await pool.getConnection();

    try {
      await connection.beginTransaction();

      const insertId = await insertResponsableZonal(
        data.responsable,
        connection
      );

      if (!insertId) {
        await connection.rollback();

        return {
          status: 422,
          message: "No se pudo insertar el responsable zonal",
          error: "Sin filas afectadas",
        };
      }

      // const zonas = this.parseZona(data.zona_responsable, insertId);

      // if (zonas.length == 0) {
      //   return {
      //     status: 422,
      //     message: "No se pudo insertar las zonas del responsable zonal",
      //     error: "Sin filas afectadas",
      //   };
      // }
      // for (const zona of zonas) {
      //   const result = await insertResponsableZonalZona(zona, connection);
      //   if (!result) {
      //     await connection.rollback();
      //     return {
      //       status: 422,
      //       message: "No se pudo insertar la zona del responsable zonal",
      //       error: "Sin filas afectadas",
      //     };
      //   }
      // }

      const result = await getResponsablesZonalesByFilter({
        id_responsable: insertId,
      });

      await connection.commit();
      return {
        status: 200,
        message: "responsable zona insertado correctamente",
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
        message: "Error al insertar responsable ",
        error: error.message,
      };
    } finally {
      connection.release();
    }
  }

  // public parseZona(
  //   zona: IResponsablesZonalesParamInsertar["zona_responsable"],
  //   id_responsable: number
  // ): IResponsableZonalZonaInput[] {
  //   const listado: IResponsableZonalZonaInput[] = [];
  //   if (zona && zona.length > 0) {
  //     zona.forEach((item) => {
  //       listado.push({
  //         id_zona: item.id_zona,
  //         id_usuario: item.id_usuario,
  //         id_responsable: id_responsable,
  //       });
  //     });
  //   }
  //   return listado;
  // }
}
