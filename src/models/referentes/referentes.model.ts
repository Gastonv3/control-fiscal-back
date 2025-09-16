import { ResultSetHeader, RowDataPacket } from "mysql2";
import { pool } from "../../config/database.config";
import {
  IReferenteEstadoVotosFilter,
  IReferentes,
  IReferentesFilter,
  IReferentesInsert,
  IReferentesUpdate,
} from "./referentes.type";
import { IQueryFilter } from "../../utils/QueryFilter.type";
import { PoolConnection } from "mysql2/promise";

const queryReferentesEstadoVotos = `
SELECT r.id_referente,
       r.nombre                                                          AS nombre_referente,
       r.apellido                                                        AS apellido_referente,
       r.codigo                                                          AS codigo_referente,
       d.id_dirigente,
       d.nombre                                                          AS nombre_dirigente,
       d.apellido                                                        AS apellido_dirigente,

       COUNT(v.id_votante)                                               AS total_votantes,
       COALESCE(SUM(CASE WHEN v.estado_voto = 'S' THEN 1 ELSE 0 END), 0) AS votaron,
       COALESCE(SUM(CASE WHEN v.estado_voto = 'N' THEN 1 ELSE 0 END), 0) AS pendientes,
       ROUND(
                       100.0 * COALESCE(SUM(CASE WHEN v.estado_voto = 'S' THEN 1 ELSE 0 END), 0)
                   / NULLIF(COUNT(v.id_votante), 0),
                       2)                                                AS percent_votaron
FROM referentes r
         INNER JOIN dirigentes d ON d.id_dirigente = r.id_dirigente
         LEFT JOIN votantes v ON v.id_referente = r.id_referente
`;

const queryTotalRegistrosReferentesEstadosVotos = `
SELECT COUNT(1) AS total_registros
  FROM referentes r
`;

const queryReferentes = `
  SELECT r.id_referente,
         r.nombre,
         r.apellido,
         r.dni,
         r.codigo,
         r.telefono,
         r.habilitada,
         r.id_categoria,
         cr.nombre  AS categoria,
         r.id_cargo,
         crt.nombre AS cargo,
         r.id_dirigente,
         d.nombre   AS nombre_dirigente,
         d.apellido AS apellido_dirigente,
         r.id_usuario_carga,
         u.nombre   AS nombre_usuario_carga,
         r.fecha_carga,
         r.id_usuario_modifica,
         u2.nombre  AS nombre_usuario_modifica,
         r.fecha_modifica
  FROM referentes r
           LEFT JOIN categoria_referentes cr ON r.id_categoria = cr.id_categoria
           LEFT JOIN cargo_referentes crt ON r.id_cargo = crt.id
           INNER JOIN dirigentes d ON r.id_dirigente = d.id_dirigente
           INNER JOIN usuarios u ON r.id_usuario_carga = u.id_usuario
           LEFT JOIN usuarios u2 ON r.id_usuario_modifica = u2.id_usuario
`;

const queryTotalRegistros = `
  SELECT count(1) as total_registros
  FROM referentes r
           LEFT JOIN categoria_referentes cr ON r.id_categoria = cr.id_categoria
           LEFT JOIN cargo_referentes crt ON r.id_cargo = crt.id
           INNER JOIN dirigentes d ON r.id_dirigente = d.id_dirigente
           INNER JOIN usuarios u ON r.id_usuario_carga = u.id_usuario
           LEFT JOIN usuarios u2 ON r.id_usuario_modifica = u2.id_usuario
`;

const buildWhereClauseEstadoVotos = (
  filter: IReferenteEstadoVotosFilter
): IQueryFilter => {
  const where: string[] = [];
  const values: any[] = [];

  if (filter.id_referente !== undefined) {
    where.push("r.id_referente = ?");
    values.push(filter.id_referente);
  }
  if (filter.id_dirigente !== undefined) {
    where.push("d.id_dirigente = ?");
    values.push(filter.id_dirigente);
  }
  if (filter.nombre_referente_like) {
    where.push("(r.nombre LIKE ? OR r.apellido LIKE ?)");
    values.push(
      `%${filter.nombre_referente_like}%`,
      `%${filter.nombre_referente_like}%`
    );
  }
  if (filter.nombre_dirigente_like) {
    where.push("(d.nombre LIKE ? OR d.apellido LIKE ?)");
    values.push(
      `%${filter.nombre_dirigente_like}%`,
      `%${filter.nombre_dirigente_like}%`
    );
  }
  if (filter.dni_referente !== undefined) {
    where.push("r.dni = ?");
    values.push(filter.dni_referente);
  }
  if (filter.dni_dirigente !== undefined) {
    where.push("d.dni = ?");
    values.push(filter.dni_dirigente);
  }

  if (filter.id_zona !== undefined) {
    where.push(`EXISTS(SELECT 1
       FROM referente_zona rz
       WHERE rz.id_referente = r.id_referente
         AND rz.id_zona = ?
         AND rz.habilitada = 'S') `);
    values.push(filter.id_zona);
  }

  const whereSql = where.length > 0 ? `WHERE ${where.join(" AND ")}` : "";
  return { whereSql, values };
};

