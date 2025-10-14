import { ResultSetHeader, RowDataPacket } from "mysql2";
import { pool } from "../../config/database.config";
import { IQueryFilter } from "../../utils/QueryFilter.type";
import {
  IFiscalesGeneralesFilter,
  IFiscalesGenerales,
  IFiscalesGeneralesUpdate,
  IParamInsertFiscalesGenerales,
} from "./fiscales_generales.type";
import { PoolConnection } from "mysql2/promise";

const queryFiscalesGenerales = `
  SELECT 
    fg.id_fiscal_general,
    fg.id_usuario,
    u.nombre AS nombre_usuario_asignado,
    u.user AS user_asignado,
    fg.dni,
    fg.telefono,
    fg.id_escuela,
    e.nombre AS nombre_escuela,
    fg.fecha_carga,
    fg.id_usuario_carga,
    uc.nombre AS nombre_usuario_carga,
    fg.fecha_modifica,
    fg.id_usuario_modifica,
    um.nombre AS nombre_usuario_modifica,
    fg.habilitado,
    IFNULL((SELECT COUNT(1)
     FROM mesas m
     WHERE m.id_escuela = fg.id_escuela),0) AS cantidad_mesas,
    IFNULL((SELECT COUNT(1)
     FROM fiscales_digitales fd
     INNER JOIN mesas m ON fd.mesa_numero = m.mesa_numero
     WHERE fd.id_fiscal_general = fg.id_fiscal_general
       AND m.id_escuela = fg.id_escuela
       AND fd.habilitado = 'S'),0)  AS mesas_asignadas,
    IFNULL((SELECT min(m.mesa_numero)
      FROM mesas m
      WHERE m.id_escuela = fg.id_escuela),0) AS mesa_desde,
    IFNULL((SELECT max(m.mesa_numero)
     FROM mesas m
     WHERE m.id_escuela = fg.id_escuela),0) AS mesa_hasta
  FROM fiscales_generales fg
  INNER JOIN usuarios u ON fg.id_usuario = u.id_usuario
  LEFT JOIN escuelas e ON fg.id_escuela = e.id_escuela
  INNER JOIN usuarios uc ON fg.id_usuario_carga = uc.id_usuario
  LEFT JOIN usuarios um ON fg.id_usuario_modifica = um.id_usuario
`;

const queryTotalRegistros = `
  SELECT count(1) as total_registros
  FROM fiscales_generales fg
  INNER JOIN usuarios u ON fg.id_usuario = u.id_usuario
  LEFT JOIN escuelas e ON fg.id_escuela = e.id_escuela
  INNER JOIN usuarios uc ON fg.id_usuario_carga = uc.id_usuario
  LEFT JOIN usuarios um ON fg.id_usuario_modifica = um.id_usuario
`;

const buildWhereClause = (filter: IFiscalesGeneralesFilter): IQueryFilter => {
  const where: string[] = [];
  const values: any[] = [];

  if (filter.id_usuario !== undefined) {
    where.push("fg.id_usuario = ?");
    values.push(filter.id_usuario);
  }

  if (filter.id_fiscal_general !== undefined) {
    where.push("fg.id_fiscal_general = ?");
    values.push(filter.id_fiscal_general);
  }
  if (filter.dni !== undefined) {
    where.push("fg.dni = ?");
    values.push(filter.dni);
  }
  if (filter.nombre_usuario_asignado !== undefined) {
    where.push("u.nombre LIKE ?");
    values.push(`%${filter.nombre_usuario_asignado}%`);
  }
  if (filter.id_escuela !== undefined) {
    where.push("fg.id_escuela = ?");
    values.push(filter.id_escuela);
  }
  if (filter.habilitado !== undefined) {
    where.push("fg.habilitado = ?");
    values.push(filter.habilitado);
  }
  if (filter.mesas_pendientes !== undefined) {
    where.push(`
      (
    IFNULL((
      SELECT COUNT(1)
      FROM mesas m
      WHERE m.id_escuela = fg.id_escuela
    ),0)
    >
    IFNULL((
      SELECT COUNT(1)
      FROM fiscales_digitales fd
      INNER JOIN mesas m ON fd.mesa_numero = m.mesa_numero
      WHERE fd.id_fiscal_general = fg.id_fiscal_general
        AND m.id_escuela = fg.id_escuela
        AND fd.habilitado = 'S'
    ),0)
  )
      `);
  }

  let whereSql = where.length > 0 ? `WHERE ${where.join(" AND ")}` : "";

  return { whereSql, values };
};

export const getFiscalesGeneralesByFilter = async (
  filter: IFiscalesGeneralesFilter
): Promise<IFiscalesGenerales[] | null> => {
  try {
    const { whereSql, values } = buildWhereClause(filter);

    const query = `
      ${queryFiscalesGenerales}
      ${whereSql}
      ORDER BY fg.id_fiscal_general DESC
      LIMIT ? OFFSET ?
    `;

    values.push(Number(filter.limit) || 100, Number(filter.offset) || 0);
    const [rows] = await pool.query<RowDataPacket[]>(query, values);
    const result = rows as IFiscalesGenerales[];

    return result.length > 0 ? result : null;
  } catch (error) {
    console.error(
      "[FiscalesGeneralesModel] Error en getFiscalesGeneralesByFilter:",
      error
    );
    throw error;
  }
};

export const getFiscalesGeneralesTotalRegistro = async (
  filter: IFiscalesGeneralesFilter
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
      "[FiscalesGeneralesModel] Error en getFiscalesGeneralesTotalRegistro:",
      error
    );
    throw new Error("Error al buscar fiscales generales");
  }
};

