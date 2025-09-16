import { ResultSetHeader, RowDataPacket } from "mysql2";
import { pool } from "../../config/database.config";
import { IQueryFilter } from "../../utils/QueryFilter.type";
import {
  IFiscalesDigitalesFilter,
  IFiscalesDigitales,
  IFiscalesDigitalesUpdate,
  IFiscalesDigitalesEstadoAsistenciaUpdate,
  IFiscalesDigitalesInsert,
} from "./fisicales_digitales.type";
import { PoolConnection } from "mysql2/promise";

const queryFiscalesDigitales = `
SELECT fd.id_fiscal_digital,
       fd.id_fiscal_general,
       fg.id_usuario AS id_usuario_fiscal_general,
       ug.nombre     AS nombre_fiscal_general,
       fd.id_usuario AS id_usuario_fiscal_digital,
       ud.nombre     AS nombre_fiscal_digital,
       ud.user       AS user_asignado,
       fd.mesa_numero,
       fg.id_escuela,
       s.nombre      AS nombre_escuela,
       fd.dni,
       fd.telefono,
       fd.fecha_carga,
       fd.id_usuario_carga,
       uc.nombre     AS nombre_usuario_carga,
       fd.fecha_modifica,
       fd.id_usuario_modifica,
       um.nombre     AS nombre_usuario_modifica,
       fd.habilitado,
       fd.id_usuario_asistencia,
       ua.nombre     AS nombre_usuario_asistencia,
       estado_asistencia
FROM fiscales_digitales fd
         LEFT JOIN fiscales_generales fg ON fd.id_fiscal_general = fg.id_fiscal_general
         LEFT JOIN escuelas s ON fg.id_escuela = s.id_escuela
         INNER JOIN usuarios ud ON fd.id_usuario = ud.id_usuario
         INNER JOIN usuarios ug ON fg.id_usuario = ug.id_usuario
         INNER JOIN usuarios uc ON fd.id_usuario_carga = uc.id_usuario
         LEFT JOIN usuarios um ON fd.id_usuario_modifica = um.id_usuario
         LEFT JOIN usuarios ua ON fd.id_usuario_asistencia = ua.id_usuario
`;

const queryTotalRegistros = `
  SELECT count(1) as total_registros
  FROM fiscales_digitales fd
    LEFT JOIN fiscales_generales fg ON fd.id_fiscal_general = fg.id_fiscal_general
    LEFT JOIN escuelas s ON fg.id_escuela = s.id_escuela
    INNER JOIN usuarios ud ON fd.id_usuario = ud.id_usuario
    INNER JOIN usuarios ug ON fg.id_usuario = ug.id_usuario
    INNER JOIN usuarios uc ON fd.id_usuario_carga = uc.id_usuario
    LEFT JOIN usuarios um ON fd.id_usuario_modifica = um.id_usuario
    LEFT JOIN usuarios ua ON fd.id_usuario_asistencia = ua.id_usuario
    
`;

const buildWhereClause = (filter: IFiscalesDigitalesFilter): IQueryFilter => {
  const where: string[] = [];
  const values: any[] = [];

  if (filter.id_fiscal_digital !== undefined) {
    where.push("fd.id_fiscal_digital = ?");
    values.push(filter.id_fiscal_digital);
  }

  if (filter.id_fiscal_general !== undefined) {
    where.push("fd.id_fiscal_general = ?");
    values.push(filter.id_fiscal_general);
  }

  if (filter.dni !== undefined) {
    where.push("fd.dni = ?");
    values.push(filter.dni);
  }

  if (filter.nombre_fiscal_digital !== undefined) {
    where.push("ud.nombre LIKE ?");
    values.push(`%${filter.nombre_fiscal_digital}%`);
  }
  if (filter.estado_asistencia !== undefined) {
    where.push("fd.estado_asistencia = ?");
    values.push(filter.estado_asistencia);
  }
  if (filter.habilitado !== undefined) {
    where.push("fd.habilitado = ?");
    values.push(filter.habilitado);
  }

  if (filter.id_usuario !== undefined) {
    where.push("fd.id_usuario = ?");
    values.push(filter.id_usuario);
  }

  const whereSql = where.length > 0 ? `WHERE ${where.join(" AND ")}` : "";
  return { whereSql, values };
};

export const getFiscalesDigitalesByFilter = async (
  filter: IFiscalesDigitalesFilter
): Promise<IFiscalesDigitales[] | null> => {
  try {
    const { whereSql, values } = buildWhereClause(filter);

    const query = `
      ${queryFiscalesDigitales}
      ${whereSql}
      ORDER BY fd.id_fiscal_digital DESC
      LIMIT ? OFFSET ?
    `;

    values.push(Number(filter.limit) || 100, Number(filter.offset) || 0);
    const [rows] = await pool.query<RowDataPacket[]>(query, values);
    return rows.length > 0 ? (rows as IFiscalesDigitales[]) : null;
  } catch (error) {
    console.error(
      "[FiscalesDigitalesModel] Error en getFiscalesDigitalesByFilter:",
      error
    );
    throw error;
  }
};

export const getFiscalesDigitalesTotalRegistro = async (
  filter: IFiscalesDigitalesFilter
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
    console.error(
      "[FiscalesDigitalesModel] Error en getFiscalesDigitalesTotalRegistro:",
      error
    );
    throw new Error("Error al buscar fiscales digitales");
  }
};

