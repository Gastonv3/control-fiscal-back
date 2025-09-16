import { pool } from "../../../config/database.config";
import { updateBajaBarrios } from "../../referente_barrio/referente_barrio.model";
import { updateReferente } from "../referentes.model";
import { IReferentesUpdate } from "../referentes.type";

export class ActualizarReferenteService {
  async actualizarReferente(data: IReferentesUpdate) {
    const connection = await pool.getConnection();

    try {
      await connection.beginTransaction();

      const referente = await updateReferente(data, connection);

      if (!referente) {
        await connection.rollback();

        return {
          status: 422,
          message: "No se pudo actualizar el Dirigente",
        };
      }

      if (data.id_categoria !== 1) {
        const anularBarrios = await updateBajaBarrios(
          {
            id_referente: data.id_referente,
            id_usuario: data.id_usuario_modifica,
          },
          connection
        );
      }
      await connection.commit();
      return {
        status: 200,
        message: "Dirigente actualizado correctamente",
        data: referente,
      };
    } catch (error: any) {
      await connection.rollback();

      console.error("[ActualizarReferenteService] Error:", error);
      if (error.message === "DNI_DUPLICADO") {
        return {
          status: 422,
          message: "El DNI ya se encuentra registrado",
        };
      }
      return {
        status: 500,
        message: "Error al actualizar Dirigente",
        error,
      };
    } finally {
      connection.release();
    }
  }
}