const buildWhereClause = (filter: IReferentesFilter): IQueryFilter => {
  const where: string[] = [];
  const values: any[] = [];

  if (filter.id_referente !== undefined) {
    where.push("r.id_referente = ?");
    values.push(filter.id_referente);
  }
  if (filter.id_dirigente !== undefined) {
    where.push("r.id_dirigente = ?");
    values.push(filter.id_dirigente);
  }
  if (filter.nombreLike) {
    where.push("(r.nombre LIKE ? OR r.apellido LIKE ?)");
    values.push(`%${filter.nombreLike}%`, `%${filter.nombreLike}%`);
  }
  if (filter.dni !== undefined) {
    where.push("r.dni = ?");
    values.push(filter.dni);
  }
  if (filter.codigo !== undefined) {
    where.push("r.codigo = ?");
    values.push(filter.codigo);
  }
  if (filter.habilitada) {
    where.push("r.habilitada = ?");
    values.push(filter.habilitada);
  }

  if (filter.id_categoria !== undefined) {
    where.push("r.id_categoria = ?");
    values.push(filter.id_categoria);
  }

  if (filter.id_cargo !== undefined) {
    where.push("r.id_cargo = ?");
    values.push(filter.id_cargo);
  }

  if (filter.id_responsable !== undefined) {
    where.push("d.id_responsable = ?");
    values.push(filter.id_responsable);
  }

  if (filter.id_zona !== undefined) {
    where.push(`EXISTS(SELECT 1
       FROM referente_zona rz
       WHERE rz.id_referente = r.id_referente
         AND rz.id_zona = ?
         AND rz.habilitada = 'S') `);
    values.push(filter.id_zona);
  }

  if (filter.id_barrio !== undefined) {
    where.push(`EXISTS(SELECT 1
       FROM referente_barrio rb
       WHERE rb.id_referente = r.id_referente
         AND rb.id_barrio = ?
         AND rb.habilitada = 'S') `);
    values.push(filter.id_barrio);
  }

  const whereSql = where.length > 0 ? `WHERE ${where.join(" AND ")}` : "";
  return { whereSql, values };
};

export const getReferentesEstadoVotos = async (
  filter: IReferenteEstadoVotosFilter
): Promise<IReferentes[] | null> => {
  try {
    const { whereSql, values } = buildWhereClauseEstadoVotos(filter);

    const havingClause =
      filter.pendientes == "S"
        ? `HAVING pendientes > 0`
        : filter.pendientes == "N"
        ? `HAVING pendientes = 0 AND total_votantes > 0`
        : ``;

    const query = `
        ${queryReferentesEstadoVotos} 
        ${whereSql}
        GROUP BY r.id_referente, r.nombre, r.apellido, r.codigo,
                d.id_dirigente, d.nombre, d.apellido
        ${havingClause}
        ORDER BY votaron DESC, pendientes ASC
        LIMIT ? OFFSET ?
    `;

    values.push(Number(filter.limit) || 100, Number(filter.offset) || 0);
    const [rows] = await pool.query<RowDataPacket[]>(query, values);
    const result = rows as IReferentes[];

    return result.length > 0 ? result : null;
  } catch (error) {
    console.error(
      "[ReferentesModel] Error en getReferentesEstadoVotos:",
      error
    );
    throw error;
  }
};

export const getReferentesEstadoVotosTotalRegistro = async (
  filter: IReferenteEstadoVotosFilter
): Promise<{ total_registros: number } | null> => {
  try {
    const { whereSql, values } = buildWhereClauseEstadoVotos(filter);
    const query = `${queryTotalRegistrosReferentesEstadosVotos} 
            ${whereSql}`;

    const [rows] = await pool.query<RowDataPacket[]>(query, values);
    const result = rows as { total_registros: number }[];

    if (result.length === 0) {
      return null;
    }

    return result[0]?.total_registros ? result[0] : null;
  } catch (error: any) {
    console.error(
      "[ReferentesModel] Error en getReferentesEstadoVotosTotalRegistro:",
      error
    );

    throw new Error("Error al buscar dirigente");
  }
};

