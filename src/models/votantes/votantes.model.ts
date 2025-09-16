import { pool } from "../../config/database.config";
import { RowDataPacket, ResultSetHeader } from "mysql2";
import {
  IRankingDirigentes,
  IRankingDirigentesFilter,
  IRankingReferentes,
  IRankingReferentesFilter,
  IRankingResponsables,
  IRankingResponsablesFilter,
  IVotantes,
  IVotantesEstadoVotantes,
  IVotantesEstadoVotantesFilter,
  IVotantesFilter,
  IVotantesInsert,
  IVotantesUpdate,
  IVotoEstadoUpdate,
} from "./votantes.type";
import { IQueryFilter } from "../../utils/QueryFilter.type";
import { PoolConnection } from "mysql2/promise";

const rankingResponsables = `
SELECT
  rz.id_responsable,
  CONCAT(rz.apellido, ', ', rz.nombre) AS responsable,
  COUNT(*) total,
  SUM(CASE WHEN v.estado_voto='S' THEN 1 ELSE 0 END) AS votaron,
  ROUND(100.0 * SUM(CASE WHEN v.estado_voto='S' THEN 1 ELSE 0 END) / COUNT(*), 1) AS pct
FROM votantes v
INNER JOIN referentes r ON r.id_referente = v.id_referente
INNER JOIN dirigentes d ON d.id_dirigente = r.id_dirigente
INNER JOIN responsables_zonales rz ON rz.id_responsable = d.id_responsable
`;

const buildWhereRankingResponsables = (
  filter: IRankingResponsablesFilter
): IQueryFilter => {
  const where: string[] = [];
  const values: any[] = [];

  if (filter.id_responsable !== undefined) {
    where.push("rz.id_responsable = ?");
    values.push(filter.id_responsable);
  }

  if (filter.nombreLikeResponsable) {
    where.push("(rz.nombre LIKE ? OR rz.apellido LIKE ?)");
    values.push(
      `%${filter.nombreLikeResponsable}%`,
      `%${filter.nombreLikeResponsable}%`
    );
  }

  if (filter.dni) {
    where.push("rz.dni = ?");
    values.push(filter.dni);
  }

  if (filter.id_categoria) {
    where.push("rz.id_categoria = ?");
    values.push(filter.id_categoria);
  }

  if (filter.id_cargo) {
    where.push("rz.id_cargo = ?");
    values.push(filter.id_cargo);
  }

  if (filter.id_zona) {
    where.push(
      `EXISTS(SELECT 1
       FROM responsables_zonales_zona x
       WHERE x.id_responsable = rz.id_responsable
         AND x.id_zona = ?
         AND x.habilitada = 'S') `
    );
    values.push(filter.id_zona);
  }

  const whereSql = where.length > 0 ? `WHERE ${where.join(" AND ")}` : "";
  return { whereSql, values };
};

export const getRankingResponsables = async (
  filter: IRankingResponsablesFilter
): Promise<IRankingResponsables[] | null> => {
  try {
    const { whereSql, values } = buildWhereRankingResponsables(filter);

    const query = `${rankingResponsables} ${whereSql} 
      GROUP BY rz.id_responsable, responsable
      ORDER BY pct, votaron DESC LIMIT ? OFFSET ?`;
    values.push(Number(filter.limit) || 100, Number(filter.offset) || 0);

    const [rows] = await pool.query<RowDataPacket[]>(query, values);
    const result = rows as IRankingResponsables[];
    return result.length > 0 ? result : null;
  } catch (error) {
    console.error("[VotantesModel] Error getRankingResponsables:", error);
    throw new Error("Error al obtener ranking de responsables");
  }
};

