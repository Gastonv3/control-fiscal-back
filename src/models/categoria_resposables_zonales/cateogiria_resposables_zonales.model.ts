import { RowDataPacket } from "mysql2";
import { pool } from "../../config/database.config";

import { ICategoriaResponsablesZonales } from "./cateogiria_resposables_zonales.type";

export const getCategoriaResponsablesZonales = async (): Promise<
  ICategoriaResponsablesZonales[] | null
> => {
  try {
    const [rows] = await pool.query<RowDataPacket[]>(
      `SELECT  id_categoria, nombre, descripcion, habilitada FROM categoria_responsables_zonales where habilitada = 'S'`,
      []
    );

    const result = rows as ICategoriaResponsablesZonales[];

    return result || null;
  } catch (error) {
    console.error(
      "[CategoriaResponsablesZonales] Error en getCategoria:",
      error
    );
    throw new Error("Error al extraer CategoriaResponsablesZonales");
  }
};