export const getReferentesByFilter = async (
  filter: IReferentesFilter
): Promise<IReferentes[] | null> => {
  try {
    const { whereSql, values } = buildWhereClause(filter);

    const query = `
        ${queryReferentes} 
        ${whereSql}    
        ORDER BY r.id_referente DESC
        LIMIT ? OFFSET ?
    `;

    values.push(Number(filter.limit) || 100, Number(filter.offset) || 0);

    const [rows] = await pool.query<RowDataPacket[]>(query, values);
    const result = rows as IReferentes[];

    return result.length > 0 ? result : null;
  } catch (error) {
    console.error("[ReferentesModel] Error en getReferentesByFilter:", error);
    throw error;
  }
};

export const getReferentesTotalRegistro = async (
  filter: IReferentesFilter
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
  } catch (error: any) {
    console.error(
      "[ReferentesModel] Error en getReferentesTotalRegistro:",
      error
    );

    throw new Error("Error al buscar dirigente ");
  }
};

export const insertReferente = async (
  data: IReferentesInsert,
  conn: PoolConnection
): Promise<IReferentes | null> => {
  try {
    const insertSQL = `
      INSERT INTO referentes (
        id_dirigente, nombre, apellido, dni, codigo, telefono, id_categoria, id_cargo,
        habilitada, id_usuario_carga, fecha_carga
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'S', ?, NOW())
    `;

    const values = [
      data.id_dirigente,
      data.nombre,
      data.apellido,
      data.dni,
      data.codigo,
      data.telefono,
      data.id_categoria || null,
      data.id_cargo || null,
      data.id_usuario_carga,
    ];

    const [result] = await conn.query<ResultSetHeader>(insertSQL, values);

    if (result.affectedRows === 0) {
      throw new Error("No se pudo insertar el dirigente ");
    }

    const [rows] = await conn.query<RowDataPacket[]>(
      `${queryReferentes} WHERE r.id_referente = ?`,
      [result.insertId]
    );

    return (rows as IReferentes[])[0] || null;
  } catch (error: any) {
    console.error("[ReferentesModel] Error en insertReferente:", error);
    if (error.code === "ER_DUP_ENTRY") {
      throw new Error("DNI_DUPLICADO");
    }
    throw new Error("Error al insertar dirigente ");
  }
};

export const updateReferente = async (
  data: IReferentesUpdate,
  conn: PoolConnection
): Promise<IReferentes | null> => {
  try {
    const fields: string[] = [];
    const values: any[] = [];

    if (data.id_dirigente !== undefined) {
      fields.push("id_dirigente = ?");
      values.push(data.id_dirigente);
    }
    if (data.nombre !== undefined) {
      fields.push("nombre = ?");
      values.push(data.nombre);
    }
    if (data.apellido !== undefined) {
      fields.push("apellido = ?");
      values.push(data.apellido);
    }
    if (data.dni !== undefined) {
      fields.push("dni = ?");
      values.push(data.dni);
    }
    if (data.codigo !== undefined) {
      fields.push("codigo = ?");
      values.push(data.codigo);
    }
    if (data.telefono !== undefined) {
      fields.push("telefono = ?");
      values.push(data.telefono);
    }
    if (data.id_categoria !== undefined) {
      fields.push("id_categoria = ?");
      values.push(data.id_categoria);
    }
    if (data.id_cargo !== undefined) {
      fields.push("id_cargo = ?");
      values.push(data.id_cargo);
    }
    if (data.habilitada !== undefined) {
      fields.push("habilitada = ?");
      values.push(data.habilitada);
    }

    fields.push("id_usuario_modifica = ?");
    values.push(data.id_usuario_modifica);

    fields.push("fecha_modifica = NOW()");

    const sql = `UPDATE referentes SET ${fields.join(
      ", "
    )} WHERE id_referente = ?`;
    values.push(data.id_referente);

    const [result] = await conn.query<ResultSetHeader>(sql, values);

    if (result.affectedRows === 0) {
      throw new Error("No se pudo actualizar el dirigente ");
    }

    const [rows] = await conn.query<RowDataPacket[]>(
      `${queryReferentes} WHERE r.id_referente = ?`,
      [data.id_referente]
    );

    return (rows as IReferentes[])[0] || null;
  } catch (error: any) {
    console.error("[ReferentesModel] Error en updateReferente:", error);
    if (error.code === "ER_DUP_ENTRY") {
      throw new Error("DNI_DUPLICADO");
    }
    throw new Error("Error al actualizar dirigente ");
  }
};
