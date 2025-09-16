import { ResultSetHeader, RowDataPacket } from "mysql2";
import { pool } from "../../config/database.config";
import { IQueryFilter } from "../../utils/QueryFilter.type";
import {
  IDirigentesFilter,
  IDirigentes,
  IDirigentesInsert,
  IDirigentesUpdate,
} from "./dirigentes.type";

import { PoolConnection } from "mysql2/promise";

const queryDirigentes: string = `
SELECT d.id_dirigente,
       d.id_responsable,
       rz.nombre   AS nombre_responsable,
       rz.apellido AS apellido_responsable,
       d.nombre,
       d.apellido,
       d.dni,
       d.codigo,
       d.telefono,
       d.id_categoria,
       cd.nombre   AS categoria_desc,
       d.id_cargo,
       cdg.nombre  AS cargo_desc,
       d.habilitada,
       d.id_usuario_carga,
       u.nombre    AS usuario_carga,
       d.fecha_carga
FROM dirigentes d
         LEFT JOIN categoria_dirigentes cd ON d.id_categoria = cd.id_categoria
         LEFT JOIN cargo_dirigentes cdg ON d.id_cargo = cdg.id
         INNER JOIN usuarios u ON u.id_usuario = d.id_usuario_carga
         LEFT JOIN responsables_zonales rz ON rz.id_responsable = d.id_responsable
  `;
const queryDirigentesTotal: string = `
  SELECT count(1) as total_registros
    FROM dirigentes d
            LEFT JOIN categoria_dirigentes cd ON d.id_categoria = cd.id_categoria
            LEFT JOIN cargo_dirigentes cdg ON d.id_cargo = cdg.id
            INNER JOIN usuarios u ON u.id_usuario = d.id_usuario_carga
            LEFT JOIN responsables_zonales rz ON rz.id_responsable = d.id_responsable  `;

export const getDirigentesByFilter = async (
  filter: IDirigentesFilter
): Promise<IDirigentes[] | null> => {
  try {
    const { whereSql, values } = getDirigentesQueryFilter(filter);

    const query = `
      ${queryDirigentes}
      ${whereSql}
      ORDER BY d.id_dirigente DESC
      LIMIT ? OFFSET ?
    `;

    values.push(Number(filter.limit) || 100, Number(filter.offset) || 0);
    const [rows] = await pool.query<RowDataPacket[]>(query, values);
    const result = rows as IDirigentes[];

    if (result.length === 0) {
      return null;
    }

    return result;
  } catch (error) {
    console.error("[DirigentesModel] Error en geDirigentesByFilter:", error);
    throw new Error("Error al buscar referentes");
  }
};

export const getDirigentesTotalRegistro = async (
  filter: IDirigentesFilter
): Promise<{ total_registros: number } | null> => {
  try {
    const { whereSql, values } = getDirigentesQueryFilter(filter);

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
    console.error(
      "[DirigentesModel] Error en geDirigentesTotalRegistro:",
      error
    );
    throw new Error("Error al buscar referentes");
  }
};

const getDirigentesQueryFilter = (filter: IDirigentesFilter): IQueryFilter => {
  const whereClauses: string[] = [];
  const values: any[] = [];

  if (filter.id_responsable) {
    whereClauses.push("d.id_responsable = ?");
    values.push(filter.id_responsable);
  }

  if (filter.id_dirigente) {
    whereClauses.push("d.id_dirigente = ?");
    values.push(filter.id_dirigente);
  }
  if (filter.nombre) {
    whereClauses.push("d.nombre LIKE ?");
    values.push(`%${filter.nombre}%`);
  }
  if (filter.apellido) {
    whereClauses.push("d.apellido LIKE ?");
    values.push(`%${filter.apellido}%`);
  }
  if (filter.nombreLike) {
    whereClauses.push("(d.nombre LIKE ? OR d.apellido LIKE ?)");
    values.push(`%${filter.nombreLike}%`, `%${filter.nombreLike}%`);
  }
  if (filter.dni) {
    whereClauses.push("d.dni = ?");
    values.push(filter.dni);
  }
  if (filter.habilitada) {
    whereClauses.push("d.habilitada = ?");
    values.push(filter.habilitada);
  }

  if (filter.id_categoria) {
    whereClauses.push("d.id_categoria = ?");
    values.push(filter.id_categoria);
  }

  if (filter.id_cargo) {
    whereClauses.push("d.id_cargo = ?");
    values.push(filter.id_cargo);
  }

  if (filter.id_zona) {
    whereClauses.push(
      `EXISTS(SELECT 1
       FROM dirigente_zona dz
       WHERE dz.id_dirigente = d.id_dirigente
         AND dz.id_zona = ?
         AND dz.habilitada = 'S') `
    );
    values.push(filter.id_zona);
  }
  const whereSql =
    whereClauses.length > 0 ? `WHERE ${whereClauses.join(" AND ")}` : "";
  return { whereSql, values };
};

export const insertDirigente = async (
  data: IDirigentesInsert,
  conn: PoolConnection
): Promise<number> => {
  try {
    const sql = `
        INSERT INTO dirigentes (id_responsable, nombre, apellido, dni, codigo, telefono, id_categoria, id_cargo, habilitada, fecha_carga, id_usuario_carga)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'S', NOW(), ?)
      `;

    const values = [
      data.id_responsable || null,
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
      throw new Error("No se pudo insertar el referente");
    }

    return insertId;
  } catch (error: any) {
    console.error("[DirigentesModel] Error en insertDirigente:", error);

    if (error.code === "ER_DUP_ENTRY") {
      throw new Error("DNI_DUPLICADO");
    }

    throw error;
  }
};

export const updateDirigente = async (
  data: IDirigentesUpdate,
  conn: PoolConnection
): Promise<boolean> => {
  try {
    const updates: string[] = [];
    const values: any[] = [];

    if (data.id_responsable) {
      updates.push("id_responsable = ?");
      values.push(data.id_responsable);
    }

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
        UPDATE dirigentes
        SET ${updates.join(", ")}
        WHERE id_dirigente = ?
      `;

    values.push(data.id);

    const [result] = await conn.query<ResultSetHeader>(sql, values);

    if (result.affectedRows === 0) {
      throw new Error("No se pudo actualizar el referente");
    }

    return true;
  } catch (error: any) {
    console.error("[DirigentesModel] Error en updateDirigente:", error);
    if (error.code === "ER_DUP_ENTRY") {
      throw new Error("DNI_DUPLICADO");
    }
    throw new Error("Error al actualizar referente");
  }
};
