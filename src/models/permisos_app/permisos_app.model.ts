import { pool } from "../../config/database.config";
import { IQueryFilter } from "../../utils/QueryFilter.type";
import {
  IPermisosApp,
  IPermisosAppFilter,
  IPermisosUrlApp,
  IPermisosUrlAppFilter,
} from "./permisos_app.type";
import { RowDataPacket } from "mysql2";

export const buildPermisosAppFilterClause = (
  filter: IPermisosAppFilter
): IQueryFilter => {
  const where: string[] = [];
  const values: any[] = [];

  if (filter.id_rol) {
    where.push("mr.id = ?");
    values.push(filter.id_rol);
  }
  if (filter.key_permiso) {
    where.push("mrp.key_permiso = ?");
    values.push(filter.key_permiso);
  }
  if (filter.id_usuario) {
    where.push("mru.id_usuario = ?");
    values.push(filter.id_usuario);
  }
  if (filter.url_menu) {
    where.push("mp.url = ?");
    values.push(filter.url_menu);
  }
  if (filter.id_tipo_permiso) {
    where.push("mp.id_tipo_permiso = ?");
    values.push(filter.id_tipo_permiso);
  }
  const whereSql = where.length > 0 ? `WHERE ${where.join(" AND ")}` : "";
  return { whereSql, values };
};

export const getPermisosAppByFilter = async (
  filter: IPermisosAppFilter
): Promise<IPermisosApp[] | null> => {
  try {
    const { whereSql, values } = buildPermisosAppFilterClause(filter);

    const queryBase = `
  SELECT mr.id, mr.nombre AS rol, mrp.key_permiso, mp.url
  FROM menu_roles mr
          INNER JOIN menu_roles_usuarios mru
                      ON mr.id = mru.id_role
          INNER JOIN menu_roles_permisos mrp
                      ON mr.id = mrp.id_menu_role
          INNER JOIN menu_permisos mp ON mp.key_permiso = mrp.key_permiso
        `;

    const query = `${queryBase} 
                    ${whereSql}
                    AND mrp.habilitado = 'S'`;
    const [rows] = await pool.query<RowDataPacket[]>(query, values);

    return rows.length > 0 ? (rows as IPermisosApp[]) : null;
  } catch (error) {
    console.error("[PermisosApp] Error en getPermisosAppByFilter:", error);
    throw new Error("Error al buscar usuario");
  }
};

export const getPermisosUrlAppByFilter = async (
  filter: IPermisosUrlAppFilter
): Promise<IPermisosUrlApp[] | null> => {
  try {
    const query = `
      SELECT mr.id,mr.nombre AS rol, mi.link
      FROM menu_roles mr
              INNER JOIN menu_roles_usuarios mru
                          ON mr.id = mru.id_role
              INNER JOIN menu_roles_items mri
                          ON mr.id = mri.role_id
      INNER JOIN menu_items mi ON mri.menu_item_id = mi.id
      WHERE mi.link = ?
      AND id_usuario = ?
      AND mri.habilitado = 'S';
        `;
    const [rows] = await pool.query<RowDataPacket[]>(query, [
      filter.url_menu,
      filter.id_usuario,
    ]);

    return rows.length > 0 ? (rows as IPermisosUrlApp[]) : null;
  } catch (error) {
    console.error("[PermisosApp] Error en getPermisosUrlAppByFilter:", error);
    throw new Error("Error al buscar usuario");
  }
};
