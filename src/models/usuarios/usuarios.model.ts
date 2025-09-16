import { RowDataPacket } from "mysql2";
import {
  IUsuario,
  IUsuarioAuth,
  IUsuarioFilter,
  IUsuarioInsert,
  IUsuarioRoles,
  IUsuarioUpdate,
} from "./usuarios.type";
import { pool } from "../../config/database.config";
import { IQueryFilter } from "../../utils/QueryFilter.type";
import { PoolConnection, ResultSetHeader } from "mysql2/promise";

export const getUsuarioByCredenciales = async (
  filter: Pick<IUsuarioFilter, "user" | "pass">
): Promise<IUsuarioAuth | null> => {
  try {
    if (!filter.user || !filter.pass) {
      throw new Error("Usuario y contraseña son requeridos");
    }

    const [rows] = await pool.query<RowDataPacket[]>(
      `SELECT u.id_usuario, u.nombre, user, u.habilitado, u.id_categoria, cu.nombre AS categoria_desc, mru.id_role AS id_rol, mr.nombre AS rol_desc
          FROM usuarios u
                  LEFT JOIN categoria_usuarios cu ON cu.id_categoria = u.id_categoria
          INNER JOIN menu_roles_usuarios mru ON mru.id_usuario = u.id_usuario
          INNER JOIN menu_roles mr ON mr.id = mru.id_role 
         WHERE u.habilitado = 'S' AND user = ? AND pass = ? LIMIT 1`,
      [filter.user, filter.pass]
    );

    const result = rows as IUsuarioAuth[];

    return result[0] || null;
  } catch (error) {
    console.error("[UsuarioModel] Error en getUsuarioByCredenciales:", error);
    throw new Error("Error al buscar usuario");
  }
};

export const getUsuariosByFilter = async (
  filter: IUsuarioFilter
): Promise<IUsuario[] | null> => {
  try {
    const { whereSql, values } = getQueryFilter(filter);

    const query = `
    ${queryUsuarios}
    ${whereSql}
    ORDER BY u.id_usuario DESC
    LIMIT ? OFFSET ?
  `;

    values.push(Number(filter.limit) || 100, Number(filter.offset) || 0);
    const [rows] = await pool.query<RowDataPacket[]>(query, values);
    const result = rows as IUsuario[];

    if (result.length === 0) {
      return null;
    }

    return result;
  } catch (error) {
    console.error("[UsuarioModel] Error en getUsuariosByFilter:", error);
    throw new Error("Error al buscar usuarios");
  }
};

export const getUsuariosTotalRegistro = async (
  filter: IUsuarioFilter
): Promise<{ total_registros: number } | null> => {
  try {
    const { whereSql, values } = getQueryFilter(filter);

    const query = `
    ${queryUsuariosTotal}
    ${whereSql}
  `;

    const [rows] = await pool.query<RowDataPacket[]>(query, values);
    const result = rows as { total_registros: number }[];

    if (result.length === 0) {
      return null;
    }

    return result[0]?.total_registros ? result[0] : null;
  } catch (error) {
    console.error("[UsuarioModel] Error en getUsuariosTotalRegistro:", error);
    throw new Error("Error al buscar usuarios");
  }
};

const queryUsuarios: string = `
SELECT u.id_usuario, u.nombre, user, u.habilitado, u.id_categoria, cu.nombre AS categoria_desc, mru.id_role AS id_rol, mr.nombre AS rol_desc, c.id AS id_cargo, c.nombre AS cargo_desc
          FROM usuarios u
                  LEFT JOIN categoria_usuarios cu ON cu.id_categoria = u.id_categoria
          INNER JOIN menu_roles_usuarios mru ON mru.id_usuario = u.id_usuario
          INNER JOIN menu_roles mr ON mr.id = mru.id_role
          LEFT JOIN cargo_usuarios c ON c.id = u.id_cargo
`;
const queryUsuariosTotal: string = `
SELECT count(1) as total_registros
          FROM usuarios u
                  LEFT JOIN categoria_usuarios cu ON cu.id_categoria = u.id_categoria
          INNER JOIN menu_roles_usuarios mru ON mru.id_usuario = u.id_usuario
          INNER JOIN menu_roles mr ON mr.id = mru.id_role
          LEFT JOIN cargo_usuarios c ON c.id = u.id_cargo
`;

const getQueryFilter = (filter: IUsuarioFilter): IQueryFilter => {
  const whereClauses: string[] = [];
  const values: any[] = [];

  if (filter.id_usuario) {
    whereClauses.push("u.id_usuario = ?");
    values.push(filter.id_usuario);
  }
  if (filter.nombre) {
    whereClauses.push("u.nombre LIKE ?");
    values.push(`%${filter.nombre}%`);
  }
  if (filter.habilitado !== undefined) {
    whereClauses.push("u.habilitado = ?");
    values.push(filter.habilitado);
  }
  if (filter.id_cargo) {
    whereClauses.push("u.id_cargo = ?");
    values.push(filter.id_cargo);
  }
  if (filter.id_categoria) {
    whereClauses.push("u.id_categoria = ?");
    values.push(filter.id_categoria);
  }

  const whereSql =
    whereClauses.length > 0 ? `WHERE ${whereClauses.join(" AND ")}` : "";
  return { whereSql, values };
};

