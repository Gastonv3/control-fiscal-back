import { RowDataPacket } from "mysql2";
import { pool } from "../../config/database.config";
import { IBarrio, IBarrioFilter } from "./barrios.type";
import { IQueryFilter } from "../../utils/QueryFilter.type";

export const getBarriosByFilter = async (
  filter: IBarrioFilter
): Promise<IBarrio[] | null> => {
  try {
    const { whereSql, values } = buildBarrioFilter(filter);

    const query = `
      SELECT  b.id_barrio, b.nombre FROM barrio b
      ${whereSql}
      ORDER BY b.nombre ASC
      LIMIT ? OFFSET ?
    `;
    values.push(Number(filter.limit) || 100, Number(filter.offset) || 0);

    const [rows] = await pool.query<RowDataPacket[]>(query, values);

    const result = rows as IBarrio[];
    if (result.length === 0) {
      return null;
    }

    return result;
  } catch (error) {
    console.error("[BarrioModel] Error en getBarrios:", error);
    throw new Error("Error al extraer barrios");
  }
};

export const getBarriosTotalRegistro = async (
  filter: IBarrioFilter
): Promise<{ total_registros: number } | null> => {
  try {
    const { whereSql, values } = buildBarrioFilter(filter);

    const query = `
      SELECT count(1) as total_registros FROM barrio b
      ${whereSql}
    `;

    const [rows] = await pool.query<RowDataPacket[]>(query, values);
    const result = rows as { total_registros: number }[];

    if (result.length === 0) {
      return null;
    }

    return result[0]?.total_registros ? result[0] : null;
  } catch (error) {
    console.error(
      "[ResponsablesModel] Error en getResponsablesTotalRegistro:",
      error
    );
    throw new Error("Error al buscar responsables");
  }
};

export const buildBarrioFilter = (filter: IBarrioFilter): IQueryFilter => {
  const whereClauses: string[] = [];
  const values: any[] = [];

  if (filter.id_barrio) {
    whereClauses.push("b.id_barrio = ?");
    values.push(filter.id_barrio);
  }
  if (filter.nombre) {
    whereClauses.push("b.nombre LIKE ?");
    values.push(`%${filter.nombre}%`);
  }
  const whereSql =
    whereClauses.length > 0 ? `WHERE ${whereClauses.join(" AND ")}` : "";
  return { whereSql, values };
};
