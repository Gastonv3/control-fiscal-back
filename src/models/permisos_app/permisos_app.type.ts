export interface IPermisosApp {
  id_rol: number;
  rol: string;
  key_permiso: string;
  url: string;
}

export interface IPermisosAppFilter {
  id_rol?: number;
  key_permiso?: string;
  id_usuario?: number;
  url_menu?: string;
  id_tipo_permiso?: number;
}

export interface IPermisosUrlApp {
  id_rol: number;
  rol: string;
  link: string;
}

export interface IPermisosUrlAppFilter {
  id_rol?: number;
  key_permiso?: string;
  id_usuario?: number;
  url_menu?: string;
}
