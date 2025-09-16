import { RowDataPacket } from "mysql2";
import { pool } from "../../config/database.config";
import {
  ICargoReferentesFilter,
  ICargoReferentes,
} from "./cargo_referentes.type";

export const getCargoReferente = async (
  filter: ICargoReferentesFilter
): Promise<ICargoReferentes[] | null> => {
  try {
    const [rows] = await pool.query<RowDataPacket[]>(
      `SELECT  id, id_categoria_referente, nombre, descripcion, habilitado 
      FROM cargo_referentes where habilitado = 'S' AND id_categoria_referente = ?`,
      [filter.id_categoria_referente]
    );

    const result = rows as ICargoReferentes[];

    return result || null;
  } catch (error) {
    console.error("[CargoReferentes] Error en getCargoReferente:", error);
    throw new Error("Error al extraer CargoReferentes");
  }
};
