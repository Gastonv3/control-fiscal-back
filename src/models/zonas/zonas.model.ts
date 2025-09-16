import { RowDataPacket } from "mysql2";
import { pool } from "../../config/database.config";

import { IZonas } from "./zonas.type";

export const getZonas = async (): Promise<IZonas[] | null> => {
  try {
    const [rows] = await pool.query<RowDataPacket[]>(
      `SELECT  id_zona, nombre FROM zonas`,
      []
    );

    const result = rows as IZonas[];

    return result || null;
  } catch (error) {
    console.error("[ZonasModal] Error en getZonas:", error);
    throw new Error("Error al extraer zonas");
  }
};