export const getRankingResponsablesTotalRegistros = async (
  filter: IRankingResponsablesFilter
): Promise<{ total_registros: number } | null> => {
  try {
    const { whereSql, values } = buildWhereRankingResponsables(filter);

    const query = `${rankingTotalRegistros} ${whereSql}`;
    const [rows] = await pool.query<RowDataPacket[]>(query, values);

    return rows[0]?.total_registros ? (rows[0] as any) : null;
  } catch (error) {
    console.error(
      "[VotantesModel] Error getRankingResponsablesTotalRegistros:",
      error
    );
    throw new Error("Error al obtener votantes");
  }
};

const rankingDirigentes = `
SELECT
  d.id_dirigente,
  CONCAT(d.apellido, ', ', d.nombre) AS dirigente,
  COUNT(*) total,
  SUM(CASE WHEN v.estado_voto='S' THEN 1 ELSE 0 END) AS votaron,
  ROUND(100.0 * SUM(CASE WHEN v.estado_voto='S' THEN 1 ELSE 0 END) / COUNT(*), 1) AS pct
FROM votantes v
JOIN referentes r ON r.id_referente = v.id_referente
JOIN dirigentes d ON d.id_dirigente = r.id_dirigente
JOIN responsables_zonales rz ON rz.id_responsable = d.id_responsable
`;

const buildWhereRankingDirigentes = (
  filter: IRankingDirigentesFilter
): IQueryFilter => {
  const where: string[] = [];
  const values: any[] = [];

  if (filter.id_dirigente !== undefined) {
    where.push("d.id_dirigente = ?");
    values.push(filter.id_dirigente);
  }

  if (filter.id_responsable !== undefined) {
    where.push("d.id_responsable = ?");
    values.push(filter.id_responsable);
  }

  if (filter.nombreLikeDirigente) {
    where.push("(d.nombre LIKE ? OR d.apellido LIKE ?)");
    values.push(
      `%${filter.nombreLikeDirigente}%`,
      `%${filter.nombreLikeDirigente}%`
    );
  }

  if (filter.dni) {
    where.push("d.dni = ?");
    values.push(filter.dni);
  }

  if (filter.id_categoria) {
    where.push("d.id_categoria = ?");
    values.push(filter.id_categoria);
  }
  if (filter.id_cargo) {
    where.push("d.id_cargo = ?");
    values.push(filter.id_cargo);
  }

  if (filter.id_zona) {
    where.push(
      `EXISTS(SELECT 1
       FROM dirigente_zona dz
       WHERE dz.id_dirigente = d.id_dirigente
         AND dz.id_zona = ?
         AND dz.habilitada = 'S') `
    );
    values.push(filter.id_zona);
  }

  const whereSql = where.length > 0 ? `WHERE ${where.join(" AND ")}` : "";
  return { whereSql, values };
};

export const getRankingDirigentes = async (
  filter: IRankingDirigentesFilter
): Promise<IRankingDirigentes[] | null> => {
  try {
    const { whereSql, values } = buildWhereRankingDirigentes(filter);

    const query = `${rankingDirigentes} ${whereSql} 
      GROUP BY d.id_dirigente, dirigente
      ORDER BY pct , votaron DESC LIMIT ? OFFSET ?`;
    values.push(Number(filter.limit) || 100, Number(filter.offset) || 0);

    const [rows] = await pool.query<RowDataPacket[]>(query, values);
    const result = rows as IRankingDirigentes[];
    return result.length > 0 ? result : null;
  } catch (error) {
    console.error("[VotantesModel] Error getRankingDirigentes:", error);
    throw new Error("Error al obtener ranking de dirigentes");
  }
};

export const getRankingDirigentesTotalRegistros = async (
  filter: IRankingDirigentesFilter
): Promise<{ total_registros: number } | null> => {
  try {
    const { whereSql, values } = buildWhere(filter);

    const query = `${rankingTotalRegistros} ${whereSql}`;
    const [rows] = await pool.query<RowDataPacket[]>(query, values);

    return rows[0]?.total_registros ? (rows[0] as any) : null;
  } catch (error) {
    console.error(
      "[VotantesModel] Error getRankingDirigentesTotalRegistros:",
      error
    );
    throw new Error("Error al obtener votantes");
  }
};

