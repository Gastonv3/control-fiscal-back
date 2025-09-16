import { pool } from "../../../config/database.config";
import { insertFiscalGeneral } from "../fiscales_generales.model";
import { IParamInsertFiscalesGenerales } from "../fiscales_generales.type";

export class InsertarFiscalGeneralService {
  async crearFiscalGeneral(data: IParamInsertFiscalesGenerales) {
    const connection = await pool.getConnection();

    try {
      await connection.beginTransaction();

      const fiscal = await insertFiscalGeneral(data, connection);

      if (!fiscal) {
        await connection.rollback();

        return {
          status: 422,
          message: "No se pudo insertar el fiscal general",
        };
      }
      await connection.commit();

      return {
        status: 200,
        message: "Fiscal general insertado correctamente",
        data: fiscal,
      };
    } catch (error: any) {
      await connection.rollback();

      console.error("[InsertarFiscalGeneralService] Error:", error);
      if (error.message === "USUARIO_DUPLICADO") {
        return {
          status: 422,
          message: "El usuario ya se encuentra registrado",
        };
      } else if (error.message === "DNI_DUPLICADO") {
        return {
          status: 422,
          message: "El DNI ya se encuentra registrado",
        };
      }
      return {
        status: 500,
        message: "Error al insertar fiscal general",
        error,
      };
    }
  }
}
