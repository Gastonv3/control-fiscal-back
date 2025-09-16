/**
 * Item de menu
 */
export interface IAppMenuItemDTO {
  id: number;
  webAppId: number;
  webAppName: string;
  title: string; // 50
  typeId: number;
  typeName: string;
  link: string | null; // 100
  orderItem: number | null;
  iconClass: string | null; // 100
  fatherId: number | null;
  fatherTitle: string | null; // 50
  isEnabled: boolean;
  description: string | null; // 100
  isActive?: boolean;
}

/**
 * Menu de aplicacion con sus items
 */
export interface IAppMenuDTO extends IAppMenuItemDTO {
  // isActive?: boolean;
  children?: IAppMenuDTO[];
}

export interface IAppMenuItemFilter {
  id?: number | undefined;
  role_id?: number | undefined;
  father_id?: number | undefined;
  type_id?: number | undefined;
}