export const insertFiscalDigital = async (
  data: IFiscalesDigitalesInsert,
  conn: PoolConnection
): Promise<IFiscalesDigitales | null> => {
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
    VALUES (1, ${userId}, 4)
    `;

    const [rolResult] = await conn.query<ResultSetHeader>(insertRolSql);
    if (rolResult.affectedRows === 0) {
      throw new Error("No se pudo asignar el rol al usuario");
    }

    const insertSQL = `
      INSERT INTO fiscales_digitales (
        id_fiscal_general,
        id_usuario,
        dni,
        telefono,
        mesa_numero,
        id_usuario_carga,
        habilitado,
        fecha_carga
      ) VALUES (?, ?, ?, ?, ?, ?, 'S', NOW())
    `;

    const values = [
      data.id_fiscal_general,
      userId,
      data.dni,
      data.telefono,
      data.mesa_numero,
      data.id_usuario_carga,
    ];

    const [result] = await conn.query<ResultSetHeader>(insertSQL, values);

    if (result.affectedRows === 0) {
      throw new Error("No se pudo insertar el fiscal digital");
    }

    const [rows] = await conn.query<RowDataPacket[]>(
      `${queryFiscalesDigitales} WHERE fd.id_fiscal_digital = ?`,
      [result.insertId]
    );

    return (rows as IFiscalesDigitales[])[0] || null;
  } catch (error: any) {
    console.error(
      "[FiscalesDigitalesModel] Error en insertFiscalDigital:",
      error
    );
    if (error.code === "ER_DUP_ENTRY") {
      if (error.message.includes("usuarios_user_pk")) {
        throw new Error("USUARIO_DUPLICADO");
      } else {
        throw new Error("DNI_DUPLICADO");
      }
    }
    throw new Error("Error al insertar fiscal digital");
  }
};

export const updateFiscalDigitalEstadoAsistencia = async (
  data: IFiscalesDigitalesEstadoAsistenciaUpdate,
  conn: PoolConnection
): Promise<IFiscalesDigitales | null> => {
  try {
    const sql = `
      UPDATE fiscales_digitales
      SET estado_asistencia = ?, id_usuario_asistencia = ?, fecha_asistencia = NOW()
      WHERE id_fiscal_digital = ?
    `;

    const values = [
      data.estado_asistencia,
      data.id_usuario_asistencia,
      data.id_fiscal_digital,
    ];

    const [result] = await conn.query<ResultSetHeader>(sql, values);

    if (result.affectedRows === 0) {
      throw new Error("No se pudo actualizar el fiscal digital");
    }

    const [rows] = await conn.query<RowDataPacket[]>(
      `${queryFiscalesDigitales} WHERE fd.id_fiscal_digital = ?`,
      [data.id_fiscal_digital]
    );

    return (rows as IFiscalesDigitales[])[0] || null;
  } catch (error: any) {
    console.error(
      "[FiscalesDigitalesModel] Error en updateFiscalDigitalEstadoAsistencia:",
      error
    );
    throw new Error("Error al actualizar estado de asistencia");
  }
};

export const updateFiscalDigital = async (
  data: IFiscalesDigitalesUpdate,
  conn: PoolConnection
): Promise<IFiscalesDigitales | null> => {
  try {
    let fields: string[] = [];
    let values: any[] = [];

    if (data.id_fiscal_general !== undefined) {
      fields.push("id_fiscal_general = ?");
      values.push(data.id_fiscal_general);
    }

    if (data.dni !== undefined) {
      fields.push("dni = ?");
      values.push(data.dni);
    }

    if (data.telefono !== undefined) {
      fields.push("telefono = ?");
      values.push(data.telefono);
    }

    if (data.mesa_numero !== undefined) {
      fields.push("mesa_numero = ?");
      values.push(data.mesa_numero);
    }

    if (data.habilitado !== undefined) {
      fields.push("habilitado = ?");
      values.push(data.habilitado);
    }

    if (data.id_usuario_modifica !== undefined) {
      fields.push("id_usuario_modifica = ?");
      values.push(data.id_usuario_modifica);
    }
    fields.push("fecha_modifica = NOW()");

    const sql = `UPDATE fiscales_digitales SET ${fields.join(
      ", "
    )} WHERE id_fiscal_digital = ?`;
    values.push(data.id_fiscal_digital);

    const [result] = await conn.query<ResultSetHeader>(sql, values);

    if (result.affectedRows === 0) {
      throw new Error("No se pudo actualizar el fiscal digital");
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

    const [rows] = await conn.query<RowDataPacket[]>(
      `${queryFiscalesDigitales} WHERE fd.id_fiscal_digital = ?`,
      [data.id_fiscal_digital]
    );

    return (rows as IFiscalesDigitales[])[0] || null;
  } catch (error: any) {
    console.error(
      "[FiscalesDigitalesModel] Error en updateFiscalDigital:",
      error
    );
    if (error.code === "ER_DUP_ENTRY") {
      if (error.message.includes("usuarios_user_pk")) {
        throw new Error("USUARIO_DUPLICADO");
      } else {
        throw new Error("DNI_DUPLICADO");
      }
    }
    throw new Error("Error al actualizar fiscal digital");
  }
};