const rankingTotalRegistros = `
  SELECT count(1) as total_registros
  FROM votantes v
           INNER JOIN referentes r ON r.id_referente = v.id_referente
           INNER JOIN dirigentes d ON d.id_dirigente = r.id_dirigente
           INNER JOIN responsables_zonales rz ON rz.id_responsable = d.id_responsable
`;

const rankingReferente = `
SELECT
  r.id_referente,
  CONCAT(r.apellido, ', ', r.nombre) AS referente,
  COUNT(*) total,
  SUM(CASE WHEN v.estado_voto='S' THEN 1 ELSE 0 END) AS votaron,
  ROUND(100.0 * SUM(CASE WHEN v.estado_voto='S' THEN 1 ELSE 0 END) / COUNT(*), 1) AS pct
FROM votantes v
JOIN referentes r ON r.id_referente = v.id_referente
JOIN dirigentes d ON d.id_dirigente = r.id_dirigente
JOIN responsables_zonales rz ON rz.id_responsable = d.id_responsable
`;

const buildWhereRankingReferente = (
  filter: IRankingReferentesFilter
): IQueryFilter => {
  const where: string[] = [];
  const values: any[] = [];

  if (filter.id_referente !== undefined) {
    where.push("r.id_referente = ?");
    values.push(filter.id_referente);
  }

  if (filter.id_dirigente) {
    where.push("r.id_dirigente = ?");
    values.push(filter.id_dirigente);
  }

  if (filter.nombreLikeReferente) {
    where.push("(r.nombre LIKE ? OR r.apellido LIKE ?)");
    values.push(
      `%${filter.nombreLikeReferente}%`,
      `%${filter.nombreLikeReferente}%`
    );
  }

  if (filter.dni) {
    where.push("r.dni = ?");
    values.push(filter.dni);
  }

  if (filter.id_categoria) {
    where.push("r.id_categoria = ?");
    values.push(filter.id_categoria);
  }

  if (filter.id_cargo) {
    where.push("r.id_cargo = ?");
    values.push(filter.id_cargo);
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

export const getRankingReferentes = async (
  filter: IRankingReferentesFilter
): Promise<IRankingReferentes[] | null> => {
  try {
    const { whereSql, values } = buildWhereRankingReferente(filter);

    const query = `${rankingReferente} ${whereSql} 
      GROUP BY r.id_referente, referente
      ORDER BY pct, votaron DESC LIMIT ? OFFSET ?`;
    values.push(Number(filter.limit) || 100, Number(filter.offset) || 0);

    const [rows] = await pool.query<RowDataPacket[]>(query, values);
    const result = rows as IRankingReferentes[];
    return result.length > 0 ? result : null;
  } catch (error) {
    console.error("[VotantesModel] Error getRankingReferentes:", error);
    throw new Error("Error al obtener ranking de responsables");
  }
};

export const getRankingReferentesTotalRegistros = async (
  filter: IVotantesFilter
): Promise<{ total_registros: number } | null> => {
  try {
    const { whereSql, values } = buildWhere(filter);

    const query = `${rankingTotalRegistros} ${whereSql}`;
    const [rows] = await pool.query<RowDataPacket[]>(query, values);

    return rows[0]?.total_registros ? (rows[0] as any) : null;
  } catch (error) {
    console.error(
      "[VotantesModel] Error getRankingReferentesTotalRegistros:",
      error
    );
    throw new Error("Error al obtener votantes");
  }
};

const estadoVotantes = `
SELECT COUNT(v.id_votante) AS total_votantes,
       COALESCE(SUM(CASE WHEN v.estado_voto = 'S' THEN 1 ELSE 0 END), 0) AS votaron,
       COALESCE(SUM(CASE WHEN v.estado_voto = 'N' THEN 1 ELSE 0 END), 0) AS no_votaron,
       IFNULL(ROUND(
                       100.0 * COALESCE(SUM(CASE WHEN v.estado_voto = 'S' THEN 1 ELSE 0 END), 0)
                   / NULLIF(COUNT(v.id_votante), 0),
                       2),0) AS pct_voto
FROM votantes v
         INNER JOIN mesas m ON v.numero_mesa = m.mesa_numero
         INNER JOIN escuelas e ON m.id_escuela = e.id_escuela
         LEFT JOIN referentes r ON v.id_referente = r.id_referente
         LEFT JOIN dirigentes d ON r.id_dirigente = d.id_dirigente
         LEFT JOIN responsables_zonales rz ON d.id_responsable = rz.id_responsable

`;

const buildWhereEstadoVotantes = (
  filter: IVotantesEstadoVotantesFilter
): IQueryFilter => {
  const where: string[] = [];
  const values: any[] = [];

  if (filter.id_referente !== undefined) {
    where.push("v.id_referente = ?");
    values.push(filter.id_referente);
  }

  if (filter.id_dirigente !== undefined) {
    where.push("r.id_dirigente = ?");
    values.push(filter.id_dirigente);
  }

  if (filter.id_responsable !== undefined) {
    where.push("d.id_responsable = ?");
    values.push(filter.id_responsable);
  }

  if (filter.id_escuela !== undefined) {
    where.push("e.id_escuela = ?");
    values.push(filter.id_escuela);
  }

  if (filter.id_zona !== undefined) {
    where.push("e.id_zona = ?");
    values.push(filter.id_zona);
  }

  if (filter.is_not_null_referente) {
    where.push("v.id_referente IS NOT NULL");
  }

  const whereSql = where.length > 0 ? `WHERE ${where.join(" AND ")}` : "";
  return { whereSql, values };
};

export const getEstadoVotantes = async (
  filter: IVotantesEstadoVotantesFilter
): Promise<IVotantesEstadoVotantes | null> => {
  try {
    const { whereSql, values } = buildWhereEstadoVotantes(filter);

    const query = `${estadoVotantes} ${whereSql}`;
    const [rows] = await pool.query<RowDataPacket[]>(query, values);
    const result = rows as IVotantesEstadoVotantes[];

    return result.length > 0 ? result[0]! : null;
  } catch (error) {
    console.error("[VotantesModel] Error getVotantesByFilter:", error);
    throw new Error("Error al obtener votantes");
  }
};

const baseQuery = `
SELECT v.id_votante,
       v.dni,
       v.nombre,
       v.telefono,
       v.numero_mesa,
       v.numero_orden,
       v.estado_voto,
       v.fecha_votacion,
       v.id_usuario_votacion,
       u1.nombre   AS nombre_usuario_votacion,
       v.id_usuario_carga,
       u2.nombre   AS nombre_usuario_carga,
       v.fecha_carga,
       v.id_usuario_modifica,
       u3.nombre   AS nombre_usuario_modifica,
       v.fecha_modifica,
       v.id_referente,
       r.nombre    AS nombre_referente,
       r.apellido  AS apellido_referente,
       r.codigo    AS codigo_referente,
       r.id_dirigente,
       d.nombre    AS nombre_dirigente,
       d.apellido  AS apellido_dirigente,
       d.codigo    AS codigo_dirigente,
       d.id_responsable,
       rz.nombre   AS nombre_responsable,
       rz.apellido AS apellido_responsable
FROM votantes v
         LEFT JOIN referentes r ON v.id_referente = r.id_referente
         LEFT JOIN dirigentes d ON r.id_dirigente = d.id_dirigente
         LEFT JOIN responsables_zonales rz ON d.id_responsable = rz.id_responsable
         LEFT JOIN usuarios u1 ON v.id_usuario_votacion = u1.id_usuario
         LEFT JOIN usuarios u2 ON v.id_usuario_carga = u2.id_usuario
         LEFT JOIN usuarios u3 ON v.id_usuario_modifica = u3.id_usuario
         LEFT JOIN mesas m ON v.numero_mesa = m.mesa_numero
`;

const totalRegistroQuery = `
  SELECT count(1) as total_registros
  FROM votantes v
          LEFT JOIN referentes r ON v.id_referente = r.id_referente
          LEFT JOIN dirigentes d ON r.id_dirigente = d.id_dirigente
          LEFT JOIN responsables_zonales rz ON d.id_responsable = rz.id_responsable
          LEFT JOIN usuarios u1 ON v.id_usuario_votacion = u1.id_usuario
          LEFT JOIN usuarios u2 ON v.id_usuario_carga = u2.id_usuario
          LEFT JOIN usuarios u3 ON v.id_usuario_modifica = u3.id_usuario
          LEFT JOIN mesas m ON v.numero_mesa = m.mesa_numero
`;

const buildWhere = (filter: IVotantesFilter): IQueryFilter => {
  const where: string[] = [];
  const values: any[] = [];

  if (filter.id_votante !== undefined) {
    where.push("v.id_votante = ?");
    values.push(filter.id_votante);
  }
  if (filter.dni !== undefined) {
    where.push("v.dni = ?");
    values.push(filter.dni);
  }
  if (filter.id_referente !== undefined) {
    where.push("v.id_referente = ?");
    values.push(filter.id_referente);
  }
  if (filter.estado_voto) {
    where.push("v.estado_voto = ?");
    values.push(filter.estado_voto);
  }
  if (filter.numero_mesa !== undefined) {
    where.push("v.numero_mesa = ?");
    values.push(filter.numero_mesa);
  }
  if (filter.numero_orden !== undefined) {
    where.push("v.numero_orden = ?");
    values.push(filter.numero_orden);
  }

  if (filter.id_dirigente !== undefined) {
    where.push("r.id_dirigente = ?");
    values.push(filter.id_dirigente);
  }

  if (filter.id_responsable !== undefined) {
    where.push("d.id_responsable = ?");
    values.push(filter.id_responsable);
  }

  if (filter.id_escuela !== undefined) {
    where.push("m.id_escuela = ?");
    values.push(filter.id_escuela);
  }
  if (filter.id_cargo_referente !== undefined) {
    where.push("r.id_cargo = ?");
    values.push(filter.id_cargo_referente);
  }
  if (filter.id_categoria_referente !== undefined) {
    where.push("r.id_categoria = ?");
    values.push(filter.id_categoria_referente);
  }

  const whereSql = where.length > 0 ? `WHERE ${where.join(" AND ")}` : "";
  return { whereSql, values };
};

export const getVotantesByFilter = async (
  filter: IVotantesFilter
): Promise<IVotantes[] | null> => {
  try {
    const { whereSql, values } = buildWhere(filter);

    const query = `${baseQuery} ${whereSql} LIMIT ? OFFSET ?`;
    values.push(Number(filter.limit) || 100, Number(filter.offset) || 0);

    const [rows] = await pool.query<RowDataPacket[]>(query, values);
    const result = rows as IVotantes[];
    return result.length > 0 ? result : null;
  } catch (error) {
    console.error("[VotantesModel] Error getVotantesByFilter:", error);
    throw new Error("Error al obtener votantes");
  }
};

export const getVotantesTotalRegistro = async (
  filter: IVotantesFilter
): Promise<{ total_registros: number } | null> => {
  try {
    const { whereSql, values } = buildWhere(filter);

    const query = `${totalRegistroQuery} ${whereSql}`;
    const [rows] = await pool.query<RowDataPacket[]>(query, values);

    return rows[0]?.total_registros ? (rows[0] as any) : null;
  } catch (error) {
    console.error("[VotantesModel] Error getVotantesByFilter:", error);
    throw new Error("Error al obtener votantes");
  }
};

export const insertVotante = async (
  data: IVotantesInsert,
  conn: PoolConnection
): Promise<IVotantes | null> => {
  try {
    const insertSQL = `
      INSERT INTO votantes (
        id_referente, dni, nombre, apellido, telefono, numero_mesa,
        numero_orden, estado_voto, id_usuario_carga, fecha_carga
      ) VALUES (?, ?, ?, ?, ?, ?, ?, 'N', ?, NOW())
    `;

    const values = [
      data.id_referente,
      data.dni,
      data.nombre,
      data.apellido,
      data.telefono,
      data.numero_mesa,
      data.numero_orden,
      data.id_usuario_carga,
    ];

    const [result] = await conn.query<ResultSetHeader>(insertSQL, values);
    if (result.affectedRows === 0) {
      throw new Error("No se pudo insertar el votante");
    }

    const [rows] = await conn.query<RowDataPacket[]>(
      `${baseQuery} WHERE v.id_votante = ?`,
      [result.insertId]
    );

    return (rows as IVotantes[])[0] || null;
  } catch (error: any) {
    console.error("[VotantesModel] Error insertVotante:", error);
    if (error.code === "ER_DUP_ENTRY") {
      throw new Error("DNI_DUPLICADO");
    }
    throw error;
  }
};

export const updateVotante = async (
  data: IVotantesUpdate,
  conn: PoolConnection
): Promise<IVotantes | null> => {
  try {
    const updates: string[] = [];
    const values: any[] = [];

    if (data.id_referente !== undefined) {
      updates.push("id_referente = ?");
      values.push(data.id_referente);
    }

    if (data.telefono !== undefined) {
      updates.push("telefono = ?");
      values.push(data.telefono);
    }

    updates.push("id_usuario_modifica = ?", "fecha_modifica = NOW()");
    values.push(data.id_usuario_modifica);
    values.push(data.id_votante);

    const updateSQL = `UPDATE votantes SET ${updates.join(
      ", "
    )} WHERE id_votante = ?`;

    const [result] = await conn.query<ResultSetHeader>(updateSQL, values);
    if (result.affectedRows === 0) {
      throw new Error("No se pudo actualizar el votante");
    }

    const [rows] = await conn.query<RowDataPacket[]>(
      `${baseQuery} WHERE v.id_votante = ?`,
      [data.id_votante]
    );

    return (rows as IVotantes[])[0] || null;
  } catch (error: any) {
    console.error("[VotantesModel] Error updateVotante:", error);
    if (error.code === "ER_DUP_ENTRY") {
      throw new Error("DNI_DUPLICADO");
    }
    throw error;
  }
};

export const marcarVotanteComoVotado = async (
  data: IVotoEstadoUpdate,
  conn: PoolConnection
): Promise<boolean> => {
  try {
    const sql = `
      UPDATE votantes
      SET estado_voto = 'S', fecha_votacion = NOW(), id_usuario_votacion = ?
      WHERE dni = ?
    `;
    const values = [data.id_usuario, data.dni];
    const [result] = await conn.query<ResultSetHeader>(sql, values);
    if (result.affectedRows === 0) {
      throw new Error("No se pudo marcar el votante como votado");
    }

    return result.affectedRows > 0;
  } catch (error) {
    console.error("[VotantesModel] Error marcarVotanteComoVotado:", error);
    throw error;
  }
};

export const anularVotoVotante = async (
  data: IVotoEstadoUpdate,
  conn: PoolConnection
): Promise<boolean> => {
  try {
    const sql = `
      UPDATE votantes
      SET estado_voto = 'N', fecha_votacion = NULL, id_usuario_votacion = NULL, id_usuario_anula_voto = ?, fecha_anula_voto = NOW()
      WHERE dni = ?
    `;
    const values = [data.id_usuario, data.dni];
    const [result] = await conn.query<ResultSetHeader>(sql, values);
    if (result.affectedRows === 0) {
      throw new Error("No se pudo anular el voto del votante");
    }
    return result.affectedRows > 0;
  } catch (error) {
    console.error("[VotantesModel] Error anularVotoVotante:", error);
    throw error;
  }
};
