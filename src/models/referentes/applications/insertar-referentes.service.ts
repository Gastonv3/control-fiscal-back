import { pool } from "../../../config/database.config";
import { insertReferenteBarrio } from "../../referente_barrio/referente_barrio.model";
import { IReferenteBarrioInsert } from "../../referente_barrio/referente_barrio.type";
import { insertReferenteZona } from "../../referente_zona/referente_zona.model";
import { IReferenteZonaInsert } from "../../referente_zona/referente_zona.type";
import { insertReferente } from "../referentes.model";
import { IReferenteteParamInsertar } from "../referentes.type";

export class InsertarReferenteService {
  async crearReferente(data: IReferenteteParamInsertar) {
    const connection = await pool.getConnection();

    try {
      await connection.beginTransaction();

      const referente = await insertReferente(data.referente, connection);

      if (!referente) {
        await connection.rollback();

        return {
          status: 422,
          message: "No se pudo insertar el Dirigente",
        };
      }

      if (data.barrio_referente.length > 0) {
        const barrios = this.parseBarrio(
          data.barrio_referente,
          referente.id_referente
        );

        if (barrios.length == 0) {
          await connection.rollback();
          return {
            status: 422,
            message: "No se pudo insertar el barrio del Dirigente",
            error: "Sin filas afectadas",
          };
        }

        for (const barrio of barrios) {
          const result = await insertReferenteBarrio(barrio, connection);
          if (!result) {
            await connection.rollback();
            return {
              status: 422,
              message: "No se pudo insertar el barrio del Dirigente",
              error: "Sin filas afectadas",
            };
          }
        }
      }

      await connection.commit();
      return {
        status: 200,
        message: "Dirigente insertado correctamente",
        data: referente,
      };
    } catch (error: any) {
      console.error("[InsertarReferenteService] Error:", error);
      if (error.message === "DNI_DUPLICADO") {
        return {
          status: 422,
          message: "El DNI ya se encuentra registrado",
        };
      }
      return {
        status: 500,
        message: "Error al insertar dirigente",
        error,
      };
    } finally {
      connection.release();
    }
  }

  public parseBarrio(
    barrio: IReferenteteParamInsertar["barrio_referente"],
    id_referente: number
  ): IReferenteBarrioInsert[] {
    const listado: IReferenteBarrioInsert[] = [];
    if (barrio && barrio.length > 0) {
      barrio.forEach((item) => {
        listado.push({
          id_barrio: item.id_barrio,
          id_usuario: item.id_usuario,
          id_referente: id_referente,
        });
      });
    }
    return listado;
  }
}
