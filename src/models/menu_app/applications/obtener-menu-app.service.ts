import { getMenuApp } from "../menu_app.model";
import {
  IAppMenuDTO,
  IAppMenuItemDTO,
  IAppMenuItemFilter,
} from "../menu_app.type";

export default class obtenerMenuAppService {
  async listar(filter: IAppMenuItemFilter) {
    try {
      const menuFlat = await getMenuApp(filter);
      const menuParse: IAppMenuDTO[] = [];

      for (const element of menuFlat!) {
        const items: IAppMenuDTO = {
          id: element.id,
          webAppId: element.webAppId,
          webAppName: element.webAppName,
          title: element.title,
          description: element.description,
          typeId: element.typeId,
          typeName: element.typeName,
          link: element.link,
          orderItem: element.orderItem,
          iconClass: element.iconClass,
          fatherId: element.fatherId,
          fatherTitle: element.fatherTitle,
          isEnabled: element.isEnabled,
        };
        if (element.fatherId === null) {
          if (element.typeId === 1) {
            const hijos = await getMenuApp({
              father_id: element.id,
              role_id: filter.role_id,
            });
            items.children = hijos || [];
            menuParse.push(items);
          }
        } else {
          menuParse.push(items);
        }
      }

      return {
        status: 200,
        message: "Menú encontrado",
        menu: menuParse || [],
      };
    } catch (error) {
      console.error("[ListarMenuAppService] Error:", error);
      return {
        status: 500,
        message: "Error al listar menú",
        error,
      };
    }
  }
}
