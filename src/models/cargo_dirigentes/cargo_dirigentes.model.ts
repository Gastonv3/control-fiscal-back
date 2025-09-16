import { RowDataPacket } from "mysql2";
import { pool } from "../../config/database.config";
import {
  ICargoDirigentesFilter,
  ICargoDirigentes,
} from "./cargo_dirigentes.type";

export const getCargoDirigente = async (
  filter: ICargoDirigentesFilter
): Promise<ICargoDirigentes[] | null> => {
  try {
    const [rows] = await pool.query<RowDataPacket[]>(
      `SELECT  id, id_categoria_dirigente, nombre, descripcion, habilitado 
      FROM cargo_dirigentes where habilitado = 'S' AND id_categoria_dirigente = ?`,
      [filter.id_categoria_dirigente]
    );

    const result = rows as ICargoDirigentes[];

    return result || null;
  } catch (error) {
    console.error("[CargoDirigentes] Error en getCargoDirigente:", error);
    throw new Error("Error al extraer CargoDirigentes");
  }
};
