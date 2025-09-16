import { ResultSetHeader, RowDataPacket } from "mysql2";
import { pool } from "../../config/database.config";
import { IQueryFilter } from "../../utils/QueryFilter.type";
import {
  IResponsablesZonales,
  IResponsablesZonalesFilter,
  IResponsablesZonalesInsert,
  IResponsablesZonalesUpdate,
} from "./responsables_zonales.type";

import { PoolConnection } from "mysql2/promise";

export const getResponsablesZonalesByFilter = async (
  filter: IResponsablesZonalesFilter
): Promise<IResponsablesZonales[] | null> => {
  try {
    const { whereSql, values } = getResponsablesZonalesQueryFilter(filter);

    const query = `
      ${queryResponsablesZonales}
      ${whereSql}
      ORDER BY rz.id_responsable DESC
      LIMIT ? OFFSET ?
    `;

    values.push(Number(filter.limit) || 100, Number(filter.offset) || 0);
    const [rows] = await pool.query<RowDataPacket[]>(query, values);
    const result = rows as IResponsablesZonales[];

    if (result.length === 0) {
      return null;
    }

    return result;
  } catch (error) {
    console.error(
      "[ResponsablesZonalesModel] Error en getResponsablesZonalesByFilter:",
      error
    );
    throw new Error("Error al buscar responsables");
  }
};

export const getResponsablesZonalesTotalRegistro = async (
  filter: IResponsablesZonalesFilter
): Promise<{ total_registros: number } | null> => {
  try {
    const { whereSql, values } = getResponsablesZonalesQueryFilter(filter);

    const query = `
      ${queryDirigentesTotal}
      ${whereSql}
    `;

    const [rows] = await pool.query<RowDataPacket[]>(query, values);
    const result = rows as { total_registros: number }[];

    if (result.length === 0) {
      return null;
    }

    return result[0]?.total_registros ? result[0] : null;
  } catch (error) {
    console.error("[Responsables] Error en IResponsablesZonalesFilter:", error);
    throw new Error("Error al buscar responsables");
  }
};

const queryResponsablesZonales: string = `
SELECT rz.id_responsable,
       rz.nombre,
       rz.apellido,
       rz.dni,
       rz.codigo,
       rz.telefono,
       rz.id_categoria,
       cr.nombre AS categoria_desc,
       rz.id_cargo,
       crg.nombre AS cargo_desc,
       rz.habilitada,
       rz.id_usuario_carga,
       u.nombre  AS usuario_carga,
       rz.fecha_carga
FROM responsables_zonales rz
         LEFT JOIN categoria_responsables_zonales cr ON rz.id_categoria = cr.id_categoria
         LEFT JOIN cargo_responsables crg ON rz.id_cargo = crg.id
         INNER JOIN usuarios u ON u.id_usuario = rz.id_usuario_carga

  `;
const queryDirigentesTotal: string = `
  SELECT count(1) as total_registros
  FROM responsables_zonales rz
           LEFT JOIN categoria_responsables_zonales cr ON rz.id_categoria = cr.id_categoria
           LEFT JOIN cargo_responsables crg ON rz.id_cargo = crg.id
           INNER JOIN usuarios u ON u.id_usuario = rz.id_usuario_carga  `;

