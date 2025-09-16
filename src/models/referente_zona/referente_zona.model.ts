import { ResultSetHeader, RowDataPacket } from "mysql2";
import { pool } from "../../config/database.config";
import {
  IReferenteZona,
  IReferenteZonaInsert,
  IReferenteZonaBaja,
  IReferenteZonaFilter,
} from "./referente_zona.type";
import { IQueryFilter } from "../../utils/QueryFilter.type";
import { PoolConnection } from "mysql2/promise";

const baseQuery = `
  SELECT rz.id_referente,
         r.nombre   AS nombre_referente,
         r.apellido AS apellido_referente,
         rz.id_zona,
         z.nombre   AS nombre_zona,
         rz.habilitada,
         rz.id_usuario_carga,
         u1.nombre  AS nombre_usuario_carga,
         rz.fecha_carga,
         rz.id_usuario_baja,
         u2.nombre  AS nombre_usuario_baja,
         rz.fecha_baja
  FROM referente_zona rz
           INNER JOIN referentes r ON rz.id_referente = r.id_referente
           INNER JOIN zonas z ON rz.id_zona = z.id_zona
           INNER JOIN usuarios u1 ON rz.id_usuario_carga = u1.id_usuario
           LEFT JOIN usuarios u2 ON rz.id_usuario_baja = u2.id_usuario
`;

const totalQuery = `
  SELECT COUNT(1) AS total_registros
  FROM referente_zona rz
           INNER JOIN referentes r ON rz.id_referente = r.id_referente
           INNER JOIN zonas z ON rz.id_zona = z.id_zona
           INNER JOIN usuarios u1 ON rz.id_usuario_carga = u1.id_usuario
           LEFT JOIN usuarios u2 ON rz.id_usuario_baja = u2.id_usuario
`;

const buildWhereClause = (filter: IReferenteZonaFilter): IQueryFilter => {
  const where: string[] = [];
  const values: any[] = [];

  if (filter.id_referente !== undefined) {
    where.push("rz.id_referente = ?");
    values.push(filter.id_referente);
  }

  if (filter.id_zona !== undefined) {
    where.push("rz.id_zona = ?");
    values.push(filter.id_zona);
  }

  if (filter.habilitada !== undefined) {
    where.push("rz.habilitada = ?");
    values.push(filter.habilitada);
  }

  const whereSql = where.length > 0 ? `WHERE ${where.join(" AND ")}` : "";
  return { whereSql, values };
};

export const getReferenteZonaByFilter = async (
  filter: IReferenteZonaFilter
): Promise<IReferenteZona[] | null> => {
  try {
    const { whereSql, values } = buildWhereClause(filter);

    const query = `
      ${baseQuery}
      ${whereSql}
      ORDER BY rz.fecha_carga DESC
      LIMIT ? OFFSET ?
    `;

    values.push(Number(filter.limit) || 100, Number(filter.offset) || 0);
    const [rows] = await pool.query<RowDataPacket[]>(query, values);
    const result = rows as IReferenteZona[];

    return result.length > 0 ? result : null;
  } catch (error) {
    console.error(
      "[ReferenteZonaModel] Error en getReferenteZonaByFilter:",
      error
    );
    throw error;
  }
};

export const getReferenteZonaTotal = async (
  filter: IReferenteZonaFilter
): Promise<{ total_registros: number } | null> => {
  try {
    const { whereSql, values } = buildWhereClause(filter);

    const query = `${totalQuery} ${whereSql}`;
    const [rows] = await pool.query<RowDataPacket[]>(query, values);
    const result = rows as { total_registros: number }[];

    return result[0] || null;
  } catch (error) {
    console.error(
      "[ReferenteZonaModel] Error en getReferenteZonaTotal:",
      error
    );
    throw error;
  }
};

export const insertReferenteZona = async (
  data: IReferenteZonaInsert,
  conn: PoolConnection
): Promise<IReferenteZona | null> => {
  try {
    const insertSQL = `
      INSERT INTO referente_zona (id_referente, id_zona, habilitada, id_usuario_carga, fecha_carga)
      VALUES (?, ?, 'S', ?, NOW())
    `;

    const values = [data.id_referente, data.id_zona, data.id_usuario];

    const [result] = await conn.query<ResultSetHeader>(insertSQL, values);
    if (result.affectedRows === 0) {
      throw new Error("No se pudo insertar la zona del referente");
    }

    const [rows] = await conn.query<RowDataPacket[]>(
      `${baseQuery} WHERE rz.id_referente = ? AND rz.id_zona = ?`,
      [data.id_referente, data.id_zona]
    );

    return (rows as IReferenteZona[])[0] || null;
  } catch (error) {
    console.error("[ReferenteZonaModel] Error en insertReferenteZona:", error);
    throw new Error("Error al insertar referente-zona");
  }
};

export const updateReferenteZona = async (
  data: IReferenteZonaBaja,
  conn: PoolConnection
): Promise<IReferenteZona | null> => {
  try {
    const updateSQL = `
      UPDATE referente_zona
      SET habilitada = ?,
          id_usuario_baja = CASE WHEN ? = 'N' THEN ? ELSE NULL END,
          fecha_baja = CASE WHEN ? = 'N' THEN NOW() ELSE NULL END
      WHERE id_referente = ? AND id_zona = ?
    `;

    const values = [
      data.habilitada,
      data.habilitada,
      data.id_usuario,
      data.habilitada,
      data.id_referente,
      data.id_zona,
    ];

    const [result] = await conn.query<ResultSetHeader>(updateSQL, values);

    if (result.affectedRows === 0) {
      throw new Error("No se pudo actualizar la zona del referente");
    }

    const [rows] = await conn.query<RowDataPacket[]>(
      `${baseQuery} WHERE rz.id_referente = ? AND rz.id_zona = ?`,
      [data.id_referente, data.id_zona]
    );

    return (rows as IReferenteZona[])[0] || null;
  } catch (error) {
    console.error("[ReferenteZonaModel] Error en updateReferenteZona:", error);
    throw new Error("Error al actualizar referente-zona");
  }
};
