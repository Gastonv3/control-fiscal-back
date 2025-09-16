import { pool } from "../../../config/database.config";
import { updateFiscalGeneral } from "../fiscales_generales.model";
import { IFiscalesGeneralesUpdate } from "../fiscales_generales.type";

export class ActualizarFiscalGeneralService {
  async actualizarFiscalGeneral(data: IFiscalesGeneralesUpdate) {
    const connection = await pool.getConnection();

    try {
      await connection.beginTransaction();

      const fiscal = await updateFiscalGeneral(data, connection);

      if (!fiscal) {
        await connection.rollback();

        return {
          status: 422,
          message: "No se pudo actualizar el fiscal general",
        };
      }

      await connection.commit();

      return {
        status: 200,
        message: "Fiscal general actualizado correctamente",
        data: fiscal,
      };
    } catch (error: any) {
      await connection.rollback();

      console.error("[ActualizarFiscalGeneralService] Error:", error);
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
        message: "Error al actualizar fiscal general",
        error,
      };
    }
  }
}
