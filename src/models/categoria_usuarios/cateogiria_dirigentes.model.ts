import { RowDataPacket } from "mysql2";
import { pool } from "../../config/database.config";

import { ICategoriaUsuarios } from "./cateogiria_dirigentes.type";

export const getCategoriaUsuarios = async (): Promise<
  ICategoriaUsuarios[] | null
> => {
  try {
    const [rows] = await pool.query<RowDataPacket[]>(
      `SELECT  id_categoria, nombre, descripcion, habilitada FROM categoria_usuarios where habilitada = 'S'`,
      []
    );

    const result = rows as ICategoriaUsuarios[];

    return result || null;
  } catch (error) {
    console.error("[CategoriaUsuarios] Error en getCategoria:", error);
    throw new Error("Error al extraer CategoriaUsuarios");
  }
};
