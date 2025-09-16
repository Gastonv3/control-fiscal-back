import { RowDataPacket } from "mysql2";
import { pool } from "../../config/database.config";

import {
  ICargoResponsablesZonales,
  ICargoResponsablesZonalesFilter,
} from "./cargo_responsables.type";

export const getCargoResponsable = async (
  filter: ICargoResponsablesZonalesFilter
): Promise<ICargoResponsablesZonales[] | null> => {
  try {
    const [rows] = await pool.query<RowDataPacket[]>(
      `SELECT  id, id_categoria_responsables, nombre, descripcion, habilitado 
      FROM cargo_responsables where habilitado = 'S' AND id_categoria_responsables = ?`,
      [filter.id_categoria_responsables]
    );

    const result = rows as ICargoResponsablesZonales[];

    return result || null;
  } catch (error) {
    console.error(
      "[CargoResponsablesZonales] Error en getCargoResponsable:",
      error
    );
    throw new Error("Error al extraer CargoResponsablesZonales");
  }
};