export const insertFiscalGeneral = async (
  data: IParamInsertFiscalesGenerales,
  conn: PoolConnection
): Promise<IFiscalesGenerales | null> => {
  try {
    const insertUserSQL = `
      INSERT INTO usuarios (nombre, user, pass, habilitado)
      VALUES (?, ?, ?, 'S')
    `;
    const userValues = [data.nombre, data.usuario, data.password];

    const [userResult] = await conn.query<ResultSetHeader>(
      insertUserSQL,
      userValues
    );
    if (userResult.affectedRows === 0) {
      throw new Error("No se pudo insertar el usuario");
    }
    const userId = userResult.insertId;

    const insertRolSql = `
    INSERT INTO menu_roles_usuarios (web_app_id, id_usuario, id_role)
    VALUES (1, ${userId}, 3)
    `;

    const [rolResult] = await conn.query<ResultSetHeader>(insertRolSql);
    if (rolResult.affectedRows === 0) {
      throw new Error("No se pudo asignar el rol al usuario");
    }

    const insertSQL = `
      INSERT INTO fiscales_generales (
        id_usuario, id_escuela, dni, telefono, id_usuario_carga, habilitado, fecha_carga
      ) VALUES (?, ?, ?, ?, ?, 'S', NOW())
    `;

    const values = [
      userId,
      data.id_escuela,
      data.dni,
      data.telefono,
      data.id_usuario_carga,
    ];

    const [result] = await conn.query<ResultSetHeader>(insertSQL, values);

    if (result.affectedRows === 0) {
      throw new Error("No se pudo insertar el fiscal general");
    }

    const [rows] = await conn.query<RowDataPacket[]>(
      `${queryFiscalesGenerales} WHERE fg.id_fiscal_general = ?`,
      [result.insertId]
    );

    return (rows as IFiscalesGenerales[])[0] || null;
  } catch (error: any) {
    console.error(
      "[FiscalesGeneralesModel] Error en insertFiscalGeneral:",
      error
    );
    if (error.code === "ER_DUP_ENTRY") {
      if (error.message.includes("usuarios_user_pk")) {
        throw new Error("USUARIO_DUPLICADO");
      } else {
        throw new Error("DNI_DUPLICADO");
      }
    }
    throw new Error("Error al insertar fiscal general");
  }
};

export const updateFiscalGeneral = async (
  data: IFiscalesGeneralesUpdate,
  conn: PoolConnection
): Promise<IFiscalesGenerales | null> => {
  try {
    let fields: string[] = [];
    let values: any[] = [];

    if (data.id_escuela !== undefined) {
      fields.push("id_escuela = ?");
      values.push(data.id_escuela);
    }
    if (data.dni !== undefined) {
      fields.push("dni = ?");
      values.push(data.dni);
    }
    if (data.habilitado !== undefined) {
      fields.push("habilitado = ?");
      values.push(data.habilitado);
    }

    if (data.id_usuario_modifica !== undefined) {
      fields.push("id_usuario_modifica = ?");
      values.push(data.id_usuario_modifica);
    }

    if (data.telefono !== undefined) {
      fields.push("telefono = ?");
      values.push(data.telefono);
    }

    fields.push("fecha_modifica = NOW()");

    const sql = `UPDATE fiscales_generales SET ${fields.join(
      ", "
    )} WHERE id_fiscal_general = ?`;
    values.push(data.id_fiscal_general);

    const [result] = await conn.query<ResultSetHeader>(sql, values);

    if (result.affectedRows === 0) {
      throw new Error("No se pudo actualizar el fiscal general");
    }

    fields = [];
    values = [];

    if (data.usuario !== undefined) {
      fields.push("user = ?");
      values.push(data.usuario);
    }
    if (data.password !== undefined) {
      fields.push("pass = ?");
      values.push(data.password);
    }
    if (data.nombre !== undefined) {
      fields.push("nombre = ?");
      values.push(data.nombre);
    }
    if (data.habilitado !== undefined) {
      fields.push("habilitado = ?");
      values.push(data.habilitado);
    }

    const updateUserSQL = `UPDATE usuarios SET ${fields.join(
      ", "
    )} WHERE id_usuario = ?`;
    values.push(data.id_usuario);

    const [resultUsuario] = await conn.query<ResultSetHeader>(
      updateUserSQL,
      values
    );

    if (resultUsuario.affectedRows === 0) {
      throw new Error("No se pudo actualizar el fiscal general");
    }

    if (
      data.escuela_original !== undefined &&
      data.escuela_original !== data.id_escuela
    ) {
      const updateFiscalDigitalSQL = `
        UPDATE fiscales_digitales
        SET mesa_numero = null,
            fecha_modifica = NOW(),
            id_usuario_modifica = ?
        WHERE id_fiscal_general = ?
      `;
      const [resultFiscalDigital] = await conn.query<ResultSetHeader>(
        updateFiscalDigitalSQL,
        [data.id_usuario_modifica, data.id_fiscal_general]
      );

      // if (resultFiscalDigital.affectedRows === 0) {
      //   throw new Error("No se pudo actualizar el fiscal general");
      // }
    }

    const [rows] = await conn.query<RowDataPacket[]>(
      `${queryFiscalesGenerales} WHERE fg.id_fiscal_general = ?`,
      [data.id_fiscal_general]
    );

    return (rows as IFiscalesGenerales[])[0] || null;
  } catch (error: any) {
    console.error(
      "[FiscalesGeneralesModel] Error en updateFiscalGeneral:",
      error
    );
    if (error.code === "ER_DUP_ENTRY") {
      if (error.message.includes("usuarios_user_pk")) {
        throw new Error("USUARIO_DUPLICADO");
      } else {
        throw new Error("DNI_DUPLICADO");
      }
    }
    throw new Error("Error al actualizar fiscal general");
  }
};
