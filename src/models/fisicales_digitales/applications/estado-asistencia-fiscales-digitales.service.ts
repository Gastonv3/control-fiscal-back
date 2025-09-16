import { pool } from "../../../config/database.config";
import { updateFiscalDigitalEstadoAsistencia } from "../fiscales_digitales.model";
import { IFiscalesDigitalesEstadoAsistenciaUpdate } from "../fisicales_digitales.type";

export class EstadoAsistenciaFiscalesDigitalesService {
  async actualizarFiscalDigital(
    data: IFiscalesDigitalesEstadoAsistenciaUpdate
  ) {
    const connection = await pool.getConnection();

    try {
      await connection.beginTransaction();

      const fiscal = await updateFiscalDigitalEstadoAsistencia(
        data,
        connection
      );

      if (!fiscal) {
        await connection.rollback();

        return {
          status: 422,
          message:
            "No se pudo actualizar el estado de asistencia del fiscal digital",
        };
      }

      await connection.commit();

      return {
        status: 200,
        message:
          "Estado de asistencia del fiscal digital actualizado correctamente",
        data: fiscal,
      };
    } catch (error: any) {
      await connection.rollback();
      console.error("[EstadoAsistenciaFiscalesDigitalesService] Error:", error);
      return {
        status: 500,
        message: "Error al actualizar estado de asistencia del fiscal digital",
        error,
      };
    }
  }
}