const getResponsablesZonalesQueryFilter = (
  filter: IResponsablesZonalesFilter
): IQueryFilter => {
  const whereClauses: string[] = [];
  const values: any[] = [];

  if (filter.id_responsable) {
    whereClauses.push("rz.id_responsable = ?");
    values.push(filter.id_responsable);
  }
  if (filter.nombre) {
    whereClauses.push("rz.nombre LIKE ?");
    values.push(`%${filter.nombre}%`);
  }
  if (filter.apellido) {
    whereClauses.push("rz.apellido LIKE ?");
    values.push(`%${filter.apellido}%`);
  }
  if (filter.nombreLike) {
    whereClauses.push("(rz.nombre LIKE ? OR rz.apellido LIKE ?)");
    values.push(`%${filter.nombreLike}%`, `%${filter.nombreLike}%`);
  }
  if (filter.dni) {
    whereClauses.push("rz.dni = ?");
    values.push(filter.dni);
  }
  if (filter.habilitada) {
    whereClauses.push("rz.habilitada = ?");
    values.push(filter.habilitada);
  }

  if (filter.id_categoria) {
    whereClauses.push("rz.id_categoria = ?");
    values.push(filter.id_categoria);
  }
  if (filter.id_cargo) {
    whereClauses.push("rz.id_cargo = ?");
    values.push(filter.id_cargo);
  }
  if (filter.id_zona) {
    whereClauses.push(
      `EXISTS(SELECT 1
       FROM responsables_zonales_zona rz
       WHERE rz.id_responsable = rz.id_responsable
         AND rz.id_zona = ?
         AND rz.habilitada = 'S') `
    );
    values.push(filter.id_zona);
  }
  const whereSql =
    whereClauses.length > 0 ? `WHERE ${whereClauses.join(" AND ")}` : "";
  return { whereSql, values };
};

export const insertResponsableZonal = async (
  data: IResponsablesZonalesInsert,
  conn: PoolConnection
): Promise<number> => {
  try {
    const sql = `
        INSERT INTO responsables_zonales (nombre, apellido, dni, codigo, telefono, id_categoria, id_cargo, habilitada, fecha_carga, id_usuario_carga)
        VALUES (?, ?, ?, ?, ?, ?, ?, 'S', NOW(), ?)
      `;

    const values = [
      data.nombre,
      data.apellido,
      data.dni || null,
      data.codigo || null,
      data.telefono || null,
      data.id_categoria || null,
      data.id_cargo || null,
      data.id_usuario_carga || null,
    ];

    const [result] = await conn.query<ResultSetHeader>(sql, values);
    const insertId = result.insertId;

    if (!insertId) {
      throw new Error("No se pudo insertar el responsable");
    }

    return insertId;
  } catch (error: any) {
    console.error(
      "[ResponsablesZonalesModel] Error en insertResponsableZonal:",
      error
    );

    if (error.code === "ER_DUP_ENTRY") {
      throw new Error("DNI_DUPLICADO");
    }

    throw error;
  }
};

export const updateResponsableZonal = async (
  data: IResponsablesZonalesUpdate,
  conn: PoolConnection
): Promise<boolean> => {
  try {
    const updates: string[] = [];
    const values: any[] = [];

    if (data.nombre) {
      updates.push("nombre = ?");
      values.push(data.nombre);
    }
    if (data.apellido) {
      updates.push("apellido = ?");
      values.push(data.apellido);
    }
    if (data.dni) {
      updates.push("dni = ?");
      values.push(data.dni);
    }
    if (data.telefono) {
      updates.push("telefono = ?");
      values.push(data.telefono);
    }
    if (data.id_categoria) {
      updates.push("id_categoria = ?");
      values.push(data.id_categoria);
    }
    if (data.id_cargo) {
      updates.push("id_cargo = ?");
      values.push(data.id_cargo);
    }
    if (data.codigo) {
      updates.push("codigo = ?");
      values.push(data.codigo);
    }
    if (data.habilitada !== undefined) {
      updates.push("habilitada = ?");
      values.push(data.habilitada);
    }

    if (data.id_usuario_carga) {
      updates.push("id_usuario_carga = ?");
      values.push(data.id_usuario_carga);
    }

    const sql = `
        UPDATE responsables_zonales
        SET ${updates.join(", ")}
        WHERE id_responsable = ?
      `;

    values.push(data.id);

    const [result] = await conn.query<ResultSetHeader>(sql, values);

    if (result.affectedRows === 0) {
      throw new Error("No se pudo actualizar el responsable");
    }

    return true;
  } catch (error: any) {
    console.error(
      "[ResponsablesZonalesModel] Error en updateResponsableZonal:",
      error
    );
    if (error.code === "ER_DUP_ENTRY") {
      throw new Error("DNI_DUPLICADO");
    }
    throw new Error("Error al actualizar responsable");
  }
};
