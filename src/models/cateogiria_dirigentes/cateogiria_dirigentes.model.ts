import { RowDataPacket } from "mysql2";
import { pool } from "../../config/database.config";

import { ICategoriaDirigentes } from "./cateogiria_dirigentes.type";

export const getCategoria = async (): Promise<
  ICategoriaDirigentes[] | null
> => {
  try {
    const [rows] = await pool.query<RowDataPacket[]>(
      `SELECT  id_categoria, nombre, descripcion, habilitada FROM categoria_dirigentes where habilitada = 'S'`,
      []
    );

    const result = rows as ICategoriaDirigentes[];

    return result || null;
  } catch (error) {
    console.error("[CategoriaDirigentes] Error en getCategoria:", error);
    throw new Error("Error al extraer CategoriaDirigentes");
  }
};
