import { RowDataPacket } from "mysql2";
import { pool } from "../../config/database.config";
import {
  IAppMenuDTO,
  IAppMenuItemDTO,
  IAppMenuItemFilter,
} from "./menu_app.type";
import { IQueryFilter } from "../../utils/QueryFilter.type";

const queryMenuApp = `
   SELECT DISTINCT wami.id,
                wami.web_app_id  AS webAppId,
                'Elecciones'     AS 'webAppName',
                wami.titulo      AS title,
                wami.descripcion AS description,
                wami.id_tipo     AS typeId,
                mit.nombre       AS 'typeName',
                wami.link,
                wami.orden_item  AS orderItem,
                wami.icono       AS iconClass,
                wami.paren_id    AS fatherId,
                wami2.titulo     AS 'fatherTitle',
                wami.habilitado  AS isEnabled
FROM menu_roles_items warm
         INNER JOIN menu_items wami ON warm.menu_item_id = wami.id
         INNER JOIN menu_item_tipo mit ON wami.id_tipo = mit.id
         LEFT JOIN menu_items wami2 ON wami.paren_id = wami2.id
         LEFT JOIN menu_roles war ON warm.role_id = war.id
`;

const buildWhereClause = (filter: IAppMenuItemFilter): IQueryFilter => {
  const where: string[] = [];
  const values: any[] = [];
  if (filter.id) {
    where.push(`wami.id = ?`);
    values.push(filter.id);
  }
  if (filter.role_id) {
    where.push(`warm.role_id = ?`);
    values.push(filter.role_id);
  }
  if (filter.father_id) {
    where.push(`wami.paren_id = ?`);
    values.push(filter.father_id);
  }
  if (filter.type_id) {
    where.push(`wami.id_tipo = ?`);
    values.push(filter.type_id);
  }
  const whereSql = where.length > 0 ? `WHERE ${where.join(" AND ")}` : "";
  return { whereSql, values };
};

export const getMenuApp = async (
  filter: IAppMenuItemFilter
): Promise<IAppMenuDTO[] | null> => {
  try {
    const { whereSql, values } = buildWhereClause(filter);

    const query = `
      ${queryMenuApp}
      ${whereSql}
      AND warm.habilitado = 'S'
      ORDER BY wami.orden_item ASC
    `;

    const [rows] = await pool.query<RowDataPacket[]>(query, values);

    return rows.length > 0 ? (rows as IAppMenuDTO[]) : null;
  } catch (error) {
    console.error("[MenuApp] Error en getMenuApp:", error);
    throw new Error("Error al buscar usuario");
  }
};