const queryRoles: string = `
SELECT id, nombre, descripcion
FROM menu_roles
WHERE 
habilitado = 'S'
ORDER BY nombre
`;

export const getRoles = async (): Promise<IUsuarioRoles[] | null> => {
  try {
    const query = `
    ${queryRoles}
  `;
    const [rows] = await pool.query<RowDataPacket[]>(query, []);
    const result = rows as IUsuarioRoles[];

    if (result.length === 0) {
      return null;
    }

    return result;
  } catch (error) {
    console.error("[UsuarioModel] Error en getRoles:", error);
    throw new Error("Error al buscar usuarios");
  }
};

export const insertarUsuario = async (
  data: IUsuarioInsert,
  conn: PoolConnection
): Promise<IUsuario | null> => {
  try {
    const insertUserQuery = `
      INSERT INTO usuarios (nombre, user, pass, habilitado, id_usuario_carga, id_categoria, id_cargo)
      VALUES (?, ?, ?, 'S', ?, ?, ?)
    `;
    const values = [
      data.nombre,
      data.user,
      data.pass,
      data.id_usuario_carga,
      data.id_categoria_usuario,
      data.id_cargo,
    ];

    const [userResult] = await conn.query<ResultSetHeader>(
      insertUserQuery,
      values
    );

    if (userResult.affectedRows === 0) {
      throw new Error("No se pudo insertar el usuario");
    }

    const userId = userResult.insertId;

    const insertUserQueryRoles = `
      INSERT INTO menu_roles_usuarios (web_app_id, id_usuario, id_role)
      VALUES (1, ?, ?)
    `;

    const valuesRoles = [userId, data.id_rol];

    const [result] = await conn.query<ResultSetHeader>(
      insertUserQueryRoles,
      valuesRoles
    );

    if (result.affectedRows === 0) {
      throw new Error("No se pudo insertar el rol del usuario");
    }

    const [rows] = await conn.query<RowDataPacket[]>(
      `${queryUsuarios} WHERE u.id_usuario = ?`,
      [userId]
    );

    return (rows as IUsuario[])[0] || null;
  } catch (error: any) {
    console.error("[UsuarioModel] Error en insertarUsuario:", error);
    if (error.code === "ER_DUP_ENTRY") {
      if (error.message.includes("usuarios_user_pk")) {
        throw new Error("USUARIO_DUPLICADO");
      }
    }
    throw new Error("Error al insertar usuario");
  }
};

export const updateUsuario = async (
  data: IUsuarioUpdate,
  conn: PoolConnection
): Promise<IUsuario | null> => {
  try {
    let fields: string[] = [];
    let values: any[] = [];

    if (data.nombre) {
      fields.push("nombre = ?");
      values.push(data.nombre);
    }
    if (data.user) {
      fields.push("user = ?");
      values.push(data.user);
    }
    if (data.pass) {
      fields.push("pass = ?");
      values.push(data.pass);
    }
    if (data.habilitado) {
      fields.push("habilitado = ?");
      values.push(data.habilitado);
    }

    const sql = `UPDATE usuarios SET ${fields.join(", ")} WHERE id_usuario = ?`;
    values.push(data.id_usuario);

    const [result] = await conn.query<ResultSetHeader>(sql, values);

    if (result.affectedRows === 0) {
      throw new Error("No se pudo actualizar el fiscal general");
    }

    fields = [];
    values = [];

    if (data.id_rol) {
      fields.push("id_role = ?");
      values.push(data.id_rol);
    }
    const sqlRoles = `UPDATE menu_roles_usuarios SET ${fields.join(
      ", "
    )} WHERE id_usuario = ?`;
    values.push(data.id_usuario);

    const [resultRolUpdates] = await conn.query<ResultSetHeader>(
      sqlRoles,
      values
    );

    if (resultRolUpdates.affectedRows === 0) {
      throw new Error("No se pudo actualizar el rol del usuario");
    }

    const [rows] = await conn.query<RowDataPacket[]>(
      `${queryUsuarios} WHERE u.id_usuario = ?`,
      [data.id_usuario]
    );

    return (rows as IUsuario[])[0] || null;
  } catch (error: any) {
    console.error("[UsuarioModel] Error en updateUsuario:", error);
    if (error.code === "ER_DUP_ENTRY") {
      if (error.message.includes("usuarios_user_pk")) {
        throw new Error("USUARIO_DUPLICADO");
      }
    }
    throw new Error("Error al insertar usuario");
  }
};
