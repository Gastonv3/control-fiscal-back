import { ResultSetHeader, RowDataPacket } from "mysql2";
import { pool } from "../../config/database.config";
import { IQueryFilter } from "../../utils/QueryFilter.type";
import {
  IEscuelasFilter,
  IEscuelas,
  IEscuelasUpdateZona,
} from "./escuelas.type";
import { PoolConnection } from "mysql2/promise";

const queryEscuelas = `
  SELECT 
    e.id_escuela,
    e.nombre AS nombre_escuela,
    e.numero,
    e.cod_circuito,
    e.cod_seccion,
    e.id_zona,
    z.nombre AS nombre_zona
  FROM escuelas e
  LEFT JOIN zonas z ON e.id_zona = z.id_zona
`;

const queryTotalRegistros = `
  SELECT COUNT(1) AS total_registros
  FROM escuelas e
  LEFT JOIN zonas z ON e.id_zona = z.id_zona
`;

const buildWhereClause = (filter: IEscuelasFilter): IQueryFilter => {
  const where: string[] = [];
  const values: any[] = [];

  if (filter.id_escuela !== undefined) {
    where.push("e.id_escuela = ?");
    values.push(filter.id_escuela);
  }

  if (filter.numero !== undefined) {
    where.push("e.numero = ?");
    values.push(filter.numero);
  }

  if (filter.nombre_escuela !== undefined) {
    where.push("e.nombre LIKE ?");
    values.push(`%${filter.nombre_escuela}%`);
  }

  if (filter.not_exista !== undefined) {
    where.push(
      "NOT EXISTS (SELECT 1 FROM fiscales_generales WHERE id_escuela = e.id_escuela AND habilitado = 'S')"
    );
  }
  if (filter.id_zona !== undefined) {
    where.push("e.id_zona = ?");
    values.push(filter.id_zona);
  }

  const whereSql = where.length > 0 ? `WHERE ${where.join(" AND ")}` : "";
  return { whereSql, values };
};

export const getEscuelasByFilter = async (
  filter: IEscuelasFilter
): Promise<IEscuelas[] | null> => {
  try {
    const { whereSql, values } = buildWhereClause(filter);

    const sql = `
      ${queryEscuelas}
      ${whereSql}
      ORDER BY e.id_escuela DESC
      LIMIT ? OFFSET ?
    `;

    values.push(Number(filter.limit) || 100, Number(filter.offset) || 0);
    const [rows] = await pool.query<RowDataPacket[]>(sql, values);
    return rows.length > 0 ? (rows as IEscuelas[]) : null;
  } catch (error) {
    console.error("[EscuelasModel] Error en getEscuelasByFilter:", error);
    throw error;
  }
};

export const getEscuelasTotalRegistro = async (
  filter: IEscuelasFilter
): Promise<{ total_registros: number } | null> => {
  try {
    const { whereSql, values } = buildWhereClause(filter);
    const query = `${queryTotalRegistros} ${whereSql}`;

    const [rows] = await pool.query<RowDataPacket[]>(query, values);
    const result = rows as { total_registros: number }[];
    if (result.length === 0) {
      return null;
    }

    return result[0]?.total_registros ? result[0] : null;
  } catch (error) {
    console.error("[EscuelasModel] Error en getEscuelasTotalRegistro:", error);
    throw new Error("Error al obtener total de escuelas");
  }
};

export const updateEscuelaZona = async (
  data: IEscuelasUpdateZona,
  conn: PoolConnection
): Promise<IEscuelas | null> => {
  try {
    const query = `
      UPDATE escuelas
      SET id_zona = ?
      WHERE id_escuela = ?
    `;
    const values = [data.id_zona, data.id_escuela];
    const [result] = await conn.query<ResultSetHeader>(query, values);

    if (result.affectedRows === 0) {
      throw new Error("No se pudo actualizar la zona de la escuela");
    }

    const [rows] = await conn.query<RowDataPacket[]>(
      `
      ${queryEscuelas}
      WHERE e.id_escuela = ?
    `,
      [data.id_escuela]
    );

    return (rows as IEscuelas[])[0] || null;
  } catch (error) {
    console.error("[EscuelasModel] Error en updateEscuelaZona:", error);
    throw new Error("Error al actualizar la zona de la escuela");
  }
};
