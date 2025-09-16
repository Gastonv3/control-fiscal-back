import { RowDataPacket, ResultSetHeader } from "mysql2";
import { pool } from "../../config/database.config";

import { PoolConnection } from "mysql2/promise";
import {
  IResponsableZonalZonaBaja,
  IResponsableZonalZonaDetalle,
  IResponsableZonalZonaFilter,
  IResponsableZonalZonaInput,
} from "./responsables_zonales_zona.type";

const queryResponsablesZonalesZonaDetalle: string = `
  SELECT rzz.id_responsable,
         rz.nombre      AS nombre_responsable,
         rz.apellido    AS apellido_responsable,
         rzz.id_zona,
         z.nombre      AS nombre_zona,
         rzz.habilitada,
         rzz.id_usuario_carga,
         u.nombre      AS nombre_usuario_carga,
         rzz.fecha_carga,
         rzz.id_usuario_baja,
         u_baja.nombre AS nombre_usuario_baja,
         rzz.fecha_baja
  FROM responsables_zonales_zona rzz
           JOIN responsables_zonales rz ON rzz.id_responsable = rz.id_responsable
           JOIN zonas z ON rzz.id_zona = z.id_zona
           INNER JOIN usuarios u ON rzz.id_usuario_carga = u.id_usuario
           LEFT JOIN usuarios u_baja ON rzz.id_usuario_baja = u_baja.id_usuario
`;

const queryTotalRegistros: string = `
  SELECT COUNT(*) AS total_registros
  FROM responsables_zonales_zona rzz
           JOIN responsables_zonales rz ON rzz.id_responsable = rz.id_responsable
           JOIN zonas z ON rzz.id_zona = z.id_zona
           INNER JOIN usuarios u ON rzz.id_usuario_carga = u.id_usuario
           LEFT JOIN usuarios u_baja ON rzz.id_usuario_baja = u_baja.id_usuario
`;

export const getResponsableZonalZonaTotalRegistro = async (
  filter: IResponsableZonalZonaFilter
): Promise<{
  total_registros: number;
} | null> => {
  try {
    const whereClauses: string[] = [];
    const values: any[] = [];

    if (filter.id_responsable) {
      whereClauses.push("rzz.id_responsable = ?");
      values.push(filter.id_responsable);
    }
    if (filter.habilitada) {
      whereClauses.push("rzz.habilitada = ?");
      values.push(filter.habilitada);
    }

    const whereSql =
      whereClauses.length > 0 ? `WHERE ${whereClauses.join(" AND ")}` : "";

    const query = `
      ${queryResponsablesZonalesZonaDetalle}
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
      "[ResponsableZonalZonaModel] Error en getResponsableZonalZonaTotalRegistro:",
      error
    );
    throw new Error("Error al buscar responsables zonales");
  }
};

export const getResponsableZonalZonaByFilter = async (
  filter: IResponsableZonalZonaFilter
): Promise<IResponsableZonalZonaDetalle[] | null> => {
  try {
    const whereClauses: string[] = [];
    const values: any[] = [];

    if (filter.id_responsable) {
      whereClauses.push("rzz.id_responsable = ?");
      values.push(filter.id_responsable);
    }
    if (filter.habilitada) {
      whereClauses.push("rzz.habilitada = ?");
      values.push(filter.habilitada);
    }
    if (filter.id_zona) {
      whereClauses.push("rzz.id_zona = ?");
      values.push(filter.id_zona);
    }

    const whereSql =
      whereClauses.length > 0 ? `WHERE ${whereClauses.join(" AND ")}` : "";

    const query = `
      ${queryResponsablesZonalesZonaDetalle}
      ${whereSql}
      ORDER BY rzz.id_responsable, rzz.id_zona
      LIMIT ? OFFSET ?
    `;

    values.push(Number(filter.limit) || 100, Number(filter.offset) || 0);
    const [rows] = await pool.query<RowDataPacket[]>(query, values);
    const result = rows as IResponsableZonalZonaDetalle[];

    return result.length > 0 ? result : null;
  } catch (error) {
    console.error(
      "[ResponsableZonalZonaModel] Error en getResponsableZonalZonaByFilter:",
      error
    );
    throw new Error("Error al obtener responsable-zona");
  }
};

export const insertResponsableZonalZona = async (
  data: IResponsableZonalZonaInput,
  conn: PoolConnection
): Promise<boolean> => {
  try {
    const query = `
      INSERT INTO responsables_zonales_zona (id_responsable, id_zona, habilitada, id_usuario_carga, fecha_carga)
      VALUES (?, ?, 'S', ?, NOW())
    `;
    const values = [data.id_responsable, data.id_zona, data.id_usuario];
    const [result] = await conn.query<ResultSetHeader>(query, values);

    if (result.affectedRows === 0) {
      throw new Error("No se pudo insertar la zona");
    }

    return true;
  } catch (error) {
    console.error(
      "[ResponsableZonalZonaModel] Error en insertResponsableZonalZona:",
      error
    );
    throw new Error("Error al insertar responsable-zona");
  }
};

export const bajaResponsableZonalZona = async (
  data: IResponsableZonalZonaBaja,
  conn: PoolConnection
): Promise<boolean> => {
  try {
    const query = `
      UPDATE responsables_zonales_zona
      SET habilitada = ?,
          id_usuario_baja = CASE WHEN ? = 'N' THEN ? ELSE NULL END,
          fecha_baja = CASE WHEN ? = 'N' THEN NOW() ELSE NULL END
      WHERE id_responsable = ? AND id_zona = ?
    `;

    const values = [
      data.habilitada,
      data.habilitada,
      data.id_usuario,
      data.habilitada,
      data.id_responsable,
      data.id_zona,
    ];
    const [result] = await conn.query<ResultSetHeader>(query, values);

    if (result.affectedRows === 0) {
      throw new Error("No se encontró ninguna relación para actualizar");
    }

    return true;
  } catch (error) {
    console.error(
      "[ResponsableZonalZonaModel] Error en bajaResponsableZonalZona:",
      error
    );
    throw new Error("Error al dar de baja responsable-zona");
  } finally {
  }
};
