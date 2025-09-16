import { RowDataPacket } from "mysql2";
import { pool } from "../../config/database.config";

import { ICategoriaReferentes } from "./cateogiria_dirigentes.type";

export const getCategoriaReferentes = async (): Promise<
  ICategoriaReferentes[] | null
> => {
  try {
    const [rows] = await pool.query<RowDataPacket[]>(
      `SELECT  id_categoria, nombre, descripcion, habilitada FROM categoria_referentes where habilitada = 'S'`,
      []
    );

    const result = rows as ICategoriaReferentes[];

    return result || null;
  } catch (error) {
    console.error("[CategoriaReferentes] Error en getCategoria:", error);
    throw new Error("Error al extraer CategoriaReferentes");
  }
};
