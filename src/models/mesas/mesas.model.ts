import { RowDataPacket } from "mysql2";
import { pool } from "../../config/database.config";
import { IQueryFilter } from "../../utils/QueryFilter.type";
import { IMesasFilter, IMesas } from "./mesas.type";

const queryMesas = `
SELECT m.id_mesa,
       m.id_escuela,
       s.nombre AS nombre_escuela,
       m.mesa_numero,
       m.cod_circuito,
       m.cod_seccion
FROM mesas m
INNER JOIN escuelas s ON s.id_escuela = m.id_escuela
`;

const buildWhereClause = (filter: IMesasFilter): IQueryFilter => {
  const where: string[] = [];
  const values: any[] = [];

  if (filter.id_mesa !== undefined) {
    where.push("m.id_mesa = ?");
    values.push(filter.id_mesa);
  }

  if (filter.mesa_numero !== undefined) {
    where.push("m.mesa_numero = ?");
    values.push(filter.mesa_numero);
  }
  if (filter.id_escuela !== undefined) {
    where.push("m.id_escuela = ?");
    values.push(filter.id_escuela);
  }

  if (filter.not_exista !== undefined) {
    where.push(
      "NOT EXISTS (SELECT 1 FROM fiscales_digitales WHERE mesa_numero = m.mesa_numero AND habilitado = 'S')"
    );
  }

  const whereSql = where.length > 0 ? `WHERE ${where.join(" AND ")}` : "";
  return { whereSql, values };
};

export const getMesasByFilter = async (
  filter: IMesasFilter
): Promise<IMesas[] | null> => {
  try {
    const { whereSql, values } = buildWhereClause(filter);

    const sql = `
      ${queryMesas}
      ${whereSql}
      ORDER BY m.id_mesa DESC
      LIMIT ? OFFSET ?
    `;

    values.push(Number(filter.limit) || 100, Number(filter.offset) || 0);
    const [rows] = await pool.query<RowDataPacket[]>(sql, values);
    return rows.length > 0 ? (rows as IMesas[]) : null;
  } catch (error) {
    console.error("[MesasModel] Error en getMesasByFilter:", error);
    throw error;
  }
};

const queryTotalMesas = `
  SELECT count(1) as total_registros
  FROM mesas m
  INNER JOIN escuelas s ON s.id_escuela = m.id_escuela`;

export const getMesasTotalRegistro = async (
  filter: IMesasFilter
): Promise<{ total_registros: number } | null> => {
  try {
    const { whereSql, values } = buildWhereClause(filter);

    const sql = `${queryTotalMesas} ${whereSql}`;

    const [rows] = await pool.query<RowDataPacket[]>(sql, values);
    const result = rows as { total_registros: number }[];

    if (result.length === 0) {
      return null;
    }

    return result[0]?.total_registros ? result[0] : null;
  } catch (error) {
    console.error("[MesasModel] Error en getMesasTotalRegistro:", error);
    throw new Error("Error al obtener total de registros de mesas");
  }
};
