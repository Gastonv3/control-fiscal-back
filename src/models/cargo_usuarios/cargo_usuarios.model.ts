import { RowDataPacket } from "mysql2";
import { pool } from "../../config/database.config";

import { ICargoUsuario, ICargoUsuarioFilter } from "./cargo_usuarios.type";

export const getCargoUsuarios = async (
  filter: ICargoUsuarioFilter
): Promise<ICargoUsuario[] | null> => {
  try {
    const [rows] = await pool.query<RowDataPacket[]>(
      `SELECT  id, id_categoria_usuario, nombre, descripcion, habilitado 
      FROM cargo_usuarios where habilitado = 'S' AND id_categoria_usuario = ?`,
      [filter.id_categoria_usuario]
    );

    const result = rows as ICargoUsuario[];

    return result || null;
  } catch (error) {
    console.error("[CargoUsuarios] Error en getCargoUsuarios:", error);
    throw new Error("Error al extraer CargoUsuarios");
  }
};
