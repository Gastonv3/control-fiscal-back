import { ResultSetHeader, RowDataPacket } from "mysql2";
import { pool } from "../../config/database.config";
import {
  IReferenteBarrio,
  IReferenteBarrioInsert,
  IReferenteBarrioBaja,
  IReferenteBarrioFilter,
  IReferenteBajaBarrio,
} from "./referente_barrio.type";
import { IQueryFilter } from "../../utils/QueryFilter.type";
import { PoolConnection } from "mysql2/promise";

const baseQuery = `
  SELECT rb.id_referente,
         r.nombre   AS nombre_referente,
         r.apellido AS apellido_referente,
         rb.id_barrio,
         b.nombre   AS nombre_barrio,
         rb.habilitada,
         rb.id_usuario_carga,
         u1.nombre  AS nombre_usuario_carga,
         rb.fecha_carga,
         rb.id_usuario_baja,
         u2.nombre  AS nombre_usuario_baja,
         rb.fecha_baja
  FROM referente_barrio rb
           INNER JOIN referentes r ON rb.id_referente = r.id_referente
           INNER JOIN barrio b ON rb.id_barrio = b.id_barrio
           INNER JOIN usuarios u1 ON rb.id_usuario_carga = u1.id_usuario
           LEFT JOIN usuarios u2 ON rb.id_usuario_baja = u2.id_usuario
`;

const totalQuery = `
  SELECT COUNT(1) AS total_registros
  FROM referente_barrio rb
           INNER JOIN referentes r ON rb.id_referente = r.id_referente
           INNER JOIN barrio b ON rb.id_barrio = b.id_barrio
           INNER JOIN usuarios u1 ON rb.id_usuario_carga = u1.id_usuario
           LEFT JOIN usuarios u2 ON rb.id_usuario_baja = u2.id_usuario
`;

const buildWhereClause = (filter: IReferenteBarrioFilter): IQueryFilter => {
  const where: string[] = [];
  const values: any[] = [];

  if (filter.id_referente !== undefined) {
    where.push("rb.id_referente = ?");
    values.push(filter.id_referente);
  }

  if (filter.id_barrio !== undefined) {
    where.push("rb.id_barrio = ?");
    values.push(filter.id_barrio);
  }

  if (filter.habilitada !== undefined) {
    where.push("rb.habilitada = ?");
    values.push(filter.habilitada);
  }

  const whereSql = where.length > 0 ? `WHERE ${where.join(" AND ")}` : "";
  return { whereSql, values };
};

export const getReferenteBarrioByFilter = async (
  filter: IReferenteBarrioFilter
): Promise<IReferenteBarrio[] | null> => {
  try {
    const { whereSql, values } = buildWhereClause(filter);

    const query = `
      ${baseQuery}
      ${whereSql}
      ORDER BY rb.fecha_carga DESC
      LIMIT ? OFFSET ?
    `;

    values.push(Number(filter.limit) || 100, Number(filter.offset) || 0);
    const [rows] = await pool.query<RowDataPacket[]>(query, values);
    const result = rows as IReferenteBarrio[];

    return result.length > 0 ? result : null;
  } catch (error) {
    console.error(
      "[ReferenteBarrioModel] Error en getReferenteBarrioByFilter:",
      error
    );
    throw error;
  }
};

export const getReferenteBarrioTotal = async (
  filter: IReferenteBarrioFilter
): Promise<{ total_registros: number } | null> => {
  try {
    const { whereSql, values } = buildWhereClause(filter);

    const query = `${totalQuery} ${whereSql}`;
    const [rows] = await pool.query<RowDataPacket[]>(query, values);
    const result = rows as { total_registros: number }[];

    return result[0] || null;
  } catch (error) {
    console.error(
      "[ReferenteBarrioModel] Error en getReferenteBarrioTotal:",
      error
    );
    throw error;
  }
};

export const insertReferenteBarrio = async (
  data: IReferenteBarrioInsert,
  conn: PoolConnection
): Promise<IReferenteBarrio | null> => {
  try {
    const insertSQL = `
      INSERT INTO referente_barrio (id_referente, id_barrio, habilitada, id_usuario_carga, fecha_carga)
      VALUES (?, ?, 'S', ?, NOW())
    `;

    const values = [data.id_referente, data.id_barrio, data.id_usuario];

    const [result] = await conn.query<ResultSetHeader>(insertSQL, values);
    if (result.affectedRows === 0) {
      throw new Error("No se pudo insertar el barrio del dirigente");
    }

    const [rows] = await conn.query<RowDataPacket[]>(
      `${baseQuery} WHERE rb.id_referente = ? AND rb.id_barrio = ?`,
      [data.id_referente, data.id_barrio]
    );

    return (rows as IReferenteBarrio[])[0] || null;
  } catch (error) {
    console.error(
      "[ReferenteBarrioModel] Error en insertReferenteBarrio:",
      error
    );
    throw new Error("Error al insertar referente-barrio");
  }
};

export const updateReferenteBarrio = async (
  data: IReferenteBarrioBaja,
  conn: PoolConnection
): Promise<IReferenteBarrio | null> => {
  try {
    const updateSQL = `
      UPDATE referente_barrio
      SET habilitada = ?,
          id_usuario_baja = CASE WHEN ? = 'N' THEN ? ELSE NULL END,
          fecha_baja = CASE WHEN ? = 'N' THEN NOW() ELSE NULL END
      WHERE id_referente = ? AND id_barrio = ?
    `;

    const values = [
      data.habilitada,
      data.habilitada,
      data.id_usuario,
      data.habilitada,
      data.id_referente,
      data.id_barrio,
    ];

    const [result] = await conn.query<ResultSetHeader>(updateSQL, values);

    if (result.affectedRows === 0) {
      throw new Error("No se pudo actualizar el barrio del referente");
    }

    const [rows] = await conn.query<RowDataPacket[]>(
      `${baseQuery} WHERE rb.id_referente = ? AND rb.id_barrio = ?`,
      [data.id_referente, data.id_barrio]
    );

    return (rows as IReferenteBarrio[])[0] || null;
  } catch (error) {
    console.error(
      "[ReferenteBarrioModel] Error en updateReferenteBarrio:",
      error
    );
    throw new Error("Error al actualizar referente-barrio");
  }
};

export const updateBajaBarrios = async (
  data: IReferenteBajaBarrio,
  conn: PoolConnection
): Promise<any> => {
  try {
    const updateSQL = `
      UPDATE referente_barrio
      SET habilitada = 'N',
          id_usuario_baja = ?,
          fecha_baja = NOW()
      WHERE id_referente = ?
    `;

    const values = [data.id_usuario, data.id_referente];

    const [result] = await conn.query<ResultSetHeader>(updateSQL, values);

    return;
  } catch (error) {
    console.error("[ReferenteBarrioModel] Error en updateBajaBarrios:", error);
    throw new Error("Error al actualizar referente-barrio");
  }
};
