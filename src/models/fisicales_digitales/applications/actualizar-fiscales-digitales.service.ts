import { pool } from "../../../config/database.config";
import { updateFiscalDigital } from "../fiscales_digitales.model";
import { IFiscalesDigitalesUpdate } from "../fisicales_digitales.type";

export class ActualizarFiscalesDigitalesService {
  async actualizarFiscalDigital(data: IFiscalesDigitalesUpdate) {
    const connection = await pool.getConnection();

    try {
      await connection.beginTransaction();

      const fiscal = await updateFiscalDigital(data, connection);

      if (!fiscal) {
        await connection.rollback();

        return {
          status: 422,
          message: "No se pudo actualizar el fiscal digital",
        };
      }

      await connection.commit();

      return {
        status: 200,
        message: "Fiscal digital actualizado correctamente",
        data: fiscal,
      };
    } catch (error: any) {
      await connection.rollback();

      console.error("[ActualizarFiscalDigitalService] Error:", error);
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
        message: "Error al actualizar fiscal digital",
        error,
      };
    }
  }
}
