import { pool } from "../../../config/database.config";
import { insertFiscalDigital } from "../fiscales_digitales.model";
import { IFiscalesDigitalesInsert } from "../fisicales_digitales.type";

export class InsertarFiscalesDigitalesService {
  async crearFiscalDigital(data: IFiscalesDigitalesInsert) {
    const connection = await pool.getConnection();

    try {
      await connection.beginTransaction();

      const fiscal = await insertFiscalDigital(data, connection);

      if (!fiscal) {
        await connection.rollback();

        return {
          status: 422,
          message: "No se pudo insertar el fiscal digital",
        };
      }

      await connection.commit();

      return {
        status: 200,
        message: "Fiscal digital insertado correctamente",
        data: fiscal,
      };
    } catch (error: any) {
      await connection.rollback();

      console.error("[InsertarFiscalDigitalService] Error:", error);
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
        message: "Error al insertar fiscal digital",
        error,
      };
    } finally {
      connection.release();
    }
  }
}
