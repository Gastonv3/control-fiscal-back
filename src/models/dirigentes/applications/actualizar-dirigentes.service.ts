import { pool } from "../../../config/database.config";
import { IResponse } from "../../../utils/response.type";
import { updateDirigente, getDirigentesByFilter } from "../dirigentes.model";
import { IDirigentes, IDirigentesUpdate } from "../dirigentes.type";

export class ActualizarDirigenteService {
  public async actualizar(
    data: IDirigentesUpdate
  ): Promise<IResponse<{ dirigente: IDirigentes | null }>> {
    const connection = await pool.getConnection();

    try {
      await connection.beginTransaction();

      const ok = await updateDirigente(data, connection);

      if (!ok) {
        await connection.rollback();

        return {
          status: 422,
          message: "No se pudo actualizar el Referente",
          error: "Sin filas afectadas",
        };
      }
      await connection.commit();

      const result = await getDirigentesByFilter({ id_dirigente: data.id });

      return {
        status: 200,
        message: "Referente actualizado correctamente",
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
        message: "Error al actualizar Referente",
        error: error.message,
      };
    } finally {
      connection.release();
    }
  }
}
