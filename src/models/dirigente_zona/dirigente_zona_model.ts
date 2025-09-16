import { RowDataPacket, ResultSetHeader } from "mysql2";
import { pool } from "../../config/database.config";

import {
  IDirigenteZonaDetalle,
  IDirigenteZonaInput,
  IDirigenteZonaBaja,
  IDirigenteZonaFilter,
} from "./dirigente_zona.type";
import { PoolConnection } from "mysql2/promise";

const queryDirigenteZonaDetalle: string = `
  SELECT dz.id_dirigente,
         d.nombre      AS nombre_dirigente,
         d.apellido    AS apellido_dirigente,
         dz.id_zona,
         z.nombre      AS nombre_zona,
         dz.habilitada,
         dz.id_usuario_carga,
         u.nombre      AS nombre_usuario_carga,
         dz.fecha_carga,
         dz.id_usuario_baja,
         u_baja.nombre AS nombre_usuario_baja,
         dz.fecha_baja
  FROM dirigente_zona dz
           JOIN dirigentes d ON dz.id_dirigente = d.id_dirigente
           JOIN zonas z ON dz.id_zona = z.id_zona
           INNER JOIN usuarios u ON dz.id_usuario_carga = u.id_usuario
           LEFT JOIN usuarios u_baja ON dz.id_usuario_baja = u_baja.id_usuario
`;

const queryTotalRegistros: string = `
  SELECT COUNT(*) AS total_registros
  FROM dirigente_zona dz
           JOIN dirigentes d ON dz.id_dirigente = d.id_dirigente
           JOIN zonas z ON dz.id_zona = z.id_zona
           INNER JOIN usuarios u ON dz.id_usuario_carga = u.id_usuario
           LEFT JOIN usuarios u_baja ON dz.id_usuario_baja = u_baja.id_usuario
`;

export const getDirigenteZonaTotalRegistro = async (
  filter: IDirigenteZonaFilter
): Promise<{
  total_registros: number;
} | null> => {
  try {
    const whereClauses: string[] = [];
    const values: any[] = [];

    if (filter.id_dirigente) {
      whereClauses.push("dz.id_dirigente = ?");
      values.push(filter.id_dirigente);
    }
    if (filter.habilitada) {
      whereClauses.push("dz.habilitada = ?");
      values.push(filter.habilitada);
    }

    const whereSql =
      whereClauses.length > 0 ? `WHERE ${whereClauses.join(" AND ")}` : "";

    const query = `
      ${queryDirigenteZonaDetalle}
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
      "[DirigenteZonaModel] Error en getDirigenteZonaTotalRegistro:",
      error
    );
    throw new Error("Error al buscar dirigentes");
  }
};

export const getDirigenteZonaByFilter = async (
  filter: IDirigenteZonaFilter
): Promise<IDirigenteZonaDetalle[] | null> => {
  try {
    const whereClauses: string[] = [];
    const values: any[] = [];

    if (filter.id_dirigente) {
      whereClauses.push("dz.id_dirigente = ?");
      values.push(filter.id_dirigente);
    }
    if (filter.habilitada) {
      whereClauses.push("dz.habilitada = ?");
      values.push(filter.habilitada);
    }
    if (filter.id_zona) {
      whereClauses.push("dz.id_zona = ?");
      values.push(filter.id_zona);
    }

    const whereSql =
      whereClauses.length > 0 ? `WHERE ${whereClauses.join(" AND ")}` : "";

    const query = `
      ${queryDirigenteZonaDetalle}
      ${whereSql}
      ORDER BY dz.id_dirigente, dz.id_zona
      LIMIT ? OFFSET ?
    `;

    values.push(Number(filter.limit) || 100, Number(filter.offset) || 0);
    const [rows] = await pool.query<RowDataPacket[]>(query, values);
    const result = rows as IDirigenteZonaDetalle[];

    return result.length > 0 ? result : null;
  } catch (error) {
    console.error(
      "[DirigenteZonaModel] Error en getDirigenteZonaByFilter:",
      error
    );
    throw new Error("Error al obtener dirigente-zona");
  }
};

export const insertDirigenteZona = async (
  data: IDirigenteZonaInput,
  conn: PoolConnection
): Promise<boolean> => {
  try {
    const query = `
      INSERT INTO dirigente_zona (id_dirigente, id_zona, habilitada, id_usuario_carga, fecha_carga)
      VALUES (?, ?, 'S', ?, NOW())
    `;
    const values = [data.id_dirigente, data.id_zona, data.id_usuario];
    const [result] = await conn.query<ResultSetHeader>(query, values);

    if (result.affectedRows === 0) {
      throw new Error("No se pudo insertar la zona");
    }

    return true;
  } catch (error) {
    console.error("[DirigenteZonaModel] Error en insertDirigenteZona:", error);
    throw new Error("Error al insertar dirigente-zona");
  }
};

export const bajaDirigenteZona = async (
  data: IDirigenteZonaBaja,
  conn: PoolConnection
): Promise<boolean> => {
  try {
    const query = `
      UPDATE dirigente_zona
      SET habilitada = ?,
          id_usuario_baja = CASE WHEN ? = 'N' THEN ? ELSE NULL END,
          fecha_baja = CASE WHEN ? = 'N' THEN NOW() ELSE NULL END
      WHERE id_dirigente = ? AND id_zona = ?
    `;

    const values = [
      data.habilitada,
      data.habilitada,
      data.id_usuario,
      data.habilitada,
      data.id_dirigente,
      data.id_zona,
    ];
    const [result] = await conn.query<ResultSetHeader>(query, values);

    if (result.affectedRows === 0) {
      throw new Error("No se encontró ninguna relación para actualizar");
    }

    return true;
  } catch (error) {
    console.error("[DirigenteZonaModel] Error en bajaDirigenteZona:", error);
    throw new Error("Error al dar de baja dirigente-zona");
  } finally {
  }
};
